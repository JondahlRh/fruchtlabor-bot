import { TeamSpeakClient } from "ts3-nodejs-library";

import { getAddgroupChannels } from "../../utility/mongodb";

/**
 * @param {TeamSpeakClient} client Client from the Event
 */
const addgroup = async (client: TeamSpeakClient) => {
  const channelAddgroups = await getAddgroupChannels();

  const channelAddgroup = channelAddgroups.find(
    (x) => x.channel.channelId === +client.cid
  );
  if (channelAddgroup == undefined) return;

  await client.move(String(channelAddgroup.moveChannel.channelId));

  const hasServergroup = client.servergroups.includes(
    channelAddgroup.servergroup.servergroupId.toString()
  );
  if (hasServergroup) {
    await client.delGroups(String(channelAddgroup.servergroup.servergroupId));
  } else {
    await client.addGroups(String(channelAddgroup.servergroup.servergroupId));

    if (channelAddgroup.message.length > 0) {
      await client.message(channelAddgroup.message);
    }
  }
};

export default addgroup;
