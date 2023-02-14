const query = require("source-server-query");

const errorMessage = require("../utility/errorMessage");
const readJsonFile = require("../utility/readJsonFile");
const pathReducer = require("../utility/pathReducer");

const playercount = async (props) => {
  const { fsData, teamspeak } = props;

  // get servers data
  const fsServers = readJsonFile(
    "server.json",
    "playercount server @ fsServers"
  );
  if (!fsServers) return;

  for (const server of fsData.functions.server.playercount) {
    // find server data (ip, port, etc.)
    const serverData = fsServers
      .find((ser) => ser.name === server.server[0])
      ?.servers?.find((ser) => ser.name === server.server[1]);
    const serverChannelId = pathReducer(server.channel, fsData.channel);

    // get server data
    let querry;
    try {
      querry = await query.info(serverData.ip, serverData.port);
    } catch (error) {
      errorMessage("playercount server @ query", error);
    }

    // format channel name and description^
    let channelName = `● ${server.prefix} | Online: ${querry?.players || 0}`;
    let channelDescription = `[center]Instaconnect:\n[URL]steam://connect/${serverData.ip}:${serverData.port}[/URL]`;
    if (!querry) {
      channelName = `● ${server.prefix} | Offline`;
      channelDescription = "[center][color=#ff4444]Server Offline!";
    }

    // check for changes
    try {
      const channel = await teamspeak.channelInfo(serverChannelId);
      if (
        channel.channelDescription === channelDescription &&
        channel.channelName === channelName
      ) {
        continue;
      }
    } catch (error) {
      errorMessage("intern server @ channelInfo", error);
      continue;
    }

    // edit channel name and description
    try {
      await teamspeak.channelEdit(serverChannelId, {
        channelName,
        channelDescription,
      });
    } catch (error) {
      errorMessage("playercount server @ channelEdit", error);
      continue;
    }
  }
};

module.exports = playercount;
