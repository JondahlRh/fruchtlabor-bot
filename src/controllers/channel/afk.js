import { TeamSpeak, TeamSpeakClient } from "ts3-nodejs-library";

import AfkChannel from "../../models/functions/AfkChannel.js";

/**
 * @param {TeamSpeakClient} client
 * @param {{ general: number, micMuted: number, sndMuted: number }} conditions
 */
const checkMove = (client, conditions) => {
  const { general, micMuted, sndMuted } = conditions;

  if (general !== -1 && client.idleTime > general) return general;
  if (micMuted !== -1 && client.inputMuted && client.idleTime > micMuted)
    return micMuted;
  if (sndMuted !== -1 && client.outputMuted && client.idleTime > sndMuted)
    return sndMuted;

  return -1;
};

const checkCollection = (afkChannels, part, client) => {
  const checkChannel = (x) => x.channelId === client.channel;
  const checkChannelParent = (x) => x.channelId === client.channelParent;
  const checkServergroup = (x) =>
    client.servergroups.includes(x.servergroupId.toString());

  return afkChannels.find(
    (afkChannel) =>
      afkChannel[part].channels.some(checkChannel) ||
      afkChannel[part].channelParents.some(checkChannelParent) ||
      afkChannel[part].servergroups.some(checkServergroup)
  );
};

/**
 * @param {TeamSpeak} teamspeak Current TeamSpeak Instance
 */
const channelAfk = async (teamspeak) => {
  const defaultMove = await AfkChannel.findOne({ isDefault: true })
    .populate("ignore")
    .populate("moveChannel");

  const afkChannels = await AfkChannel.find({ isDefault: false })
    .populate("moveChannel")
    .populate({
      path: "ignore",
      populate: [
        { path: "channels" },
        { path: "channelParents" },
        { path: "servergroups" },
      ],
    })
    .populate({
      path: "apply",
      populate: [
        { path: "channels" },
        { path: "channelParents" },
        { path: "servergroups" },
      ],
    });

  const clientList = await teamspeak.clientList();
  const channelList = await teamspeak.channelList();

  for (const listClient of clientList) {
    if (listClient.type === 1) continue;

    const channel = channelList.find((c) => c.cid === listClient.cid);

    const clientData = {
      channel: +channel.cid,
      channelParent: +channel.pid,
      servergroups: listClient.servergroups,
    };

    const ignore = checkCollection(afkChannels, "ignore", clientData);
    if (ignore != undefined) continue;

    const apply = checkCollection(afkChannels, "apply", clientData);
    const afkChannel = apply != undefined ? apply : defaultMove;

    const maxIdleTime = checkMove(listClient, afkChannel.conditions);
    const maxIdleTimeMinutes = Math.floor(maxIdleTime / 1000 / 60);
    if (maxIdleTime === -1) continue;
    if (+listClient.cid === afkChannel.moveChannel.channelId) continue;

    await listClient.move(afkChannel.moveChannel.channelId);
    await listClient.message(
      `Du warst über ${maxIdleTimeMinutes} Minuten abwesend und wurdest in den Afk Channel gemoved!`
    );
  }
};

export default channelAfk;
