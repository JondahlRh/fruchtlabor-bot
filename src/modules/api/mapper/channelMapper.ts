import { TeamSpeakChannel } from "ts3-nodejs-library";

export type MappedChannel = {
  name: string;
  id: number;
};

const channelMapper = (channel: TeamSpeakChannel) => {
  return {
    name: channel.name,
    id: +channel.cid,
  };
};

export default channelMapper;
