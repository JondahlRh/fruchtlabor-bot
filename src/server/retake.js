const errorMessage = require("../utility/errorMessage");
const pathReducer = require("../utility/pathReducer");
const readJsonFile = require("../utility/readJsonFile");
const query = require("source-server-query");

const retake = async (props) => {
  const { fsData, teamspeak } = props;

  const fsServers = readJsonFile("server.json", "retake server @ fsServers");
  if (!fsServers) return;

  for (const server of fsData.functions.server.retake) {
    const [categorie, type] = server.server;
    const { ip, port } = fsServers
      .find((s) => s.name === categorie)
      ?.servers?.find((s) => s.name === type);

    let queryData;
    try {
      queryData = await query.info(ip, port);
    } catch (error) {
      errorMessage("retake server @ query", error);
    }

    const id = pathReducer(server.channel, fsData.channel);
    const name = queryData
      ? `● ${server.name} | Online: ${queryData.players || 0}`
      : `● ${server.name} | Offline`;
    const description = queryData
      ? `[center]Instaconnect:\n[URL]steam://connect/${ip}:${port}[/URL]`
      : "[center][color=#ff4444]Server Offline!";

    try {
      const { channelDescription, channelName } = await teamspeak.channelInfo(
        id
      );
      if (channelName === name && channelDescription === description) continue;
    } catch (error) {
      errorMessage("retake server @ channelInfo", error);
      continue;
    }

    try {
      await teamspeak.channelEdit(id, {
        channelName: name,
        channelDescription: description,
      });
    } catch (error) {
      errorMessage("retake server @ channelEdit", error);
      continue;
    }
  }
};

module.exports = retake;
