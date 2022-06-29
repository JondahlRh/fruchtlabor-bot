const CREDS = require("./.creds");
const groupData = require("./groupData");
const { TeamSpeak } = require("ts3-nodejs-library");

const transformData = (data) => {
  return JSON.parse(JSON.stringify(data));
};

TeamSpeak.connect({
  host: CREDS.SERVER_IP,
  serverport: CREDS.SERVER_PORT,
  username: CREDS.QUERY_USERNAME,
  password: CREDS.QUERY_PASSWORD,
  nickname: "Fruchtlabor Bot",
})
  .then(async (teamspeak) => {
    console.log("connected");

    // get the bot client and move it to the support spacer
    const self = await teamspeak.getClientByUid("Su5GYQbW1FfV4uXEaUxR7s8aeOg=");
    teamspeak.clientMove(self, await teamspeak.getChannelById("19"));

    // #
    // code below
    // #

    // timeout for the change description function
    let executeChangeDescription = true;
    const timeoutChangeDescription = () => {
      setTimeout(() => {
        executeChangeDescription = true;
      }, 20000);
      executeChangeDescription = false;
    };

    // extra users/groups for group data
    const groupDataExtra = async () => {
      groupData["Staff"][3].extra = [];
      const kummerkastenIcon = await teamspeak.serverGroupClientList("2485");
      for (const client of kummerkastenIcon) {
        groupData["Staff"][3].extra.push({
          clientNickname: client.clientNickname,
          clientUniqueIdentifier: client.clientUniqueIdentifier,
        });
      }
    };

    // change description function
    const changeDescription = async (title, channel) => {
      // get online clients array
      const clientList = transformData(await teamspeak.clientList({ clientType: 0 }));

      // description title
      let description = `[center][table]

[tr]
[td][hr][/td]
[/tr]

[tr][/tr]

[tr]
[th][size=16] ${title} [/size][/th]
[/tr]

[tr][/tr]

[tr]
[td][hr][/td]
[/tr]
[tr]
[td]                                                                                                    [/td]
[/tr]

[/table][table]`;

      // function to check the status of the client
      const checkStatus = async (groupClient) => {
        const isOnline = clientList.some(
          (client) => client.clientUniqueIdentifier === groupClient.clientUniqueIdentifier
        );

        if (!isOnline) return "[color=#FF0000]offline[/color]";

        const client = transformData(
          await teamspeak.getClientByUid(groupClient.clientUniqueIdentifier)
        );

        const clientChannel = client.clientChannelGroupInheritedChannelId;
        const clientChannelObject = transformData(await teamspeak.getChannelById(clientChannel));
        const clientGroups = client.clientServergroups;

        if (["13"].includes(clientChannel)) return "AFK";
        if (["8"].includes(clientChannel)) return "Besprechung";
        if (["20", "3805", "19054", "19055", "22", "68829"].includes(clientChannel)) {
          return "Support";
        }
        if (
          [
            "Wettkampf | Clanintern",
            "Wettkampf | Öffentlich",
            "Wingman",
            "FaceIt | Clanintern",
            "FaceIt  Öffentlich",
          ].some((channel) => clientChannelObject.channelName.includes(channel))
        ) {
          return "ingame";
        }

        if (["59"].some((group) => clientGroups.includes(group))) return "No Support";
        if (
          client.clientIdleTime > 900000 &&
          !["12", "78098"].some((group) => clientChannel === group)
        ) {
          return "abwesend";
        }

        return "[color=#00ff00]online[/color]";
      };

      // loop all groups in groupData
      for (const group of groupData[title]) {
        // get server group clients
        const serverGroup = await teamspeak.serverGroupClientList(group.id);

        // initalize variable
        let groupDescription = "";

        // add specific text if no clients in server group (or extra group)
        if (serverGroup.length === 0 && group.extra === undefined) {
          groupDescription = `\n[tr][td][center] - [/center][/td][td][center] none [/td][/tr]`;
        }

        // add specific text for all clients in servergroup (+ add status)
        for (const client of serverGroup) {
          const status = await checkStatus(client);
          groupDescription += `\n[tr][td][URL=client:///${client.clientUniqueIdentifier}]${client.clientNickname} [/URL][/td][td][center]${status}[/td][/tr]`;
        }

        // add specific text for all extra users (+ add status)
        if (group.extra !== undefined) {
          for (const client of group.extra) {
            const status = await checkStatus(client);
            groupDescription += `\n[tr][td][URL=client:///${client.clientUniqueIdentifier}]${client.clientNickname} [/URL][/td][td][center]${status}[/td][/tr]`;
          }
        }

        // add group to description
        description += `[tr]
[th][size=12] ${group.name} [/size][/th]
[td][center][size=12] Status [/size][/td]
[/tr]
[tr]
[td][hr][/td]
[td][hr][/td]
[/tr]
${groupDescription}

[tr][/tr]`;
      }

      // description end
      description += `[/table]`;

      // get current description und check if something changed
      const getChannel = await teamspeak.getChannelById(channel);
      const getChannelInfo = await getChannel.getInfo();
      const oldDescripion = getChannelInfo.channelDescription;
      if (description === oldDescripion) return;

      // change channel description
      teamspeak.channelEdit(channel, {
        channelDescription: description,
      });
    };

    // send support message function
    const sendSupportMessage = async (event) => {
      // if (event.client.clientType === 1) return; // return if server query user

      // get support channel objects
      const supportAllg = transformData(await teamspeak.getChannelById("24"));
      const supportVeri = transformData(await teamspeak.getChannelById("25"));
      const supportBewe = transformData(await teamspeak.getChannelById("27"));
      const supportCoach = transformData(await teamspeak.getChannelById("61154"));
      const supportKummer = transformData(await teamspeak.getChannelById("68837"));

      // get online clients array
      const clientList = await teamspeak.clientList({ clientType: 0 });

      // initalize variables/ arrays
      const msgClientList = [];
      const msgGroupList = [];
      let talk = false;

      // get event client groups
      const eventClientGroups = event.client.clientServergroups;

      // check for event client channel ID and add specific group IDs to array
      switch (event.client.cid) {
        case supportAllg.cid:
          if (eventClientGroups.some((group) => ["318", "2480"].includes(group))) {
            msgGroupList.push("2559");
            talk = true;
          } else {
            msgGroupList.push("2554", "2559");
          }
          break;
        case supportVeri.cid:
          msgGroupList.push("2554", "2559");
          break;
        case supportBewe.cid:
          msgGroupList.push("2556", "2559");
          break;
        case supportCoach.cid:
          msgGroupList.push("2558");
          break;
        case supportKummer.cid:
          msgGroupList.push("2484", "2485");
          break;
        default:
          break;
      }

      // check if any group should be notified
      if (msgGroupList.length === 0) return;

      // loop online clients array
      for (const clientRAW of clientList) {
        const client = transformData(clientRAW);

        // format the client variables
        const clientGroups = client.clientServergroups;
        const clientChannel = client.clientChannelGroupInheritedChannelId;

        // filter specific clients with groups or in channel
        if (!clientGroups.some((group) => msgGroupList.includes(group))) continue;
        if (clientGroups.some((group) => ["59"].includes(group))) continue;
        if (["8", "13"].includes(clientChannel)) continue;
        if (
          [
            "Wettkampf | Clanintern",
            "Wettkampf | Öffentlich",
            "Wingman",
            "FaceIt | Clanintern",
            "FaceIt  Öffentlich",
          ].some((channel) => clientChannelObject.channelName.includes(channel))
        ) {
          continue;
        }

        // add clients to array
        msgClientList.push(clientRAW);
      }

      // format the event user name wih link
      const eventClientClicker = `[URL=client:///${event.client.clientUniqueIdentifier}]${event.client.clientNickname}[/URL]`;

      // initalize support message variable
      let supportMessage = "";

      // check for special support
      if (talk) {
        supportMessage = `[color=#FF0000][b]Support Gespräch: [/b][/color]Der User ${eventClientClicker} meldet sich in dem Channel "${event.channel.channelName}"`;
      } else {
        supportMessage = `Der User ${eventClientClicker} wartet in dem Channel "${event.channel.channelName}"`;
      }

      // add count of other support contacted
      if (msgClientList.length === 1) {
        supportMessage += ` (Es wurde kein weiterer Supporter kontaktiert)`;
      } else if (msgClientList.length === 2) {
        supportMessage += ` (Es wurde ein weiterer Supporter kontaktiert)`;
      } else {
        supportMessage += ` (Es wurden ${msgClientList.length - 1} weitere Supporter kontaktiert)`;
      }

      // send each support the support message
      for (const msgClient of msgClientList) {
        msgClient.message(supportMessage);
      }
    };

    // execute when client connects to server
    teamspeak.on("clientconnect", (eventRAW) => {
      const event = transformData(eventRAW);

      // add group data extra clients
      groupDataExtra();

      // check if description should be updated
      if (executeChangeDescription) {
        timeoutChangeDescription();
        changeDescription("Leitende Teammitglieder", "4");
        changeDescription("Teammitglieder", "12");
        changeDescription("Staff", "78098");
        changeDescription("Supporter", "19");
      }
    });

    // execute when client disconnects to server
    teamspeak.on("clientdisconnect", (eventRAW) => {
      const event = transformData(eventRAW);

      // add group data extra clients
      groupDataExtra();

      // check if description should be updated
      if (executeChangeDescription) {
        timeoutChangeDescription();
        changeDescription("Leitende Teammitglieder", "4");
        changeDescription("Teammitglieder", "12");
        changeDescription("Staff", "78098");
        changeDescription("Supporter", "19");
      }
    });

    // execute when client moved in the server
    teamspeak.on("clientmoved", (eventRAW) => {
      const event = transformData(eventRAW);

      // add group data extra clients
      groupDataExtra();

      // check if description should be updated
      if (executeChangeDescription) {
        timeoutChangeDescription();
        changeDescription("Leitende Teammitglieder", "4");
        changeDescription("Teammitglieder", "12");
        changeDescription("Staff", "78098");
        changeDescription("Supporter", "19");
      }

      // send support message
      sendSupportMessage(event);
    });

    // #
    // code above
    // #
  })
  .catch((error) => {
    console.log("Catched an error!");
    console.log(error);
  });
