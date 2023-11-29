import { TeamSpeakClient } from "ts3-nodejs-library";

type MappedClient = {
  name: string;
  uuid: number;
  dbid: number;
};

const clientMapper = (client: TeamSpeakClient): MappedClient => {
  return {
    name: client.nickname,
    uuid: Number(client.uniqueIdentifier),
    dbid: Number(client.databaseId),
  };
};

export default clientMapper;
