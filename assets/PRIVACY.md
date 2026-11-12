# IPTV Pro Privacy Policy

Effective date: 12 November 2026

## Scope and project identity

This policy describes the data behavior implemented by the IPTV Pro Flutter application in this repository. The app is a client for provider sources selected by the user; it does not operate an IPTV service or include a project-operated account, advertising, analytics, or cloud-storage backend.

For a public web deployment, the publisher/operator and contact are identified on that site's [Legal information](legal.html) page. The deployment supplies these values; this repository does not invent a legal owner, data controller, address, or privacy contact. An operator's GitHub handle and repository issues URL can identify a project contact, but do not substitute for a legal name, private contact channel, or other disclosures where required by law. Do not post credentials or viewing information in public issues.

## Legal notice for distributors

This is a description of the client, not a guarantee that a deployment, provider, or use is lawful. Before publishing, the distributor must review the actual operator identity/contact, applicable privacy and consumer laws, hosting configuration, and third-party obligations. See [Terms of use](TERMS.md) and [Third-party notices](THIRD_PARTY_NOTICES.md). These documents do not replace legal advice or resolve outstanding license-compliance work.

## Public web hosting and browser storage

GitHub Pages serves static application files; it is not an IPTV backend or a playlist-storage service. Requests for the site and its assets reach GitHub and its hosting/network infrastructure, which can process IP addresses, request metadata and logs under [GitHub's Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement) and [Terms of Service](https://docs.github.com/en/site-policy/github-terms/github-terms-of-service). Local playlists are not uploaded to GitHub merely by opening the app. Do not put provider credentials, playlists, API tokens, private backups, recordings, or unauthorized media/artwork into the public repository or deployed bundle.

The app uses browser storage for essential local settings, provider data and playback features, not advertising or cross-site tracking. This build does not add an analytics-cookie consent banner merely for that essential storage. Hosting services and third-party endpoints have their own practices; operators must reassess disclosures and any required consent before adding analytics, optional cookies or other services.

The bundled Inter font and HLS.js library are served with the app. The public browser-only release workflow uses Flutter's local Web resources option to serve renderer resources from the same deployment instead of its default renderer CDN. Optional libmedia/FFmpeg compatibility-decoder binaries and their loader are excluded from that profile. Other builds may still request runtime/renderer or font assets from a third-party CDN (for example Google's runtime infrastructure). Such hosts receive ordinary connection metadata, including IP addresses. Review the actual release's network requests rather than assuming all builds are self-hosted. The standalone legal pages themselves use no external fonts, scripts or CDN assets.

An HTTPS web app generally cannot access HTTP-only providers because browsers block mixed content. Providers must also permit the browser's cross-origin requests (CORS). This client supplies no project-operated proxy to bypass these restrictions. Provider traffic, credentials and media requests go to the selected third-party endpoints, not a project-operated playlist backend.

Browser data and encryption keys are tied to the browser profile and origin (scheme, hostname and port), with storage behavior also affected by deployment paths and app configuration. Moving between hosts or HTTP/HTTPS does not automatically migrate data. Sites sharing an origin may share storage access: trust the operator and every deployment on that origin. Same-origin malicious scripts, XSS, a compromised release or browser extensions may access data while the app is running despite encryption at rest. Publishing static legal pages does not clear data, migrate keys or reset parental locks; changing an origin must not be presented as a recovery or lock-reset feature. Export a protected backup while the old app remains accessible if you need to move data.

## Data stored on the device

Depending on the features you use, the app stores the following locally in its app data or browser storage:

- Provider configurations, including playlist and XMLTV URLs, Xtream server addresses, usernames, passwords, and stream URLs derived from those credentials.
- Provider catalog data and cached channel logos, posters, schedules, movies, series, and other metadata.
- Profiles, favorites, parental-control settings, PIN hashes, application preferences, an optional OpenSubtitles API key, and an optional TMDB API Read Access Token.
- Watch progress and watch history, including content titles, stream URLs, playback position, duration, profile, playlist, and last-updated time.
- Search history, including each query, how often it was used, and when it was last used. The app keeps at most 50 recent search entries per profile.
- Recording metadata and, on supported platforms, locally recorded video files. On Web, recordings are downloaded through the browser rather than retained in the app's managed recording list.
- Temporary image, network, and platform caches needed to display provider content.

The app does not upload this local database to a project-operated server.

## Encryption at rest and platform limits

Sensitive Hive fields are encrypted with authenticated AES-256-GCM encryption. These fields currently include provider/playlist URLs and credentials, cached channel and movie stream URLs, watch-history stream URLs, the OpenSubtitles API key, and the TMDB Read Access Token. A random master key is stored through the platform secure-storage facility rather than beside the Hive database. Legacy plaintext sensitive fields are migrated to encrypted values during startup.

This protection has important limits:

