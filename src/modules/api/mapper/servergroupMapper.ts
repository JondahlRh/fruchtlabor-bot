import { TeamSpeakServerGroup } from "ts3-nodejs-library";

const servergroupMapper = (servergroup: TeamSpeakServerGroup) => {
  return {
    name: servergroup.name,
    id: +servergroup.sgid,
  };
};

export default servergroupMapper;
