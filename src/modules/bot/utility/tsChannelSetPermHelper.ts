import { TeamSpeak, TeamSpeakChannel } from "ts3-nodejs-library";

import { TsPermissionType } from "types/general";

const tsChannelSetPermHelper = async (
  teamspeak: TeamSpeak,
  channel: TeamSpeakChannel,
  permissions: TsPermissionType[]
) => {
  for (const { key, value } of permissions) {
    await teamspeak.channelSetPerm(channel, {
      permname: key,
      permvalue: +value,
    });
  }
};

export default tsChannelSetPermHelper;
