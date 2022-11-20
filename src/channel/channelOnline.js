const fs = require("fs");
const errorMessage = require("../errorMessage");

const insertStatus = (client, fsData, matchChannels) => {
  if (!client) return "[color=#ff4444]offline[/color]";

  const { clientServergroups, cid, clientIdleTime } = client.propcache;

  if (fsData.channels.afk.includes(cid)) return "AFK";
  if (fsData.channels.meeting.includes(cid)) return "Besprechung";
  if (fsData.channels.support.includes(cid)) return "Support";
  if (matchChannels.some((c) => c.cid === cid)) return "ingame";
  if (fsData.groups.noSupport.some((g) => clientServergroups.includes(g))) {
    return "No Support";
  }
  if (fsData.groups.dnd.some((g) => clientServergroups.includes(g))) {
    return "Do Not Disturb";
  }
  if (
    clientIdleTime > 900000 &&
    !fsData.channels.ignoreIdle.some((c) => c === cid)
  ) {
    return "abwesend";
  }

  return "[color=#44ff44]online[/color]";
};

const insertDescriptionData = (title, groupGroups) => {
  const getClient = (c) => {
    return `[tr][td][URL=client:///${c.clientUniqueIdentifier}]${c.clientNickname} [/URL][/td][td][center]${c.status}[/td][/tr]`;
  };

  return `[center][table]

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

[/table][table]
${groupGroups
  .map(
    (g) => `[tr]
[th][size=12] ${g.name} [/size][/th]
[td][center][size=12] Status [/size][/td]
[/tr]
[tr]
[td][hr][/td]
[td][hr][/td]
[/tr]${
      g.clients.length === 0
        ? `\n[tr][td][center] - [/center][/td][td][center] none [/td][/tr]`
        : g.clients.map((c) => getClient(c)).join("")
    }
[tr][/tr]`
  )
  .join("")}`;
};

const channelOnline = async (props) => {
  const { teamspeak } = props;

  // get definition data
  let fsData;
  try {
    const data = fs.readFileSync(
      `src/utility/${process.env.VERSION}/teamspeakData.json`,
      "utf8"
    );
    fsData = JSON.parse(data);
  } catch (error) {
    return errorMessage("online channel @ fs", error);
  }

  // get all channels
  let channels;
  try {
    channels = await teamspeak.channelList();
  } catch (error) {
    return errorMessage("online channel @ channelList", error);
  }

  // get match channels
  const matchChannels = channels.filter((c) =>
    fsData.channels.match.includes(c.propcache.pid)
  );

  // edit descriptions
  fsData.channels.online.forEach(async (c) => {
    // get all group categories
    const listGroups = [];
    for (const group of c.groups) {
      // get all group clients
      const listGroupClients = [];
      for (const id of group.id) {
        try {
          listGroupClients.push(...(await teamspeak.serverGroupClientList(id)));
        } catch (error) {
          errorMessage("online channel @ serverGroupClientList", error);
          continue;
        }
      }
      // get status for all group clients
      for (const mc of listGroupClients) {
        let client;
        try {
          client = await teamspeak.getClientByUid(mc.clientUniqueIdentifier);
        } catch (error) {
          errorMessage("online channel @ serverGroupClientList", error);
        }
        mc.status = insertStatus(client, fsData, matchChannels);
      }
      listGroups.push({ name: group.name, clients: listGroupClients });
    }

    // get description
    const description = insertDescriptionData(c.title, listGroups);

    // check for changes
    try {
      const channel = await teamspeak.channelInfo(c.channel);
      if (channel.channelDescription === description) return;
    } catch (error) {
      return errorMessage("online channel @ channelInfo", error);
    }

    // edit description
    try {
      await teamspeak.channelEdit(c.channel, {
        channelDescription: description,
      });
    } catch (error) {
      return errorMessage("online channel @ channelEdit", error);
    }
  });
};

module.exports = channelOnline;
