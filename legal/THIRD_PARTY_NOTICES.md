# Third-Party Notices

## Project license status

No project `LICENSE` has been chosen or added to this repository. Nothing in this notice assigns an owner identity or grants an open-source license for the IPTV Pro project itself. Third-party components remain subject to their own licenses.

## Public web redistribution: review required

The [Legal information](legal.html) page identifies the deployment's operator and contact. See also [Privacy](PRIVACY.md) and [Terms of use](TERMS.md). Publishing these notices does not establish that a deployment is lawful or that all third-party obligations have been met.

**Public Web profile (`browser-only-v1`):** the release workflow excludes the optional libmedia/FFmpeg JavaScript/Wasm decoder distribution and its loading bridge from both the downloadable Web ZIP and GitHub Pages. Browser video, native HLS and HLS.js remain, with unmodified Mediabunny core for direct TS/MKV container remuxing into MSE fragmented MP4 using browser-supported codecs. No optional codec extensions or FFmpeg codec binaries ship in this profile. The compatibility-decoding section below describes optional assets in the developer repository, **not components shipped in this public Web profile**. Its generated standalone notices explicitly identify this exclusion and retain the notices for the components actually distributed.

For developer builds, source-repository redistribution, or any distribution that includes those optional binaries, resolve the libmedia/FFmpeg corresponding-source, dependency-license and replacement/relinking review described below and in the vendor notice. The current source pointers are not a complete corresponding-source bundle. Excluding those binaries from a Web bundle does not resolve obligations for copies already distributed or for the repository containing them. Review the remaining dependencies and applicable codec/patent, API, artwork and trademark permissions as well.

The standalone web notices packager copies the full license texts, notices, source metadata and matching Mediabunny source archive for the selected profile, the patched-package licenses, and the Inter OFL without shortening them. Binary source archives are download-only, not rendered as text; original Markdown downloads retain the repository documents byte for byte. Public builds also expose their build-specific Flutter notices as a standalone download. It does not audit dependencies or generate Flutter's dependency license registry. Retain the build-specific Flutter/package notices too; review the actual release, not just this summary.

## Flutter and package dependencies

The app's **Settings > About & Privacy > Open source licenses** screen uses Flutter's `LicensePage` and generated `LicenseRegistry` data to display licenses supplied by Flutter and bundled Dart/Flutter packages. That in-app list is generated from the dependencies included in the particular build and is the appropriate dependency-level notice for that build.

The locally patched `flutter_chrome_cast` **2.0.0** retains its **BSD-3-Clause**
license in [packages/flutter_chrome_cast/LICENSE](packages/flutter_chrome_cast/LICENSE). Its iOS Swift package minimum
version fix is documented in `packages/flutter_chrome_cast/LOCAL_PATCHES.md`.

## TMDB artwork and attribution

This product uses the TMDB API but is not endorsed or certified by TMDB.

TMDB (The Movie Database), https://www.themoviedb.org, is the optional source for
missing movie/series posters and backdrops. Its official attribution logo is
included in Settings > About & Privacy. The approved source SVG and its PNG
rasterization are retained in `assets/tmdb/`; artwork colors and proportions are
not modified. See `assets/tmdb/README.md` for provenance.

TMDB data/images and branding remain subject to TMDB's applicable terms and
attribution requirements; this notice does not grant a license to provider media.
Developer API access is available for non-commercial use with attribution.
Commercial distribution requires reviewing TMDB's commercial licensing terms.

## Browser HLS playback

Web builds bundle HLS.js **1.7.4**, copyright Dailymotion and contributors,
licensed under the **Apache License 2.0**. Source: https://github.com/video-dev/hls.js.
The upstream [notice](web/vendor/hls.js-1.7.4/LICENSE),
[full Apache license](web/vendor/hls.js-1.7.4/APACHE-2.0.txt) and
[source/hash metadata](web/vendor/hls.js-1.7.4/SOURCE.json) ship in
`web/vendor/hls.js-1.7.4/` alongside the unmodified JavaScript distribution.
HLS.js transmuxes supported HLS media; it does not add codec transcoding.

