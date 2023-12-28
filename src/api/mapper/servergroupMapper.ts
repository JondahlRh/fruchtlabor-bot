import { TeamSpeakServerGroup } from "ts3-nodejs-library";

const servergroupMapper = (
  servergroup: TeamSpeakServerGroup
): MappedServerGroup => {
  return {
    name: servergroup.name,
    id: Number(servergroup.sgid),
  };
};

let a: MappedServerGroup;

export default servergroupMapper;
