require("dotenv").config();
const { TeamSpeak } = require("ts3-nodejs-library");
const fs = require("fs");

const CREDS = require("./.creds");

const errorMessage = require("./src/errorMessage");
const channel = require("./src/channel");
const message = require("./src/message");
const move = require("./src/move");

const app = async () => {
  const teamspeak = await TeamSpeak.connect({
    host: CREDS[process.env.VERSION].SERVER_IP,
    serverport: CREDS[process.env.VERSION].SERVER_PORT,
    username: CREDS[process.env.VERSION].QUERY_USERNAME,
    password: CREDS[process.env.VERSION].QUERY_PASSWORD,
    nickname: "Fruchtlabor Bot",
  });
  console.log("connected:", new Date());

  // get definition data
  let fsData;
  try {
    const data = fs.readFileSync(
      `src/utility/${process.env.VERSION}/teamspeakData.json`,
      "utf8"
    );
    fsData = JSON.parse(data);
  } catch (error) {
    return errorMessage("app @ fs", error);
  }

  const self = await teamspeak.self();
  await teamspeak.clientMove(self, fsData.channels.botChannel);

  // event listener
  teamspeak.on("clientconnect", (event) => {
    if (self === event.client) return;

    channel.custom({ teamspeak, event, self });
    channel.lobby({ teamspeak });
    message.support({ teamspeak, event });
    message.welcome({ event });
  });

  teamspeak.on("clientmoved", (event) => {
    if (self === event.client) return;

    channel.custom({ teamspeak, event, self });
    channel.lobby({ teamspeak });
    message.support({ teamspeak, event });
  });

  teamspeak.on("clientdisconnect", (event) => {
    if (self === event.client) return;

    channel.lobby({ teamspeak });
  });

  // interval
  setInterval(() => {
    channel.online({ teamspeak });
    channel.server({ teamspeak });
    move.afk({ teamspeak });
  }, 30000);

  // error - event listener
  teamspeak.on("error", (error) => {
    errorMessage("app @ errer event", error);
  });
};

app();
