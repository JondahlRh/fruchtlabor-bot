const CREDS = require("./.creds");
const { TeamSpeak } = require("ts3-nodejs-library");

const leitende_teammitglieder = [
  { name: "Admin", id: "85" },
  { name: "Supervisor", id: "2487" },
  { name: "Head-Developer", id: "81" },
  { name: "Head-Mod", id: "77" },
  { name: "Head-Designer", id: "2537" },
  { name: "Head-Coach", id: "95" },
];
const teammitglieder = [
  { name: "Developer", id: "326" },
  { name: "Servertechniker", id: "354" },
  { name: "Mod", id: "10" },
  { name: "Inspektor", id: "321" },
  { name: "Recruiter", id: "319" },
  { name: "Teambetreuer", id: "334" },
  { name: "Redakteur", id: "307" },
  { name: "Social-Media", id: "308" },
  { name: "Designer", id: "78" },
  { name: "Cutter", id: "2501" },
  { name: "Event", id: "94" },
  { name: "Caster", id: "82" },
  { name: "Coach", id: "73" },
  { name: "Trial-Developer", id: "2538" },
  { name: "Trial-Mod", id: "96" },
  { name: "Trial-Recruiter", id: "2539" },
  { name: "Trial-Coach", id: "230" },
];
const staff = [
  { name: "Berater", id: "231" },
  { name: "Skin-Berater", id: "328" },
  { name: "IT-Berater", id: "320" },
  { name: "Kummerkasten", id: "2484" },
];
const support = [
  { name: "Head-Mod", id: "77" },
  { name: "Mod", id: "10" },
  { name: "Trial-Mod", id: "96" },
];

const msgClients = [];

const transform = (data) => {
  return JSON.parse(JSON.stringify(data));
};

const changeDescription = async (teamspeak, title, groupData, channel) => {
  const clientList = transform(await teamspeak.clientList({ clientType: 0 }));

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

  const checkOnline = async (client) => {
    const isOnline = clientList.some(
      (clientOn) => clientOn.clientUniqueIdentifier === client.clientUniqueIdentifier
    );
    if (!isOnline) return "[color=#FF0000]offline[/color]";

    const clientData = transform(await teamspeak.getClientByUid(client.clientUniqueIdentifier));

    if (clientData.clientChannelGroupInheritedChannelId === "13") return "AFK";
    if (clientData.clientServergroups.includes("59")) return "No Support";
    if (clientData.clientIdleTime > 900000) return "abwesend";
    return "[color=#00ff00]online[/color]";
  };

  for (const group of groupData) {
    const servergroup = await teamspeak.serverGroupClientList(group.id);
    let groupDescription = "";

    for (const client of servergroup) {
      const status = await checkOnline(client);
      groupDescription += `\n[tr][td][URL=client:///${client.clientUniqueIdentifier}]${client.clientNickname} [/URL][/td][td][center]${status}[/td][/tr]`;
    }

    if (group.extra !== undefined) {
      for (const client of group.extra) {
        const status = await checkOnline(client);
        groupDescription += `\n[tr][td][URL=client:///${client.id}]${client.name} [/URL][/td][td][center]${status}[/td][/tr]`;
      }
    }

    description += `[tr]
[th][size=12] ${group.name} [/size][/th]
[td][size=12] Status [/size][/td]
[/tr]
[tr]
[td][hr][/td]
[td][hr][/td]
[/tr]
${groupDescription}

[tr][/tr]`;
  }

  description += `[/table]`;

  const getChannel = await teamspeak.getChannelById(channel);
  const getChannelInfo = await getChannel.getInfo();
  const oldDescripion = getChannelInfo.channelDescription;

  if (description === oldDescripion) return;

  teamspeak.channelEdit(channel, {
    channelDescription: description,
  });
};

