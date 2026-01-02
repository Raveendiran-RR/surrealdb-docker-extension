# syntax=docker/dockerfile:1

# Build the UI
FROM node:20-alpine AS client-builder  
WORKDIR /ui
COPY ui/package.json /ui/package.json
COPY ui/package-lock.json /ui/package-lock.json
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci
COPY ui /ui
RUN npm run build

# Production image
FROM alpine:3.18
LABEL org.opencontainers.image.title="SurrealDB" \
    org.opencontainers.image.description="A Docker Desktop extension for managing SurrealDB databases" \
    org.opencontainers.image.vendor="Raveendiran RR" \
    com.docker.desktop.extension.api.version="0.3.3" \
    com.docker.desktop.extension.icon="https://raw.githubusercontent.com/Raveendiran-RR/surrealdb-docker-extension/main/surrealdb.svg"

COPY metadata.json .
COPY surrealdb.svg .
COPY docker-compose.yaml .
COPY --from=client-builder /ui/build ui
