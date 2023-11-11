import { TeamSpeak, TeamSpeakClient } from "ts3-nodejs-library";

import AfkChannel from "../../models/functions/AfkChannel.js";
import TsServergroup from "../../models/teamspeak/TsServergroup.js";

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
  const afkChannels = await AfkChannel.find()
    .populate({
      path: "moveChannel",
      populate: [{ path: "member" }, { path: "teammember" }],
    })
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

  const defaultMove = afkChannels.find((x) => x.isDefault);
  const allButDefaultMove = afkChannels.filter((x) => !x.isDefault);

  const clientList = await teamspeak.clientList();
  const channelList = await teamspeak.channelList();
  const tsServergroups = await TsServergroup.find();

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

    const apply = checkCollection(allButDefaultMove, "apply", clientData);
    const afkChannel = apply != undefined ? apply : defaultMove;

    const maxIdleTime = checkMove(listClient, afkChannel.conditions);
    const maxIdleTimeMinutes = Math.floor(maxIdleTime / 1000 / 60);
    if (maxIdleTime === -1) continue;

    const tsServergroup = tsServergroups.find((tsSg) => {
      return (
        tsSg.isTeammember &&
        listClient.servergroups.some((x) => tsSg.servergroupId === +x)
      );
    });

    const moveChannel = tsServergroup?.isTeammember
      ? afkChannel.moveChannel.teammember
      : afkChannel.moveChannel.member;

    if (+listClient.cid === moveChannel.channelId) continue;

    await listClient.move(moveChannel.channelId);
    await listClient.message(
      `Du warst über ${maxIdleTimeMinutes} Minuten abwesend und wurdest in den Afk Channel gemoved!`
    );
  }
};

export default channelAfk;