The locally patched `video_player_web` **2.4.0** remains subject to the Flutter
Authors' **BSD-3-Clause** license, retained in
[packages/video_player_web/LICENSE](packages/video_player_web/LICENSE). Local integration changes are documented
in that package's `PATCHES.md`.

## Browser container remuxing (Mediabunny)

The public `browser-only-v1` profile includes the unmodified **Mediabunny 1.65.2 core**, copyright (c) 2026-present Vanilagy and contributors, under the **Mozilla Public License 2.0 (MPL-2.0)**. Preserve the individual copyright/license notices in its covered source. The five pinned files in `web/vendor/mediabunny-1.65.2/` are `mediabunny.min.mjs`, [full MPL license](web/vendor/mediabunny-1.65.2/LICENSE), [NOTICE.md](web/vendor/mediabunny-1.65.2/NOTICE.md), [SOURCE.json](web/vendor/mediabunny-1.65.2/SOURCE.json), and the [matching MPL-covered source download — original npm archive (TGZ)](web/vendor/mediabunny-1.65.2/mediabunny-1.65.2.tgz). The archive's pinned npm SHA-512 integrity and per-file SHA-256 hashes are recorded in `SOURCE.json` and verified offline by `tool/web_remux_assets.py`.

That exact original npm archive contains 66 `package/src/*.ts` files: the preferred source form of the covered library, including its notices, plus README, package metadata, LICENSE and the upstream distribution. The archive is served alongside the library, not merely linked to a moving upstream repository. No vendor-library files have been modified. The app's own adapter is separate in `web/remux_bridge.js`; no application-source license has been chosen. Upstream: https://github.com/Vanilagy/mediabunny at revision `173f6b70765fa3a6ffc1c82737514416fa559ef5`.

MPL-covered source remains available under MPL-2.0. Its rights to use, modify and redistribute covered software, subject to that license, are not overridden by application terms or the project's unchosen license. Distributors must retain the full license, notices, source metadata and matching covered-source download; review MPL obligations for any later covered-file modifications. This is not a grant of rights to provider content, codecs or project branding, or a claim of legal clearance.

This core-only integration includes **no optional codec-extension packages or FFmpeg codec binaries**. It remuxes direct TS/MKV into MSE fragmented MP4 in the browser; it does not transcode or add unsupported HEVC, AC-3 or DTS codecs, bypass DRM, or guarantee playback. Assets are self-hosted; no new CDN, provider proxy or backend is added. Provider requests remain direct and subject to HTTP Range, CORS and HTTPS requirements and source-credential privacy risks described in [Privacy](PRIVACY.md).

## Browser compatibility decoding (libmedia / FFmpeg)

Developer builds that have not been prepared as the browser-only public profile also distribute **libmedia / AVPlayer 1.3.1**, copyright
2024-present Gaoxing Zhao (赵高兴) and contributors, identified upstream as
**LGPL-3.0-or-later**. The UMD runtime comes from the integrity-pinned npm
package; baseline/SIMD decoder and audio-helper Wasm comes from revision
`152f629d3021fd8013efa464fcb7b55f9fbe7753`. These upstream binaries are unmodified;
no encoder binaries (including x264/x265), atomic or wasm64 variants are shipped.

The Wasm includes **FFmpeg** decoder/util/resampling code (copyright FFmpeg
developers and individual authors; license depends on exact configuration) and
**SoundTouch** pitch/stretch code (Olli Parviainen and contributors; listed
upstream as LGPL 2.1). Other dependencies have their own terms; excluding GPL
encoders does not establish the license status of every transitive component. The upstream build script enables GPL and version 3 options (`--enable-gpl` and `--enable-version3`); the exact shipped binaries' source/build correspondence and effective licensing remain unresolved. Do not describe them as verified LGPL-only or as a verified GPL-compliant distribution.

