# Standout client

The storefront is built with React and Vite. Vitest and Testing Library provide
the test environment, and ESLint checks the client source.

## Commands

```bash
npm start       # start Vite at http://localhost:3000
npm run build   # create the production bundle in dist/
npm run preview # preview the production bundle
npm run lint    # run ESLint
npm test        # run the test suite once
npm run test:watch
```

During development, Vite proxies `/user`, `/product`, and `/payment` requests to
the API at `http://localhost:3001`.
