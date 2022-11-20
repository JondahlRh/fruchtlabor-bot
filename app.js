require("dotenv").config();
const { TeamSpeak } = require("ts3-nodejs-library");
const CREDS = require("./.creds");

const errorMessage = require("./src/errorMessage");
const channel = require("./src/channel");
const message = require("./src/message");

const app = async () => {
  const teamspeak = await TeamSpeak.connect({
    host: CREDS[process.env.VERSION].SERVER_IP,
    serverport: CREDS[process.env.VERSION].SERVER_PORT,
    username: CREDS[process.env.VERSION].QUERY_USERNAME,
    password: CREDS[process.env.VERSION].QUERY_PASSWORD,
    nickname: "Fruchtlabor Bot",
  });
  console.log("connected:", new Date());

  const self = await teamspeak.self();
  const defChannel = await teamspeak.getChannelById(
    process.env.VERSION === "PROD" ? "19" : "81483"
  );
  await teamspeak.clientMove(self, defChannel);

  // event listener
  teamspeak.on("clientconnect", (event) => {
    if (self === event.client) return;

    channel.custom({ teamspeak, event, self, defChannel });
    channel.lobby({ teamspeak });
    message.support({ teamspeak, event });
    message.welcome({ event });
  });

  teamspeak.on("clientmoved", (event) => {
    if (self === event.client) return;

    channel.custom({ teamspeak, event, self, defChannel });
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
  }, 30000);

  // error - event listener
  teamspeak.on("error", (error) => {
    errorMessage("error listener", error);
  });
};

app();
