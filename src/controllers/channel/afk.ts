import { TeamSpeak, TeamSpeakClient } from "ts3-nodejs-library";

import AfkChannel from "../../models/functions/AfkChannel";
import TsServergroup from "../../models/teamspeak/TsServergroup";

import { AfkChannelType } from "../../types/mongoose/functions";
import {
  TsChannelType,
  TsServergroupType,
} from "../../types/mongoose/teamspeak";

/**
 * @param {TeamSpeakClient} client
 * @param {{ general: number, micMuted: number, sndMuted: number }} conditions
 */
const checkMove = (
  client: TeamSpeakClient,
  conditions: { general: number; micMuted: number; sndMuted: number }
) => {
  const { general, micMuted, sndMuted } = conditions;

  if (general !== -1 && client.idleTime > general) return general;
  if (micMuted !== -1 && client.inputMuted && client.idleTime > micMuted)
    return micMuted;
  if (sndMuted !== -1 && client.outputMuted && client.idleTime > sndMuted)
    return sndMuted;

  return -1;
};

const checkCollection = (
  afkChannels: AfkChannelType[],
  part: "apply" | "ignore",
  client: { channel: number; channelParent: number; servergroups: string[] }
) => {
  const checkChannel = (x: TsChannelType) => x.channelId === client.channel;
  const checkChannelParent = (x: TsChannelType) =>
    x.channelId === client.channelParent;
  const checkServergroup = (x: TsServergroupType) =>
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
const channelAfk = async (teamspeak: TeamSpeak) => {
  const afkChannels: AfkChannelType[] = await AfkChannel.find()
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
  if (!defaultMove) throw new Error("Afk Channel default is not definded!");

  const allButDefaultMove = afkChannels.filter((x) => !x.isDefault);

  const clientList = await teamspeak.clientList();
  const channelList = await teamspeak.channelList();
  const tsServergroups: TsServergroupType[] = await TsServergroup.find();

  for (const listClient of clientList) {
    if (listClient.type === 1) continue;

    const channel = channelList.find((c) => c.cid === listClient.cid);

    const clientData = {
      channel: Number(channel?.cid),
      channelParent: Number(channel?.pid),
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

    await listClient.move(String(moveChannel.channelId));
    await listClient.message(
      `Du warst über ${maxIdleTimeMinutes} Minuten abwesend und wurdest in den Afk Channel gemoved!`
    );
  }
};

export default channelAfk;
