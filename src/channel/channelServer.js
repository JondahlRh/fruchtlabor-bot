const query = require("source-server-query");
const fs = require("fs");
const errorMessage = require("../errorMessage");

const channelServer = async (props) => {
  const { teamspeak } = props;

  let fsData;
  try {
    const data = fs.readFileSync(
      `src/utility/${process.env.VERSION}/teamspeakData.json`,
      "utf8"
    );
    fsData = JSON.parse(data);
  } catch (error) {
    return errorMessage("server channel @ fs", error);
  }

  for (const server of fsData.channels.server) {
    let querry;
    try {
      querry = await query.info(server.ip, server.port);
    } catch (error) {
      errorMessage("server channel @ query", error);
      continue;
    }
    try {
      await teamspeak.channelEdit(server.channel.id, {
        channelName: `● ${server.channel.name} | Online: ${
          querry?.players || 0
        }`,
      });
    } catch (error) {
      errorMessage("server channel @ channelEdit", error);
      continue;
    }
  }
};

module.exports = channelServer;
