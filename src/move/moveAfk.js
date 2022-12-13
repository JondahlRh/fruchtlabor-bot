const fs = require("fs");
const errorMessage = require("../errorMessage");

// client message
const clMsg = async (client, maxIdleTime) => {
  const idleMinute = Math.floor(maxIdleTime / 1000 / 60);

  try {
    await client.message(
      `Du warst über ${idleMinute} Minuten abwesend und wurdest in unseren Afk Channel gemoved!`
    );
  } catch (error) {
    return errorMessage("move afk @ message", error);
  }
};

// client move
const clMove = async (client, to) => {
  try {
    await client.move(to);
  } catch (error) {
    return errorMessage("move afk @ move", error);
  }
};

const moveAfk = async (props) => {
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
    return errorMessage("move afk @ fs", error);
  }
  const { types, to } = fsData.channels.afkMover;

  // get all clients
  let clients;
  try {
    clients = await teamspeak.clientList({ clientType: 0 });
  } catch (error) {
    return errorMessage("move afk @ clientList", error);
  }

  // get all channels
  let channels;
  try {
    channels = await teamspeak.channelList();
  } catch (error) {
    return errorMessage("move afk @ channelList", error);
  }

  types.forEach((move) => {
    const { maxIdleTime, soundMuteNeeded } = move;

    for (const client of clients) {
      const { clientIdleTime, cid, clientOutputMuted } = client.propcache;

      if (clientIdleTime < +maxIdleTime) continue;
      if (soundMuteNeeded && !clientOutputMuted) continue;

      if (move.cid.includes(cid)) {
        clMove(client, to.user);
        clMsg(client, maxIdleTime);
      }

      const channel = channels.find((c) => c.propcache.cid === cid);

      if (move.pid.includes(channel.propcache.pid)) {
        clMove(client, to.user);
        clMsg(client, maxIdleTime);
      }
    }
  });
};

module.exports = moveAfk;
