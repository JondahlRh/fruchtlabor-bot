import { TeamSpeak } from "ts3-nodejs-library";

import { getTextData } from "modules/bot/utility/descriptionTemplates/data";
import {
  getEmptyRow,
  getHorizontalLineRow,
  getSpacerRow,
  getTextRow,
} from "modules/bot/utility/descriptionTemplates/row";
import { getGeneralUrl } from "modules/bot/utility/descriptionTemplates/url";

import { findOrganizationChannels } from "services/mongodbServices/functions/organizationChannel";

const TABLE_WIDTH = 120;

type JobAd = {
  title: string;
  links: {
    label: string;
    url: string;
  }[];
};

const getJobAdsTable = (jobAd: JobAd) => {
  let description = getTextRow(jobAd.title, "center", 12, true);

  description += "[/table][table]\n";
  for (const link of jobAd.links) {
    description += "[tr]\n";
    description += getTextData(`${link.label}:`, "left", 10, true, 0);
    description += getTextData(`${getGeneralUrl(link.url, "hier")}`);
    description += "[/tr]\n";
  }
  description += "[/table][table]\n";

  return description + getSpacerRow(TABLE_WIDTH);
};

export default async (teamspeak: TeamSpeak) => {
  const organizationChannels = await findOrganizationChannels();

  organizationChannels.forEach(async (organizationChannel) => {
    let channelDescription = "[center][table]\n";
    channelDescription += getHorizontalLineRow();
    channelDescription += getSpacerRow(TABLE_WIDTH);
    channelDescription += getTextRow(
      organizationChannel.title,
      "center",
      16,
      true
    );
    channelDescription += getEmptyRow();
    channelDescription += getTextRow(organizationChannel.body, "center", 12);
    channelDescription += getEmptyRow();
    channelDescription += getHorizontalLineRow();
    channelDescription += getEmptyRow();

    channelDescription += getJobAdsTable(organizationChannel.openJobAds);
    channelDescription += getJobAdsTable(organizationChannel.closedJobAds);

    channelDescription += getHorizontalLineRow();
    channelDescription += getEmptyRow();

    for (const categorie of organizationChannel.categories) {
      channelDescription += getTextRow(
        `${categorie.title}:`,
        "center",
        12,
        true
      );
      for (const link of categorie.links) {
        channelDescription += getTextRow(
          getGeneralUrl(link.url, link.label),
          "center",
          10,
          true
        );
      }
      channelDescription += getEmptyRow();
    }

    channelDescription += getHorizontalLineRow();
    channelDescription += "[/table]\n";

    const channelInfo = await teamspeak.channelInfo(
      organizationChannel.channel.id.toString()
    );
    if (channelInfo.channelDescription === channelDescription) {
      return;
    }
    await teamspeak.channelEdit(organizationChannel.channel.id.toString(), {
      channelDescription,
    });
  });
};
