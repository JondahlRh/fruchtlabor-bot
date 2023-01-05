const errorMessage = require("../utility/errorMessage");
const pathReducer = require("../utility/pathReducer");
const readJsonFile = require("../utility/readJsonFile");

const MAX_IDLE_TIME = 900000;

// function returning status
const insertStatus = (client, clientChannel, fsData) => {
  if (!client) return "[color=#ff4444]offline[/color]";

  const { clientServergroups, cid, clientIdleTime } = client.propcache;
  const { pid } = clientChannel.propcache;

  if (fsData.channel.afk.team.away === +cid) return "AFK";
  if (fsData.channel.meeting.team === +cid) return "Besprechung";
  if (fsData.channel.spacer.support === +pid) return "Support";
  if (Object.entries(fsData.channel.match).find((m) => m[1] === +pid)) {
    return "ingame";
  }
  if (clientServergroups.some((sg) => +sg === fsData.servergroup.noSupport)) {
    return "No Support";
  }
  if (
    clientServergroups.some(
      (sg) =>
        +sg === fsData.servergroup.live ||
        +sg === fsData.servergroup.doNotDisturb
    )
  ) {
    return "Do Not Disturb";
  }
  if (
    clientIdleTime > MAX_IDLE_TIME &&
    !(
      fsData.channel.afk.team.availableTeam === +cid ||
      fsData.channel.afk.team.availableStaff === +cid
    )
  ) {
    return "abwesend";
  }

  return "[color=#44ff44]online[/color]";
};

// function returning desctiption
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

const online = async (props) => {
  const { fsData, teamspeak } = props;

  // get ranks data
  const fsRanks = readJsonFile(
    `${process.env.VERSION}/ranks.json`,
    "online channel @ fsRanks"
  );
  if (!fsRanks) return;

  // get all channels
  let channels;
  try {
    channels = await teamspeak.channelList();
  } catch (error) {
    return errorMessage("online channel @ channelList", error);
  }

  fsData.functions.channel.online.forEach(async (c) => {
    // get all group categories
    const ranksFiltered = fsRanks.filter((rank) =>
      rank.categorie.some((cat) => c.categories.includes(cat))
    );

    const listGroups = [];
    for (const group of ranksFiltered) {
      // get all group clients
      let listGroupClients;
      try {
        listGroupClients = await teamspeak.serverGroupClientList(group.id);
      } catch (error) {
        errorMessage("online channel @ serverGroupClientList", error);
        continue;
      }

      // get status for all group clients
      for (const mc of listGroupClients) {
        let client;
        try {
          client = await teamspeak.getClientByUid(mc.clientUniqueIdentifier);
        } catch (error) {
          errorMessage("online channel @ getClientByUid", error);
        }
        let clientChannel;
        try {
          clientChannel = await teamspeak.getChannelById(
            client?.propcache?.cid
          );
        } catch (error) {
          errorMessage("online channel @ getChannelById", error);
        }
        mc.status = insertStatus(client, clientChannel, fsData);
      }
      listGroups.push({ name: group.name, clients: listGroupClients });
    }

    // get description
    const description = insertDescriptionData(c.title, listGroups);

    // check for changes
    const onlineChannelId = pathReducer(c.channel, fsData.channel);
    try {
      const channel = await teamspeak.channelInfo(onlineChannelId);
      if (channel.channelDescription === description) return;
    } catch (error) {
      return errorMessage("online channel @ channelInfo", error);
    }

    // edit description
    try {
      await teamspeak.channelEdit(onlineChannelId, {
        channelDescription: description,
      });
    } catch (error) {
      return errorMessage("online channel @ channelEdit", error);
    }
  });
};

module.exports = online;
