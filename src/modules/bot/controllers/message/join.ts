import { TeamSpeak, TeamSpeakClient } from "ts3-nodejs-library";

import { findJoinMessages } from "services/mongodbServices/functions/joinMessage";

const messageJoin = async (teamspeak: TeamSpeak, client: TeamSpeakClient) => {
  const joinMessages = await findJoinMessages();

  for (const joinMessage of joinMessages) {
    const includesServergroup = client.servergroups.includes(
      String(joinMessage.servergroup.id)
    );
    if (!includesServergroup) continue;

    client.message(joinMessage.message);
  }
};

export default messageJoin;
