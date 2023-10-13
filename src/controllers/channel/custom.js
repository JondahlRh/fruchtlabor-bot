import { TeamSpeak, TeamSpeakClient } from "ts3-nodejs-library";

import CustomChannel from "../../models/functions/CustomChannel.js";

import tsChannelSetPermHelper from "../../utility/tsChannelSetPermHelper.js";

import botMove from "./botMove.js";

/**
 * @param {TeamSpeak} teamspeak Current TeamSpeak Instance
 * @param {TeamSpeakClient} client Client from the Event
 */
const channelCustom = async (teamspeak, client) => {
  if (client.type === 1) return;

  const customChannels = await CustomChannel.find()
    .populate("channelParent")
    .populate("channelGroup");

  const customChannel = customChannels.find(
    (x) => x.channelParent.channelId === +client.cid
  );
  if (customChannel == undefined) return;

  const channelList = await teamspeak.channelList();

  const channelGroupClientList = await teamspeak.channelGroupClientList();

  let tsCustomChannel = channelList
    .filter((x) => +x.pid === +client.cid)
    .find((x) => channelGroupClientList.some((y) => +y.cid === +x.cid));

  if (tsCustomChannel == undefined) {
    const channelNamePrefix = customChannel.prefix && `${customChannel.prefix}`;
    const channelName = channelNamePrefix.concat(" ", client.nickname);

    tsCustomChannel = await teamspeak.channelCreate(channelName, {
      cpid: client.cid,
      channelDeleteDelay: 5,
    });

    await tsChannelSetPermHelper(tsCustomChannel, customChannel.permissions);

    await teamspeak.setClientChannelGroup(
      customChannel.channelGroup.channelgroupId,
      tsCustomChannel.cid,
      client.databaseId
    );
  }

  await teamspeak.clientMove(client, tsCustomChannel.cid);

  await botMove(teamspeak);
};

export default channelCustom;
