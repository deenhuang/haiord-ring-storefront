# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

The current brand is HAIORD (元序), and the product is HAIORD Ring (元序智能戒指). Use “Sense Life. Understand the World.” / “感知生命，理解世界。” as the long-term brand line and “Hello, a World That Knows You.” / “你好，更懂你的世界。” as the brand-story theme. Keep the English and Chinese storefronts in sync. Existing product imagery and prices remain unchanged until the user supplies replacements; do not surface the legacy NOOR brochure as a download.
