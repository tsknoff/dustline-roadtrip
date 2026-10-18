# DUSTLINE — Render multiplayer

Node 22+, npm ci, npm start. Default port 4174; Render supplies PORT.

Render web service: npm ci / npm start, free plan, Frankfurt. render.yaml contains the equivalent Blueprint. Both players should open the same Render URL. Create a room, share its six-character code, join.

On Render, all game traffic is relayed through the same-origin /ws WebSocket endpoint. PeerJS and WebRTC are not used for room creation or gameplay. Host simulates the shared world; server enforces two-player rooms, packet size/rate limits and role-based message types. No database, login or TURN required. The host must keep the tab open. Rooms disappear on server restart/deploy or host disconnect. A free Render instance can sleep when inactive and take about a minute to start.

GitHub Pages remains a static fallback with the older PeerJS/manual connection modes until a separate relay endpoint is configured. Use the Render URL for the new multiplayer.

Tests: npm test (room creation, join/full, bidirectional relay, leave/rejoin, host cleanup, invalid messages, HTTP allowlist); npm run check (syntax).

## Aero edition v0.3

- Asphalt maximum: 300 km/h; off-road limit: 115 km/h. Increased acceleration and speed-sensitive steering.
- Procedural Subaru Libero-inspired microvan with tall cab-over body, side windows, front seats and dashboard.
- Frutiger Aero park city: green grass, glass towers, trees, ponds, cloud clusters and animated bubbles. No desert scenery.
- Characters have faces; hold Z to zoom from 65° to 22° FOV and bulge the character's eyes. Other players see the effect.
- Click the capture prompt to keep the pointer inside the game. Esc releases it and opens the menu. Two-finger trackpad scrolling or arrow keys also controls the view without pointer lock.
- Sound, room-code copying, sensitivity, trackpad/mouse selection and fullscreen live in the Esc menu.

Verified in Chrome on macOS: pointer lock/Esc/resume, denied-lock fallback wheel events, clipboard, sound, two-player networked zoom, cabin view and driving. Physical Mac trackpad feel still depends on browser/OS sensitivity. Vehicle tests cover 300 km/h at 30/60/144fps, braking, reverse, empty fuel and off-road limiting.
