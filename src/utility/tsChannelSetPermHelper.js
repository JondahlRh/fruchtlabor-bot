import { TeamSpeak, TeamSpeakChannel } from "ts3-nodejs-library";

/**
 * @param {TeamSpeak} teamspeak Current TeamSpeak Instance
 * @param {TeamSpeakChannel} channel TeamSpeak Channel
 * @param {[{key: string, value: string}]} permissions permissions
 */
const tsChannelSetPermHelper = async (teamspeak, channel, permissions) => {
  for (const { key, value } of permissions) {
    await teamspeak.channelSetPerm(channel, {
      permname: key,
      permvalue: value,
    });
  }
};

export default tsChannelSetPermHelper;
