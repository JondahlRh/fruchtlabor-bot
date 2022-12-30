const fs = require("fs");
const errorMessage = require("../functions/errorMessage");
const pathReducer = require("../functions/pathReducer");
const readJsonFile = require("../functions/readJsonFile");

// move client
const checkClientMove = async (client, conditions, moveChannel) => {
  const { clientIdleTime, clientInputMuted, clientOutputMuted } =
    client.propcache;

  const { def, micMuted, sndMuted } = conditions;

  if (
    (!def || clientIdleTime < def) &&
    (!micMuted || !clientInputMuted || clientIdleTime < micMuted) &&
    (!sndMuted || !clientOutputMuted || clientIdleTime < sndMuted)
  ) {
    return;
  }

  try {
    await client.move(moveChannel);
  } catch (error) {
    return errorMessage("move afk @ move", error);
  }

  const idleMinute = Math.floor(clientIdleTime / 1000 / 60);
  try {
    await client.message(
      `Du warst ${idleMinute} Minuten abwesend und wurdest in unseren Afk Channel gemoved!`
    );
  } catch (error) {
    return errorMessage("move afk @ message", error);
  }
};

const afk = async (props) => {
  const { teamspeak } = props;

  const fsData = readJsonFile(
    `${process.env.VERSION}/data.json`,
    "move afk @ fsData"
  );
  if (!fsData) return;

  const fsRanks = readJsonFile("ranks.json", "move afk @ fsRanks");
  if (!fsRanks) return;

  const { def, specials } = fsData.functions.move.afk;

  // get all clients
  let clients;
  try {
    clients = await teamspeak.clientList({ clientType: 0 });
  } catch (error) {
    return errorMessage("move afk @ clientList", error);
  }

  // get all channels
  let allChannels;
  try {
    allChannels = await teamspeak.channelList();
  } catch (error) {
    return errorMessage("move afk @ channelList", error);
  }

  clients.forEach((client) => {
    const { cid, clientServergroups } = client.propcache;

    // check if user is already in afk channel
    const afkChannels = [
      ...Object.entries(fsData.channel.afk.team).map((a) => a[1]),
      ...Object.entries(fsData.channel.afk.user).map((a) => a[1]),
    ];
    if (afkChannels.includes(+cid)) return;

    // differentiate between team or user afk channel
    const tm = ranks.find((r) => clientServergroups.some((sg) => +sg === r.id));
    let moveChannel;
    if (tm?.categorie.includes("teamAfk")) {
      moveChannel = fsData.channel.afk.team.away;
    } else {
      moveChannel = fsData.channel.afk.user.away;
    }

    checkClientMove(client, def, moveChannel);

    for (const type of specials) {
      const { channels, channelParents, conditions } = type;

      for (const c of channels) {
        const channelId = pathReducer(c, fsData.channel);

        if (+cid !== channelId) continue;
        checkClientMove(client, conditions, moveChannel);
      }
      for (const c of channelParents) {
        const pChannelId = pathReducer(c, fsData.channel);
        const channel = allChannels.find((ch) => +ch.propcache.cid === +cid);

        if (+channel.propcache.pid !== pChannelId) continue;
        checkClientMove(client, conditions, moveChannel);
      }
    }
  });
};

module.exports = afk;
