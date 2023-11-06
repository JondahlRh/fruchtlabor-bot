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

  let tsCustomChannel;
  try {
    const channelGroupClientList = await teamspeak.channelGroupClientList(
      customChannel.channelGroup.channelgroupId,
      null,
      client.databaseId
    );

    tsCustomChannel = channelList.find((x) =>
      channelGroupClientList.some((y) => y.cid === x.cid)
    );
  } catch (error) {}

  if (tsCustomChannel == undefined) {
    const channelName = customChannel.prefix
      ? customChannel.prefix.concat(" - ", client.nickname)
      : client.nickname;
    const slicedChannelName = channelName.slice(-channelName.length, 40);

    tsCustomChannel = await teamspeak.channelCreate(slicedChannelName, {
      cpid: client.cid,
      channelDeleteDelay: 5,
    });

    await tsChannelSetPermHelper(
      teamspeak,
      tsCustomChannel,
      customChannel.permissions
    );

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
