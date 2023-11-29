import { TeamSpeakClient } from "ts3-nodejs-library";

export type MappedClient = {
  name: string;
  uuid: string;
  dbid: number;
};

const clientMapper = (client: TeamSpeakClient): MappedClient => {
  return {
    name: client.nickname,
      uuid: client.uniqueIdentifier,
    dbid: Number(client.databaseId),
  };
};

export default clientMapper;
