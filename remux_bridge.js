/* Compressed-packet remuxing only. Runtime: locally vendored Mediabunny 1.65.2. */
(function (root) {
  'use strict';

  function createBridge(env, importRuntime) {
    const CACHE = 8 * 1024 * 1024;
    const FORWARD = 20;
    const BACK = 10;
    const CANCELLED = Symbol('cancelled');
    const messages = {
      WEB_REMUX_NETWORK_ERROR: 'The media server must allow direct streaming and byte-range access for on-demand media.',
      WEB_REMUX_CONTAINER_ERROR: 'The media container cannot be remuxed.',
      WEB_REMUX_CODEC_ERROR: 'The browser cannot play all primary media tracks in fragmented MP4.',
      WEB_REMUX_ERROR: 'Media remuxing failed.',
    };
    function error(code) {
      const value = new Error(messages[code]);
      value.code = code;
      return value;
    }
    function safeError(value, fallback = 'WEB_REMUX_ERROR') {
      return error(Object.hasOwn(messages, value?.code) ? value.code : fallback);
    }
    function deferred() {
      let resolve, reject;
      const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
      promise.catch(() => {});
      return { promise, resolve, reject };
    }
    const MSE = () => env.MediaSource || env.ManagedMediaSource;
    let runtime;
    function load() {
      if (!runtime) {
        runtime = Promise.resolve().then(() => importRuntime(new env.URL(
          'vendor/mediabunny-1.65.2/mediabunny.min.mjs', env.document.baseURI,
        ).href)).then(mb => {
          mb.Logging.level = mb.LogLevel.Silent;
          return mb;
        });
        runtime.catch(() => { runtime = undefined; });
      }
      return runtime;
    }

    class Session {
      constructor(video, source, onError) {
        this.video = video;
        this.source = source;
        this.onError = onError;
        this.duration = Infinity;
        this.disposed = false;
        this.listeners = [];
        this.listen(video, 'timeupdate', () => this.generation?.wake?.());
        this.listen(video, 'pause', () => {
          // Resource selection resets paused without calling pause(). A native
          // pause event is newer user/plugin intent, including during a seek.
          if (this.generation) this.generation.resume = false;
        });
        this.listen(video, 'seeking', () => {
          const g = this.generation;
          g?.wake?.();
          if (g?.positioned && !this.buffered(g, video.currentTime)) {
            this.seek(video.currentTime * 1000).catch(() => {});
          }
        });
        this.ready = this.start(0, false);
        this.ready.catch(() => {});
      }
      listen(target, name, fn) {
        target.addEventListener(name, fn);
        this.listeners.push(() => target.removeEventListener(name, fn));
      }
      active(g) { return !this.disposed && this.generation === g && !g.stopped; }
      check(g) { if (!this.active(g)) throw CANCELLED; }
      async guard(g, promise) {
        let cancel;
        const cancelled = new Promise((_, reject) => { cancel = () => reject(CANCELLED); });
        g.waiters.add(cancel);
        try {
          const result = await Promise.race([promise, cancelled]);
          this.check(g);
          return result;
        } finally { g.waiters.delete(cancel); }
      }
      buffered(g, time) {
        const ranges = g.sb?.buffered;
        for (let i = 0; i < (ranges?.length || 0); i++) {
          if (ranges.start(i) <= time + 0.025 && ranges.end(i) > time) return true;
        }
        return false;
      }
      fail(g, value, fallback) {
        if (!this.active(g) || g.failed) return;
        g.failed = true;
        const failure = safeError(value, fallback);
        g.ready.reject(failure);
        // Callbacks queued before a seek/destroy must not reach the new owner.
        env.queueMicrotask(() => {
          if (this.active(g)) {
            try { this.onError?.(failure); } catch (_) { /* Consumer-owned callback. */ }
          }
        });
        this.release(g, false);
      }
      release(g, stop = true) {
        if (!g) return Promise.resolve();
        if (stop) g.stopped = true;
        if (g.cleanup) return g.cleanup;
        for (const cancel of [...g.waiters]) cancel();
        g.wake?.();
        g.ready.resolve();
        try { g.input?.dispose(); } catch (_) { /* Already disposed. */ }
        for (const off of [...g.listeners]) off();
        try { if (g.sb?.updating) g.sb.abort(); } catch (_) { /* Detached MSE. */ }
        if (g.url) env.URL.revokeObjectURL(g.url);
        // Unblock pending writes before asking the muxer to release its resources.
        g.cleanup = Promise.resolve().then(() => g.output?.cancel()).catch(() => {});
        return g.cleanup;
      }
      start(target, resume) {
        const previous = this.generation;
        if (previous) this.release(previous);
        const g = {
          target, resume, ready: deferred(), waiters: new Set(), listeners: new Set(),
          positioned: false, stopped: false, bytes: 0, serial: Promise.resolve(),
        };
        this.generation = g;
        this.run(g).catch(value => { if (value !== CANCELLED) this.fail(g, value); });
        return g.ready.promise;
      }
      event(g, target, name, action) {
        return this.guard(g, new Promise((resolve, reject) => {
          const cleanup = () => {
            target.removeEventListener(name, done);
            target.removeEventListener('error', failed);
            g.listeners.delete(cleanup);
          };
          const done = () => { cleanup(); resolve(); };
          const failed = () => { cleanup(); reject(error('WEB_REMUX_ERROR')); };
          target.addEventListener(name, done);
          target.addEventListener('error', failed);
          g.listeners.add(cleanup);
          try { action?.(); } catch (value) { cleanup(); reject(value); }
        }));
      }
      operation(g, action) {
        const next = g.serial.then(() => { this.check(g); return this.event(g, g.sb, 'updateend', action); });
        g.serial = next.catch(() => {});
        return next;
      }
      async evict(g, quota = false) {
        const ranges = g.sb.buffered;
        const now = g.positioned ? this.video.currentTime : g.target;
        const cutoff = Math.max(0, now - (quota ? 1 : BACK));
        if (ranges.length && ranges.start(0) < cutoff) {
          await this.operation(g, () => g.sb.remove(ranges.start(0), cutoff));
          return true;
        }
        return false;
      }
      position(g) {
        if (g.positioned || !this.buffered(g, g.target)) return;
        g.positioned = true;
        if (Math.abs(this.video.currentTime - g.target) > 0.025) this.video.currentTime = g.target;
        g.ready.resolve();
        if (g.resume) {
          // Never play on initial setup. Only restore an already-playing seek.
          Promise.resolve().then(() => {
            this.check(g);
            if (g.resume) return this.video.play();
          }).catch(value => {
            if (value !== CANCELLED && value?.name !== 'NotAllowedError' && value?.name !== 'AbortError') {
              this.fail(g, value);
            }
          });
        }
      }
      async append(g, chunk) {
        this.check(g);
        if (chunk.type !== 'write' || chunk.position !== g.bytes || chunk.data.byteLength > CACHE) {
          throw error('WEB_REMUX_CONTAINER_ERROR');
        }
        await this.evict(g);
        try {
          await this.operation(g, () => g.sb.appendBuffer(chunk.data));
        } catch (value) {
          if (value?.name !== 'QuotaExceededError' || !await this.evict(g, true)) throw value;
          await this.operation(g, () => g.sb.appendBuffer(chunk.data));
        }
        g.bytes += chunk.data.byteLength;
        if (g.mse.readyState === 'open') g.mse.duration = this.duration;
        this.position(g);
      }
      async room(g, timestamp) {
        while (timestamp > (g.positioned ? this.video.currentTime : g.target) + FORWARD) {
          if (!g.positioned) throw error('WEB_REMUX_CONTAINER_ERROR');
          await this.guard(g, new Promise(resolve => { g.wake = resolve; }));
          g.wake = undefined;
          await this.evict(g);
        }
      }
      async run(g) {
        let source;
        try { source = new env.URL(this.source, env.document.baseURI); }
        catch (_) { throw error('WEB_REMUX_NETWORK_ERROR'); }
        const path = source.pathname.toLowerCase();
        const vod = path.includes('/movie/') || path.includes('/series/') || path.endsWith('.mkv');
        // Unknown paths are classified once from the first actual media GET.
        // Keep that decision across seek generations; later ranges aren't probes.
        let live = path.includes('/live/') ? true : vod ? false : this.live;
        g.live = live;
        const mb = await this.guard(g, load());
        if (!MSE()) throw error('WEB_REMUX_ERROR');
        const fetchFn = async (...args) => {
          this.check(g);
          try {
            const response = await env.fetch(...args);
            this.check(g);
            const range = /^bytes \d+-\d+\/(\d+)$/i.exec(response.headers.get('content-range') || '');
            const total = range ? Number(range[1]) : NaN;
            const finiteRange = response.status === 206 && Number.isSafeInteger(total) && total > 0;
            if (response.ok && live === undefined) {
              const length = response.headers.get('content-length') || '';
              const finiteLength = response.status === 200 && /^\d+$/.test(length)
                && Number.isSafeInteger(Number(length)) && Number(length) > 0;
              live = !finiteRange && !finiteLength;
              this.live = live;
              g.live = live;
            }
            if (!response.ok || (live === false && !finiteRange)) {
              await response.body?.cancel().catch(() => {});
              throw error('WEB_REMUX_NETWORK_ERROR');
            }
            return response;
          } catch (value) {
            if (value === CANCELLED) throw value;
            throw error('WEB_REMUX_NETWORK_ERROR');
          }
        };
        g.input = new mb.Input({
          source: new mb.UrlSource(source.href, {
            maxCacheSize: CACHE, parallelism: 1, getRetryDelay: () => null, fetchFn,
            handleUnhandledError: () => this.fail(g, error('WEB_REMUX_NETWORK_ERROR')),
          }),
          formats: [mb.MPEG_TS, mb.MATROSKA],
        });
        let tracks;
        try {
          tracks = (await this.guard(g, Promise.all([
            g.input.getPrimaryVideoTrack(), g.input.getPrimaryAudioTrack(),
          ]))).filter(Boolean);
        } catch (value) { throw safeError(value, 'WEB_REMUX_CONTAINER_ERROR'); }
        if (!tracks.length) throw error('WEB_REMUX_CONTAINER_ERROR');
        if (live === undefined) throw error('WEB_REMUX_NETWORK_ERROR');
        let info;
        try {
          info = await this.guard(g, Promise.all(tracks.map(async track => ({
            track, codec: await track.getCodec(), parameter: await track.getCodecParameterString(),
            config: await track.getDecoderConfig(), sink: new mb.EncodedPacketSink(track),
          }))));
          if (info.some(t => !t.codec || !t.parameter || !t.config)) throw error('WEB_REMUX_CODEC_ERROR');
          g.mime = `${tracks.some(t => t.type === 'video') ? 'video' : 'audio'}/mp4; codecs="${info.map(t => t.parameter).join(',')}"`;
          if (!MSE().isTypeSupported(g.mime)) throw error('WEB_REMUX_CODEC_ERROR');
        } catch (value) { throw safeError(value, 'WEB_REMUX_CODEC_ERROR'); }
        if (this.origin === undefined) {
          // Probe only the first packet of each primary track, never a live
          // duration or a seek keyframe. One session-wide origin keeps every
          // generation on the same UI timeline without changing A/V phase.
          const first = await this.guard(g, Promise.all(info.map(t => t.sink.getFirstPacket())));
          if (first.some(packet => !packet || !Number.isFinite(packet.timestamp))) {
            throw error('WEB_REMUX_CONTAINER_ERROR');
          }
          this.origin = Math.min(...first.map(packet => packet.timestamp));
        }
        const origin = this.origin;
        if (!live) {
          // For these finite, range-backed formats this queries the final packet,
          // not a sequential duration scan. Never do this on the live path.
          const ends = await this.guard(g, Promise.all(tracks.map(track => track.computeDuration())));
          this.duration = Math.max(...ends) - origin;
          if (!Number.isFinite(this.duration) || this.duration <= 0) throw error('WEB_REMUX_CONTAINER_ERROR');
          g.target = Math.min(g.target, Math.max(0, this.duration - 0.001));
        } else this.duration = Infinity;
        // Demuxer lookups use source time; MSE, controls and backpressure use UI time.
        const video = info.find(t => t.track.type === 'video');
        const anchor = video || info[0];
        if (!live && g.target > 0) {
          anchor.packet = await this.guard(g, anchor.sink.getKeyPacket(g.target + origin, { verifyKeyPackets: true }));
        }
        if (!anchor.packet) anchor.packet = await this.guard(g, anchor.sink.getFirstKeyPacket({ verifyKeyPackets: true }));
        if (!anchor.packet) throw error('WEB_REMUX_CONTAINER_ERROR');
        const start = anchor.packet.timestamp;
        for (const t of info) {
          if (t !== anchor) {
            if (!live && g.target > 0) t.packet = await this.guard(g, t.sink.getPacket(start));
            if (!t.packet) t.packet = await this.guard(g, t.sink.getFirstPacket());
            if (live) {
              let skipped = 0;
              while (t.packet && t.packet.timestamp + t.packet.duration < start) {
                skipped += t.packet.data.byteLength;
                if (skipped > CACHE) throw error('WEB_REMUX_CONTAINER_ERROR');
                t.packet = await this.guard(g, t.sink.getNextPacket(t.packet));
              }
            }
            if (!t.packet) throw error('WEB_REMUX_CONTAINER_ERROR');
          }
        }
        g.target = Math.max(g.target, start - origin);
        g.mse = new (MSE())();
        const opened = this.event(g, g.mse, 'sourceopen');
        g.url = env.URL.createObjectURL(g.mse);
        if (!env.MediaSource) this.video.disableRemotePlayback = true;
        const playbackRate = this.video.playbackRate;
        this.video.src = g.url;
        await opened;
        // The media load algorithm resets playbackRate to defaultPlaybackRate.
        // sourceopen follows that reset; keep the existing element's controls.
        this.video.playbackRate = playbackRate;
        g.sb = g.mse.addSourceBuffer(g.mime);
        for (const [target, name] of [[g.sb, 'error'], [g.mse, 'sourceclose'], [this.video, 'error']]) {
          const failed = () => {
            const nativeCode = this.video.error?.code;
            this.fail(g, error(nativeCode === 3 || nativeCode === 4
              ? 'WEB_REMUX_CODEC_ERROR' : 'WEB_REMUX_ERROR'));
          };
          target.addEventListener(name, failed);
          g.listeners.add(() => target.removeEventListener(name, failed));
        }
        g.mse.duration = this.duration;
        const stream = new env.WritableStream({ write: chunk => this.append(g, chunk) }, {
          // StreamTarget awaits writer.ready, not each write promise. Even a
          // tiny init segment must apply backpressure until updateend, which is
          // a browser task (not a microtask like the packet producer).
          highWaterMark: 1, size: chunk => chunk.data.byteLength,
        });
        const format = new mb.Mp4OutputFormat({ fastStart: 'fragmented', minimumFragmentDuration: 1 });
        g.output = new mb.Output({ format, target: new mb.StreamTarget(stream, { chunked: false }) });
        try {
          for (const t of info) {
            t.source = t.track.type === 'video'
              ? new mb.EncodedVideoPacketSource(t.codec) : new mb.EncodedAudioPacketSource(t.codec);
            if (t.track.type === 'video') g.output.addVideoTrack(t.source);
            else g.output.addAudioTrack(t.source);
            t.first = true;
          }
        } catch (value) { throw safeError(value, 'WEB_REMUX_CODEC_ERROR'); }
        await this.guard(g, g.output.start());
        let pendingBytes = 0;
        let lastBytes = 0;
        while (info.some(t => t.packet)) {
          this.check(g);
          // One packet head per track; each track remains in decode order even with B-frames.
          const t = info.filter(t => t.packet).reduce((a, b) => a.packet.timestamp <= b.packet.timestamp ? a : b);
          await this.room(g, t.packet.timestamp - origin);
          pendingBytes = g.bytes === lastBytes ? pendingBytes + t.packet.data.byteLength : t.packet.data.byteLength;
          lastBytes = g.bytes;
          // A malformed/unbounded GOP must not accumulate an entire movie in the muxer.
          if (pendingBytes > 32 * 1024 * 1024) throw error('WEB_REMUX_CONTAINER_ERROR');
          // clone changes only PTS; compressed bytes, sequence/decode order,
          // duration and side data stay intact. Keep the original for sink lookup.
          const packet = t.packet.clone({ timestamp: t.packet.timestamp - origin });
          await this.guard(g, t.source.add(packet, t.first ? { decoderConfig: t.config } : undefined));
          t.first = false;
          t.packet = await this.guard(g, t.sink.getNextPacket(t.packet));
          if (!t.packet) t.source.close();
        }
        await this.guard(g, g.output.finalize());
        await this.guard(g, g.serial);
        this.position(g);
        if (!g.positioned) throw error('WEB_REMUX_CONTAINER_ERROR');
        if (g.mse.readyState === 'open') {
          // Duration has already been set while open. The duration setter is
          // invalid once endOfStream transitions readyState to ended.
          g.mse.endOfStream();
        }
      }
      seek(milliseconds) {
        if (this.disposed) return Promise.resolve();
        if (!Number.isFinite(milliseconds)) return Promise.reject(error('WEB_REMUX_ERROR'));
        const target = Math.max(0, milliseconds / 1000);
        const g = this.generation;
        if (g && !g.failed && this.buffered(g, target)) {
          this.video.currentTime = target;
          g.wake?.();
          return Promise.resolve();
        }
        if (g?.live) return Promise.reject(error('WEB_REMUX_NETWORK_ERROR'));
        return this.start(target, !this.video.paused && !this.video.ended);
      }
      destroy() {
        if (this.destroyed) return this.destroyed;
        this.disposed = true;
        for (const off of this.listeners) off();
        const g = this.generation;
        this.destroyed = this.release(g);
        if (g?.url && this.video.src === g.url) {
          this.video.removeAttribute('src');
          this.video.load();
        }
        return this.destroyed;
      }
    }
    return {
      supported: () => Boolean(MSE()?.isTypeSupported && env.WritableStream && env.fetch && env.URL?.createObjectURL),
      create: (video, source, onError) => new Session(video, source, onError),
    };
  }

  root.IPTVRemux = createBridge(root, url => import(url));
  if (typeof module === 'object' && module.exports) module.exports = { createBridge };
})(typeof window === 'object' ? window : globalThis);
