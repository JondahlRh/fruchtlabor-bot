import { TeamSpeak, TeamSpeakClient } from "ts3-nodejs-library";

import tsChannelSetPermHelper from "modules/bot/utility/tsChannelSetPermHelper";

import { cachedFindOneCustomChannelByChannelId } from "services/mongodbServices/functions/customChannel";

import botMove from "../move/bot";

const CHANNEL_NAME_MAX_LENGTH = 40;
const CHANNEL_DELETE_DELAY = 5;

export default async function customChannel(
  teamspeak: TeamSpeak,
  client: TeamSpeakClient
) {
  if (client.type === 1) return;

  const customChannel = await cachedFindOneCustomChannelByChannelId(
    +client.cid
  );
  if (customChannel === null) return;

  const channelList = await teamspeak.channelList();

  let tsCustomChannel;
  try {
    const channelGroupClientList = await teamspeak.channelGroupClientList(
      customChannel.channelGroup.id.toString(),
      undefined,
      client.databaseId
    );

    tsCustomChannel = channelList.find((x) => {
      return (
        x.pid === customChannel.channelParent.id.toString() &&
        channelGroupClientList.some((y) => y.cid === x.cid)
      );
    });
  } catch (error) {}

  if (tsCustomChannel == undefined) {
    const channelName = customChannel.prefix
      ? customChannel.prefix.concat(" - ", client.nickname)
      : client.nickname;
    const slicedChannelName = channelName.slice(
      -channelName.length,
      CHANNEL_NAME_MAX_LENGTH
    );

    tsCustomChannel = await teamspeak.channelCreate(slicedChannelName, {
      cpid: customChannel.channelParent.id.toString(),
      channelDeleteDelay: CHANNEL_DELETE_DELAY,
    });

    await tsChannelSetPermHelper(
      teamspeak,
      tsCustomChannel,
      customChannel.permissions
    );

    await teamspeak.setClientChannelGroup(
      customChannel.channelGroup.id.toString(),
      tsCustomChannel.cid,
      client.databaseId
    );
  }

  await teamspeak.clientMove(client, tsCustomChannel.cid);

  await botMove(teamspeak);
}
