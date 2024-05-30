import { TeamSpeak } from "ts3-nodejs-library";

import "services/channelDescriptionService";
import "services/channelDescriptionService";
import {
  emptyRow,
  getBodyRows,
  getConnectLink,
  getDataTitle,
  getPlayerStatus,
  getSpacerRow,
  getSubtitleRow,
  getTitleRow,
  horizontalRow,
} from "services/channelDescriptionService";
import { findServerDescriptions } from "services/mongodbServices/functions/serverDescription";
import { getServerInfo } from "services/sourceServerQueryService";

const title = async (teamspeak: TeamSpeak) => {
  const serverDescriptions = await findServerDescriptions();

  for (const serverDescription of serverDescriptions) {
    let channelDescription = "[center][table]\n";
    channelDescription += horizontalRow;
    channelDescription += getSpacerRow(150);
    channelDescription += getTitleRow(serverDescription.title);
    channelDescription += getSubtitleRow(serverDescription.subtitle);

    if (serverDescription.body.length > 0) {
      channelDescription += emptyRow;
      channelDescription += getBodyRows(serverDescription.body);
    }

    channelDescription += emptyRow;
    channelDescription += horizontalRow;
    channelDescription += emptyRow;

    channelDescription += "[/table][table]\n";

    for (const server of serverDescription.servers) {
      channelDescription += "[tr]\n";
      const serverData = await getServerInfo(server.ip, server.port);

      let status = "";
      let connectData = "[color=#ff4444]Server Offline![/color]";
      if (serverData !== null) {
        status = `(${getPlayerStatus(serverData)})`;
        connectData = getConnectLink(server.ip, server.port);
      }

      channelDescription += getDataTitle(server.name, "left", false, 4);
      channelDescription += getDataTitle(connectData, "center");
      channelDescription += getDataTitle(status, "center", false, 2);

      channelDescription += "[/tr]\n";
    }

    channelDescription += "[/table][table]\n";

    channelDescription += getSpacerRow(150);
    channelDescription += horizontalRow;

    if (
      serverDescription.description &&
      serverDescription.description.text.length > 0
    ) {
      channelDescription += emptyRow;
      channelDescription += getBodyRows(serverDescription.description.text);
      channelDescription += emptyRow;
      channelDescription += horizontalRow;
    }

    channelDescription += "[/table]\n";

    const channelInfo = await teamspeak.channelInfo(
      serverDescription.channel.id.toString()
    );
    if (channelInfo.channelDescription === channelDescription) {
      continue;
    }
    await teamspeak.channelEdit(serverDescription.channel.id.toString(), {
      channelDescription,
    });
  }
};

export default title;
