const CREDS = require("./.creds");
const { TeamSpeak } = require("ts3-nodejs-library");
const express = require("express");

const transformData = (data) => {
  return JSON.parse(JSON.stringify(data));
};

const activityList = {};

TeamSpeak.connect({
  host: CREDS.SERVER_IP,
  serverport: CREDS.SERVER_PORT,
  username: CREDS.QUERY_USERNAME,
  password: CREDS.QUERY_PASSWORD,
  nickname: "Activity Bot",
})
  .then(async (teamspeak) => {
    console.log("connected");

    // get the bot client and move it to the support spacer
    const self = await teamspeak.getClientByUid("Su5GYQbW1FfV4uXEaUxR7s8aeOg=");
    teamspeak.clientMove(self, await teamspeak.getChannelById("19"));

    // #
    // code below
    // #

    const activityBot = async () => {
      // get client List (online Clients)
      const clientList = transformData(await teamspeak.clientList({ clientType: 0 }));

      const now = Date.now();

      for (const client of clientList) {
        const CUID = client.clientUniqueIdentifier;

        if (!activityList[CUID]) {
          activityList[CUID] = {
            name: client.clientNickname,
            active: 0,
            online: 0,
            last: now,
          };
        }

        if (client.clientFlagTalking) {
          activityList[CUID].active += now - activityList[CUID].last;
        }
        activityList[CUID].online += now - activityList[CUID].last;
      }

      for (const CUID of Object.keys(activityList)) {
        activityList[CUID].last = now;
      }

      activityBot();
    };

    activityBot();

    // #
    // code above
    // #
  })
  .catch((error) => {
    console.log("Catched an error!");
    console.log(error);
  });

const app = express();

app.listen(2999, () => {
  console.log("Server running on port 2999");
});

app.get("/", (req, res) => {
  res.json(activityList);
});
