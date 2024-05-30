import { TeamSpeak } from "ts3-nodejs-library";

import {
  emptyRow,
  getBodyRows,
  getDataEntry,
  getListRow,
  getSpacerRow,
  getSubtitleRow,
  getTitleRow,
  getUrlLink,
  horizontalRow,
} from "services/channelDescriptionService";
import { findTeamChannels } from "services/mongodbServices/functions/teamChannel";

export default async (teamspeak: TeamSpeak) => {
  const teamChannels = await findTeamChannels();

  teamChannels.forEach(async (teamChannel) => {
    let channelDescription = "[center][table]\n";
    channelDescription += horizontalRow;
    channelDescription += getSpacerRow(150);
    channelDescription += getTitleRow(`${teamChannel.type} von FruchtLabor`);

    if (teamChannel.links.length > 0) {
      channelDescription += "[/table][table]\n";

      for (const link of teamChannel.links) {
        channelDescription += "[tr]\n";
        channelDescription += getDataEntry(`${link.label}:`, "right");
        channelDescription += getDataEntry(
          getUrlLink(link.link, "hier"),
          "left"
        );
        channelDescription += "[/tr]\n";
      }

      channelDescription += "[/table][table]\n";
    }

    channelDescription += getSpacerRow(150);
    channelDescription += horizontalRow;

    channelDescription += "[/table][table]\n";

    channelDescription += getSpacerRow(60);
    channelDescription += getSubtitleRow("Aktuelles LineUp:");
    channelDescription += horizontalRow;
    channelDescription += getListRow(teamChannel.players, 5, "TBA");
    channelDescription += getSpacerRow(60);
    channelDescription += getSubtitleRow("Stand-Ins:");
    channelDescription += horizontalRow;
    channelDescription += getListRow(teamChannel.standins, 1, "TBA");

    channelDescription += "[/table][table]\n";
    channelDescription += getSpacerRow(150);
    channelDescription += horizontalRow;
    channelDescription += "[/table][table]\n";

    channelDescription += getSpacerRow(60);
    channelDescription += getSubtitleRow("Trainingszeiten:");
    channelDescription += horizontalRow;
    channelDescription += getListRow(teamChannel.trainingTimes, 1, "flexibel");

    channelDescription += "[/table][table]\n";
    channelDescription += getSpacerRow(150);
    channelDescription += horizontalRow;

    if (teamChannel.extraBody.length > 0) {
      channelDescription += emptyRow;
      channelDescription += getBodyRows(teamChannel.extraBody);
      channelDescription += emptyRow;
      channelDescription += horizontalRow;
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
};
