import { TeamSpeak } from "ts3-nodejs-library";

import { TsCollectionType } from "models/teamspeak/TsCollection";

import {
  getHorizontalLineData,
  getTextData,
} from "modules/bot/utility/descriptionTemplates/data";
import {
  getEmptyRow,
  getHorizontalLineRow,
  getSpacerRow,
  getTextRow,
} from "modules/bot/utility/descriptionTemplates/row";
import { getClientUrl } from "modules/bot/utility/descriptionTemplates/url";
import {
  ClientData,
  clientMatchesCollectionsSorted,
} from "modules/bot/utility/tsCollectionHelper";

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
    channelDescription += getHorizontalLineRow();
    channelDescription += getSpacerRow(120);
    channelDescription += getTextRow(onlineChannel.title, "center", 16, true);
    channelDescription += getEmptyRow();
    channelDescription += getHorizontalLineRow();
    channelDescription += getEmptyRow();
    channelDescription += "[/table][table]\n";

    for (const servergroup of onlineChannel.servergroups) {
      channelDescription += "[tr]\n";
      channelDescription += getTextData(servergroup.name, "center", 12, true);
      channelDescription += getTextData("Status", "center", 12, true);
      channelDescription += "[/tr]\n";

      channelDescription += "[tr]\n";
      channelDescription += getHorizontalLineData();
      channelDescription += getHorizontalLineData();
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

        const clientUrl = getClientUrl(
          serverGroupClient.clientNickname,
          serverGroupClient.clientUniqueIdentifier
        );
        channelDescription += getTextData(clientUrl, "left");
        channelDescription += getTextData(status);

        channelDescription += "[/tr]\n";
      }

      channelDescription += getEmptyRow();
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
