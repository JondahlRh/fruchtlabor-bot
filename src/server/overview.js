const query = require("source-server-query");

const errorMessage = require("../utility/errorMessage");
const pathReducer = require("../utility/pathReducer");
const readJsonFile = require("../utility/readJsonFile");

const SERVER_TITLE_WIDTH = 25;
const PLAYERCOUNT_WIDTH = 15;

const widthDefiner = `[tr][td]                                                                                                                                                             [/td][/tr]`;

const horizontalLine = `[table]
${widthDefiner}
[tr][td][hr][/td][/tr]
[tr][/tr]
[/table]`;

// fucntion to get query data
const getServerData = async (ip, port) => {
  try {
    return await query.info(ip, port);
  } catch (error) {
    errorMessage("overview server @ querry", error);
  }
};

const overview = async (props) => {
  const { fsData, teamspeak } = props;

  // get servers data
  const fsServers = readJsonFile("server.json", "overview server @ fsServers");
  if (!fsServers) return;

  const { channel, title, subTitle, description, serverTypes } =
    fsData.functions.server.overview;
  const channelId = pathReducer(channel, fsData.channel);

  // add header part
  let channelDescription = `[center][table]

[tr]
[td][hr][/td]
[/tr]

[tr][/tr]

[tr]
[th][center][size=16] ${title} [/size][/th]
[/tr]

[tr]
[td][center][size=12] ${subTitle} [/td]
[/tr]

${widthDefiner}

[tr]
[td][center][size=10] ${description} [/td]
[/tr]

[/table]`;

  channelDescription += horizontalLine;

  const shownServers = fsServers.filter((s) => serverTypes.includes(s.name));
  for (const serverCategorie of shownServers) {
    // server categorie title
    channelDescription += "[table]";
    channelDescription += `[tr][th][center][size=12]${serverCategorie.title} Server[/size][/th][/tr]`;
    channelDescription += widthDefiner;
    channelDescription += "[/table]";

    // single server ips
    channelDescription += "[table]";
    for (const server of serverCategorie.servers) {
      const serverData = await getServerData(server.ip, server.port);

      // format title and add player count
      const fullServerTitle = `${server.title}:`.padEnd(SERVER_TITLE_WIDTH);
      const playerCount = `(Spieler: ${serverData?.players || 0})`.padStart(
        PLAYERCOUNT_WIDTH
      );

      channelDescription += "[tr]";
      channelDescription += `[th][left][size=10]${fullServerTitle}[/th]`;
      channelDescription += `[th][size=9][URL]steam://connect/${server.ip}:${server.port}[/URL][/size][/th]`;
      channelDescription += `[th][size=9]${playerCount}[/size][/th]`;
      channelDescription += "[/tr]";
    }
    channelDescription += "[/table]";

    channelDescription += horizontalLine;
  }

  // check for changes
  try {
    const channel = await teamspeak.channelInfo(channelId);
    if (channel.channelDescription === channelDescription) return;
  } catch (error) {
    return errorMessage("overview server @ channelInfo", error);
  }

  // edit description
  try {
    await teamspeak.channelEdit(channelId, { channelDescription });
  } catch (error) {
    return errorMessage("overview server @ channelEdit", error);
  }
};

module.exports = overview;
