const fs = require("fs");
const query = require("source-server-query");
const errorMessage = require("../utility/errorMessage");
const pathReducer = require("../utility/pathReducer");
const readJsonFile = require("../utility/readJsonFile");

const widthDefiner = `[tr][td]                                                                                                                                                             [/td][/tr]`;

const horizontalLine = `[table]
${widthDefiner}
[tr][td][hr][/td][/tr]
[tr][/tr]
[/table]`;

// function to get query data
const getServerData = async (ip, port) => {
  try {
    return await query.info(ip, port);
  } catch (error) {
    errorMessage("overview server @ querry", error);
  }
};

const intern = async (props) => {
  const { fsData, teamspeak } = props;

  // get servers data
  const fsServers = readJsonFile("server.json", "overview server @ fsServers");
  if (!fsServers) return;

  // get maplist data
  let fsMaplist;
  try {
    fsMaplist = JSON.parse(
      fs.readFileSync(process.env.PATHTOINTERNMAPS, "utf8")
    );
  } catch (error) {
    return errorMessage("intern server @ fsMaplist", error);
  }

  const pugServer = fsServers.find((s) => s.name === "pug");
  const { channel, title, subTitle, description, footer } =
    fsData.functions.server.intern;
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

${description.map((d) => `[tr][td][center][size=10]${d}[/td][/tr]`).join("")}

[/table]`;

  channelDescription += horizontalLine;

  // add servers part
  channelDescription += "[table]";
  channelDescription +=
    "[tr][th][center][size=12]Unsere Pug Server[/size][/th][/tr]";
  channelDescription += widthDefiner;
  channelDescription += "[/table]";

  channelDescription += "[table]";
  for (const server of pugServer.servers) {
    const serverData = await getServerData(server.ip, server.port);

    // server full handler
    const serverIsFull = serverData?.players > 1;
    const fullServerTitle = `${serverIsFull ? "[s][color=#ff4444]" : ""}${
      server.title
    }:`.padEnd(30);
    const fullConnect = serverIsFull
      ? `[URL=steam://connect/${server.ip}:${server.port}]Connectlink[/URL]  [s][color=#ff4444]Match läuft bereits![s]`
      : `[URL]steam://connect/${server.ip}:${server.port}[/URL]`;

    channelDescription += "[tr]";
    channelDescription += `[th][left][size=10]${fullServerTitle}[/th]`;
    channelDescription += `[th][left][size=9]${fullConnect}[/size][/th]`;
    channelDescription += "[/tr]";
  }
  channelDescription += "[/table]";

  channelDescription += horizontalLine;

  // add maps part
  channelDescription += "[table]";
  channelDescription +=
    "[tr][th][center][size=12]Die aktuellen Communitymaps[/size][/th][/tr]";
  channelDescription += widthDefiner;
  channelDescription += "[/table]";

  channelDescription += "[table]";
  for (const map of fsMaplist) {
    channelDescription += `[tr][td][left][size=9]- ${map}[/size][/td][/tr]`;
  }
  channelDescription += "[/table]";

  channelDescription += "[table]";
  channelDescription += "[tr][/tr]";
  channelDescription += footer
    .map((d) => `[tr][td][center][size=10]${d}[/td][/tr]`)
    .join("");
  channelDescription += "[/table]";

  channelDescription += horizontalLine;

  // check for changes
  try {
    const channel = await teamspeak.channelInfo(channelId);
    if (channel.channelDescription === channelDescription) return;
  } catch (error) {
    return errorMessage("intern server @ channelInfo", error);
  }

  // edit description
  try {
    await teamspeak.channelEdit(channelId, { channelDescription });
  } catch (error) {
    return errorMessage("intern server @ channelEdit", error);
  }
};

module.exports = intern;
