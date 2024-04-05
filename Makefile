start:
	@docker compose start app

stop:
	@docker compose stop app

restart:
	@docker compose restart app

up:
	@docker compose up -d

log:
	@docker compose logs -f app

build:
	@docker compose build

shell:
	@docker compose run --rm --no-deps app sh
