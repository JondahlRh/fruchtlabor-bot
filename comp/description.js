const descriptionData = require("./utility/descriptionData");

const getStatus = (client, matchChannels) => {
  if (!client) return "[color=#ff4444]offline[/color]";

  const clientServergroups = client.propcache.clientServergroups;
  const clientCID = client.propcache.cid;
  const clientIdleTime = client.propcache.clientIdleTime;

  // channel: "Team/Staff - AFK"
  if (clientCID === "13") return "AFK";
  // channel: "Teambesprechung"
  if (clientCID === "8") return "Besprechung";
  // channel: Support I to VI
  if (["20", "22", "3805", "19054", "Support", "68829"].includes(clientCID)) return "Support";
  // channel: Matchmaking, Wingman and FaceIt
  if (matchChannels.some((channel) => channel.cid === clientCID)) return "ingame";

  // group: "No Support!"
  if (clientServergroups.some((group) => group === "59")) return "No Support";
  // group: "LIVE", "Do Not Disturb!"
  if (clientServergroups.some((group) => ["2482", "2541"].includes(group))) return "Do Not Disturb";

  // channel: "Team - erreichbar", "Staff - erreichbar" + idletime > 15min
  if (clientIdleTime > 900000 && !["12", "78098"].some((channel) => channel === clientCID)) {
    return "abwesend";
  }

  return "[color=#44ff44]online[/color]";
};

const description = async (teamspeak) => {
  // get current match channels
  const matchChannels = await (async () => {
    return [
      ...(await teamspeak.channelFind("Wettkampf | Clanintern")),
      ...(await teamspeak.channelFind("Wettkampf | Öffentlich")),
      ...(await teamspeak.channelFind("Wingman")),
      ...(await teamspeak.channelFind("FaceIT | Clanintern")),
      ...(await teamspeak.channelFind("FaceIT | Öffentlich")),
    ];
  })();

  // loop all description types
  for (const descriptionType of descriptionData) {
    // add the title
    let description = `[center][table]

[tr]
[td][hr][/td]
[/tr]

[tr][/tr]

[tr]
[th][size=16] ${descriptionType.title} [/size][/th]
[/tr]

[tr][/tr]

[tr]
[td][hr][/td]
[/tr]
[tr]
[td]                                                                                                    [/td]
[/tr]

[/table][table]`;

    // loop each group
    for (const group of descriptionType.groups) {
      groupClientList = [];
      let groupDescription = "";

      // get servergroup clients
      for (const groupID of group.id) {
        groupClientList.push(...(await teamspeak.serverGroupClientList(groupID)));
      }

      // get each servergroup clients with the status
      if (groupClientList.length === 0) {
        groupDescription = `\n[tr][td][center] - [/center][/td][td][center] none [/td][/tr]`;
      }
      for (const groupClient of groupClientList) {
        const client = await teamspeak.getClientByUid(groupClient.clientUniqueIdentifier);
        const status = getStatus(client, matchChannels);

        groupDescription += `\n[tr][td][URL=client:///${groupClient.clientUniqueIdentifier}]${groupClient.clientNickname} [/URL][/td][td][center]${status}[/td][/tr]`;
      }

      // add servergroup title and clients
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

    description += `[/table]`;

    // check if the description changed
    const channel = await teamspeak.channelInfo(descriptionType.channel);
    if (channel.channelDescription === description) continue;

    // change description
    // console.log({ title: descriptionType.title });
    teamspeak.channelEdit(descriptionType.channel, {
      channelDescription: description,
    });
  }
};

module.exports = { edit: description };
