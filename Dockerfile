FROM node:22-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM dependencies AS frontend-build
COPY . .
ARG NEXT_PUBLIC_API_BASE_URL=
ARG NEXT_PUBLIC_USAGE_ENABLED=false
ARG NEXT_PUBLIC_FEEDBACK_ENABLED=false
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL \
    NEXT_PUBLIC_USAGE_ENABLED=$NEXT_PUBLIC_USAGE_ENABLED \
    NEXT_PUBLIC_FEEDBACK_ENABLED=$NEXT_PUBLIC_FEEDBACK_ENABLED \
    NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM dependencies AS backend-build
COPY . .
RUN npm run build:backend

FROM node:22-alpine AS backend
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3001
COPY --from=backend-build --chown=node:node /app/backend-dist ./backend-dist
COPY --from=backend-build --chown=node:node /app/backend/migrations ./backend/migrations
USER node
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD node -e "fetch('http://127.0.0.1:3001/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "backend-dist/index.cjs"]

# DevBox remains a Next.js static export, including in the frontend container.
FROM nginxinc/nginx-unprivileged:1.28-alpine AS frontend
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend-build /app/out /usr/share/nginx/html
USER 101
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s CMD wget -q -O /dev/null http://127.0.0.1:8080/ || exit 1
