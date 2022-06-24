const CREDS = require("./.creds");
const { TeamSpeak } = require("ts3-nodejs-library");

TeamSpeak.connect({
  host: CREDS.SERVER_IP,
  serverport: CREDS.SERVER_PORT,
  username: CREDS.QUERY_USERNAME,
  password: CREDS.QUERY_PASSWORD,
  nickname: "Test Fruchtlabor Bot",
})
  .then(async (teamspeak) => {
    console.log("connected");
  })
  .catch((e) => {
    console.log("Catched an error!");
    console.log(e);
  });
