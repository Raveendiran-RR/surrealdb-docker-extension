# Build the UI
FROM node:20-alpine AS client-builder  
WORKDIR /ui
COPY ui/package.json /ui/package.json
COPY ui/package-lock.json /ui/package-lock.json
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm install
COPY ui /ui
RUN npm run build

# Production image
FROM alpine:3.18

LABEL org.opencontainers.image.title="SurrealDB" \
    org.opencontainers.image.description="A Docker Desktop extension for managing SurrealDB databases" \
    org.opencontainers.image.vendor="Raveendiran RR" \
    com.docker.desktop.extension.api.version="0.3.3" \
    com.docker.desktop.extension.icon="https://raw.githubusercontent.com/Raveendiran-RR/surrealdb-docker-extension/main/surrealdb.svg" \
    com.docker.extension.screenshots='[{"alt":"SurrealDB Docker Extension - Main Dashboard","url":"https://raw.githubusercontent.com/Raveendiran-RR/surrealdb-docker-extension/main/screenshots/surrealist_docker_extension.png"}]' \
    com.docker.extension.detailed-description="SurrealDB is a Multi-Model database that combines SQL and NoSQL capabilities in one place. This extension helps you experiment with SurrealDB on Docker Desktop." \
    com.docker.extension.publisher-url="https://github.com/Raveendiran-RR" \
    com.docker.extension.additional-urls='[{"title":"SurrealDB Website","url":"https://surrealdb.com/"},{"title":"Documentation","url":"https://surrealdb.com/docs/surrealdb"},{"title":"Source Code","url":"https://github.com/Raveendiran-RR/surrealdb-docker-extension"}]' \
    com.docker.extension.categories="DATABASES & STORAGE" \
    com.docker.extension.changelog="<ul><li>Initial release with SurrealDB Extension</li><li>Added comprehensive Help tab with tutorials</li><li>Integrated Surrealist UI for advanced database management</li><li>Added Database Manager and Settings in Manager tab</li></ul>" \
    com.docker.desktop.extension.icon="https://raw.githubusercontent.com/Raveendiran-RR/surrealdb-docker-extension/main/surrealdb.svg"

# Install docker-compose and required dependencies
RUN apk add --no-cache \
    docker-cli \
    docker-cli-compose

COPY metadata.json .
COPY surrealdb.svg .
COPY docker-compose.yaml .
COPY --from=client-builder /ui/build ui