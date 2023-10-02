import {
  TeamSpeak,
  TeamSpeakChannel,
  TeamSpeakClient,
} from "ts3-nodejs-library";

import AfkChannel from "../../models/functions/AfkChannel.js";
import IgnorePack from "../../models/general/IgnorePack.js";

/**
 * @param {TeamSpeakClient} client
 * @param {TeamSpeakChannel} channel
 * @param {{ general: number, micMuted: number, sndMuted: number }} conditions
 * @param {string} ignoreId
 */
const checkMove = async (client, channel, conditions, ignoreId) => {
  const ignore = await IgnorePack.findById(ignoreId)
    .populate("channels")
    .populate("channelParents")
    .populate("servergroups");

  if (
    ignore.servergroups.some((x) =>
      client.servergroups.includes(x.servergroupId.toString())
    ) ||
    ignore.channels.some((x) => x.channelId === +client.cid) ||
    ignore.channelParents.some((x) => x.channelId === +channel.pid)
  ) {
    return -1;
  }

  const { general, micMuted, sndMuted } = conditions;

  if (general !== -1 && client.idleTime > general) return general;
  if (micMuted !== -1 && client.inputMuted && client.idleTime > micMuted)
    return micMuted;
  if (sndMuted !== -1 && client.outputMuted && client.idleTime > sndMuted)
    return sndMuted;

  return -1;
};

/**
 * @param {TeamSpeak} teamspeak Current TeamSpeak Instance
 */
const channelAfk = async (teamspeak) => {
  const defaultMove = await AfkChannel.findOne({ isDefault: true })
    .populate("ignore")
    .populate("moveChannel");

  const afkChannels = await AfkChannel.find({ isDefault: false })
    .populate("ignore")
    .populate("moveChannel")
    .populate("channels")
    .populate("channelParents");

  const clientList = await teamspeak.clientList();
  const channelList = await teamspeak.channelList();

  for (const listClient of clientList) {
    if (listClient.type === 1) continue;

    const channel = channelList.find((c) => c.cid === listClient.cid);

    const afkChannel =
      afkChannels.find(
        (afkChannel) =>
          afkChannel.channels.some((x) => x.channelId === +channel.cid) ||
          afkChannel.channelParents.some((x) => x.channelId === +channel.pid)
      ) || defaultMove;

    const maxIdleTime = await checkMove(
      listClient,
      channel,
      afkChannel.conditions,
      afkChannel.ignore.id
    );
    const maxIdleTimeMinutes = Math.floor(maxIdleTime / 1000 / 60);

    if (
      maxIdleTime !== -1 &&
      +listClient.cid !== afkChannel.moveChannel.channelId
    ) {
      await listClient.move(afkChannel.moveChannel.channelId);
      await listClient.message(
        `Du warst über ${maxIdleTimeMinutes} Minuten abwesend und wurdest in den Afk Channel gemoved!`
      );
    }
  }
};

export default channelAfk;
