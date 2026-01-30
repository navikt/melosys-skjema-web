SHELL := /bin/bash
.PHONY: help local local-q2 local-q2-new-token get-token stop rebuild

MOCK_OAUTH_CONTAINER := melosys-docker-compose-mock-oauth2-server-1

help:
	@echo "Tilgjengelige kommandoer:"
	@echo "  make local              - Start med mock OAuth (Wonderwall)"
	@echo "  make local-q2           - Start med ekte Q2-token (krever LOCAL_TOKEN env var)"
	@echo "  make local-q2-new-token - Hent nytt Q2-token og start"
	@echo "  make get-token          - Hent nytt Q2-token (åpner nettleser)"
	@echo "  make rebuild            - Tving rebuild av server-image"
	@echo "  make stop               - Stopp alle tjenester"

# Start with mock OAuth (Wonderwall)
local:
	@echo ""
	@printf "\033[36m⚡ Starting melosys-skjema-web (Wonderwall mode)\033[0m\n"
	@echo ""
	@printf "  \033[33m◐\033[0m Starting mock-oauth...  \r" && \
		docker start $(MOCK_OAUTH_CONTAINER) 2>/dev/null && \
		printf "  \033[32m✓\033[0m Mock-oauth running     \n" || \
		(printf "  \033[31m✗\033[0m Mock-oauth failed      \n"; \
		echo ""; echo "    Container '$(MOCK_OAUTH_CONTAINER)' finnes ikke."; \
		echo "    Kjør først: cd ~/nav/melosys-docker-compose && docker compose up -d mock-oauth2-server"; exit 1)
	@if docker images -q melosys-skjema-web-express-server 2>/dev/null | grep -q .; then \
		printf "  \033[32m✓\033[0m Server image exists (skipping build)\n"; \
	else \
		printf "  \033[33m◐\033[0m Building server...      \r" && \
		cd server && docker compose build >/dev/null 2>&1 && \
		printf "  \033[32m✓\033[0m Server built           \n"; \
	fi
	@printf "  \033[33m◐\033[0m Starting server...      \r" && \
		cd server && docker compose up -d >/dev/null 2>&1 && \
		printf "  \033[32m✓\033[0m Server running         \n"
	@echo ""
	@printf "  \033[1m→\033[0m Open \033[4mhttp://localhost:4000/vite-on\033[0m\n"
	@printf "  \033[2mPress CTRL+C to stop\033[0m\n"
	@echo ""
	@trap 'printf "\n\033[33m◐\033[0m Stopping...\r"; cd server && docker compose down -t 2 >/dev/null 2>&1; printf "\033[32m✓\033[0m Stopped        \n"; exit 0' INT; cd app && npm run dev --silent 2>&1 | grep -v "^$$"

# Start with real Q2 token - requires LOCAL_TOKEN env var and melosys-skjema-api on localhost:8089
local-q2:
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
	@if docker images -q melosys-skjema-web-local-q2-express-server 2>/dev/null | grep -q .; then \
		printf "  \033[32m✓\033[0m Server image exists (skipping build)\n"; \
	else \
		printf "  \033[33m◐\033[0m Building server...  \r" && \
		cd server && docker compose -f docker-compose.local-q2.yaml build >/dev/null 2>&1 && \
		printf "  \033[32m✓\033[0m Server built       \n"; \
	fi
	@printf "  \033[33m◐\033[0m Starting server...  \r" && \
		cd server && docker compose -f docker-compose.local-q2.yaml up -d >/dev/null 2>&1 && \
		printf "  \033[32m✓\033[0m Server running     \n"
	@echo ""
	@printf "  \033[1m→\033[0m Open \033[4mhttp://localhost:4000/vite-on\033[0m\n"
	@printf "  \033[2mPress CTRL+C to stop\033[0m\n"
	@echo ""
	@trap 'printf "\n\033[33m◐\033[0m Stopping...\r"; cd server && docker compose -f docker-compose.local-q2.yaml down -t 2 >/dev/null 2>&1; printf "\033[32m✓\033[0m Stopped        \n"; exit 0' INT; cd app && npm run dev --silent 2>&1 | grep -v "^$$"

# Get new token and start
local-q2-new-token:
	@cd server && . ./scripts/get-q2-token.sh && cd .. && $(MAKE) local-q2

# Open browser to get Q2 token
get-token:
	@cd server && ./scripts/get-q2-token.sh

# Stop all containers and processes
stop:
	@cd server && docker compose down 2>/dev/null || true
	@cd server && docker compose -f docker-compose.local-q2.yaml down 2>/dev/null || true
	@docker stop $(MOCK_OAUTH_CONTAINER) 2>/dev/null || true
	@pkill -f "npm run dev" 2>/dev/null || true
	@echo "Stopped all services"

# Force rebuild of server images
rebuild:
	@echo "Rebuilding server images..."
	@cd server && docker compose build --no-cache
	@cd server && docker compose -f docker-compose.local-q2.yaml build --no-cache
	@echo "Done!"
