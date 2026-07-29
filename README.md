# Standout

Standout is a MERN clothing storefront with product browsing, search, carts,
orders, customer accounts, admin order management, and Braintree payments.

## Requirements

- Node.js 22.12 or newer
- MongoDB
- Braintree sandbox credentials
- Cloudinary credentials for product image management

Copy `.env.example` to `.env` and replace every placeholder with your own value.
Never commit `.env`.

## Development

Install and start the API:

```bash
npm install
npm run dev
```

In a second terminal, install and start the client:

```bash
cd client
npm install
npm start
```

The API listens on port 3001 and Vite serves the client on port 3000.

## Verification

```bash
npm run check:server
npm run test:server
npm audit --omit=dev

cd client
npm run lint
npm test
npm run build
npm audit --omit=dev
```

## Production

Build the client before starting the Express server:

```bash
cd client
npm ci
npm run build
cd ..
npm ci
npm start
```

Set `NODE_ENV=production`. Express serves the generated `client/dist` directory
and falls back to `index.html` for client-side routes.

Set `BRAINTREE_ENVIRONMENT=production` and use the `BRAINTREE_MERCHANT_ID`,
`BRAINTREE_PUBLIC_KEY`, and `BRAINTREE_PRIVATE_KEY` variables for live payments.
For `mongodb+srv` connections, `MONGODB_DNS_SERVERS` accepts comma-separated DNS
servers; set it to `system` when the host resolver already supports SRV records.
