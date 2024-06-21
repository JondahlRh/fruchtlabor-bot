import { TeamSpeak } from "ts3-nodejs-library";

import {
  getCsServerDomain,
  getPlayerCountLabel,
} from "modules/bot/utility/descriptionTemplates/general";
import {
  getEmptyRow,
  getHorizontalLineRow,
  getSpacerRow,
  getTextRow,
} from "modules/bot/utility/descriptionTemplates/row";
import { getCsServerConnectLink } from "modules/bot/utility/descriptionTemplates/url";

import { cachedFindServerTitles } from "services/mongodbServices/functions/serverTitle";
import { getServerInfo } from "services/sourceServerQueryService";

export default async function detailsServer(teamspeak: TeamSpeak) {
  const serverTitles = await cachedFindServerTitles();

  for (const serverTitle of serverTitles) {
    const serverData = await getServerInfo(
      serverTitle.server.host,
      serverTitle.server.port
    );

    let status = "Offline";
    let connectData = "";
    if (serverData !== null) {
      status = getPlayerCountLabel(serverData);

      connectData += getEmptyRow();

      const connectLink = getCsServerConnectLink(
        serverTitle.server.host,
        serverTitle.server.port,
        "hier"
      );
      connectData += getTextRow(`Instaconnect: ${connectLink}`);

      const connectCopy = getCsServerDomain(serverTitle.server.port, true);
      connectData += getTextRow(connectCopy);
    }

    const channelName = `● ${serverTitle.prefix} | ${status}`;

    let channelDescription = "[center][table]\n";
    channelDescription += getHorizontalLineRow();
    channelDescription += getSpacerRow(120);
    channelDescription += getTextRow(serverTitle.title, "center", 16, true);
    channelDescription += getTextRow(status, "center", 12, true);
    channelDescription += connectData;
    channelDescription += getEmptyRow();
    channelDescription += getHorizontalLineRow();

    if (serverTitle.body.length > 0) {
      channelDescription += getEmptyRow();
      channelDescription += getTextRow(serverTitle.body, "center", 8);
      channelDescription += getEmptyRow();
      channelDescription += getHorizontalLineRow();
    }

    channelDescription += "[/table]\n";

    const channelInfo = await teamspeak.channelInfo(
      serverTitle.channel.id.toString()
    );
    if (
      channelInfo.channelName === channelName &&
      channelInfo.channelDescription === channelDescription
    ) {
      continue;
    }
    await teamspeak.channelEdit(serverTitle.channel.id.toString(), {
      channelName,
      channelDescription,
    });
  }
}
