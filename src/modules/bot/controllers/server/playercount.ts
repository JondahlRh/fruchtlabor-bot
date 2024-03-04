import query from "source-server-query";
import { TeamSpeak } from "ts3-nodejs-library";
import { z } from "zod";

import { getServerPlayercounts } from "../../utility/mongodb";

const ServerInfoSchema = z.object({
  name: z.string(),
  map: z.string(),
  players: z.number(),
  max_players: z.number(),
});

const getChannelDescription = (
  title: string,
  description: string,
  ip?: string,
  port?: number
) => {
  const connectData = `[tr][/tr]\n[tr][td][center][size=8]Instaconnect: [url=steam://connect/${ip}:${port}/]hier[/url][/td][/tr]
[tr][td][center][size=8]${process.env.CS_SERVER_DOMAIN}:${port}[/td][/tr]`;

  return `[center][table][tr][td][hr][/td][/tr]
[tr][td]                                                                                                    [/td][/tr]
[tr][td][center][size=16][b]${title}[/b][/td][/tr]
[tr][td][center][size=10]${description}[/td][/tr]
${(ip && port && connectData) ?? ""}
[tr][/tr]\n[tr][td][hr][/td][/tr]`;
};

const playercount = async (teamspeak: TeamSpeak) => {
  const serverPlayercounts = await getServerPlayercounts();

  for (const serverPlayercount of serverPlayercounts) {
    const { title, channel, server } = serverPlayercount;

    let serverInfo;
    try {
      const serverInfoRaw = await query.info(server.ip, server.port);

      serverInfo = ServerInfoSchema.parse(serverInfoRaw);
    } catch (error) {}

    let status = "Offline";
    let channelDescription = getChannelDescription(title, "Offline");

    if (serverInfo !== undefined) {
      status = `Spieler: ${serverInfo.players}/${serverInfo.max_players}`;
      channelDescription = getChannelDescription(
        title,
        status,
        server.ip,
        server.port
      );
    }

    const channelName = `● ${title} | ${status}`;

    const channelInfo = await teamspeak.channelInfo(String(channel.id));
    if (
      channelInfo.channelName === channelName &&
      channelInfo.channelDescription === channelDescription
    ) {
      continue;
    }

    await teamspeak.channelEdit(String(channel.id), {
      channelName,
      channelDescription,
    });
  }
};

export default playercount;
