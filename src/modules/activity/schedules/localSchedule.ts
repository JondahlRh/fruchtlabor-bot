import { TeamSpeak } from "ts3-nodejs-library";

export default async (teamspeak: TeamSpeak, cachedClients: CachedClient[]) => {
  try {
    const clientList = await teamspeak.clientList({ clientType: 0 });

    for (const client of clientList) {
      cachedClients.push({
        uuid: client.uniqueIdentifier,
        active: client.flagTalking,
      });
    }
  } catch (error) {}
};
