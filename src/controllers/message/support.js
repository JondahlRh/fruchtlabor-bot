import { TeamSpeak, TeamSpeakClient } from "ts3-nodejs-library";

import SupportMessage from "../../models/functions/SupportMessage.js";

/**
 * @param {TeamSpeak} teamspeak Current TeamSpeak Instance
 * @param {TeamSpeakClient} client Client from the Event
 */
const messageSupport = async (teamspeak, client) => {
  if (client.type === 1) return;

  const supportMessages = await SupportMessage.find()
    .populate("channel")
    .populate("contactServergroups")
    .populate({
      path: "ignore",
      populate: [
        { path: "channels" },
        { path: "channelParents" },
        { path: "servergroups" },
      ],
    })
    .populate({
      path: "doNotDisturb",
      populate: [
        { path: "channels" },
        { path: "channelParents" },
        { path: "servergroups" },
      ],
    })
    .populate("specials.servergroup")
    .populate("specials.contactServergroups");

  const supportMessage = supportMessages.find(
    (x) => x.channel.channelId === +client.cid
  );
  if (supportMessage == undefined) return;

  const clientList = await teamspeak.clientList();
  const channelList = await teamspeak.channelList();

  const specialContact = supportMessage.specials.find((x) =>
    client.servergroups.includes(x.servergroup.servergroupId.toString())
  );
  const contactServergroups = specialContact
    ? specialContact.contactServergroups
    : supportMessage.contactServergroups;

  const filterListClient = (listClient, collection) => {
    const { channels, channelParents, servergroups } = collection;

    const isSupporter = listClient.servergroups.some((x) =>
      contactServergroups.some((y) => y.servergroupId === +x)
    );

    const channel = channelList.find((c) => c.cid === listClient.cid);
    return (
      isSupporter &&
      !channels.some((x) => x.channelId === +listClient.cid) &&
      !channelParents.some((x) => x.channelId === +channel.pid) &&
      !servergroups.some((x) =>
        listClient.servergroups.some((y) => x.servergroupId === +y)
      )
    );
  };

  const supportClientsContact = clientList.filter((listClient) =>
    filterListClient(listClient, supportMessage.ignore)
  );

  const supportClientsListed = clientList.filter((listClient) =>
    filterListClient(listClient, supportMessage.doNotDisturb)
  );

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

  for (const supportClient of supportClientsListed) {
    const otherSupporterString = supportClientsListed
      .filter((cl) => cl !== supportClient)
      .map((cl) => clientString(cl.uniqueIdentifier, cl.nickname))
      .join(", ");

    let messageSuffix;
    if (supportClientsListed.length === 1) {
      messageSuffix = "(Keine weiteren Supporter kontaktiert)";
    } else if (supportClientsListed.length === 2) {
      messageSuffix = `(Dieser weitere Supporter wurde kontaktiert: ${otherSupporterString})`;
    } else {
      messageSuffix = `(Diese weiteren Supporter wurden kontaktiert: ${otherSupporterString})`;
    }

    supportClient.message(messageBody + messageSuffix);
  }

  const supporterString = supportClientsListed
    .map((cl) => clientString(cl.uniqueIdentifier, cl.nickname))
    .join(", ");

  for (const supportClient of supportClientsContact) {
    let messageSuffix;
    if (supporterString.length === 0) {
      messageSuffix = "(Kein Supporter wurde kontaktiert)";
    } else if (supportClientsListed.length === 1) {
      messageSuffix = `(Dieser Supporter wurde kontaktiert: ${supporterString})`;
    } else {
      messageSuffix = `(Diese Supporter wurden kontaktiert: ${supporterString})`;
    }

    supportClient.message(
      `[color=#111111][b]Der User weiß nichts von dir:[/b][/color] ${messageBody}${messageSuffix}`
    );
  }

  let message = `Hallo ${client.nickname}, `;
  if (supportClientsListed.length === 0) {
    message += `es ist zur Zeit leider kein Supporter erreichbar. Komm gerne später noch einmal. ${supportMessage.messageBody}`;
  } else {
    const followUpStr =
      supportClientsListed.length === 1 ? "Folgender" : "Folgende";
    message += `bitte warte kurz, wir helfen dir gleich. ${supportMessage.messageBody} ${followUpStr} Supporter wurden kontaktiert: ${supporterString}`;
  }

  client.message(message);
};

export default messageSupport;
