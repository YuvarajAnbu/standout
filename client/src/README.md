# Frontend architecture

- `app/` contains application startup, providers, routing, global state, and the
  persistent layout shell.
- `pages/` contains route-level screens and components used only by one screen.
- `features/` contains reusable business behavior such as catalog, cart, and
  admin product-form logic.
- `shared/` contains business-agnostic API infrastructure, UI primitives,
  hooks, storage adapters, styles, and utilities.

Use the `@/` alias for imports outside the current folder. Keep tests and SCSS
next to the code they cover. Component styles are imported from SCSS directly;
Vite owns compilation, so generated CSS and source maps do not belong in
`src/`.
