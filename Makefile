.PHONY: help build install update remove clean dev build-extension push-extension

EXTENSION_NAME = raveendiranrr/surrealdb-docker-extension
VERSION = 1.0.0
DOCKER_HUB_USERNAME = raveendiranrr

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build the Docker extension
	docker build -t $(EXTENSION_NAME):$(VERSION) .

build-extension: ## Build extension for multi-platform (amd64, arm64)
	docker buildx build --platform linux/amd64,linux/arm64 -t $(EXTENSION_NAME):$(VERSION) --push .

push-extension: ## Push extension to Docker Hub (requires login)
	@echo "Pushing $(EXTENSION_NAME):$(VERSION) to Docker Hub..."
	@echo "Make sure you're logged in: docker login"
	docker push $(EXTENSION_NAME):$(VERSION)

install: build ## Build and install the extension
	docker extension install $(EXTENSION_NAME):$(VERSION)

update: build ## Update an existing extension installation
	docker extension update $(EXTENSION_NAME):$(VERSION)

remove: ## Remove the extension
	docker extension rm $(EXTENSION_NAME)

clean: ## Clean build artifacts
	rm -rf ui/build ui/node_modules ui/package-lock.json

dev: ## Enable development mode with UI hot reload
	cd ui && npm install && npm run dev &
	docker extension dev debug $(EXTENSION_NAME)
	docker extension dev ui-source $(EXTENSION_NAME) http://localhost:3000

validate: ## Validate the extension
	docker extension validate $(EXTENSION_NAME):$(VERSION)

logs: ## Show extension logs
	docker extension dev logs $(EXTENSION_NAME)

docker-login: ## Login to Docker Hub
	@echo "Logging in to Docker Hub as $(DOCKER_HUB_USERNAME)..."
	docker login -u $(DOCKER_HUB_USERNAME)
