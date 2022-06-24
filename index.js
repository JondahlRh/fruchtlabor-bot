const CREDS = require("./.creds");
const { TeamSpeak } = require("ts3-nodejs-library");

TeamSpeak.connect({
  host: CREDS.SERVER_IP,
  serverport: CREDS.SERVER_PORT,
  username: CREDS.QUERY_USERNAME,
  password: CREDS.QUERY_PASSWORD,
  nickname: "Fruchtlabor Bot",
})
  .then(async (teamspeak) => {
    console.log("connected");

    // #
    // Code below
    // #

    const transform = (data) => {
      return JSON.parse(JSON.stringify(data));
    };

    // support channel objects
    const support = transform(await teamspeak.getChannelById("24"));
    const supportRang = transform(await teamspeak.getChannelById("25"));
    const supportAppl = transform(await teamspeak.getChannelById("27"));
    // const supportIT = transform(await teamspeak.getChannelById("22621"));
    // const supportCoach = transform(await teamspeak.getChannelById("61154"));
    // const supportKummer = transform(await teamspeak.getChannelById("68837"));

    // function when a client changes channel
    const clientMovedHandler = async (eventRAW) => {
      const event = transform(eventRAW);

      // check switched channel
      switch (event.client.cid) {
        // switched to support, supportRang or supportAppl
        case support.cid || supportRang.cid || supportAppl.cid:
          // get client list
          const clientList = await teamspeak.clientList();

          // loop client list
          clientList.forEach((clientRAW) => {
            const client = transform(clientRAW);

            // groups who should get a message
            if (!client.clientServergroups.includes("2552")) {
              return;
            }
            // groups who should NOT get a message
            if (client.clientServergroups.includes("59")) {
              return;
            }
            // channel where no message should be send
            if (client.clientChannelGroupInheritedChannelId.includes("13")) {
              return;
            }

            // send message
            const msgClicker = `[URL=client://${event.client.cid}/${event.client.clientUniqueIdentifier}]${event.client.clientNickname}[/URL]`;
            clientRAW.message(
              `Der User ${msgClicker} wartet in "${event.channel.channelName}"`
            );
          });
          break;
        default:
          break;
      }
    };

    teamspeak.on("clientmoved", clientMovedHandler);
    teamspeak.on("clientconnect", clientMovedHandler);

    // #
    // Code above
    // #
  })
  .catch((e) => {
    console.log("Catched an error!");
    console.log(e);
  });
