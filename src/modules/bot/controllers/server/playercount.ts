import { TeamSpeak } from "ts3-nodejs-library";

import "services/channelDescriptionService";
import {
  emptyRow,
  getBodyRows,
  getConnectCopy,
  getConnectLink,
  getPlayerStatus,
  getSpacerRow,
  getSubtitleRow,
  getTextRow,
  getTitleRow,
  horizontalRow,
} from "services/channelDescriptionService";
import { findServerTitles } from "services/mongodbServices/functions/serverTitle";
import { getServerInfo } from "services/sourceServerQueryService";

const title = async (teamspeak: TeamSpeak) => {
  const serverTitles = await findServerTitles();

  for (const serverTitle of serverTitles) {
    const serverData = await getServerInfo(
      serverTitle.server.ip,
      serverTitle.server.port
    );

    let status = "Offline";
    let connectData = "";
    if (serverData !== null) {
      status = getPlayerStatus(serverData);

      connectData += emptyRow;

      const connectLink = getConnectLink(
        serverTitle.server.ip,
        serverTitle.server.port
      );
      connectData += getTextRow(`Instaconnect: ${connectLink}`);

      const connectCopy = getConnectCopy(serverTitle.server.port);
      connectData += getTextRow(connectCopy);
    }

    const channelName = `● ${serverTitle.prefix} | ${status}`;

    let channelDescription = "[center][table]\n";
    channelDescription += horizontalRow;
    channelDescription += getSpacerRow(120);
    channelDescription += getTitleRow(serverTitle.title);
    channelDescription += getSubtitleRow(status);
    channelDescription += connectData;
    channelDescription += emptyRow;
    channelDescription += horizontalRow;

    if (serverTitle.body.length > 0) {
      channelDescription += emptyRow;
      channelDescription += getBodyRows(serverTitle.body);
      channelDescription += emptyRow;
      channelDescription += horizontalRow;
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
};

export default title;
