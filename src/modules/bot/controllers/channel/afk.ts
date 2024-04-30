import {
  findAfkChannels,
  findDefaultAfkChannel,
} from "services/mongodbServices/functions";
import { findTsServergroups } from "services/mongodbServices/teamspeak";
import { TeamSpeak, TeamSpeakClient } from "ts3-nodejs-library";

import { clientMatchesCollection } from "modules/bot/utility/tsCollectionHelper";

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

const channelAfk = async (teamspeak: TeamSpeak) => {
  const afkChannels = await findAfkChannels();
  if (afkChannels === null) return;

  const defaultAfkChannel = await findDefaultAfkChannel();
  if (!defaultAfkChannel) {
    throw new Error("Afk Channel default is not definded!");
  }

  const clientList = await teamspeak.clientList();
  const channelList = await teamspeak.channelList();
  const tsServergroups = await findTsServergroups();
  if (tsServergroups === null) return;

  for (const listClient of clientList) {
    if (listClient.type === 1) continue;

    const channel = channelList.find((c) => c.cid === listClient.cid);

    const clientData = {
      channel: channel?.cid,
      channelParent: channel?.pid,
      servergroups: listClient.servergroups,
    };

    const ignore = afkChannels.some((afkChannel) =>
      afkChannel.ignore.some((x) => clientMatchesCollection(clientData, x))
    );
    if (ignore) continue;

    const apply = afkChannels.find((afkChannel) =>
      afkChannel.apply.some((x) => clientMatchesCollection(clientData, x))
    );
    const afkChannel = apply ?? defaultAfkChannel;

    const maxIdleTime = checkMove(listClient, afkChannel.conditions);
    const maxIdleTimeMinutes = Math.floor(maxIdleTime / 1000 / 60);
    if (maxIdleTime === -1) continue;

    const tsServergroup = tsServergroups.find((tsSg) => {
      return (
        tsSg.isTeammember && listClient.servergroups.some((x) => tsSg.id === +x)
      );
    });

    const moveChannel = tsServergroup?.isTeammember
      ? afkChannel.moveChannel.teammember
      : afkChannel.moveChannel.member;

    if (+listClient.cid === moveChannel.id) continue;

    await listClient.move(String(moveChannel.id));
    await listClient.message(
      `Du warst über ${maxIdleTimeMinutes} Minuten abwesend und wurdest in den Afk Channel gemoved!`
    );
  }
};

export default channelAfk;
