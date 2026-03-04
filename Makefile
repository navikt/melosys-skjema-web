SHELL := /bin/bash
.PHONY: help local local-q2 local-q2-new-token get-token stop rebuild build-server

MOCK_OAUTH_CONTAINER := melosys-docker-compose-mock-oauth2-server-1

help:
	@echo "Tilgjengelige kommandoer:"
	@echo "  make local              - Start med mock OAuth (Wonderwall)"
	@echo "  make local-q2           - Start med ekte Q2-token (krever LOCAL_TOKEN env var)"
	@echo "  make local-q2-new-token - Hent nytt Q2-token og start"
	@echo "  make get-token          - Hent nytt Q2-token (åpner nettleser)"
	@echo "  make rebuild            - Tving rebuild av server-image"
	@echo "  make stop               - Stopp alle tjenester"

# Build server identical to CI/prod: compile TypeScript, deploy prod deps to build/, copy frontend placeholder
build-server:
	@printf "  \033[33m◐\033[0m Building server...      \r"
	@pnpm build:server >/dev/null 2>&1
	@rm -rf build
	@pnpm --filter server deploy --prod build >/dev/null 2>&1
	@mkdir -p build/public
	@printf "  \033[32m✓\033[0m Server built            \n"

# Start with mock OAuth (Wonderwall)
local: build-server
	@echo ""
	@printf "\033[36m⚡ Starting melosys-skjema-web (Wonderwall mode)\033[0m\n"
	@echo ""
	@printf "  \033[33m◐\033[0m Starting mock-oauth...  \r" && \
		docker start $(MOCK_OAUTH_CONTAINER) 2>/dev/null && \
		printf "  \033[32m✓\033[0m Mock-oauth running     \n" || \
		(printf "  \033[31m✗\033[0m Mock-oauth failed      \n"; \
		echo ""; echo "    Container '$(MOCK_OAUTH_CONTAINER)' finnes ikke."; \
		echo "    Kjør først: cd ~/nav/melosys-docker-compose && docker compose up -d mock-oauth2-server"; exit 1)
	@printf "  \033[33m◐\033[0m Building Docker image... \r" && \
		docker compose build >/dev/null 2>&1 && \
		printf "  \033[32m✓\033[0m Docker image built     \n"
	@printf "  \033[33m◐\033[0m Starting server...      \r" && \
		docker compose up -d >/dev/null 2>&1 && \
		printf "  \033[32m✓\033[0m Server running         \n"
	@echo ""
	@printf "  \033[1m→\033[0m Open \033[4mhttp://localhost:4000/vite-on\033[0m\n"
	@printf "  \033[2mPress CTRL+C to stop\033[0m\n"
	@echo ""
	@trap 'printf "\n\033[33m◐\033[0m Stopping...\r"; docker compose down -t 2 >/dev/null 2>&1; printf "\033[32m✓\033[0m Stopped        \n"; exit 0' INT; pnpm dev

# Start with real Q2 token - requires LOCAL_TOKEN env var and melosys-skjema-api on localhost:8089
local-q2: build-server
ifndef LOCAL_TOKEN
	@echo "ERROR: LOCAL_TOKEN er ikke satt."
	@echo ""
	@echo "1. Kjør: make get-token"
	@echo "2. Kopier access_token fra JSON-responsen"
	@echo "3. Kjør: export LOCAL_TOKEN=\"din-token\""
	@echo "4. Kjør: make local-q2"
	@exit 1
endif
	@echo ""
	@printf "\033[36m⚡ Starting melosys-skjema-web (Q2 mode)\033[0m\n"
	@echo ""
	@printf "  \033[33m◐\033[0m Building Docker image... \r" && \
		docker compose -f docker-compose.local-q2.yaml build >/dev/null 2>&1 && \
		printf "  \033[32m✓\033[0m Docker image built     \n"
	@printf "  \033[33m◐\033[0m Starting server...  \r" && \
		docker compose -f docker-compose.local-q2.yaml up -d >/dev/null 2>&1 && \
		printf "  \033[32m✓\033[0m Server running     \n"
	@echo ""
	@printf "  \033[1m→\033[0m Open \033[4mhttp://localhost:4000/vite-on\033[0m\n"
	@printf "  \033[2mPress CTRL+C to stop\033[0m\n"
	@echo ""
	@trap 'printf "\n\033[33m◐\033[0m Stopping...\r"; docker compose -f docker-compose.local-q2.yaml down -t 2 >/dev/null 2>&1; printf "\033[32m✓\033[0m Stopped        \n"; exit 0' INT; pnpm dev

# Get new token and start
local-q2-new-token:
	@. ./server/scripts/get-q2-token.sh && $(MAKE) local-q2

# Open browser to get Q2 token
get-token:
	@./server/scripts/get-q2-token.sh

# Stop all containers and processes
stop:
	@docker compose down 2>/dev/null || true
	@docker compose -f docker-compose.local-q2.yaml down 2>/dev/null || true
	@docker stop $(MOCK_OAUTH_CONTAINER) 2>/dev/null || true
	@pkill -f "pnpm dev" 2>/dev/null || true
	@echo "Stopped all services"

# Force rebuild of server images
rebuild: build-server
	@echo "Rebuilding server images..."
	@docker compose build --no-cache
	@docker compose -f docker-compose.local-q2.yaml build --no-cache
	@echo "Done!"
