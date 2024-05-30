import { TeamSpeakChannel } from "ts3-nodejs-library";

const channelMapper = (channel: TeamSpeakChannel) => {
  return {
    name: channel.name,
    id: +channel.cid,
  };
};

export default channelMapper;
