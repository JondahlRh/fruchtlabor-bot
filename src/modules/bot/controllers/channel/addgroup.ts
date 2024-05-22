import { TeamSpeakClient } from "ts3-nodejs-library";

import { findOneAddgroupChannelByChannelId } from "services/mongodbServices/functions/addgroupChannel";

const addgroup = async (client: TeamSpeakClient) => {
  const channelAddgroup = await findOneAddgroupChannelByChannelId(+client.cid);
  if (channelAddgroup === null) return;

  await client.move(channelAddgroup.moveChannel.id.toString());

  const hasServergroup = client.servergroups.includes(
    channelAddgroup.servergroup.id.toString()
  );
  if (hasServergroup) {
    await client.delGroups(channelAddgroup.servergroup.id.toString());
    return;
  }

  await client.addGroups(channelAddgroup.servergroup.id.toString());

  if (channelAddgroup.message.length > 0) {
    await client.message(channelAddgroup.message);
  }
};

export default addgroup;
