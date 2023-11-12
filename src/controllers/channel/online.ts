import { TeamSpeak } from "ts3-nodejs-library";

import { ClientData } from "src/types/general";
import { OnlineChannelType } from "src/types/mongoose/functions";
import { TsCollectionType } from "src/types/mongoose/teamspeak";

import OnlineChannel from "src/models/functions/OnlineChannel";

import { clientMatchesCollectionsSorted } from "src/utility/tsCollectionHelper";

const getStatus = (clientData: ClientData, statusList: TsCollectionType[]) => {
  if (!clientData.channel || !clientData.channelParent) {
    return "[color=#ee2222]offline[/color]";
  }

  const matchedCollection = clientMatchesCollectionsSorted(
    clientData,
    statusList
  );
  if (matchedCollection) {
    return matchedCollection?.label;
  }

  return "[color=#44dd44]online[/color]";
};

const getDescClient = (
  clientName: string,
  clientUId: string,
  status: string
) => {
  return `[tr][td][URL=client:///${clientUId}]${clientName} [/URL][/td][td][center]${status}[/td][/tr]`;
};

const getDescGroup = (title: string, clients: string[]) => {
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

const getDescription = (title: string, descGroups: string[]) => {
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
const channelOnline = async (teamspeak: TeamSpeak) => {
  const onlineChannels: OnlineChannelType[] = await OnlineChannel.find()
    .populate("channel")
    .populate("servergroups")
    .populate({
      path: "collections",
      populate: [
        { path: "channels" },
        { path: "channelParents" },
        { path: "servergroups" },
      ],
    });

  for (const onlineChannel of onlineChannels) {
    const descGroups = [];
    for (const servergroup of onlineChannel.servergroups) {
      const serverGroupClientList = await teamspeak.serverGroupClientList(
        String(servergroup.servergroupId)
      );

      const descClients = [];
      for (const serverGroupClient of serverGroupClientList) {
        const client = await teamspeak.getClientByUid(
          serverGroupClient.clientUniqueIdentifier
        );

        const channel = await teamspeak.getChannelById(client?.cid ?? "");

        const clientData: ClientData = {
          channel: channel?.cid,
          channelParent: channel?.pid,
          servergroups: client?.servergroups ?? [],
        };

        const status = getStatus(clientData, onlineChannel.collections);

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
      String(onlineChannel.channel.channelId)
    );
    if (channelInfo.channelDescription === description) continue;

    await teamspeak.channelEdit(String(onlineChannel.channel.channelId), {
      channelDescription: description,
    });
  }
};

export default channelOnline;
