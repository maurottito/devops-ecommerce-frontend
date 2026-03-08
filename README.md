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


