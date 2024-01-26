# Sourcecode of the Official FruchtLabor TeamSpeak Bot

## installation

```
npm install
```

## required files

### docker-compose\*.yml

```
services:
  app:
    build: .
    container_name: fruchtlabor-bot
    environment:
      - TEAMSPEAK_IP=
      - TEAMSPEAK_PORT=
      - TEAMSPEAKQUERY_USERNAME=
      - TEAMSPEAKQUERY_PASSWORD=
      - TEAMSPEAK_NICKNAME=

      - MONGODB_CONNECT=
      - MONGODB_DBNAME=

      - API_KEY=
    ports:
      - "<api_port>:3000"
```
