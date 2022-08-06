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
    const selfRAW = await teamspeak.getClientByUid("Su5GYQbW1FfV4uXEaUxR7s8aeOg=");
    const self = transformData(selfRAW);
    teamspeak.clientMove(selfRAW, await teamspeak.getChannelById("19"));

    // #
    // code below
    // #

    // channel and group arrays
    const afkChannels = ["13"];
    const meetingChannels = ["8"];
    const supportChannels = ["20", "3805", "19054", "19055", "22", "68829"];
    const noSuppportGroups = ["59"];
    const dontDisturbGroups = ["2541", "2482"];
    const availableChannels = ["12", "78098"];
    let matchChannels = [];

    const setMatchChannels = async () => {
      matchChannels = [
        ...(await teamspeak.channelFind("● Wettkampf |")),
        ...(await teamspeak.channelFind("● Wingman")),
        ...(await teamspeak.channelFind("● FaceIT |")),
      ];
    };

    // support waiting channels
    const supportAllg = "24";
    const supportVeri = "25";
    const supportBewe = "27";
    const supportCoach = "61154";
    const supportKummer = "68837";
    const supportBeratung = "22621";

    // last support
    const lastSupport = { msgClientList: [], supportClient: {} };

    // function to check the status of the client
    const checkStatus = async (client) => {
      const clientChannelID = client.clientChannelGroupInheritedChannelId;
      const clientGroups = client.clientServergroups;

      if (afkChannels.includes(clientChannelID)) return 1; // AFK
      if (meetingChannels.includes(clientChannelID)) return 2; // Besprechung
      if (supportChannels.includes(clientChannelID)) return 3; // Support
      if (matchChannels.some((group) => clientChannelID === group.cid)) return 4; // ingame
      if (noSuppportGroups.some((group) => clientGroups.includes(group))) return 5; // No Support
      if (dontDisturbGroups.some((group) => clientGroups.includes(group))) return 6; // No Support
      if (
        client.clientIdleTime > 900000 &&
        !availableChannels.some((group) => clientChannelID === group)
      ) {
        return 7; // abwesend
      }
    };

    // convert the status code to text
    const getStatusText = (value) => {
      if (value === 0) return "[color=#ff4444]offline[/color]";
      if (value === 1) return "AFK";
      if (value === 2) return "Besprechung";
      if (value === 3) return "Support";
      if (value === 4) return "ingame";
      if (value === 5) return "No Support";
      if (value === 6) return "Do Not Disturb";
      if (value === 7) return "abwesend";
      return "[color=#44ff44]online[/color]";
    };

    // timeout for the change description function
    let executeChangeDescription = true;
    const timeoutChangeDescription = () => {
      setTimeout(() => {
        executeChangeDescription = true;
      }, 20000);
      executeChangeDescription = false;
    };

    // change description function
    const changeDescription = async (title, channel) => {
      // get match channels
      await setMatchChannels();

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

      // loop all groups in groupData
      for (const group of groupData[title]) {
        const groupClientList = [];

        // get server group clients
        for (const groupID of group.id) {
          groupClientList.push(...(await teamspeak.serverGroupClientList(groupID)));
        }

        // initalize variable
        let groupDescription = "";

        // add specific text if no clients in server group(s)
        if (groupClientList.length === 0) {
          groupDescription = `\n[tr][td][center] - [/center][/td][td][center] none [/td][/tr]`;
        }

        // add specific text for all clients in groupClientList (+ add status)
        for (const groupClient of groupClientList) {
          const clientRAW = await teamspeak.getClientByUid(groupClient.clientUniqueIdentifier);
          const statusCode = clientRAW ? await checkStatus(transformData(clientRAW)) : 0;
          const status = getStatusText(statusCode);

          groupDescription += `\n[tr][td][URL=client:///${groupClient.clientUniqueIdentifier}]${groupClient.clientNickname} [/URL][/td][td][center]${status}[/td][/tr]`;
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
    const sendSupportMessage = async (eventRAW) => {
      const event = transformData(eventRAW);

      // return if server query user
      if (event.client.clientType === 1) return;

      // get match channels
      await setMatchChannels();

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
        case supportAllg:
          if (eventClientGroups.some((group) => ["318", "2480"].includes(group))) {
            msgGroupList.push("2559");
            talk = true;
          } else {
            msgGroupList.push("2554", "2559");
          }
          break;
        case supportVeri:
          msgGroupList.push("2554", "2559");
          break;
        case supportBewe:
          msgGroupList.push("2556", "2559");
          break;
        case supportCoach:
          msgGroupList.push("2558");
          break;
        case supportKummer:
          msgGroupList.push("2484", "2485");
          break;
        case supportBeratung:
          msgGroupList.push("320");
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

        // filter supporter of clients
        if (!clientGroups.some((group) => msgGroupList.includes(group))) continue;

        // check status
        const statusCode = await checkStatus(client);
        if (statusCode === 1) continue;
        if (statusCode === 2) continue;
        if (statusCode === 4) continue;
        if (statusCode === 5) continue;
        if (statusCode === 6) continue;

        // add clients to array
        msgClientList.push(clientRAW);
      }

      // last support
      lastSupport.msgClientList = msgClientList;
      lastSupport.supportClient = event.client;

      // format the event user name wih link
      const eventClientClicker = `[URL=client:///${event.client.clientUniqueIdentifier}]${event.client.clientNickname}[/URL]`;

      // initalize support message variable
      let supportMessage = "";

      // check for special support
      if (talk) {
        supportMessage = `[color=#ff4444][b]Support Gespräch: [/b][/color]Der User ${eventClientClicker} meldet sich in dem Channel "${event.channel.channelName}"`;
      } else {
        supportMessage = `Der User ${eventClientClicker} wartet in dem Channel "${event.channel.channelName}"`;
      }

      // loop supporter array
      for (const msgClientRAW of msgClientList) {
        const msgClient = transformData(msgClientRAW);

        // fill other suporter list
        let supporterList = "";
        if (msgClientList.length === 1) {
          supporterList = "(Keine weiteren Suporter kontaktiert)";
        } else {
          if (msgClientList.length === 2) {
            supporterList = "(Dieser weitere Supporter wurde kontaktiert: ";
          }
          if (msgClientList.length > 2) {
            supporterList = "(Diese weiteren Supporter wurden kontaktiert: ";
          }
          for (const supClientRAW of msgClientList) {
            const supClient = transformData(supClientRAW);
            if (supClient.clientUniqueIdentifier === msgClient.clientUniqueIdentifier) continue;
            supporterList += `[URL=client:///${supClient.clientUniqueIdentifier}]${supClient.clientNickname}[/URL], `;
          }
          supporterList = supporterList.slice(0, -2) + ")";
        }

        // send the support message
        msgClientRAW.message(`${supportMessage} ${supporterList}`);
      }

      let supporterList = "";
      for (const supClientRAW of msgClientList) {
        const supClient = transformData(supClientRAW);
        supporterList += `[URL=client:///${supClient.clientUniqueIdentifier}]${supClient.clientNickname}[/URL], `;
      }
      supporterList = supporterList.slice(0, -2);

      const setEventClientMsg = (extraContent) => {
        if (msgClientList.length === 0) {
          return `Lieber ${event.client.clientNickname}, es ist zur Zeit leider kein Supporter erreichbar. Komm gerne später noch einmal.`;
        }
        if (msgClientList.length === 1) {
          return `Lieber ${event.client.clientNickname}, bitte warte kurz, wir helfen dir gleich. ${extraContent}Folgender Supporter wurde kontaktiert: ${supporterList}`;
        }
        if (msgClientList.length > 1) {
          return `Lieber ${event.client.clientNickname}, bitte warte kurz, wir helfen dir gleich. ${extraContent}Folgende Supporter wurden kontaktiert: ${supporterList}`;
        }
      };

      const customVeri = "Du kannst uns zur Ranganpassung auch schriftlich kontaktieren. ";
      const customBewe =
        "Du kannst gerne die Steamprofillinks von allen Accounts bereithalten. Das Gespräch dauert in der Regel 20 bis 30 Minuten. ";

      let userMessage;
      switch (event.client.cid) {
        case supportAllg:
        case supportCoach:
        case supportKummer:
        case supportBeratung:
          userMessage = setEventClientMsg("");
          eventRAW.client.message(userMessage);
          break;
        case supportVeri:
          userMessage = setEventClientMsg(customVeri);
          eventRAW.client.message(userMessage);
          break;
        case supportBewe:
          userMessage = setEventClientMsg(customBewe);
          eventRAW.client.message(userMessage);
          break;
        default:
          break;
      }
    };

    // send (custom) message to suporter
    const sendCustomMessage = async (event) => {
      // create user clicker
      const msgClientClicker = `[URL=client:///${event.invoker.clientUniqueIdentifier}]${event.invoker.clientNickname}[/URL]`;
      const supportClientClicker = `[URL=client:///${lastSupport.supportClient.clientUniqueIdentifier}]${lastSupport.supportClient.clientNickname}[/URL]`;

      // check message for "!me"
      if (event["msg"].startsWith("!me")) {
        for (const clientRAW of lastSupport.msgClientList) {
          const client = transformData(clientRAW);

          // check for the sender
          if (client.clientUniqueIdentifier === event.invoker.clientUniqueIdentifier) {
            clientRAW.message(`Nachricht gesendet`);
            continue;
          }

          clientRAW.message(
            `[b][color=#ffff44]Nachricht:[/color][/b] ${msgClientClicker} übenimmt den User ${supportClientClicker}`
          );
        }
      }

      // check message for "!send"
      if (event["msg"].startsWith("!send")) {
        const msgBody = event["msg"].slice(6);

        for (const clientRAW of lastSupport.msgClientList) {
          const client = transformData(clientRAW);

          // check for the sender
          if (client.clientUniqueIdentifier === event.invoker.clientUniqueIdentifier) {
            clientRAW.message(`Nachricht gesendet`);
            continue;
          }

          clientRAW.message(
            `[b][color=#aaff44]An Supporter von [/color]${msgClientClicker}:[/b] ${msgBody}`
          );
        }
      }

      // check message for "@mods"
      if (event["msg"].startsWith("@mods")) {
        const msgBody = event["msg"].slice(6);

        const clientList = await teamspeak.clientList({ clientType: 0 });
        for (const clientRAW of clientList) {
          const client = transformData(clientRAW);

          // check for the sender
          if (client.clientUniqueIdentifier === event.invoker.clientUniqueIdentifier) {
            clientRAW.message(`Nachricht gesendet`);
            continue;
          }

          // check for groups
          if (!client.clientServergroups.some((group) => ["96", "10", "77"].includes(group))) {
            continue;
          }

          clientRAW.message(
            `[b][color=#aaff44]An alle Mods von [/color]${msgClientClicker}:[/b] ${msgBody}`
          );
        }
      }
    };

    // execute when client connects to server
    teamspeak.on("clientconnect", () => {
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
    teamspeak.on("clientdisconnect", () => {
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
      // send support message
      sendSupportMessage(eventRAW);

      // check if description should be updated
      if (executeChangeDescription) {
        timeoutChangeDescription();
        changeDescription("Leitende Teammitglieder", "4");
        changeDescription("Teammitglieder", "12");
        changeDescription("Staff", "78098");
        changeDescription("Supporter", "19");
      }
    });

    teamspeak.on("textmessage", (eventRAW) => {
      const event = transformData(eventRAW);

      if (self.clientUniqueIdentifier === event.invoker.clientUniqueIdentifier) return;

      sendCustomMessage(event);
    });

    // #
    // code above
    // #
  })
  .catch((error) => {
    console.log("Catched an error!");
    console.log(error);
  });
