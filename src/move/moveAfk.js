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
  const { maxIdleTime, from, to } = fsData.channels.afkMover;

  // get all clients
  let clients;
  try {
    clients = await teamspeak.clientList({ clientType: 0 });
  } catch (error) {
    return errorMessage("move afk @ clientList", error);
  }

  clients.forEach(async (client) => {
    const { clientIdleTime, cid, clientOutputMuted } = client.propcache;

    if (!clientOutputMuted || clientIdleTime < +maxIdleTime) return;

    if (from.cid.includes(cid)) {
      clMsg(client, maxIdleTime);
      clMove(client, to);
    }

    // get all clChannel
    let clChannel;
    try {
      clChannel = await teamspeak.getChannelById(cid);
    } catch (error) {
      return errorMessage("move afk @ getChannelById", error);
    }
    const { pid } = clChannel.propcache;

    if (from.pid.includes(pid)) {
      clMsg(client, maxIdleTime);
      clMove(client, to);
    }
  });
};

module.exports = moveAfk;
