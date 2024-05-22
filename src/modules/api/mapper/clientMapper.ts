import { TeamSpeakClient } from "ts3-nodejs-library";
import { ClientDBInfo } from "ts3-nodejs-library/lib/types/ResponseTypes";

export type MappedClient = {
  name: string;
  uuid: string;
  dbid: number;
};

const clientMapper = (client: ClientDBInfo) => {
  return {
    name: client.clientNickname,
    uuid: client.clientUniqueIdentifier,
    dbid: +client.clientDatabaseId,
  };
};

const clientOnlineMapper = (client: TeamSpeakClient) => {
  return {
    name: client.nickname,
    uuid: client.uniqueIdentifier,
    dbid: +client.databaseId,
  };
};

export { clientMapper, clientOnlineMapper };
