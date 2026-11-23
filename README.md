# Mythrill VTT

**Mythrill** is an original fantasy tabletop RPG (TTRPG) and real-time virtual tabletop platform, combining a React web client (`vtt-react/`) with an authoritative Node.js and Socket.IO multiplayer server (`server/`).

## Features

- **Interactive Tactical Grid & Level Editor** — Multi-layer battlemaps with pan/zoom canvas, walls, dynamic lighting, fog of war, terrain/environmental controls, area-of-effect previews, and drag-and-drop token management.
- **Authoritative Multiplayer & Combat Engine** — Real-time room synchronization over Socket.IO with Firebase persistence, turn-based combat timeline, ongoing effect tracking, saving throws, cooldowns, circle and line area execution, passive triggers, follow-up/component-watch triggers, and atomic resource payments.
- **Spellcrafting Wizard & Authored Abilities** — Multi-step spell authoring studio supporting direct damage and healing, dynamic formulas, channeled spells (`authored-channeled:v1`), rollable/random outcome tables, riders and conditions, saving throws, relationship-aware targeting, and Spell Library admission.
- **Original Character System** — Guided character creation wizard, interactive character sheets, original classes with bespoke class resources (such as Hunter Flow, Minstrel notes, Arcanoneer spheres, Martyr devotion, and more), talent trees, equipment, inventory, and rest/quest tracking.
- **GM & Worldbuilding Suite** — Bestiary and Creature Wizard, Item Generation, Loot/Shop/Crafting tools, Interactive World Map, Location Scenes, Books/Journal/Dialogue tools, Jukebox audio, and GM-authoritative adjudication controls.
- **Verification & Release Tooling** — Client/server shared contract mirror verification, executable capability map, composition preservation gate, read-only release preflight CLI, and a disposable local demo encounter.

## Repository Structure

```text
.
├── vtt-react/                     # React 18 frontend (Zustand, CRACO, Jest, Playwright)
│   └── src/
│       ├── components/            # Grid, HUD, Combat, Spellcrafting Wizard, Character Sheet, GM Tools
│       ├── data/                  # Original classes, spells, items, bestiary, and world data
│       ├── services/              # Authored ability compiler, execution plans, targeting, sync services
│       └── store/                 # Zustand state slices
├── server/                        # Express + Socket.IO authoritative multiplayer backend
│   ├── handlers/                  # Socket event and room lifecycle handlers
│   ├── services/                  # Combat, triggers, passives, persistence, validation, rate limiting
│   ├── shared/                    # Synced mirrors of client/server shared domain services
│   └── tests/                     # Mocha/Chai production, acceptance, and composition-gate suites
├── docs/                          # Lore canon, contracts, capability map, and engineering records
├── tools/release-preflight/       # Read-only release verification CLI
├── demo/frost-lantern-encounter/  # Disposable local demo encounter and play sheet
└── scripts/                       # Build, deployment, health-check, and class-audit scripts
```

## Getting Started

### Prerequisites

- **Node.js** (`>=20` recommended; required by `server/` and release tooling)
- **npm**

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/DJ-github88/Descension.git
   cd Descension
   ```

2. Install root, frontend, and server dependencies:
   ```bash
   npm run install:all
   ```

### Environment Configuration

- **Client (`vtt-react/`):** Copy `vtt-react/.env.example` to `vtt-react/.env.local` and configure your Firebase project keys and `REACT_APP_SOCKET_URL` (defaults to `http://localhost:3001`).
- **Server (`server/`):** Copy `server/.env.example` to `server/.env` and configure `PORT`, `CORS_ORIGIN`, Firebase Admin credentials, and `ALLOW_DEV_AUTH=true` for local development only.

### Running Locally

Start both the multiplayer server and frontend together from the repository root:

```bash
npm start
```

Or run them in separate terminals:

```bash
# Terminal 1 — Multiplayer server (http://localhost:3001)
cd server
npm start        # or: npm run dev

# Terminal 2 — React client (http://localhost:3000)
cd vtt-react
npm start
```

## Testing & Verification

### Frontend (`vtt-react/`)
```bash
cd vtt-react
npm run lint
npm test -- --watchAll=false
```

### Server & Shared Contracts (`server/`)
```bash
cd server
npm run check:shared             # Verify server/shared matches vtt-react/src/services
npm test                         # Full Mocha test suite
npm run test:composition         # Composition preservation gate
npm run test:passive:acceptance  # Passive acceptance suite
node tests/capabilityMap.runner.cjs --strict
```

### Class Data Validation (Repo Root)
```bash
npm run validate:classes
npm run validate:talent-trees
```

## Tech Stack

- **Frontend:** React 18, Zustand, React Router, React Bootstrap, Three.js, Cannon-es, Rough.js, Howler.js, Socket.IO Client, Firebase Web SDK
- **Backend:** Node.js, Express, Socket.IO, Firebase Admin SDK, Joi, fast-json-patch, Mocha / Chai / Sinon
- **Deployment:** GitHub Actions & Netlify

## Documentation

- [Capability Map](docs/CAPABILITY_MAP.md) — Executable inventory of Spell Wizard authoring vs. installed engine execution
- [Channeled Spell Contract](docs/CHANNELED_SPELL_CONTRACT.md) — Wire, persistence, and combat contract for `authored-channeled:v1`
- [Server Architecture](server/docs/ARCHITECTURE.md) — Backend module overview and socket handler categories
- [Pre-Launch Testing Guide](README_TESTING.md) — Health checks, observability endpoints, and load testing
- [Release Preflight CLI](tools/release-preflight/README.md) — Read-only source, build, and gameplay evidence verification
- [Frost Lantern Demo Encounter](demo/frost-lantern-encounter/README.md) — Disposable local scenario host and play sheet
