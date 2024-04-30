import { findJoinMessages } from "services/mongodbServices/functions";
import { TeamSpeak, TeamSpeakClient } from "ts3-nodejs-library";

const messageJoin = async (teamspeak: TeamSpeak, client: TeamSpeakClient) => {
  const joinMessages = await findJoinMessages();
  if (joinMessages === null) return;

  for (const joinMessage of joinMessages) {
    const includesServergroup = client.servergroups.includes(
      String(joinMessage.servergroup.id)
    );
    if (!includesServergroup) continue;

    client.message(joinMessage.message);
  }
};

export default messageJoin;
