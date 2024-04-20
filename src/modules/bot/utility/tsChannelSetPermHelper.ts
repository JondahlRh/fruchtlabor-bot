import { TeamSpeak, TeamSpeakChannel } from "ts3-nodejs-library";

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
