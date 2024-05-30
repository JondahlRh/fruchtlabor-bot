import { TeamSpeak } from "ts3-nodejs-library";

import {
  getEmptyRow,
  getHorizontalLineRow,
  getSpacerRow,
  getTextRow,
} from "modules/bot/utility/descriptionTemplates/row";
import { getGeneralUrl } from "modules/bot/utility/descriptionTemplates/url";

import { findBlackboardChannels } from "services/mongodbServices/functions/blackboardChannel";

const TABLE_WIDTH = 120;

export default async (teamspeak: TeamSpeak) => {
  const blackboardChannels = await findBlackboardChannels();

  blackboardChannels.forEach(async (blackboardChannel) => {
    let channelDescription = "[center][table]\n";
    channelDescription += getHorizontalLineRow();
    channelDescription += getSpacerRow(TABLE_WIDTH);
    channelDescription += getTextRow(
      blackboardChannel.title,
      "center",
      16,
      true
    );
    channelDescription += getEmptyRow();
    channelDescription += getTextRow(blackboardChannel.body, "center", 12);
    channelDescription += getEmptyRow();
    channelDescription += getHorizontalLineRow();
    channelDescription += getEmptyRow();

    for (const news of blackboardChannel.news) {
      channelDescription += getTextRow(news.title, "center", 12, true);

      const row = `${news.link.label} ${getGeneralUrl(news.link.url, "hier")}`;
      channelDescription += getTextRow(row);

      channelDescription += getEmptyRow();
    }

    channelDescription += getHorizontalLineRow();
    channelDescription += getEmptyRow();

    for (const news of blackboardChannel.generals) {
      channelDescription += getTextRow(news.title, "center", 12, true);

      const row = `${news.link.label} ${getGeneralUrl(news.link.url, "hier")}`;
      channelDescription += getTextRow(row);

      channelDescription += getEmptyRow();
    }

    channelDescription += getHorizontalLineRow();
    channelDescription += "[/table]\n";

    const channelInfo = await teamspeak.channelInfo(
      blackboardChannel.channel.id.toString()
    );
    if (channelInfo.channelDescription === channelDescription) {
      return;
    }
    await teamspeak.channelEdit(blackboardChannel.channel.id.toString(), {
      channelDescription,
    });
  });
};
