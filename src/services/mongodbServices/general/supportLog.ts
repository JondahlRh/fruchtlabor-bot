import { TeamSpeakClient } from "ts3-nodejs-library";

import SupportLog from "models/general/SupportLog";
import { TsChannelType } from "models/teamspeak/TsChannel";

export const createSupportLog = async (
  channel: TsChannelType,
  client: TeamSpeakClient,
  contactedClients: TeamSpeakClient[],
  listedClients: TeamSpeakClient[]
) => {
  try {
    await SupportLog.create({
      channel: channel.id,
      client: client.uniqueIdentifier,
      supportClientsContact: contactedClients.map((x) => x.uniqueIdentifier),
      supportClientsListed: listedClients.map((x) => x.uniqueIdentifier),
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};
