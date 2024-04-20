import { TeamSpeak, TeamSpeakClient } from "ts3-nodejs-library";

const getDbid = async (teamspeak: TeamSpeak, client: string) => {
  if (Number.isNaN(Number(client))) {
    const clientDbFind = await teamspeak.clientDbFind(client, true);
    return clientDbFind[0]?.cldbid;
  }

  return client;
};

const getDbClient = async (teamspeak: TeamSpeak, client: string) => {
  try {
    const dbId = await getDbid(teamspeak, client);
    if (dbId === undefined) return null;

    const dbClients = await teamspeak.clientDbInfo(dbId);
    if (dbClients[0] === undefined) return null;

    return dbClients[0];
  } catch (error) {
    return null;
  }
};

const getOnlineClient = async (teamspeak: TeamSpeak, client: string) => {
  const dbId = await getDbid(teamspeak, client);
  if (dbId === undefined) return null;

  let onlineClient: TeamSpeakClient | undefined;
  try {
    onlineClient = await teamspeak.getClientByDbid(dbId);
  } catch (error) {
    return null;
  }

  return onlineClient ?? null;
};

export { getDbClient, getOnlineClient };
