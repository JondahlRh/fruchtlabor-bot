const query = require("source-server-query");
const fs = require("fs");
const errorMessage = require("../functions/errorMessage");
const readJsonFile = require("../functions/readJsonFile");
const pathReducer = require("../functions/pathReducer");

const playercount = async (props) => {
  const { teamspeak } = props;

  const fsData = readJsonFile(
    `${process.env.VERSION}/data.json`,
    "playercount server @ fsData"
  );
  if (!fsData) return;

  const fsServers = readJsonFile(
    "server.json",
    "playercount server @ fsServers"
  );
  if (!fsServers) return;

  for (const server of fsData.functions.server.playercount) {
    const serverData = servers
      .find((ser) => ser.name === server.server[0])
      .servers.find((ser) => ser.name === server.server[1]);

    let querry;
    try {
      querry = await query.info(serverData.ip, serverData.port);
    } catch (error) {
      errorMessage("playercount server @ query", error);
      continue;
    }

    const serverChannelId = pathReducer(server.channel, fsData.channel);
    try {
      await teamspeak.channelEdit(serverChannelId, {
        channelName: `● ${server.prefix} | Online: ${querry?.players || 0}`,
      });
    } catch (error) {
      errorMessage("playercount server @ channelEdit", error);
      continue;
    }
  }
};

module.exports = playercount;
