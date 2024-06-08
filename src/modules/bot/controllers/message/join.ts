import { TeamSpeak, TeamSpeakClient } from "ts3-nodejs-library";

import { findJoinMessages } from "services/mongodbServices/functions/joinMessage";

export default async function joinMessage(
  teamspeak: TeamSpeak,
  client: TeamSpeakClient
) {
  const joinMessages = await findJoinMessages();

  for (const joinMessage of joinMessages) {
    const includesServergroup = client.servergroups.includes(
      joinMessage.servergroup.id.toString()
    );
    if (!includesServergroup) continue;

    await client.message(joinMessage.message);
  }
}
