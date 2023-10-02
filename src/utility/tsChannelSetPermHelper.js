import { TeamSpeakChannel } from "ts3-nodejs-library";

/**
 * @param {TeamSpeakChannel} channel TeamSpeak Channel
 * @param {[{key: string, value: string}]} permissions permissions
 */
const tsChannelSetPermHelper = async (channel, permissions) => {
  for (const { key, value } of permissions) {
    await teamspeak.channelSetPerm(channel, {
      permname: key,
      permvalue: value,
    });
  }
};

export default tsChannelSetPermHelper;
