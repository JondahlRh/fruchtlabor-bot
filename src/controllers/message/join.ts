import { TeamSpeak, TeamSpeakClient } from "ts3-nodejs-library";

import JoinMessage from "../../models/functions/JoinMessage";

import { JoinMessageType } from "../../types/mongoose/functions";

/**
 * @param {TeamSpeak} teamspeak Current TeamSpeak Instance
 * @param {TeamSpeakClient} client Client from the Event
 */
const messageJoin = async (teamspeak: TeamSpeak, client: TeamSpeakClient) => {
  const joinMessages: JoinMessageType[] =
    await JoinMessage.find().populate("servergroup");

  for (const joinMessage of joinMessages) {
    const includesServergroup = client.servergroups.includes(
      String(joinMessage.servergroup.servergroupId)
    );
    if (!includesServergroup) continue;

    client.message(joinMessage.message);
  }
};

export default messageJoin;
