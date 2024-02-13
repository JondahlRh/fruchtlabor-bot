# Sourcecode of the Official FruchtLabor TeamSpeak Bot

## installation

```
npm install
```

## required files

### .env

<sub>Exposed port outside of docker container

```
EXPOSED_PORT=""
```

### .env.dev / .env.prod

<sub>Environment variables for development or production

```
TEAMSPEAK_IP=""
TEAMSPEAK_PORT=""
TEAMSPEAKQUERY_USERNAME=""
TEAMSPEAKQUERY_PASSWORD=""
TEAMSPEAK_NICKNAME=""

MONGODB_CONNECT=""
MONGODB_DBNAME=""

API_KEY=""
```
