import { TeamSpeak, TeamSpeakClient } from "ts3-nodejs-library";

import JoinMessage from "../../models/functions/JoinMessage";

/**
 * @param {TeamSpeak} teamspeak Current TeamSpeak Instance
 * @param {TeamSpeakClient} client Client from the Event
 */
const messageJoin = async (teamspeak, client) => {
  const joinMessages = await JoinMessage.find().populate("servergroup");

  for (const joinMessage of joinMessages) {
    const includesServergroup = client.servergroups.includes(
      joinMessage.servergroup.servergroupId.toString()
    );
    if (!includesServergroup) continue;

    client.message(joinMessage.message);
  }
};

export default messageJoin;
