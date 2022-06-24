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

    const self = await teamspeak.getClientByUid("Su5GYQbW1FfV4uXEaUxR7s8aeOg=");
    teamspeak.clientMove(self, await teamspeak.getChannelById("19"));

    const transform = (data) => {
      return JSON.parse(JSON.stringify(data));
    };

    // support channel objects
    const support = transform(await teamspeak.getChannelById("24"));
    const supportRang = transform(await teamspeak.getChannelById("25"));
    const supportAppl = transform(await teamspeak.getChannelById("27"));
    const supportIT = transform(await teamspeak.getChannelById("22621"));
    const supportCoach = transform(await teamspeak.getChannelById("61154"));
    const supportKummer = transform(await teamspeak.getChannelById("68837"));

    // function when a client changes channel
    const clientMovedHandler = async (eventRAW) => {
      const event = transform(eventRAW);
      if (event.client.clientType === 1) return; // return if server query user
      const clientList = await teamspeak.clientList({ clientType: 0 });
      switch (event.client.cid) {
        case support.cid:
        case supportRang.cid:
        case supportAppl.cid:
          clientList.forEach((clientRAW) => {
            const client = transform(clientRAW);
            console.log(client.clientNickname);
            if (
              // !client.clientServergroups.includes("85") || // Admin
              // !client.clientServergroups.includes("77") || // Head-Mod
              // !client.clientServergroups.includes("10") || // Mod
              // !client.clientServergroups.includes("96") || // Trial-Mod
              // !client.clientServergroups.includes("260") || // Supp-Benachrichtigung
              !client.clientServergroups.includes("2552") // GamixTestGruppe
            ) {
              return;
            } // groups that should get a message
            if (client.clientServergroups.includes("59")) return; // groups that should NOT get a message
            if (client.clientChannelGroupInheritedChannelId.includes("13")) return; // channel where you should NOT get a message
            const msgClicker = `[URL=client://${event.client.cid}/${event.client.clientUniqueIdentifier}]${event.client.clientNickname}[/URL]`;
            clientRAW.message(
              `Der User ${msgClicker} wartet in "${event.channel.channelName}" auf einen Supporter!`
            );
          });
          break;
        case supportIT.cid:
          clientList.forEach((clientRAW) => {
            const client = transform(clientRAW);
            if (
              !client.clientServergroups.includes("328") || // IT-Berater
              !client.clientServergroups.includes("2552") // GamixTestGruppe
            ) {
              return;
            } // groups that should get a message
            if (client.clientServergroups.includes("59")) return; // groups that should NOT get a message
            if (client.clientChannelGroupInheritedChannelId.includes("13")) return; // channel where you should NOT get a message
            const msgClicker = `[URL=client://${event.client.cid}/${event.client.clientUniqueIdentifier}]${event.client.clientNickname}[/URL]`;
            clientRAW.message(
              `Der User ${msgClicker} wartet in "${event.channel.channelName}" auf einen IT-Berater!`
            );
          });
          break;
        case supportCoach.cid:
          clientList.forEach((clientRAW) => {
            const client = transform(clientRAW);
            if (
              !client.clientServergroups.includes("95") || // Head-Coach
              !client.clientServergroups.includes("73") || // Coach
              !client.clientServergroups.includes("230") || // Trial-Coach
              !client.clientServergroups.includes("2552") // GamixTestGruppe
            ) {
              return;
            } // groups that should get a message
            if (client.clientServergroups.includes("59")) return; // groups that should NOT get a message
            if (client.clientChannelGroupInheritedChannelId.includes("13")) return; // channel where you should NOT get a message
            const msgClicker = `[URL=client://${event.client.cid}/${event.client.clientUniqueIdentifier}]${event.client.clientNickname}[/URL]`;
            clientRAW.message(
              `Der User ${msgClicker} wartet in "${event.channel.channelName}" auf einen Coach!`
            );
          });
          break;
        case supportKummer.cid:
          clientList.forEach((clientRAW) => {
            const client = transform(clientRAW);
            if (
              !client.clientServergroups.includes("2484") || // Kummerkasten
              !client.clientServergroups.includes("2485") || // Kummerkasen-Icon
              !client.clientServergroups.includes("2552") // GamixTestGruppe
            ) {
              return;
            } // groups that should get a message
            if (client.clientServergroups.includes("59")) return; // groups that should NOT get a message
            if (client.clientChannelGroupInheritedChannelId.includes("13")) return; // channel where you should NOT get a message
            const msgClicker = `[URL=client://${event.client.cid}/${event.client.clientUniqueIdentifier}]${event.client.clientNickname}[/URL]`;
            clientRAW.message(
              `Der User ${msgClicker} wartet in "${event.channel.channelName}" und braucht Hilfe!`
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
