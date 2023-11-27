# Sourcecode of the Official FruchtLabor TeamSpeak Bot

## installation

```
npm install
```

## required files

### .env

```
NODE_ENV=""

TEAMSPEAK_IP=""
TEAMSPEAK_PORT=0
TEAMSPEAKQUERY_USERNAME=""
TEAMSPEAKQUERY_PASSWORD=""
TEAMSPEAK_NICKNAME=""

MONGODB_CONNECT=""
MONGODB_DBNAME=""

API_PORT=""
```

### optional .env stage file

<sub>Optional, for having different login data for different stages. Filename has to start with ".env." and the value provided in "NODE_ENV"!</sub>

```
TEAMSPEAK_IP=""
TEAMSPEAK_PORT=0
TEAMSPEAKQUERY_USERNAME=""
TEAMSPEAKQUERY_PASSWORD=""
TEAMSPEAK_NICKNAME=""

MONGODB_CONNECT=""
MONGODB_DBNAME=""

API_PORT=""
```
