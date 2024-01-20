import { TeamSpeakClient } from "ts3-nodejs-library";
import { ClientDBInfo } from "ts3-nodejs-library/lib/types/ResponseTypes";

const clientMapper = (client: TeamSpeakClient | ClientDBInfo): MappedClient => {
  if (client instanceof TeamSpeakClient) {
    return {
      name: client.nickname,
      uuid: client.uniqueIdentifier,
      dbid: Number(client.databaseId),
    };
  }

  return {
    name: client.clientNickname,
    uuid: client.clientUniqueIdentifier,
    dbid: Number(client.clientDatabaseId),
  };
};

export default clientMapper;
