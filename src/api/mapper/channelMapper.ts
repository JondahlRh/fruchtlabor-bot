import { TeamSpeakChannel } from "ts3-nodejs-library";

export type MappedChannel = {
  name: string;
  id: number;
};

const channelMapper = (channel: TeamSpeakChannel): MappedChannel => {
  return {
    name: channel.name,
    id: Number(channel.cid),
  };
};

export default channelMapper;
