# IPTV Pro Terms of Use

Effective date: 13 November 2026

## Operator and scope

The publisher/operator and contact for this web deployment are listed on its [Legal information](legal.html) page. Deployment configuration supplies that information; this repository does not designate a legal entity or invent a contact. The operator must provide any additional legally required identity, address, private contact channel and jurisdiction-specific disclosures before publication. Avoid sharing credentials or private viewing details in public issues.

These terms describe use of the standalone IPTV Pro client. They are not a legal opinion, a guarantee of legality, or a substitute for reviewing the deployment and applicable law. See the [Privacy Policy](PRIVACY.md) and [Third-Party Notices](THIRD_PARTY_NOTICES.md). Third-party license conditions continue to apply independently.

## A player, not an IPTV service

IPTV Pro is client software for sources you choose and configure. The project does not sell or supply channels, playlists, subscriptions, provider accounts, broadcasting rights, media hosting, a stream relay or an IPTV backend. Static hosting serves the app's files, not a project-operated content service. No subscription or right to third-party content is included.

The app does not verify that a provider, playlist or user has permission to distribute or access particular content. Availability through a URL, search result, API or catalog is not evidence of authorization. Nothing here grants rights to programs, recordings, artwork, subtitles, trademarks or other third-party material.

## Authorized use only

Use only sources and content you are lawfully authorized to access, and comply with applicable law and provider terms. Do not use the app to infringe copyright, redistribute unauthorized streams, misuse credentials, bypass payment or access controls, or circumvent DRM or other technical protection measures. The app does not grant permission for, or promise support for, circumvention. These authorized-content restrictions do not prohibit modifying MPL-covered software or otherwise limit rights granted by its license; modifying software is not itself circumvention.

You are responsible for checking the permissions applicable to streaming, downloading, recording, time-shifting and casting in your circumstances. Recording or private-copying exceptions differ by jurisdiction and are not guaranteed by a feature being available. Casting can disclose credential-bearing stream URLs to a receiver and may be restricted by provider terms. Use trusted devices and networks and do not share provider credentials without authorization.

## Browser and service limitations

Features vary by platform, browser, codec, network and provider. The public `browser-only-v1` profile includes browser video/native HLS/HLS.js and Mediabunny 1.65.2 core container remuxing of direct TS/MKV into MSE fragmented MP4. Remuxing uses browser-supported codecs; it does not transcode or add unsupported HEVC, AC-3 or DTS decoding and offers no playback guarantee. No optional codec extensions or FFmpeg codec binaries ship in this profile. Browser playback still requires HTTPS-compatible endpoints and cross-origin permissions; finite remuxed media and seeking also require HTTP Range support. Remuxing runs locally, adds no CDN or provider proxy/backend, and leaves source URLs and credentials subject to direct-provider request disclosures. No proxy, transcoding service, uninterrupted playback, recording availability or Cast compatibility is promised. Providers and third-party APIs can change or discontinue access independently.

Protect local data, encryption keys, passwords and backups. An origin change does not automatically migrate browser data or recover encryption keys. Do not rely on the operator to recover a provider account, lost backup password, recording or local database. See the Privacy Policy for storage, network, export and security limitations.

## Third-party services and non-affiliation

Providers, GitHub, Flutter, Google/Cast, TMDB, OpenSubtitles and other referenced services or marks belong to their respective owners. A reference or integration does not imply affiliation, sponsorship or endorsement. This product uses the TMDB API but is not endorsed or certified by TMDB. API access, artwork, subtitles and provider content remain subject to their owners' terms, privacy practices and permissions; commercial use may require separate agreements.

## Software rights and redistribution

No project LICENSE has been selected in this repository. These terms do not choose an open-source license or grant general redistribution rights for project code, branding or third-party content. Third-party components retain their own licenses and rights. In particular, the unmodified Mediabunny 1.65.2 library and its matching covered source remain under MPL-2.0. These terms do not override or restrict MPL grants to use, modify or redistribute covered software subject to that license, nor impose a general reverse-engineering ban. The standalone Third-Party Notices provide the full MPL text, NOTICE, SOURCE metadata and an explicit matching covered-source archive download. The separate `web/remux_bridge.js` adapter is application code, not a modification of the vendor library; no application-source license is selected here. Distributors must independently satisfy notice, source-availability, modification/relinking and other applicable obligations. The public browser-only Web profile excludes the optional libmedia/FFmpeg decoder binaries rather than redistributing them with unresolved corresponding-source obligations. Developer builds or repositories that still include those binaries require the review noted in Third-Party Notices; copying notices alone does not resolve it. Exclusion from this profile does not certify the remaining dependencies or eliminate applicable patent or other legal requirements.

## Warranties and responsibility

To the extent permitted by applicable law, the software is provided as available and as is, without promises of uninterrupted operation, fitness for a particular purpose, security, content accuracy or compatibility. No statement here guarantees that use or distribution is lawful in every jurisdiction.

To the extent permitted by applicable law, the operator is not responsible for losses caused by unauthorized sources, third-party outages, incompatible devices or loss of locally stored data. Nothing in these terms excludes or limits mandatory consumer rights or liability that cannot lawfully be excluded or limited, including any applicable liability for fraud, intentional misconduct or personal injury. Third-party license disclaimers apply on their own terms.

## Questions and complaints

Use the contact on the site's Legal information page for deployment, privacy, rights or attribution concerns. Identify the relevant deployment and issue without posting secrets or unauthorized copies of content. The operator should review and respond as applicable, including correcting disclosures or removing material it actually hosts when warranted. This is a general contact route, not a designated DMCA agent or statutory takedown procedure, a promise to control third-party providers, or a claim of automatic safe-harbor immunity.

## Changes and publication review

Operators must keep these terms and the Privacy Policy consistent with the actual release and disclose material changes appropriately. Before public deployment, verify the real operator identity/contact, applicable local requirements and unresolved third-party obligations. These supporting files do not certify legal compliance or authorize publication by themselves.
