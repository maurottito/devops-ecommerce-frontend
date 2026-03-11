# Stage 1: Build React application
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY public/ ./public/
COPY src/ ./src/

# Build args allow injecting service URLs at build time.
# Default to empty string so the React app uses relative URLs (e.g. /products)
# which nginx proxies to the ClusterIP services — works for Kubernetes out of the box.
# For docker-compose, pass --build-arg REACT_APP_PRODUCT_SERVICE_URL=http://localhost:3001
ARG REACT_APP_PRODUCT_SERVICE_URL=""
ARG REACT_APP_ORDER_SERVICE_URL=""

ENV REACT_APP_PRODUCT_SERVICE_URL=$REACT_APP_PRODUCT_SERVICE_URL \
    REACT_APP_ORDER_SERVICE_URL=$REACT_APP_ORDER_SERVICE_URL

RUN npm run build

# Stage 2: Serve with nginx
# 1.27-alpine ships with a newer Alpine base, patching curl/libexpat/libxml2/musl CVEs
FROM nginx:1.27-alpine AS runtime

# Upgrade remaining OS packages
RUN apk upgrade --no-cache

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/app.conf

# Copy built React assets
COPY --from=builder /app/build /usr/share/nginx/html

# Drop privileges: nginx master runs as root to bind port 80,
# but worker processes run as the unprivileged 'nginx' user (set in nginx.conf).
EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/index.html || exit 1

CMD ["nginx", "-g", "daemon off;"]
