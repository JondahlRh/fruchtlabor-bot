# Sourcecode of the Official FruchtLabor TeamSpeak Bot

## docker commands

```
docker-compose -f path/to/local/dockercompose up --build
```

## needed environment values

```
FEATUREFLAG_BOT=true|false
FEATUREFLAG_API=true|false

TEAMSPEAK_IP=""
TEAMSPEAK_PORT=""
TEAMSPEAK_QUERYPORT=""
TEAMSPEAKQUERY_USERNAME=""
TEAMSPEAKQUERY_PASSWORD=""
TEAMSPEAK_NICKNAME=""

MONGODB_CONNECT=mongodb://<mongo_username>:<mongo_password>@<mongo_host>:<mongo_port>
MONGODB_DBNAME=""

CS_SERVER_DOMAIN=""
CS_SERVER_PASSWORD=""

FUNCTIONS_RULES_URL=""
```
