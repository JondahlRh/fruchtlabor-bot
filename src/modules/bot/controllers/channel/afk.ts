import { TeamSpeak, TeamSpeakClient } from "ts3-nodejs-library";

import { getAfkChannels, getTsServergroups } from "../../utility/mongodb";
import { clientMatchesCollection } from "../../utility/tsCollectionHelper";

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

/**
 * @param {TeamSpeak} teamspeak Current TeamSpeak Instance
 */
const channelAfk = async (teamspeak: TeamSpeak) => {
  const afkChannels = await getAfkChannels();

  const defaultMove = afkChannels.find((x) => x.isDefault);
  if (!defaultMove) throw new Error("Afk Channel default is not definded!");

  const allButDefaultMove = afkChannels.filter((x) => !x.isDefault);

  const clientList = await teamspeak.clientList();
  const channelList = await teamspeak.channelList();
  const tsServergroups = await getTsServergroups();

  for (const listClient of clientList) {
    if (listClient.type === 1) continue;

    const channel = channelList.find((c) => c.cid === listClient.cid);

    const clientData: ClientData = {
      channel: channel?.cid,
      channelParent: channel?.pid,
      servergroups: listClient.servergroups,
    };

    const ignore = allButDefaultMove.some((afkChannel) =>
      afkChannel.ignore.some((x) => clientMatchesCollection(clientData, x))
    );
    if (ignore) continue;

    const apply = allButDefaultMove.find((afkChannel) =>
      afkChannel.apply.some((x) => clientMatchesCollection(clientData, x))
    );
    const afkChannel = apply ?? defaultMove;

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
