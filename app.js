const CREDS = require("./.creds");
const { TeamSpeak } = require("ts3-nodejs-library");

const support = require("./comp/support");
const welcome = require("./comp/welcome");
const description = require("./comp/description");
const message = require("./comp/message");

const app = async () => {
  const teamspeak = await TeamSpeak.connect({
    host: CREDS.PROD.SERVER_IP,
    serverport: CREDS.PROD.SERVER_PORT,
    username: CREDS.PROD.QUERY_USERNAME,
    password: CREDS.PROD.QUERY_PASSWORD,
    nickname: "Fruchtlabor Bot",
  });
  console.log("connected");
  teamspeak.clientMove(await teamspeak.self(), await teamspeak.getChannelById("19"));

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

    description(teamspeak);
  };

  descriptionExecuteChecker();

  // listen for events
  teamspeak.on("clientconnect", (event) => {
    welcome(teamspeak, event);
    support(teamspeak, event);
    descriptionExecuteChecker();
  });
  teamspeak.on("clientmoved", (event) => {
    support(teamspeak, event);
    descriptionExecuteChecker();
  });
  teamspeak.on("clientdisconnect", (event) => {
    descriptionExecuteChecker();
  });
  teamspeak.on("textmessage", (event) => {
    message(teamspeak, event);
  });
};

app();
