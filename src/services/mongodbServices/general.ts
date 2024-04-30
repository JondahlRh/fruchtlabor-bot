import { TeamSpeakClient } from "ts3-nodejs-library";

import ActivityEntry, { ActivityEntryType } from "models/general/ActivityEntry";
import AsyncError from "models/general/AsyncError";
import Fruit from "models/general/Fruit";
import SupportLog from "models/general/SupportLog";
import { TsChannelType } from "models/teamspeak/TsChannel";

export const insertManyActivityEntries = async (
  entries: ActivityEntryType[]
) => {
  try {
    await ActivityEntry.insertMany(entries);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

export const saveAsyncError = async (error: Error, functionname: string) => {
  try {
    await new AsyncError({
      timestamp: new Date(),
      function: functionname,
      message: error.message,
      name: error.name,
      stack: error.stack,
    }).save();
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

export const findFruits = async () => {
  try {
    return await Fruit.find();
  } catch (error) {
    return null;
  }
};

export const saveSupportLog = async (
  channel: TsChannelType,
  client: TeamSpeakClient,
  contactedClients: TeamSpeakClient[],
  listedClients: TeamSpeakClient[]
) => {
  try {
    await new SupportLog({
      timestamp: new Date(),
      channel: channel.id,
      client: client.uniqueIdentifier,
      supportClientsContact: contactedClients.map((x) => x.uniqueIdentifier),
      supportClientsListed: listedClients.map((x) => x.uniqueIdentifier),
    }).save();
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};
