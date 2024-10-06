# FruchtLabor Teamspeak Bot

TeamSpeak Bot for the FruchtLabor Community

## Dependencies and Development

Project uses [pnpm](https://pnpm.io/) for dependency management.
In development the bot will be started with tsx

```bash
pnpm install
pnpm dev
```

## Envirement Variables

```bash
INTERNAL_PORT="" # Number with zero to five digits

TEAMSPEAK_HOST="" # Four numbers with one to three digits seperated by dots
TEAMSPEAK_PORT="" # Number with zero to five digits
TEAMSPEAK_QUERYPORT="" # Number with zero to five digits
TEAMSPEAK_USERNAME=""
TEAMSPEAK_PASSWORD=""
TEAMSPEAK_NICKNAME=""
```

## Example docker-compose

```bash
docker-compose -f .\.gitea\docker-compose.local.yml -p fruchtlabor up --build
```

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    image: fruchtlabor-teamspeak-bot:latest
    container_name: fruchtlabor-teamspeak-bot
    restart: unless-stopped
    env_file:
      - ../.env
    ports:
      - "5000:5000"
```
