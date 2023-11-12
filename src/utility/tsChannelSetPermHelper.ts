import { TeamSpeak, TeamSpeakChannel } from "ts3-nodejs-library";

import { PermissionType } from "src/types/mongoose/general";

/**
 * @param {TeamSpeak} teamspeak Current TeamSpeak Instance
 * @param {TeamSpeakChannel} channel TeamSpeak Channel
 * @param {PermissionType[]} permissions permissions
 */
const tsChannelSetPermHelper = async (
  teamspeak: TeamSpeak,
  channel: TeamSpeakChannel,
  permissions: PermissionType[]
) => {
  for (const { key, value } of permissions) {
    await teamspeak.channelSetPerm(channel, {
      permname: key,
      permvalue: Number(value),
    });
  }
};

export default tsChannelSetPermHelper;
