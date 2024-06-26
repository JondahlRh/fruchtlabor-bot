import { TeamSpeakClient } from "ts3-nodejs-library";

import { cachedFindOneAddgroupChannelByChannelId } from "services/mongodbServices/functions/addgroupChannel";

export default async function addgroupChannel(client: TeamSpeakClient) {
  const channelAddgroup = await cachedFindOneAddgroupChannelByChannelId(
    +client.cid
  );
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
}
