.PHONY: help local local-q2 local-q2-new-token get-token stop

MOCK_OAUTH_CONTAINER := melosys-docker-compose-mock-oauth2-server-1

help:
	@echo "Tilgjengelige kommandoer:"
	@echo "  make local              - Start med mock OAuth (Wonderwall)"
	@echo "  make local-q2           - Start med ekte Q2-token (bruker eksisterende token)"
	@echo "  make local-q2-new-token - Hent nytt Q2-token og start"
	@echo "  make get-token          - Hent nytt Q2-token (åpner nettleser)"
	@echo "  make stop               - Stopp alle tjenester"

# Start with mock OAuth (Wonderwall)
local:
	@echo "Starting mock-oauth2-server..."
	@docker start $(MOCK_OAUTH_CONTAINER) 2>/dev/null || \
		(echo ""; echo "ERROR: Container '$(MOCK_OAUTH_CONTAINER)' finnes ikke."; \
		echo "Kjør først: cd ~/nav/melosys-docker-compose && docker compose up -d mock-oauth2-server"; exit 1)
	@echo "Starting express + wonderwall..."
	@cd server && docker compose up --build -d
	@cd app && npm run dev &
	@echo ""
	@echo "Open http://localhost:4000/vite-on"

# Start with real Q2 token - requires melosys-skjema-api on localhost:8089
local-q2: server/.local-token
	@echo "Starting with Q2 token..."
	@cd server && docker compose -f docker-compose.local-q2.yaml up --build -d
	@cd app && npm run dev &
	@echo ""
	@echo "Open http://localhost:4000/vite-on"

# Get new token and start
local-q2-new-token: get-token local-q2

# Get Q2 token (opens browser for login)
get-token:
	@cd server && ./scripts/get-q2-token.sh

# Check if token exists, prompt to get one if not
server/.local-token:
	@echo "No token found. Running get-token first..."
	@cd server && ./scripts/get-q2-token.sh

# Stop all containers and processes
stop:
	@cd server && docker compose down 2>/dev/null || true
	@cd server && docker compose -f docker-compose.local-q2.yaml down 2>/dev/null || true
	@docker stop $(MOCK_OAUTH_CONTAINER) 2>/dev/null || true
	@pkill -f "npm run dev" 2>/dev/null || true
	@echo "Stopped all services"
