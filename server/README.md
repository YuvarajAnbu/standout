# Backend architecture

- `main.js` is the process entry point and owns startup and graceful shutdown.
- `app/` assembles Express, global middleware, routes, and production static
  serving without opening a network port.
- `modules/` groups business code by capability: authentication, users,
  catalog, orders, and payments.
- `infrastructure/` contains adapters for external systems such as MongoDB and
  Braintree.
- `shared/` contains framework helpers, reusable HTTP middleware, errors, and
  validation with no ownership of a business module.
- `config/` loads environment configuration.
- `tests/` and `scripts/` contain verification tooling.

Use Node's package imports (`#app/`, `#modules/`, `#infrastructure/`,
`#shared/`, and `#config/`) across architectural boundaries. Relative imports
are reserved for files within the same local module.
