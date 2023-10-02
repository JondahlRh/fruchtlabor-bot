import {
  TeamSpeak,
  TeamSpeakChannel,
  TeamSpeakClient,
} from "ts3-nodejs-library";

import OnlineChannel from "../../models/functions/OnlineChannel.js";
import Status from "../../models/general/Status.js";

/**
 * @param {TeamSpeakClient} client
 * @param {TeamSpeakChannel} channel
 * @return {Promise<string>}
 */
const getStatus = async (client, channel) => {
  if (!client) return "[color=#ee2222]offline[/color]";

  const statusList = await Status.find()
    .populate("channels")
    .populate("channelParents")
    .populate("servergroups");

  for (const status of statusList) {
    if (status.channels.some((x) => x.channelId === +channel.cid))
      return status.label;
  }
  for (const status of statusList) {
    if (status.channelParents.some((x) => x.channelId === +channel.pid))
      return status.label;
  }
  for (const status of statusList) {
    const servergroupmatches = status.servergroups.some((x) =>
      client.servergroups.some((clsg) => +clsg === x.servergroupId)
    );
    if (servergroupmatches) return status.label;
  }

  return "[color=#44dd44]online[/color]";
};

/**
 * @param {string} clientName
 * @param {string} clientUId
 * @param {string} status
 */
const getDescClient = (clientName, clientUId, status) => {
  return `[tr][td][URL=client:///${clientUId}]${clientName} [/URL][/td][td][center]${status}[/td][/tr]`;
};

/**
 * @param {string} title
 * @param {string[]} clients
 */
const getDescGroup = (title, clients) => {
  const clientsString =
    clients.length === 0
      ? `\n[tr][td][center] - [/center][/td][td][center] none [/td][/tr]`
      : clients.join("");

  return `[tr]
[th][size=12] ${title} [/size][/th]
[td][center][size=12] Status [/size][/td]
[/tr]
[tr]
[td][hr][/td]
[td][hr][/td]
[/tr]${clientsString}
[tr][/tr]`;
};

/**
 * @param {string} title
 * @param {string[]} descGroups
 */
const getDescription = (title, descGroups) => {
  return `[center][table]

[tr]
[td][hr][/td]
[/tr]

[tr][/tr]

[tr]
[th][size=16] ${title} [/size][/th]
[/tr]

[tr][/tr]

[tr]
[td][hr][/td]
[/tr]
[tr]
[td]                                                                                                    [/td]
[/tr]

[/table][table]
${descGroups.join("")}`;
};

/**
 * @param {TeamSpeak} teamspeak Current TeamSpeak Instance
 */
const channelOnline = async (teamspeak) => {
  const onlineChannels = await OnlineChannel.find()
    .populate("channel")
    .populate("servergroups");

  for (const onlineChannel of onlineChannels) {
    const descGroups = [];
    for (const servergroup of onlineChannel.servergroups) {
      const serverGroupClientList = await teamspeak.serverGroupClientList(
        servergroup.servergroupId
      );

      const descClients = [];
      for (const serverGroupClient of serverGroupClientList) {
        const client = await teamspeak.getClientByUid(
          serverGroupClient.clientUniqueIdentifier
        );

        const channel = await teamspeak.getChannelById(client?.cid);

        const status = await getStatus(client, channel);

        descClients.push(
          getDescClient(
            serverGroupClient.clientNickname,
            serverGroupClient.clientUniqueIdentifier,
            status
          )
        );
      }
      descGroups.push(getDescGroup(servergroup.name, descClients));
    }
    const description = getDescription(onlineChannel.title, descGroups);

    const channelInfo = await teamspeak.channelInfo(
      onlineChannel.channel.channelId
    );
    if (channelInfo.channelDescription === description) return;

    await teamspeak.channelEdit(onlineChannel.channel.channelId, {
      channelDescription: description,
    });
  }
};

export default channelOnline;
