up:
	docker compose --env-file .docker.env up -d
down:
	docker compose --env-file .docker.env down

start:
	docker compose --env-file .docker.env down
stop:
	docker compose --env-file .docker.env down