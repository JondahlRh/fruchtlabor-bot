const CREDS = require("./.creds");
const { TeamSpeak } = require("ts3-nodejs-library");

const support = require("./comp/support");
const welcome = require("./comp/welcome");
const description = require("./comp/description");
const channel = require("./comp/channel");

const app = async () => {
  const teamspeak = await TeamSpeak.connect({
    host: CREDS.PROD.SERVER_IP,
    serverport: CREDS.PROD.SERVER_PORT,
    username: CREDS.PROD.QUERY_USERNAME,
    password: CREDS.PROD.QUERY_PASSWORD,
    nickname: "Fruchtlabor Bot",
  });
  console.log("connected");
  const self = await teamspeak.self();
  teamspeak.clientMove(self, await teamspeak.getChannelById("19"));

  // execute "description" if last execute >30s ago or queued execute
  let recentExecute, queuedExecute;
  const descriptionExecuteChecker = () => {
    if (recentExecute) {
      queuedExecute = true;
      return;
    }

    queuedExecute = false;
    recentExecute = setTimeout(() => {
      recentExecute = null;
      if (queuedExecute) {
        descriptionExecuteChecker();
      }
    }, 30000);

    description.edit(teamspeak);
  };

  descriptionExecuteChecker();

  // listen for events
  teamspeak.on("clientconnect", (event) => {
    welcome.message(teamspeak, event);
    support.message(teamspeak, event);
    descriptionExecuteChecker();
  });
  teamspeak.on("clientmoved", (event) => {
    if (self === event.client) return;

    channel.custom(teamspeak, event, self);
    support.message(teamspeak, event);
    descriptionExecuteChecker();
  });
  teamspeak.on("clientdisconnect", (event) => {
    descriptionExecuteChecker();
  });

  teamspeak.on("error", (error) => {
    console.log({ date: new Date(), error });
  });
};

app();
