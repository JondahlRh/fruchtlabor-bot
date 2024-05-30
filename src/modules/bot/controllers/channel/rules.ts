import { parse } from "node-html-parser";
import { TeamSpeak } from "ts3-nodejs-library";
import { z } from "zod";

import { findOneTsRulesChannel } from "services/mongodbServices/teamspeak/tsChannel";

const HR_AND_SPACER = "[tr][td][hr][/td][/tr][tr][/tr]";

const channelRules = async (teamspeak: TeamSpeak) => {
  const rulesChannel = await findOneTsRulesChannel();
  if (!rulesChannel) return;

  const rawData = await fetch(process.env.FUNCTIONS_RULES_URL);
  const jsonData = await rawData.text();
  const parsedData = z.string().parse(jsonData);

  const root = parse(parsedData);

  const htmlContent = root.querySelector(".messageText")?.innerHTML;
  if (!htmlContent) return;

  const description =
    "[center][table][tr]" +
    htmlContent
      .replace(/\t/g, "")
      .replace(/<span[^>]*>/g, "")
      .replaceAll("</span>", "")
      .replaceAll("<br>", "")
      .replaceAll("<strong>", "")
      .replaceAll("</strong>", "")
      .replaceAll("<h2>", HR_AND_SPACER + "[tr][th][size=16]")
      .replaceAll("</h2>", "[/th][/tr][tr][/tr]" + HR_AND_SPACER)
      .replaceAll("<p>", "[tr][th][size=12]")
      .replaceAll("</p>", "[/th][/tr][tr][/tr]")
      .replaceAll("<ul>", "[tr][td][size=10][list]")
      .replaceAll("</ul>", "[/list][/td][/tr]")
      .replaceAll("<li>", "[*]")
      .replaceAll("</li>", "\n")
      .replace(/<a[^>]*>TeamSpeak<\/a>/g, "TeamSpeak")
      .replace(/<a[^>]*>Discord<\/a>/g, "Discord")
      .replace(/<a[^>]*>/g, "[url=")
      .replaceAll("</a>", "]hier[/url]") +
    "[/table]";

  const channelInfo = await teamspeak.channelInfo(rulesChannel.id.toString());
  if (channelInfo.channelDescription === description) return;

  await teamspeak.channelEdit(rulesChannel.id.toString(), {
    channelDescription: description,
  });
};

export default channelRules;
