import { TeamSpeak } from "ts3-nodejs-library";

import { CachedClient } from "..";

const cacheOnlineClients = async (
  teamspeak: TeamSpeak,
  cachedClients: CachedClient[]
) => {
  try {
    const clientList = await teamspeak.clientList({ clientType: 0 });

    cachedClients.push(
      ...clientList.map((client) => ({
        uuid: client.uniqueIdentifier,
        active: client.flagTalking,
      }))
    );
  } catch (error) {
    console.error(error);
  }
};

export default cacheOnlineClients;
