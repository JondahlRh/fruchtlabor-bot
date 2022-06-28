const CREDS = require("./.creds");
const { TeamSpeak } = require("ts3-nodejs-library");
const { performance } = require("perf_hooks");
const app = require("express")();
// const fs = require("fs");

const transform = (data) => {
  return JSON.parse(JSON.stringify(data));
};

const activityList = {};

const checkTalking = async (teamspeak) => {
  const clientList = transform(await teamspeak.clientList({ clientType: 0 }));
  for (const client of clientList) {
    const CUID = client.clientUniqueIdentifier;

    if (!Object.keys(activityList).includes(CUID)) {
      activityList[CUID] = {
        name: client.clientNickname,
        active: 0,
        online: 0,
        lastLoop: performance.now(),
      };
    }

    const now = performance.now();
    if (client.clientFlagTalking) {
      activityList[CUID].active += now - activityList[CUID].lastLoop;
    }
    activityList[CUID].online += now - activityList[CUID].lastLoop;
    activityList[CUID].lastLoop = now;
  }
  checkTalking(teamspeak);
};

TeamSpeak.connect({
  host: CREDS.SERVER_IP,
  serverport: CREDS.SERVER_PORT,
  username: CREDS.QUERY_USERNAME,
  password: CREDS.QUERY_PASSWORD,
  nickname: "Activity Bot",
})
  .then(async (teamspeak) => {
    console.log("connected");

    // code below

    const self = await teamspeak.getClientByUid("Su5GYQbW1FfV4uXEaUxR7s8aeOg=");
    teamspeak.clientMove(self, await teamspeak.getChannelById("19"));

    // setInterval(() => {
    //   fs.writeFile("./activityList.json", JSON.stringify(activityList), () => {});
    // }, 1000);

    checkTalking(teamspeak);

    // code above
  })
  .catch((e) => {
    console.log("Catched an error!");
    console.log(e);
  });

app.listen(8080);

app.get("/", (req, res) => {
  res.status(200).send(activityList);
});
