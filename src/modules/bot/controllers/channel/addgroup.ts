import { getAddgroupChannels } from "modules/bot/utility/mongodb";
import { TeamSpeakClient } from "ts3-nodejs-library";

/**
 * @param {TeamSpeakClient} client Client from the Event
 */
const addgroup = async (client: TeamSpeakClient) => {
  const channelAddgroups = await getAddgroupChannels();

  const channelAddgroup = channelAddgroups.find(
    (x) => x.channel.id === +client.cid
  );
  if (channelAddgroup == undefined) return;

  await client.move(String(channelAddgroup.moveChannel.id));

  const hasServergroup = client.servergroups.includes(
    channelAddgroup.servergroup.id.toString()
  );
  if (hasServergroup) {
    await client.delGroups(String(channelAddgroup.servergroup.id));
  } else {
    await client.addGroups(String(channelAddgroup.servergroup.id));

    if (channelAddgroup.message.length > 0) {
      await client.message(channelAddgroup.message);
    }
  }
};

export default addgroup;
