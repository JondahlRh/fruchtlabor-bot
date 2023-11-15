import { TeamSpeak, TeamSpeakClient } from "ts3-nodejs-library";

import { ClientData } from "../../types/general";
import { getSupportMessages } from "../../utility/mongodb";
import { clientMatchesCollection } from "../../utility/tsCollectionHelper";

/**
 * @param {TeamSpeak} teamspeak Current TeamSpeak Instance
 * @param {TeamSpeakClient} client Client from the Event
 */
const messageSupport = async (
  teamspeak: TeamSpeak,
  client: TeamSpeakClient
) => {
  if (client.type === 1) return;

  const supportMessages = await getSupportMessages();

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

  const supportClientsListed: TeamSpeakClient[] = [];
  const supportClientsContact: TeamSpeakClient[] = [];

  clientList.forEach((listClient) => {
    const isSupporter = listClient.servergroups.some((x) =>
      contactServergroups.some((y) => y.servergroupId === +x)
    );
    if (!isSupporter) return;

    const channel = channelList.find((c) => c.cid === listClient.cid);
    const clientData: ClientData = {
      channel: channel?.cid,
      channelParent: channel?.pid,
      servergroups: listClient.servergroups,
    };

    const isIgnore = supportMessage.ignore.some((x) =>
      clientMatchesCollection(clientData, x)
    );
    if (isIgnore) return supportClientsContact.push(listClient);

    const isDND = supportMessage.doNotDisturb.some((x) =>
      clientMatchesCollection(clientData, x)
    );
    if (!isDND) supportClientsListed.push(listClient);
  });

  const clientString = (uid: string, name: string) =>
    `[URL=client:///${uid}]${name}[/URL]`;

  const clientChannel = channelList.find((c) => c.cid === client.cid)?.name;
  const clientName = clientString(client.uniqueIdentifier, client.nickname);

  const messagePrefix = specialContact
    ? `[color=#${specialContact.messagePrefix.color}][b]${specialContact.messagePrefix.text}:[/b][/color] `
    : "";
  const messageBody = `${messagePrefix}Der User ${clientName} wartet in dem Channel "${clientChannel}" `;

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
      `[color=#888888][b]INFO[/b] - [/color]${messageBody}${messageSuffix}`
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
