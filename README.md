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

## v0.4 — smooth multiplayer and hill country

Client movement now uses sequenced input commands with host acknowledgments and replay of unacknowledged commands. Remote car motion is buffered/interpolated; cameras, occupants and car render from the same smoothed pose. Removed camera head-bob and artificial chassis shaking. Simulation/snapshot timers are independent from rendering. Incompatible with old clients: refresh both browsers and create a new room after update.

Steering ramps in, self-centers and limits yaw at speed; leaving asphalt slows the car progressively. New E12-inspired model has a swept windshield, rounded nose/roof, narrow body, roof glass, arch trim and detailed wheels. Continuous sampled terrain supports road inclines, stronger bend sections, mountains, bushes, rocks, benches and marker posts.

Validation: prediction/reconciliation tests with delayed batched acknowledgments, continuous terrain at chunk seams, steering and 300 km/h tests. Browser tests add approximately 180ms RTT and packet jitter: guest walking and driving, plus passenger camera while host turns. No reverse position jumps observed in these tests. Severe network stalls can still require resynchronization; no host migration.

## v0.5 — independent cars, drift wallet and AERO MART

Two cars spawn together: Libero and a procedural early Toyota Crown S110 sedan (1979), with separate fuel, motion and driver/passenger seats. There is no forward speed clamp; grass, drifting, coasting and brakes still reduce speed. Hold Shift with A/D above 25 km/h to initiate an arcade momentum slide. Release to regain grip. Valid moving slides accumulate a chain with up to x5 multiplier, banked after 0.8 seconds without a slide. Wallets belong to the host/guest player slots for this room, survive switching cars and are reset with a new session. No persistence after closing the room.

M at the AERO MART counter opens purchases: 5 cigarettes / 100 drift points, one beer / 150. N smokes for 7s; B drinks for 4s. Inventory consumption, balances and action timestamps are host-authoritative. Both peers see the hand movement/items and smoke; first-person camera has a held prop. C now provides third-person walking as well as driving, and shows the local avatar.

Validation: 12 automated tests including multicar input replay, drift banking and purchase restrictions. Two-browser smoke verifies independent simultaneous drivers, guest earnings, walking camera, host-visible guest smoking/drinking, and shop debits with a browser-only seeded fixture. The game source starts wallets and inventories empty. Both clients must refresh and create a new room after deploying.

Model references: early S110 sedan front/side reference photos at https://www.drom.ru/catalog/toyota/crown/g_1979_6406/ ; original procedural geometry, no copied assets. Arcade drift feel inspired by Deadline Delivery; not a reproduction of its physics.

## v0.6 — woodland roads and animated travelers

Roads alternate 1.5 km straights and 900 m quintic bends with continuous tangents. The shared deterministic route works in either direction. Replaced Aero towers/bubbles with autumn woodland, crooked trees, muted leaf litter, instanced dry grass, mushrooms, pumpkins, cottages, fences and lanterns. Stations and menus use wood/parchment colors.

Walking leg/knee and arm animation follows actual rendered distance, blends to rest, and remains visible remotely. Seated legs bend; consumption actions retain the active arm animation. Wheel up stretches the walking avatar to 1.9x; down squashes/crouches to 0.4x. Host clamps the replicated stance; local prediction replays it. Camera height follows the smoothed stance. Alt + trackpad scroll retains the old look gesture; arrow-key look remains available.

Validation: 14 automated tests, plus two-browser verification of remote walking/stopping, wheel stance replication, and first-person camera height. Scene visually inspected in Chrome. Refresh both clients and start a new room after deploying.
