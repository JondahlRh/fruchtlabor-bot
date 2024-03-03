# Sourcecode of the Official FruchtLabor TeamSpeak Bot

## installation

```
npm install
```

## required files

### .env

<sub>Exposed ip and port outside of docker container

```
EXPOSED_IP=""
EXPOSED_PORT=""
```

### .env.dev / .env.prod

<sub>Environment variables for development or production

```
FEATUREFLAG_BOT="" # "true" if enabled
FEATUREFLAG_API="" # "true" if enabled

TEAMSPEAK_IP=""
TEAMSPEAK_PORT=""
TEAMSPEAK_QUERYPORT=""
TEAMSPEAKQUERY_USERNAME=""
TEAMSPEAKQUERY_PASSWORD=""
TEAMSPEAK_NICKNAME=""

MONGODB_CONNECT=""
MONGODB_DBNAME=""

API_KEY=""
```