const sendSupportMessage = (clientList, group) => {
  clientList.forEach((clientRAW) => {
    const client = transform(clientRAW);

    if (!client.clientServergroups.includes(group)) return;
    if (client.clientServergroups.includes("59")) return;
    if (
      client.clientChannelGroupInheritedChannelId.includes("13") ||
      client.clientChannelGroupInheritedChannelId.includes("8")
    ) {
      return;
    }
    msgClients.push(clientRAW);
  });
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

    // #
    // Code below
    // #

    const self = await teamspeak.getClientByUid("Su5GYQbW1FfV4uXEaUxR7s8aeOg=");
    teamspeak.clientMove(self, await teamspeak.getChannelById("19"));

    const clientConnectHandler = async () => {
      staff[3].extra = [];
      (await teamspeak.serverGroupClientList("2485")).forEach((client) => {
        staff[3].extra.push({ name: client.clientNickname, id: client.clientUniqueIdentifier });
      });

      changeDescription(teamspeak, "Leitende Teammitglieder", leitende_teammitglieder, "4");
      changeDescription(teamspeak, "Teammitglieder", teammitglieder, "12");
      changeDescription(teamspeak, "Staff", staff, "78098");
      changeDescription(teamspeak, "Supporter", support, "19");
    };

    // support channel objects
    const supportAllg = transform(await teamspeak.getChannelById("24"));
    const supportVeri = transform(await teamspeak.getChannelById("25"));
    const supportBewe = transform(await teamspeak.getChannelById("27"));
    const supportCoach = transform(await teamspeak.getChannelById("61154"));
    const supportKummer = transform(await teamspeak.getChannelById("68837"));

    const clientMovedHandler = async (eventRAW) => {
      const event = transform(eventRAW);
      if (event.client.clientType === 1) return; // return if server query user

      const clientList = await teamspeak.clientList({ clientType: 0 });

      msgClients.length = 0;
      let talk = false;

      const gamix = await teamspeak.getClientByUid("jNstJ3PaKEIgHx4N+leTOxVniqM=");

      switch (event.client.cid) {
        case supportAllg.cid:
        case supportVeri.cid:
          if (
            event.client.clientServergroups.includes("318") ||
            event.client.clientServergroups.includes("2480")
          ) {
            sendSupportMessage(clientList, "2559");
            talk = true;
            gamix.message(
              "[color=#FF0000][b]Support Gespräch: [/b][/color] Allgemein/Verifizierung"
            );
          } else {
            sendSupportMessage(clientList, "2554");
            sendSupportMessage(clientList, "2559");
            gamix.message("Allgemein/Verifizierung");
          }
          break;
        case supportBewe.cid:
          sendSupportMessage(clientList, "2556");
          sendSupportMessage(clientList, "2559");
          gamix.message("Bewerbung");
          break;
        case supportCoach.cid:
          sendSupportMessage(clientList, "2558");
          gamix.message("Coaching");
          break;
        case supportKummer.cid:
          sendSupportMessage(clientList, "2484");
          sendSupportMessage(clientList, "2485");
          gamix.message("Kummerkasten");
          break;

        default:
          break;
      }

      msgClients.forEach((clientRAW) => {
        const msgClicker = `[URL=client://${event.client.cid}/${event.client.clientUniqueIdentifier}]${event.client.clientNickname}[/URL]`;

        let clientMessageSupp = "";
        if (msgClients.length === 1) {
          clientMessageSupp = `(Es wurde kein weiterer Supporter kontaktiert)`;
        } else if (msgClients.length === 2) {
          clientMessageSupp = `(Es wurde ein weiterer Supporter kontaktiert)`;
        } else {
          clientMessageSupp = `(Es wurden ${msgClients.length - 1} weitere Supporter kontaktiert)`;
        }

        let clientMessage = "";
        if (talk) {
          clientMessage = `[color=#FF0000][b]Support Gespräch: [/b][/color]Der User ${msgClicker} meldet sich in dem Channel "${event.channel.channelName}" ${clientMessageSupp}`;
        } else {
          clientMessage = `Der User ${msgClicker} wartet in dem Channel "${event.channel.channelName}" ${clientMessageSupp}`;
        }

        clientRAW.message(clientMessage);
      });
    };

    teamspeak.on("clientconnect", clientConnectHandler);
    teamspeak.on("clientdisconnect", clientConnectHandler);
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
