# Sourcecode of the Official FruchtLabor TeamSpeak Bot

## installation

```
npm install
```

## required files

### .env.dev / .env.prod

<sub>Environment variables for development or production

```
FEATUREFLAG_BOT="" # "true" if enabled
FEATUREFLAG_API="" # "true" if enabled
FEATUREFLAG_ACTIVITY="" # "true" if enabled

TEAMSPEAK_IP=""
TEAMSPEAK_PORT=""
TEAMSPEAK_QUERYPORT=""
TEAMSPEAKQUERY_USERNAME=""
TEAMSPEAKQUERY_PASSWORD=""
TEAMSPEAK_NICKNAME=""

MONGODB_CONNECT=""
MONGODB_DBNAME=""

CS_SERVER_DOMAIN=""
CS_SERVER_PASSWORD=""
```

## optional files

### docker-compose.dev.yml / docker-compose.yml

<sub>Docker compose setup in specific example file
