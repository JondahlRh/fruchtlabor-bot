const CREDS = require("./.creds");
const { TeamSpeak } = require("ts3-nodejs-library");

const support = require("./comp/support");
const welcome = require("./comp/welcome");
const description = require("./comp/description");

const app = async () => {
  const teamspeak = await TeamSpeak.connect({
    host: CREDS.PROD.SERVER_IP,
    serverport: CREDS.PROD.SERVER_PORT,
    username: CREDS.PROD.QUERY_USERNAME,
    password: CREDS.PROD.QUERY_PASSWORD,
    nickname: "Fruchtlabor Bot",
  });
  console.log("connected");
  teamspeak.clientMove(
    await teamspeak.self(),
    await teamspeak.getChannelById("19")
  );

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
    try {
      welcome.message(teamspeak, event);
    } catch (err) {
      console.log({
        date: new Date(),
        error: err,
        type: "welcome.message(teamspeak, event)",
        event: "clientconnect",
      });
    }
    try {
      support.message(teamspeak, event);
    } catch (err) {
      console.log({
        date: new Date(),
        error: err,
        type: "support.message(teamspeak, event)",
        event: "clientconnect",
      });
    }
    try {
      descriptionExecuteChecker();
    } catch (err) {
      console.log({
        date: new Date(),
        error: err,
        type: "descriptionExecuteChecker()",
        event: "clientconnect",
      });
    }
  });
  teamspeak.on("clientmoved", (event) => {
    try {
      support.message(teamspeak, event);
    } catch (err) {
      console.log({
        date: new Date(),
        error: err,
        type: "support.message(teamspeak, event)",
        event: "clientmoved",
      });
    }
    try {
      descriptionExecuteChecker();
    } catch (err) {
      console.log({
        date: new Date(),
        error: err,
        type: "descriptionExecuteChecker()",
        event: "clientmoved",
      });
    }
  });
  teamspeak.on("clientdisconnect", (event) => {
    try {
      descriptionExecuteChecker();
    } catch (err) {
      console.log({
        date: new Date(),
        error: err,
        type: "descriptionExecuteChecker()",
        event: "clientdisconnect",
      });
    }
  });
};

app();
