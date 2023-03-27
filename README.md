# Sourcecode of the Official FruchtLabor TeamSpeak Bot

## Todo's for Setup:

### .creds file

<sub>js file with the credentials for the teamspeak server (query user)</sub>

```
const PROD = {
  SERVER_IP: string,
  SERVER_PORT: number,
  QUERY_USERNAME: string,
  QUERY_PASSWORD: string,
  TS_ID: string,
};

module.exports = { PROD };
```

### .env file

<sub>envirement file with the current version (defined in the .creds file before)</sub>

```
VERSION="PROD"
```

### "files" file

<sub>folder for external files that needs to be loaded</sub>

### "logs" file

<sub>folder for error logs</sub>
