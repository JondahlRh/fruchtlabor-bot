import { TeamSpeak } from "ts3-nodejs-library";

import { getTextData } from "modules/bot/utility/descriptionTemplates/data";
import { getPlayerCountLabel } from "modules/bot/utility/descriptionTemplates/general";
import {
  getEmptyRow,
  getHorizontalLineRow,
  getSpacerRow,
  getTextRow,
} from "modules/bot/utility/descriptionTemplates/row";
import { getCsServerConnectLink } from "modules/bot/utility/descriptionTemplates/url";

import { findServerDescriptions } from "services/mongodbServices/functions/serverDescription";
import { getServerInfo } from "services/sourceServerQueryService";

const TABLE_WIDTH = 120;

const title = async (teamspeak: TeamSpeak) => {
  const serverDescriptions = await findServerDescriptions();

  for (const serverDescription of serverDescriptions) {
    let channelDescription = "[center][table]\n";
    channelDescription += getHorizontalLineRow();
    channelDescription += getSpacerRow(TABLE_WIDTH);
    channelDescription += getTextRow(
      serverDescription.title,
      "center",
      16,
      true
    );
    channelDescription += getTextRow(
      serverDescription.subtitle,
      "center",
      12,
      true
    );

    if (serverDescription.body.length > 0) {
      channelDescription += getEmptyRow();
      channelDescription += getTextRow(serverDescription.body, "center", 8);
    }

    channelDescription += getEmptyRow();
    channelDescription += getHorizontalLineRow();
    channelDescription += getEmptyRow();

    channelDescription += "[/table][table]\n";

    for (const server of serverDescription.servers) {
      channelDescription += "[tr]\n";
      const serverData = await getServerInfo(server.ip, server.port);

      let status = "";
      let connectData = "[color=#ff4444]Server Offline![/color]";
      if (serverData !== null) {
        status = `(${getPlayerCountLabel(serverData)})`;
        connectData = getCsServerConnectLink(
          server.ip,
          server.port,
          "Instaconnect"
        );
      }

      channelDescription += getTextData(server.name, "left", 10, true);
      channelDescription += getTextData(connectData, "center", 10, true);
      channelDescription += getTextData(status, "center", 10, true);

      channelDescription += "[/tr]\n";
    }

    channelDescription += "[/table][table]\n";

    channelDescription += getSpacerRow(TABLE_WIDTH);
    channelDescription += getHorizontalLineRow();

    if (
      serverDescription.description &&
      serverDescription.description.text.length > 0
    ) {
      channelDescription += getEmptyRow();
      channelDescription += getTextRow(
        serverDescription.description.text,
        "center",
        8
      );
      channelDescription += getEmptyRow();
      channelDescription += getHorizontalLineRow();
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