The optional developer `web/vendor/libmedia-1.3.1/` directory retains
[LGPLv3](web/vendor/libmedia-1.3.1/COPYING.LGPLv3),
[GPLv3](web/vendor/libmedia-1.3.1/COPYING.GPLv3),
[LGPLv2.1](web/vendor/libmedia-1.3.1/COPYING.LGPLv2.1),
[hash/source metadata](web/vendor/libmedia-1.3.1/SOURCE.json), and
[`NOTICE.md`](web/vendor/libmedia-1.3.1/NOTICE.md) with pinned libmedia source,
customized FFmpeg source pointers, upstream build instructions and outstanding
corresponding-source/dependency review requirements. FFmpeg upstream source and
legal information: https://github.com/FFmpeg/FFmpeg and https://ffmpeg.org/legal.html.

These notices are attribution/source-discovery documentation, **not a fully
audited legal-compliance claim or complete corresponding-source bundle**.
Exact dependency revisions, build configuration, required transitive notices,
source availability and LGPL replacement/relinking obligations require review
before redistribution. Do not assume Flutter's generated license screen covers
these separately deployed JS/Wasm assets; keep their notices with the web bundle.

## Inter font

IPTV Pro bundles the Inter variable font. Its [original notice and full SIL Open Font License](assets/fonts/Inter-OFL.txt) are registered explicitly in the same in-app license screen. The license is also reproduced below without abridgment.

Copyright 2020 The Inter Project Authors (https://github.com/rsms/inter)

This Font Software is licensed under the SIL Open Font License, Version 1.1.
This license is copied below, and is also available with a FAQ at:
https://scripts.sil.org/OFL

-----------------------------------------------------------
SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007
-----------------------------------------------------------

PREAMBLE
The goals of the Open Font License (OFL) are to stimulate worldwide
development of collaborative font projects, to support the font creation
efforts of academic and linguistic communities, and to provide a free and
open framework in which fonts may be shared and improved in partnership
with others.

The OFL allows the licensed fonts to be used, studied, modified and
redistributed freely as long as they are not sold by themselves. The
fonts, including any derivative works, can be bundled, embedded,
redistributed and/or sold with any software provided that any reserved
names are not used by derivative works. The fonts and derivatives,
however, cannot be released under any other type of license. The
requirement for fonts to remain under this license does not apply
to any document created using the fonts or their derivatives.

DEFINITIONS
"Font Software" refers to the set of files released by the Copyright
Holder(s) under this license and clearly marked as such. This may
include source files, build scripts and documentation.

"Reserved Font Name" refers to any names specified as such after the
copyright statement(s).

"Original Version" refers to the collection of Font Software components as
distributed by the Copyright Holder(s).

"Modified Version" refers to any derivative made by adding to, deleting,
or substituting -- in part or in whole -- any of the components of the
Original Version, by changing formats or by porting the Font Software to a
new environment.

"Author" refers to any designer, engineer, programmer, technical
writer or other person who contributed to the Font Software.

PERMISSION & CONDITIONS
Permission is hereby granted, free of charge, to any person obtaining
a copy of the Font Software, to use, study, copy, merge, embed, modify,
redistribute, and sell modified and unmodified copies of the Font
Software, subject to the following conditions:

1) Neither the Font Software nor any of its individual components,
in Original or Modified Versions, may be sold by itself.

2) Original or Modified Versions of the Font Software may be bundled,
redistributed and/or sold with any software, provided that each copy
contains the above copyright notice and this license. These can be
included either as stand-alone text files, human-readable headers or
in the appropriate machine-readable metadata fields within text or
binary files as long as those fields can be easily viewed by the user.

3) No Modified Version of the Font Software may use the Reserved Font
Name(s) unless explicit written permission is granted by the corresponding
Copyright Holder. This restriction only applies to the primary font name as
presented to the users.

4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font
Software shall not be used to promote, endorse or advertise any
Modified Version, except to acknowledge the contribution(s) of the
Copyright Holder(s) and the Author(s) or with their explicit written
permission.

5) The Font Software, modified or unmodified, in part or in whole,
must be distributed entirely under this license, and must not be
distributed under any other license. The requirement for fonts to
remain under this license does not apply to any document created
using the Font Software.

TERMINATION
This license becomes null and void if any of the above conditions are
not met.

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM
OTHER DEALINGS IN THE FONT SOFTWARE.
