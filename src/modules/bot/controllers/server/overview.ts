import query from "source-server-query";
import { TeamSpeak } from "ts3-nodejs-library";
import { z } from "zod";

import { findServerOverviews } from "services/mongodbServices/functions/serverOverview";

const ServerInfoSchema = z.object({
  name: z.string(),
  map: z.string(),
  players: z.number(),
  max_players: z.number(),
});

const WIDTH_DEFINER =
  "[tr][td]                                                                                                                                                             [/td][/tr]";
const PLAYERCOUNT_WIDTH = 16;

type ServerCategoryServer = {
  title: string;
  ip: string;
  port: string;
  playercount: number;
};

const getFullServerlink = (ser: ServerCategoryServer) => {
  return ser.playercount < 0
    ? "[color=#ff4444]Server Offline![/color]"
    : `[URL=steam://connect/${ser.ip}:${ser.port}?appid=730/${process.env.CS_SERVER_PASSWORD}]${process.env.CS_SERVER_DOMAIN}:${ser.port}[/URL]`;
};
const getFullPlayercount = (ser: ServerCategoryServer) => {
  const playerCountString = ser.playercount.toString().padStart(2);

  return ser.playercount < 0
    ? ""
    : `(Spieler: ${playerCountString})`.padStart(PLAYERCOUNT_WIDTH);
};

const getChannelDescription = (
  title: string,
  subtitle: string,
  description: string,
  servers: ServerCategoryServer[]
) => {
  const titleMaxLength =
    4 +
    servers.map((x) => x.title.length).reduce((p, c) => (p > c ? p : c), 10);

  return `[center][table]
[tr][td][hr][/td][/tr]
${WIDTH_DEFINER}
[tr][th][size=16]${title}[/size][/th][/tr]
[tr][th][size=12]${subtitle}[/size][/th][/tr]
[tr][/tr]
${description
  .split("\n")
  .map((x) => `[tr][td][center][size=10]${x}[/size][/td][/tr]`)
  .join("")}
[tr][/tr]
[tr][td][hr][/td][/tr]
[tr][/tr]
[/table][table]
${servers
  .map(
    (ser) => `[tr]
[th][left][size=10]${ser.title.padEnd(titleMaxLength)}[/th]
[th][size=9]${getFullServerlink(ser)}[/size][/th]
[th][left][size=9]${getFullPlayercount(ser)}[/size][/th]
[/tr]`
  )
  .join("")}
[/table][table]
${WIDTH_DEFINER}
[tr][td][hr][/td][/tr]
[/table]`;
};

const overview = async (teamspeak: TeamSpeak) => {
  const serverOverviews = await findServerOverviews();

  for (const serverOverview of serverOverviews) {
    const { title, subtitle, description, channel, servers } = serverOverview;

    const mappedServers: ServerCategoryServer[] = [];
    for (const server of servers) {
      let serverInfo;
      try {
        const serverInfoRaw = await query.info(server.ip, server.port);

        serverInfo = ServerInfoSchema.parse(serverInfoRaw);
      } catch (error) {} // eslint-disable-line

      const playercount = serverInfo === undefined ? -1 : serverInfo.players;

      mappedServers.push({
        title: server.name,
        ip: server.ip,
        port: server.port.toString(),
        playercount,
      });
    }

    const channelDescription = getChannelDescription(
      title,
      subtitle,
      description,
      mappedServers
    );

    const channelInfo = await teamspeak.channelInfo(channel.id.toString());
    if (channelInfo.channelDescription === channelDescription) {
      continue;
    }

    await teamspeak.channelEdit(channel.id.toString(), {
      channelDescription,
    });
  }
};

export default overview;
