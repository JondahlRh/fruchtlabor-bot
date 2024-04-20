import { TeamSpeakServerGroup } from "ts3-nodejs-library";

export type MappedServerGroup = {
  name: string;
  id: number;
};

const servergroupMapper = (
  servergroup: TeamSpeakServerGroup
): MappedServerGroup => {
  return {
    name: servergroup.name,
    id: Number(servergroup.sgid),
  };
};

export default servergroupMapper;
