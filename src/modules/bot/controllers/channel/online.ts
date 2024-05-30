import { TeamSpeak } from "ts3-nodejs-library";

import { TsCollectionType } from "models/teamspeak/TsCollection";

import {
  ClientData,
  clientMatchesCollectionsSorted,
} from "modules/bot/utility/tsCollectionHelper";

import {
  emptyRow,
  getClientClicker,
  getDataEntry,
  getDataHorizontal,
  getDataTitle,
  getSpacerRow,
  getTitleRow,
  horizontalRow,
} from "services/channelDescriptionService";
import { findOnlineChannels } from "services/mongodbServices/functions/onlineChannel";

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

const channelOnline = async (teamspeak: TeamSpeak) => {
  const onlineChannels = await findOnlineChannels();

  const clientList = await teamspeak.clientList();
  const channelList = await teamspeak.channelList();

  onlineChannels.forEach(async (onlineChannel) => {
    let channelDescription = "[center][table]\n";
    channelDescription += horizontalRow;
    channelDescription += getSpacerRow(120);
    channelDescription += getTitleRow(onlineChannel.title);
    channelDescription += emptyRow;
    channelDescription += horizontalRow;
    channelDescription += emptyRow;
    channelDescription += "[/table][table]\n";

    for (const servergroup of onlineChannel.servergroups) {
      channelDescription += "[tr]\n";
      channelDescription += getDataTitle(servergroup.name, "center", true, 3);
      channelDescription += getDataTitle("Status", "center", true, 3);
      channelDescription += "[/tr]\n";

      channelDescription += "[tr]\n";
      channelDescription += getDataHorizontal();
      channelDescription += getDataHorizontal();
      channelDescription += "[/tr]\n";

      const serverGroupClientList = await teamspeak.serverGroupClientList(
        servergroup.id.toString()
      );

      serverGroupClientList.sort((a, b) =>
        a.clientNickname.localeCompare(b.clientNickname)
      );

      for (const serverGroupClient of serverGroupClientList) {
        channelDescription += "[tr]\n";

        const client = clientList.find(
          (x) => x.uniqueIdentifier === serverGroupClient.clientUniqueIdentifier
        );
        const channel = channelList.find((x) => x.cid === client?.cid);

        const clientData = {
          channel: channel?.cid,
          channelParent: channel?.pid,
          servergroups: client?.servergroups ?? [],
        };

        const status = getStatus(clientData, onlineChannel.collections);

        channelDescription += getDataEntry(
          getClientClicker(serverGroupClient),
          "left",
          2
        );
        channelDescription += getDataEntry(status, "center");

        channelDescription += "[/tr]\n";
      }

      channelDescription += emptyRow;
    }

    channelDescription += "[/table]\n";

    const channelInfo = await teamspeak.channelInfo(
      onlineChannel.channel.id.toString()
    );
    if (channelInfo.channelDescription === channelDescription) {
      return;
    }
    await teamspeak.channelEdit(onlineChannel.channel.id.toString(), {
      channelDescription,
    });
  });
};

export default channelOnline;
