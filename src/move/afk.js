const errorMessage = require("../utility/errorMessage");
const pathReducer = require("../utility/pathReducer");
const readJsonFile = require("../utility/readJsonFile");

const moveClient = async (client, channelId, maxIdleTime) => {
  const idleTimeMinutes = Math.floor(maxIdleTime / 1000 / 60);
  const message = `Du warst über ${idleTimeMinutes} Minuten abwesend und wurdest in den Afk Channel gemoved!`;

  // move client
  try {
    await client.move(channelId);
  } catch (error) {
    return errorMessage("move afk @ move", error);
  }

  // message client
  try {
    await client.message(message);
  } catch (error) {
    return errorMessage("move afk @ message", error);
  }
};

const checkMove = (client, conditions) => {
  const { clientIdleTime, clientInputMuted, clientOutputMuted } =
    client.propcache;
  const { def, micMuted, sndMuted } = conditions;

  // checks if specefic condition should be checked and if idle time exceeded
  if (def && clientIdleTime > def) {
    return def;
  }
  if (micMuted && clientInputMuted && clientIdleTime > micMuted) {
    return micMuted;
  }
  if (sndMuted && clientOutputMuted && clientIdleTime > sndMuted) {
    return sndMuted;
  }
};

const afk = async (props) => {
  const { fsData, teamspeak } = props;

  // get ranks data
  const fsRanks = readJsonFile(
    `${process.env.VERSION}/ranks.json`,
    "move afk @ fsRanks"
  );
  if (!fsRanks) return;

  // get clients
  let clients;
  try {
    clients = await teamspeak.clientList({ clientType: 0 });
  } catch (error) {
    return errorMessage("move afk @ clientList");
  }

  // get channels
  let channels;
  try {
    channels = await teamspeak.channelList();
  } catch (error) {
    return errorMessage("move afk @ channelList");
  }

  // get afk channel ids
  const afkChannels = [
    ...Object.values(fsData.channel.afk.team),
    ...Object.values(fsData.channel.afk.user),
  ];

  outer: for (const client of clients) {
    const { cid, clientServergroups } = client.propcache;

    // get parent channel id
    const pid = channels.find((c) => c.propcache.cid === cid)?.propcache?.pid;

    // get move channel id
    const teamAfkRankIds = fsRanks
      .filter((r) => r.categorie.includes("teamAfk"))
      .map((r) => r.id);
    let moveChannelId;
    if (clientServergroups.some((sg) => teamAfkRankIds.includes(+sg))) {
      moveChannelId = fsData.channel.afk.team.away;
    } else {
      moveChannelId = fsData.channel.afk.user.away;
    }

    // ignore users in afk channel
    if (afkChannels.includes(+cid)) continue outer;

    // check move for default data
    const maxIdleTime = checkMove(client, fsData.functions.move.afk.general);
    if (maxIdleTime) {
      moveClient(client, moveChannelId, maxIdleTime);
      continue outer;
    }

    inner: for (const moveType of fsData.functions.move.afk.moveTypes) {
      // get channel and parent channel ids
      const channelIds = moveType.channels.map((c) =>
        pathReducer(c, fsData.channel)
      );
      const pchannelIds = moveType.channelParents.map((c) =>
        pathReducer(c, fsData.channel)
      );

      // check channel and parent channel
      if (!channelIds.includes(+cid) && !pchannelIds.includes(+pid)) {
        continue inner;
      }

      // check move for move type
      const maxIdleTime = checkMove(client, moveType.conditions);
      if (maxIdleTime) {
        moveClient(client, moveChannelId, maxIdleTime);
        continue outer;
      }
    }
  }
};

module.exports = afk;
