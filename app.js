require("dotenv").config();
const { TeamSpeak } = require("ts3-nodejs-library");
const cron = require("node-cron");

const CREDS = require("./.creds");

const errorMessage = require("./src/utility/errorMessage");
const pathReducer = require("./src/utility/pathReducer");
const readJsonFile = require("./src/utility/readJsonFile");

const channel = require("./src/channel");
const group = require("./src/group");
const message = require("./src/message");
const move = require("./src/move");
const server = require("./src/server");

const getDefinitionData = () => {
  return readJsonFile(`${process.env.VERSION}/data.json`, "app @ fsData");
};

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
  const fsData = getDefinitionData();
  if (!fsData) return;

  // move to bot channel
  let self;
  const botDefaultChannel = pathReducer(
    fsData.functions.botDefaultChannel,
    fsData.channel
  );
  try {
    self = await teamspeak.self();
    await teamspeak.clientMove(self, botDefaultChannel);
  } catch (error) {
    return errorMessage("app @ self / clientMove", error);
  }

  // event listener:
  // ignore self + read data.json + execute functions
  teamspeak.on("clientconnect", (event) => {
    if (self === event.client) return;

    const fsData = getDefinitionData();
    if (!fsData) return;

    channel.custom({ fsData, teamspeak, event, self });
    channel.lobby({ fsData, teamspeak });
    group.live({ fsData, teamspeak, event });
    message.join({ fsData, event });
    message.support({ fsData, teamspeak, event });
  });

  teamspeak.on("clientmoved", (event) => {
    if (self === event.client) return;

    const fsData = getDefinitionData();
    if (!fsData) return;

    channel.custom({ fsData, teamspeak, event, self });
    channel.lobby({ fsData, teamspeak });
    group.live({ fsData, teamspeak, event });
    message.support({ fsData, teamspeak, event });
  });

  teamspeak.on("clientdisconnect", (event) => {
    if (self === event.client) return;

    const fsData = getDefinitionData();
    if (!fsData) return;

    channel.lobby({ fsData, teamspeak });
  });

  // interval: read data.json + execute functions
  // interval 30s
  cron.schedule("*/30 * * * * *", () => {
    const fsData = getDefinitionData();
    if (!fsData) return;

    channel.online({ fsData, teamspeak });
    // server.retake({ fsData, teamspeak });
    move.afk({ fsData, teamspeak });
  });

  // interval 120s
  // cron.schedule("*/2 * * * *", () => {
  //   const fsData = getDefinitionData();
  //   if (!fsData) return;

  //   server.overview({ fsData, teamspeak });
  //   server.intern({ fsData, teamspeak });
  // });

  // error - event listener
  teamspeak.on("error", (error) => {
    errorMessage("app @ errer event", error);
  });
};

app();
