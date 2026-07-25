# AGENTS.md — Operating Memory for Mythrill VTT

> Two distinct memory systems are available in this environment. Do not confuse them.
>
> - **Mind MCP** (`mcp.mind`) — the project's durable memory layer (SQLite). Tools are
>   namespaced as Mind tools: `space_*`, `memory_add`, `memory_read`, `memory_query`,
>   `checkpoint_save`, `checkpoint_load`, `checkpoint_query`, `link_*`, `status`,
>   `system_instructions`. Use the `projects/mythrill-vtt` space unless otherwise noted.
> - **Memory MCP** (`mcp.memory`) — the generic knowledge-graph server (`memory_create_entities`,
>   `memory_read_graph`, `memory_search_nodes`, …). Ephemeral scratchpad; not the source of truth.
>
> When a workflow rule below says "Mind", use the Mind MCP tools.

---

## Operational Rules for TTRPG & VTT Engine Development

### Memory & State Management (Mind MCP)
- **Active Memory:** Query Mind (`memory_query` with `search`, or `space_get` for an orientation
  summary) for project lore, mechanics, and TTRPG rules **before** proposing new features or
  drafting game content. In a fresh session, call `system_instructions` first to load the protocol.
- **Recording decisions:** Use `memory_add` (space `projects/mythrill-vtt`) to capture decisions,
  bug fixes, lore canon, and config changes with meaningful tags. Use `links_to` to connect
  related memories.
- **Session Continuity:** Execute `checkpoint_save` **before** major architectural refactors, VTT
  canvas updates, or session ends. Recover with `checkpoint_query` then `checkpoint_load`. Close
  out completed work with `checkpoint_done` to fold it into a `session-*` summary.
- **Architectural Rules:** Never override core VTT design choices or established world lore without
  recording the rationale in Mind under the project space. If a change supersedes prior canon,
  `memory_add` the new decision and `link_create` it as `supersedes` the old one rather than
  silently deleting context.

### Live Documentation & Testing (Context7 & Playwright)
- **Framework Docs:** Always check Context7 (`context7_resolve-library-id` →
  `context7_query-docs`) for up-to-date syntax **before** using external libraries or canvas
  renderers (React, Firebase, Socket.io, Zustand, etc.).
- **VTT UI & Canvas Testing:** Use Playwright to launch browser checks and verify interactive
  elements (character sheet updates, token drag-and-drop, UI state sync) rather than assuming
  frontend code works. Prefer `playwright_browser_snapshot` for assertions over screenshots.

---

## Environment Setup Notes (Windows)
- **Mind** is installed from source at `C:\Users\Daniel\mind` and runs on **Bun**.
- The `mind setup opencode` flow records a Unix bash launcher that Windows cannot execute, so the
  `mcp.mind` command in `~/.config/opencode/opencode.json` was corrected to:
  `["C:\\Users\\Daniel\\.bun\\bin\\bun.exe", "C:\\Users\\Daniel\\mind\\src\\mind.ts", "mcp"]`
- If `mind update` is run later, re-run `mind setup opencode` and **re-apply** this command-path
  fix (setup will overwrite it with the bash launcher path again).
- The Mind MCP tools become available to opencode only after a **restart** (MCP servers load at
  startup). If Mind tools are missing in a session, restart opencode before reporting a failure.
