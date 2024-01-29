import { TeamSpeak } from "ts3-nodejs-library";

const getDbid = async (teamspeak: TeamSpeak, client: string) => {
  let dbId = client;
  if (Number.isNaN(Number(client))) {
    const clientDbFind = await teamspeak.clientDbFind(client, true);
    dbId = clientDbFind[0].cldbid;
  }

  return dbId;
};

const getDbClient = async (teamspeak: TeamSpeak, client: string) => {
  const dbId = await getDbid(teamspeak, client);

  try {
    const dbClients = await teamspeak.clientDbInfo(dbId);
    return dbClients[0];
  } catch (error) {
    return null;
  }
};

const getOnlineClient = async (teamspeak: TeamSpeak, client: string) => {
  const dbId = await getDbid(teamspeak, client);

  let onlineClient;
  try {
    onlineClient = await teamspeak.getClientByDbid(dbId);
  } catch (error) {
    return null;
  }

  return onlineClient ?? null;
};

export { getDbClient, getOnlineClient };
