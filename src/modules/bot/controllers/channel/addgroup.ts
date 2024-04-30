import { findOneAddgroupChannel } from "services/mongodbServices/functions";
import { TeamSpeakClient } from "ts3-nodejs-library";

const addgroup = async (client: TeamSpeakClient) => {
  const channelAddgroup = await findOneAddgroupChannel(+client.cid);
  if (channelAddgroup === null) return;

  await client.move(String(channelAddgroup.moveChannel.id));

  const hasServergroup = client.servergroups.includes(
    channelAddgroup.servergroup.id.toString()
  );
  if (hasServergroup) {
    await client.delGroups(String(channelAddgroup.servergroup.id));
    return;
  }

  await client.addGroups(String(channelAddgroup.servergroup.id));

  if (channelAddgroup.message.length > 0) {
    await client.message(channelAddgroup.message);
  }
};

export default addgroup;
