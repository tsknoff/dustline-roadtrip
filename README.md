# DUSTLINE — Render multiplayer

Node 22+, npm ci, npm start. Default port 4174; Render supplies PORT.

Render web service: npm ci / npm start, free plan, Frankfurt. render.yaml contains the equivalent Blueprint. Both players should open the same Render URL. Create a room, share its six-character code, join.

On Render, all game traffic is relayed through the same-origin /ws WebSocket endpoint. PeerJS and WebRTC are not used for room creation or gameplay. Host simulates the shared world; server enforces two-player rooms, packet size/rate limits and role-based message types. No database, login or TURN required. The host must keep the tab open. Rooms disappear on server restart/deploy or host disconnect. A free Render instance can sleep when inactive and take about a minute to start.

GitHub Pages remains a static fallback with the older PeerJS/manual connection modes until a separate relay endpoint is configured. Use the Render URL for the new multiplayer.

Tests: npm test (room creation, join/full, bidirectional relay, leave/rejoin, host cleanup, invalid messages, HTTP allowlist); npm run check (syntax).
