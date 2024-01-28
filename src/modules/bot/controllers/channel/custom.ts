import { TeamSpeak, TeamSpeakClient } from "ts3-nodejs-library";

import { getCustomChannels } from "../../utility/mongodb";
import tsChannelSetPermHelper from "../../utility/tsChannelSetPermHelper";
import botMove from "./botMove";

/**
 * @param {TeamSpeak} teamspeak Current TeamSpeak Instance
 * @param {TeamSpeakClient} client Client from the Event
 */
const channelCustom = async (teamspeak: TeamSpeak, client: TeamSpeakClient) => {
  if (client.type === 1) return;

  const customChannels = await getCustomChannels();

  const customChannel = customChannels.find(
    (x) => x.channelParent.id === +client.cid
  );
  if (customChannel == undefined) return;

  const channelList = await teamspeak.channelList();

  let tsCustomChannel;
  try {
    const channelGroupClientList = await teamspeak.channelGroupClientList(
      String(customChannel.channelGroup.id),
      undefined,
      client.databaseId
    );

    tsCustomChannel = channelList.find((x) => {
      return (
        x.pid === client.cid &&
        channelGroupClientList.some((y) => y.cid === x.cid)
      );
    });
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
      String(customChannel.channelGroup.id),
      tsCustomChannel.cid,
      client.databaseId
    );
  }

  await teamspeak.clientMove(client, tsCustomChannel.cid);

  await botMove(teamspeak);
};

export default channelCustom;
