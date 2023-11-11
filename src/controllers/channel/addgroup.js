import { TeamSpeakClient } from "ts3-nodejs-library";

import AddgroupChannel from "../../models/functions/AddgroupChannel.js";

/**
 * @param {TeamSpeakClient} client Client from the Event
 */
const addgroup = async (client) => {
  const channelAddgroups = await AddgroupChannel.find()
    .populate("channel")
    .populate("moveChannel")
    .populate("servergroup");

  const channelAddgroup = channelAddgroups.find(
    (x) => x.channel.channelId === +client.cid
  );
  if (channelAddgroup == undefined) return;

  await client.move(channelAddgroup.moveChannel.channelId);

  const hasServergroup = client.servergroups.includes(
    channelAddgroup.servergroup.servergroupId.toString()
  );
  if (hasServergroup) {
    await client.delGroups(channelAddgroup.servergroup.servergroupId);
  } else {
    await client.addGroups(channelAddgroup.servergroup.servergroupId);

    if (channelAddgroup.message.length > 0) {
      await client.message(channelAddgroup.message);
    }
  }
};

export default addgroup;
