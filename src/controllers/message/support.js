import { TeamSpeak, TeamSpeakClient } from "ts3-nodejs-library";

import SupportMessage from "../../models/functions/SupportMessage.js";
import IgnorePack from "../../models/general/IgnorePack.js";

/**
 * @param {TeamSpeak} teamspeak Current TeamSpeak Instance
 * @param {TeamSpeakClient} client Client from the Event
 */
const messageSupport = async (teamspeak, client) => {
  if (client.type === 1) return;

  const supportMessages = await SupportMessage.find()
    .populate("channel")
    .populate("contactServergroups")
    .populate("ignore")
    .populate("specials.servergroup")
    .populate("specials.contactServergroups");

  const supportMessage = supportMessages.find(
    (x) => x.channel.channelId === +client.cid
  );
  if (supportMessage == undefined) return;

  const ignore = await IgnorePack.findById(supportMessage.ignore)
    .populate("channels")
    .populate("channelParents")
    .populate("servergroups");

  const clientList = await teamspeak.clientList();
  const channelList = await teamspeak.channelList();

  const ignoreChannels = ignore.channels.map((c) => c.channelId);
  const ignoreChannelParents = ignore.channelParents.map((c) => c.channelId);
  const ignoreServergroups = ignore.servergroups.map((sg) => sg.servergroupId);

  const specialContact = supportMessage.specials.find((x) =>
    client.servergroups.includes(x.servergroup.servergroupId.toString())
  );
  const contactServergroups = specialContact
    ? specialContact.contactServergroups
    : supportMessage.contactServergroups;

  const supportClients = clientList.filter((listClient) => {
    const hasServergroup = listClient.servergroups.some((x) =>
      contactServergroups.some((y) => y.servergroupId === +x)
    );
    const hasIgnoresupport = listClient.servergroups.some((x) =>
      ignoreServergroups.some((y) => y === +x)
    );
    const channel = channelList.find((c) => c.cid === listClient.cid);

    return (
      hasServergroup &&
      !ignoreChannels.includes(+listClient.cid) &&
      !ignoreChannelParents.includes(+channel.pid) &&
      !hasIgnoresupport
    );
  });

  /**
   * @param {string} uid
   * @param {string} name
   */
  const clientString = (uid, name) => `[URL=client:///${uid}]${name}[/URL]`;

  const clientChannel = channelList.find((c) => c.cid === client.cid).name;
  const clientName = clientString(client.uniqueIdentifier, client.nickname);

  const messagePrefix = specialContact
    ? `[color=#${specialContact.messagePrefix.color}][b]${specialContact.messagePrefix.text}:[/b][/color]`
    : "";
  const messageBody = `${messagePrefix} Der User ${clientName} wartet in dem Channel "${clientChannel}" `;

  for (const supportClient of supportClients) {
    const otherSupporterString = supportClients
      .filter((cl) => cl !== supportClient)
      .map((cl) => clientString(cl.uniqueIdentifier, cl.nickname))
      .join(", ");

    let messageSuffix;
    if (supportClients.length === 1) {
      messageSuffix = "(Keine weiteren Supporter kontaktiert)";
    } else if (supportClients.length === 2) {
      messageSuffix = `(Dieser weitere Supporter wurde kontaktiert: ${otherSupporterString})`;
    } else {
      messageSuffix = `(Diese weiteren Supporter wurden kontaktiert: ${otherSupporterString})`;
    }

    supportClient.message(messageBody + messageSuffix);
  }

  const supporterString = supportClients
    .map((cl) => clientString(cl.uniqueIdentifier, cl.nickname))
    .join(", ");

  let message = `Hallo ${client.nickname}, `;
  if (supportClients.length === 0) {
    message += `es ist zur Zeit leider kein Supporter erreichbar. Komm gerne später noch einmal. ${supportMessage.messageBody}`;
  } else {
    const followUpStr = supportClients.length === 1 ? "Folgender" : "Folgende";
    message += `bitte warte kurz, wir helfen dir gleich. ${supportMessage.messageBody} ${followUpStr} Supporter wurden kontaktiert: ${supporterString}`;
  }

  client.message(message);
};

export default messageSupport;