- It protects selected fields in the app's local database at rest; it is not full-device, full-database, recording-file, or cache encryption. Exported backups use separate password-based encryption described below.
- Other local data, including titles, searches, favorites, profile names, catalog metadata, and recording files, is not encrypted by this app. Profile PINs are one-way hashed rather than stored as the original PIN.
- Android, iOS, macOS, Windows, Linux, Web, and Tizen use different secure-storage backends and security properties. Web secure storage requires HTTPS or localhost and relies on the browser's experimental WebCrypto/localStorage model. Linux requires libsecret and an available Secret Service. Tizen requires its device key-manager service. If the required backend is unavailable or locked, the app fails closed instead of writing an unprotected fallback key.
- Device compromise, an unlocked user session, operating-system backup/sync behavior, browser extensions or profiles, screen capture, malware, and access while the app is running can bypass or reduce at-rest protection.
- If the secure-storage key is lost or becomes unavailable, encrypted local fields cannot be recovered by the app.

## Network disclosures

### Your IPTV or playlist provider

The app contacts the provider endpoints and media hosts configured by you to authenticate, download playlists/catalogs and program guides, check source health, load images, and play or record streams. Those services can receive your IP address, request metadata, provider credentials, and the content or channel requested. Their terms, privacy practices, security, availability, and retention are outside this project's control.

### OpenSubtitles (opt-in)

OpenSubtitles access requires an API key supplied by you. Adding a key alone does not enable automatic lookup. When you manually use online subtitle search, or enable the separately controlled automatic subtitle lookup, the app sends the API key and relevant search metadata to OpenSubtitles. Depending on the media, this can include title or series name, release year, movie/episode type, season and episode numbers, and preferred subtitle language. Downloading a selected subtitle also sends its OpenSubtitles file identifier. OpenSubtitles and ordinary network infrastructure also receive connection metadata such as your IP address.

Automatic subtitle lookup is off by default. OpenSubtitles processes data under its own terms and privacy practices.

### TMDB artwork (opt-in)

Optional missing-poster/backdrop lookup uses The Movie Database (TMDB). It is off by default and requires your own API Read Access Token in Settings > Appearance. Adding a token alone does not enable lookup. When enabled, mounted movie/series artwork widgets can send the content title, release year when available, media type and app language to `api.themoviedb.org`. Episode artwork uses the series name when available, not the episode title. TMDB receives the access token and normal connection metadata such as your IP address. Loading a selected image contacts `image.tmdb.org`.

The app does not send playlist URLs, stream URLs, Xtream credentials, profile names, favorites or viewing positions as TMDB lookup parameters. Searches are skipped when a title resembles a credential-bearing URL. Provider artwork remains preferred in ordinary cards/details. The featured Home, Movies and Series heroes can request the matched TMDB title's image collection and prefer a higher-quality landscape over a provider banner; this sends that public TMDB title identifier, media type and image-language filters. A matched search response can also supply a missing hero overview, year or rating for display only. Catalog data and playback identifiers are not rewritten. Lookups do not block playback or refresh the full provider catalog.

Lookup results, including short-lived no-match results, are kept in a bounded session-memory cache. Images use the existing platform image-cache policy. Disabling the feature or changing/clearing the token disposes its service and cancels pending requests. Public artwork may remain in the image/browser cache until cleared or evicted. This is not a deletion request to TMDB; its terms, privacy policy, logs and retention are outside this project's control.

### Local phone-to-TV setup portal (opt-in)

On native platforms, Set up with phone in Settings > Data, Appearance,
Subtitles, or Playlists can start a temporary local HTTP receiver after a separate
warning and confirmation. The selected entry limits the accepted forms. It binds
one private IPv4 interface, displays an address and six-digit pairing code, and
accepts one new TMDB token, OpenSubtitles key, Xtream source, or M3U/XMLTV draft
from a browser. Source drafts may contain usernames, passwords and credential-
bearing URLs. This is **unencrypted local
HTTP**, not a cloud transfer or an encrypted tunnel. Use only trusted Wi-Fi/LAN,
not public/guest networks or a VPN. Private-address, origin and pairing-code
checks do not establish strict same-subnet isolation; routed private peers and
network observers may still be relevant threats.

The receiver expires after five minutes and stops on cancellation, leaving
the initiating screen, profile changes/logout, or successful transfer. Attempts,
body size, socket count and request lifetimes are limited. A session-bound
anti-forgery value and the TV pairing code are required, including when a browser
omits Origin or reports `null`. Explicit foreign origins remain rejected. It does
not serve existing credentials/settings, use external page assets or browser
storage, log/echo submitted secrets, or accept query-string submissions.

