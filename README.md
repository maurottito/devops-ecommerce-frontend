# devops-ecommerce-frontend

React 18 frontend for the e-commerce platform. Displays the product catalog and lets customers place orders.

## Requirements

- Node.js 18+
- `devops-product-service` running on port 3001
- `devops-order-service` running on port 3002

## Setup

```bash
git clone <repo-url>
cd devops-ecommerce-frontend
npm install
```

## Run

```bash
REACT_APP_PRODUCT_SERVICE_URL=http://localhost:3001 \
REACT_APP_ORDER_SERVICE_URL=http://localhost:3002 \
npm start
```

App will be available at `http://localhost:3000`.

## Scripts

| Command           | Description              |
|-------------------|--------------------------|
| `npm start`       | Start development server |
| `npm run build`   | Build for production     |
| `npm test`        | Run tests                |

## Environment Variables

| Variable                        | Default                 | Description                  |
|---------------------------------|-------------------------|------------------------------|
| `REACT_APP_PRODUCT_SERVICE_URL` | `http://localhost:3001` | Product service base URL     |
| `REACT_APP_ORDER_SERVICE_URL`   | `http://localhost:3002` | Order service base URL       |
| `PORT`                          | `3000`                  | Dev server port              |

## Available Scripts

| Script        | Description                        |
|---------------|------------------------------------|
| `npm start`   | Start development server           |
| `npm run build` | Create optimised production build |
| `npm test`    | Run tests in watch mode            |

## Folder Structure

```
devops-ecommerce-frontend/
├── public/
│   └── index.html          # HTML entry point
├── src/
│   ├── App.js              # Main application component
│   └── index.js            # React DOM entry point
├── .env.example            # Environment variable template
├── .gitignore
├── package.json
└── README.md
```
