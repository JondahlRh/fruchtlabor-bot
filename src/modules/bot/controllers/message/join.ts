import { getJoinMessages } from "modules/bot/utility/mongodb";
import { TeamSpeak, TeamSpeakClient } from "ts3-nodejs-library";

/**
 * @param {TeamSpeak} teamspeak Current TeamSpeak Instance
 * @param {TeamSpeakClient} client Client from the Event
 */
const messageJoin = async (teamspeak: TeamSpeak, client: TeamSpeakClient) => {
  const joinMessages = await getJoinMessages();

  for (const joinMessage of joinMessages) {
    const includesServergroup = client.servergroups.includes(
      String(joinMessage.servergroup.id)
    );
    if (!includesServergroup) continue;

    client.message(joinMessage.message);
  }
};

export default messageJoin;