New details stay in memory until you confirm Save or Add Source on TV. Cancelling
leaves existing keys and sources unchanged. Playlist import is owned by the
initiating profile, uses the existing provider/download/parser path, and rolls
back newly created records if cancelled or invalidated during persistence.
Confirmed keys/provider credentials use the encrypted fields described above;
non-sensitive catalog metadata is not encrypted. Saving API keys does not enable
TMDB artwork or automatic subtitle lookup. See the repository README's Phone-to-TV setup section
for the native-platform workflow and limitations.
Browser/OS clipboard and network behavior remain outside the app's control. The
explicit clipboard-paste button reads your local clipboard only when pressed.

### Cast receivers

A stream URL can contain provider usernames, passwords, tokens, or other credentials. To cast that stream, the app must send the URL to the selected receiver so the receiver can request the media directly. When credentials are detected, the app displays a confirmation before sharing them for that cast session. Continue only with a receiver and local network you trust. The receiver platform, device operator, provider, and network may process or log the URL independently of this app.

### Other content hosts

Image, subtitle-download, playlist, guide, and media hosts receive normal request and connection data when their resources are requested. The app cannot control their logs or retention.

## Advertising, analytics, and crash reporting

The current app contains no advertising SDK, behavioral analytics, or project-operated telemetry service. It does not currently send crash reports to a project-operated or third-party crash-reporting service.

Optional crash reporting may be considered in a future version, but it is not active under this policy. Before enabling it, the app and this policy should be updated to identify the service and data involved, avoid credentials and sensitive URLs, provide any legally required choice or consent, and disclose retention and transfer details.

## Backups and exports

Settings > Data can export a password-encrypted JSON backup containing playlists, provider URLs and Xtream usernames/passwords, profiles, favorites, watch progress/history, and TMDB artwork settings including the Read Access Token when configured. The current backup format derives a key from the password with Argon2id and encrypts/authenticates the payload with AES-256-GCM using a random salt and nonce. Provider credentials and viewing activity are not readable in the exported envelope without the password. The app does not store or recover the backup password; losing it makes the backup unrecoverable. Choose a strong, unique password and transfer it separately from the file.

A decrypted backup payload remains highly sensitive. It contains provider credentials in readable form and profile PIN hashes, not the original PINs. Anyone who knows the backup password or obtains a decrypted copy may be able to access your provider account or infer viewing activity. Encryption also does not prevent someone with both the file and password from sharing or retaining the contents.

Older v1 backups supported for migration are unencrypted plaintext and can expose playlist URLs, usernames, passwords, profiles, favorites, and watch history to anyone who can read them. The app identifies that legacy format and requires a separate warning confirmation before import, but it cannot retroactively protect copies of those files. Re-export imported data in the current encrypted format and securely delete legacy copies when they are no longer needed.

The backup is a partial data export. It does not currently include recording files, recording metadata, recent search history, cached catalogs/images, all application settings, or data held by providers and other third parties. The selected share destination, file provider, cloud drive, messaging app, operating system, or recipient may retain its own encrypted or decrypted copies and may expose the backup password if entered or shared there. Store and transmit backups only through locations you trust, and delete every copy when no longer needed.

## Retention and deletion

The project does not retain a server-side copy of the app's local database because it has no project-operated backend. This does not exclude hosting request logs or records held by third-party services described above. Local data generally remains until you remove it, clear app/browser data, or uninstall the app, subject to operating-system backup, secure-storage, browser, filesystem, and cache behavior.

Available controls include:

- Remove individual recent searches or clear search history from Search.
- Remove individual watch-history items or clear watch history for the active profile from History or Settings > Data.
- Delete playlists and their cached catalogs from Playlists.
- Delete non-default profiles and their playlists, favorites, watch/search history, notifications, and related profile-scoped data. Recording files are separate and should be deleted from Recordings.
- Delete individual recording files from Recordings. Files exported or downloaded outside app-managed storage must be deleted with the operating system or browser.
- Export the partial JSON backup described above.
- Clear the app's storage or uninstall it for broader removal of app-managed local data. Platform backups, exported backups, downloaded recordings, receiver logs, provider records, and secure-storage entries may require separate deletion.

The app does not provide access to or deletion of records held by your provider, TMDB, OpenSubtitles, a Cast platform/receiver, content hosts, your operating-system account, backup provider, or another app. Contact those parties or use their controls for their copies.

## Security and user responsibility

No storage or transmission method is completely secure. Use a device account and screen lock, install trusted builds, keep the operating system updated, avoid reusing provider credentials, protect backup and recording files, and do not cast credential-bearing URLs to untrusted receivers.

You are responsible for choosing lawful providers and sources and for having the rights, permissions, and licenses required to access, stream, record, download, cast, or otherwise use content. The app does not supply content and does not verify that a provider or user has those rights.

## Changes

If app behavior changes, this policy should be updated and the effective date revised. Distributors are responsible for ensuring that the policy presented with their build matches their configuration, added services, jurisdiction, and store disclosures.
