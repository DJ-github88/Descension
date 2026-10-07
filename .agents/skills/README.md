# Agent Skills for Mythrill VTT

Shared repository-local skills installed for both **Google Antigravity** and **OpenCode**.

Both tools natively discover skills placed at:
```
.agents/skills/<skill-name>/SKILL.md
```
No duplicate copies or symlinks are needed.

---

## Skills Catalog

### 1. Ponytail
- **Source**: [https://github.com/DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail)
- **Upstream Commit**: `c982cd411abb53323c4baa1baa3c2f020b8d0b08`
- **Purpose**: Keep engineering solutions small, prevent unnecessary complexity, and avoid over-engineering.
- **When to Use**: Broadly during implementation and refactoring. Prefer the smallest correct change. Stop at the first rung of the simplicity ladder (reuse existing code > stdlib > native platform > existing dependency).
- **When NOT to Use**:
  - Do NOT use for aggressive simplification of mature, working code merely for aesthetic reasons.
  - Do NOT delete established abstractions just because a simpler theoretical design exists. Stability > elegance.
  - Do NOT use on non-coding tasks (prose, summaries).
  - Never simplify away input validation, error handling, security checks, or accessibility.
- **Dependencies**: None. Pure markdown instructions.
- **Privacy & Security**: Zero external network access, zero code execution on install.
- **Status**: **Active / Installed**
- **Antigravity Compatibility**: Verified (Standard `.agents/skills/ponytail/SKILL.md`)
- **OpenCode Compatibility**: Verified (Discovered via `opencode agent list`)

---

### 2. I Have ADHD
- **Source**: [https://github.com/ayghri/i-have-adhd](https://github.com/ayghri/i-have-adhd)
- **Upstream Commit**: `839872f9d1cd634fed642b4589ce7226199cc15f`
- **Purpose**: Make agent communication action-first, concise, structured, and easier to execute without losing context.
- **When to Use**: Primarily for agent communication with the user. Structure outputs around:
  1. What happened / what matters
  2. What you are doing
  3. Result
  4. What the user needs to do next (single clear action)
  Cap lists at 5 visible items, suppress tangents, restate state across turns.
- **When NOT to Use**:
  - Do NOT let brevity reduce technical rigor. Never skip tests, investigation, edge cases, validation, or security reasoning.
  - Break brevity rules when the user asks for full explanations, when destructive actions are pending, or when disambiguation is required.
- **Dependencies**: None. Pure markdown instructions and configuration templates.
- **Privacy & Security**: Zero network access, zero runtime execution on install.
- **Status**: **Active / Installed**
- **Antigravity Compatibility**: Verified (Standard `.agents/skills/i-have-adhd/SKILL.md`)
- **OpenCode Compatibility**: Verified (Discovered via `opencode agent list`)

---

### 3. Cloudflare Security Audit Skill
- **Source**: [https://github.com/cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill)
- **Upstream Commit**: `c1c8a8c1471069fb0e188eeaff69b8e8db6564a8`
- **Purpose**: Defensive, source-first security analysis for authentication, authorization, APIs, sockets, multiplayer state, user input, database access, secrets, and trust boundaries.
- **When to Use**: When touching security-relevant boundaries:
  - Authentication and authorization
  - GM vs. Player permission boundaries
  - WebSockets and multiplayer real-time events (89+ socket events)
  - Firebase security rules and state mutation
  - Input validation and client-server trust boundaries
- **When NOT to Use**:
  - Do NOT run full security audits for routine CSS/UI changes or minor text tweaks.
  - Never probe live/deployed endpoints or external production services.
- **Dependencies**: Node.js (uses only built-in core modules for standalone ledger/findings validation). Zero third-party packages.
- **Privacy & Security**: All analysis is local and defensive. No telemetry, no remote transmissions.
- **Status**: **Active / Installed**
- **Antigravity Compatibility**: Verified (Standard `.agents/skills/security-audit/SKILL.md`)
- **OpenCode Compatibility**: Verified (Discovered via `opencode agent list`)

---

### 4. Diagram Design
- **Source**: [https://github.com/cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design)
- **Upstream Commit**: `f903933a534ba92cde1c85a28186267b3a317bb2`
- **Purpose**: Create accessible, editorial architecture and system diagrams (HTML/SVG) for complex flows.
- **When to Use**: When visual representation materially improves comprehension:
  - WebSocket architecture and message synchronization flows
  - Frontend/backend communication boundaries
  - Scene and combat state machines
  - Permission and data models
- **When NOT to Use**:
  - Do NOT generate diagrams for trivial changes or simple linear logic.
  - Lists, tables, and short descriptions should remain as text.
- **Dependencies**: Python 3 standard library only (`argparse`, `re`, `html`, `json`, `base64`) for optional conversion/lint scripts (`self_check.py`, extractors). Zero third-party pip dependencies.
- **Privacy & Security**: Fully local generation. No external scripts or data transmissions.
- **Status**: **Active / Installed**
- **Antigravity Compatibility**: Verified (Standard `.agents/skills/diagram-design/SKILL.md`)
- **OpenCode Compatibility**: Verified (Discovered via `opencode agent list`)

---

### 5. Graphify
- **Source**: [https://github.com/Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify)
- **Upstream Commit**: `0b60d47e6cd9338c51143f39f35b6c45c8453385`
- **Purpose**: Help understand relationships and cross-cutting architecture across large codebases.
- **When to Use**: Querying existing knowledge graphs or architectural relationships when `graphify-out/` is pre-built.
- **When NOT to Use**:
  - Do NOT run extraction without user approval due to heavy computation and dependency requirements.
  - Do NOT send private repository source code to external services.
- **Infrastructure & Dependencies Required**:
  - Requires `graphifyy` Python package (installed via pip or uv).
  - Optional external databases (Neo4j, FalkorDB).
  - Extensive AST extraction and local disk output (`graphify-out/`).
- **Privacy & Security Considerations**:
  - AST analysis runs locally, but cross-repo merge or cloud features must NOT be invoked on private source code without explicit consent.
- **Status**: **OPTIONAL / NOT ACTIVATED** (Safe declarative instructions and reference documentation installed; execution pipeline deactivated to avoid unnecessary infrastructure/dependencies).
- **Antigravity Compatibility**: Discovered (Standard `.agents/skills/graphify/SKILL.md`)
- **OpenCode Compatibility**: Verified (Discovered via `opencode agent list`)

---

### 6. Impeccable
- **Source**: [https://github.com/pbakaus/impeccable](https://github.com/pbakaus/impeccable)
- **Upstream Commit**: `e103efe779e2dd01274dabae83531fef00bf2563`
- **Purpose**: Improve frontend UI/UX hierarchy, typography, contrast, spacing, accessibility, and interaction clarity.
- **When to Use**: Frontend UI/UX tasks (character sheets, wizard steps, HUD components, modals) needing design polish, accessibility checks, or consistency improvements.
- **When NOT to Use**:
  - Do NOT spontaneously redesign established VTT components or rewrite visual identity.
  - Do NOT replace custom VTT aesthetics with generic SaaS templates.
  - Functionality and existing project consistency always take precedence.
- **Dependencies & Caution**:
  - Shipped scripts include `impeccable.cmd`, which attempts to download an external precompiled binary (`impeccable.exe`) if not found.
  - **Supply-Chain Guard**: The binary download has NOT been executed. The skill includes an explicit offline/no-launcher fallback: agents read existing `PRODUCT.md` and `DESIGN.md` directly.
- **Status**: **Active / Installed** (Declarative guidance active; automatic binary launcher withheld).
- **Antigravity Compatibility**: Verified (Standard `.agents/skills/impeccable/SKILL.md`)
- **OpenCode Compatibility**: Verified (Discovered via `opencode agent list`)

---

## Interaction and Precedence Rules

When multiple skills are relevant to a task, observe this strict priority order:

1. **CORRECTNESS** — Working code over everything else.
2. **SECURITY** — Cloudflare Security Audit rules override Ponytail's simplification (never simplify security/validation away).
3. **EXISTING PROJECT BEHAVIOR** — Existing VTT components and conventions override Impeccable redesign suggestions.
4. **SIMPLICITY** — Ponytail principles govern new implementation diffs.
5. **MAINTAINABILITY** — Clear, modular architecture over clever micro-optimizations.
6. **UI/UX QUALITY** — Impeccable guidelines refine user experience while respecting current VTT style.
7. **DOCUMENTATION / VISUALIZATION** — Diagram Design only when diagrams genuinely clarify complex systems.
8. **COMMUNICATION STYLE** — I Have ADHD shapes the structure of user reports (action-first, concise), but never reduces technical rigor or validation depth.
