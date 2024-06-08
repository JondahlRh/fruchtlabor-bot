import { TeamSpeak } from "ts3-nodejs-library";

import { getTextData } from "modules/bot/utility/descriptionTemplates/data";
import {
  getEmptyRow,
  getHorizontalLineRow,
  getListRow,
  getSpacerRow,
  getTextRow,
} from "modules/bot/utility/descriptionTemplates/row";
import { getGeneralUrl } from "modules/bot/utility/descriptionTemplates/url";

import { findTeamChannels } from "services/mongodbServices/functions/teamChannel";

export default async function teamchannelDescription(teamspeak: TeamSpeak) {
  const teamChannels = await findTeamChannels();

  teamChannels.forEach(async (teamChannel) => {
    let channelDescription = "[center][table]\n";
    channelDescription += getHorizontalLineRow();
    channelDescription += getSpacerRow(150);
    channelDescription += getTextRow(
      `${teamChannel.type} von FruchtLabor`,
      "center",
      16,
      true
    );

    if (teamChannel.links.length > 0) {
      channelDescription += "[/table][table]\n";

      for (const link of teamChannel.links) {
        channelDescription += "[tr]\n";

        const url = getGeneralUrl(link.url, "hier");
        channelDescription += getTextData(
          `${link.label}:`,
          "right",
          10,
          false,
          0
        );
        channelDescription += getTextData(url, "left", 10, false, 0);

        channelDescription += "[/tr]\n";
      }

      channelDescription += "[/table][table]\n";
    }

    channelDescription += getSpacerRow(150);
    channelDescription += getHorizontalLineRow();

    channelDescription += "[/table][table]\n";

    channelDescription += getSpacerRow(60);
    channelDescription += getTextRow("Aktuelles LineUp:", "center", 12, true);
    channelDescription += getHorizontalLineRow();
    channelDescription += getListRow(teamChannel.players, 5, "TBA");

    channelDescription += getSpacerRow(60);
    channelDescription += getTextRow("Stand-Ins:", "center", 12, true);
    channelDescription += getHorizontalLineRow();
    channelDescription += getListRow(teamChannel.standins, 1, "TBA");

    channelDescription += "[/table][table]\n";
    channelDescription += getSpacerRow(150);
    channelDescription += getHorizontalLineRow();
    channelDescription += "[/table][table]\n";

    channelDescription += getSpacerRow(60);
    channelDescription += getTextRow("Trainingszeiten:", "center", 12, true);
    channelDescription += getHorizontalLineRow();
    channelDescription += getListRow(teamChannel.trainingTimes, 1, "flexibel");

    channelDescription += "[/table][table]\n";
    channelDescription += getSpacerRow(150);
    channelDescription += getHorizontalLineRow();

    if (teamChannel.extraBody.length > 0) {
      channelDescription += getEmptyRow();
      channelDescription += getTextRow(teamChannel.extraBody, "center", 8);
      channelDescription += getEmptyRow();
      channelDescription += getHorizontalLineRow();
    }

    channelDescription += "[/table][table]\n";

    const channelInfo = await teamspeak.channelInfo(
      teamChannel.channel.id.toString()
    );
    if (channelInfo.channelDescription === channelDescription) {
      return;
    }
    await teamspeak.channelEdit(teamChannel.channel.id.toString(), {
      channelDescription,
    });
  });
}
