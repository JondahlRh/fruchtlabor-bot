import { TeamSpeak } from "ts3-nodejs-library";

import { Entry, InfoDescriptionType } from "models/functions/InfoDescription";

import { getTextData } from "modules/bot/utility/descriptionTemplates/data";
import {
  getEmptyRow,
  getHorizontalLineRow,
  getSpacerRow,
  getTextRow,
} from "modules/bot/utility/descriptionTemplates/row";
import { getGeneralUrl } from "modules/bot/utility/descriptionTemplates/url";

import { cachedFindInfoDescriptions } from "services/mongodbServices/functions/infoDescription";

const TABLE_WIDTH = 120;

const getEntry = (entry: Entry) => {
  let description = getTextRow(entry.title, "center", 14, true);

  if (entry.subtitle) {
    description += getTextRow(entry.subtitle, "center", 12);
  }

  if (entry.type === "table") {
    description += getEmptyRow();
    description += "[/table][table]\n";
  }
  for (const link of entry.links) {
    if (entry.type === "linkOnly") {
      const url = getGeneralUrl(link.url, link.label);
      description += getTextRow(url, "center", 10, true);
    }

    if (entry.type === "hereLabel") {
      const url = getGeneralUrl(link.url, "hier");
      description += getTextRow(`${link.label} ${url}`, "center", 10, true);
    }

    if (entry.type === "table") {
      const url = getGeneralUrl(link.url, "hier");

      description += "[tr]\n";
      description += getTextData(link.label, "left", 10, true, 0);
      description += getTextData(url);
      description += "[/tr]\n";
    }
  }
  if (entry.type === "table") {
    description += "[/table][table]\n";
    description += getSpacerRow(TABLE_WIDTH);
  }

  return description;
};

export const singleInfoDescription = async (
  teamspeak: TeamSpeak,
  infoDescription: InfoDescriptionType
) => {
  const { title, subtitle, description, channel, entrySections } =
    infoDescription;

  let channelDescription = "[center][table]\n";
  channelDescription += getHorizontalLineRow();
  channelDescription += getSpacerRow(TABLE_WIDTH);
  channelDescription += getTextRow(title, "center", 16, true);
  channelDescription += getEmptyRow();

  if (subtitle) {
    channelDescription += getTextRow(subtitle, "center", 12);
    channelDescription += getEmptyRow();
  }

  channelDescription += getHorizontalLineRow();
  channelDescription += getEmptyRow();

  if (description) {
    channelDescription += getTextRow(description, "center", 10);
    channelDescription += getEmptyRow();
    channelDescription += getHorizontalLineRow();
    channelDescription += getEmptyRow();
  }

  for (const entrySection of entrySections) {
    for (const entry of entrySection) {
      channelDescription += getEntry(entry);
      channelDescription += getEmptyRow();
    }
    channelDescription += getHorizontalLineRow();
    channelDescription += getEmptyRow();
  }

  const channelInfo = await teamspeak.channelInfo(channel.id.toString());
  if (channelInfo.channelDescription === channelDescription) return;
  await teamspeak.channelEdit(channel.id.toString(), { channelDescription });
};

export default async function infoDescription(teamspeak: TeamSpeak) {
  const infoDescriptions = await cachedFindInfoDescriptions();

  for (const infoDescription of infoDescriptions) {
    singleInfoDescription(teamspeak, infoDescription);
  }
}
