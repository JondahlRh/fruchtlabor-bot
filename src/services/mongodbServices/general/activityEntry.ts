import ActivityEntry, { ActivityEntryType } from "models/general/ActivityEntry";

export const findActivityEntries = async () => {
  try {
    return await ActivityEntry.find();
  } catch (error) {
    return [];
  }
};

export const findActivityEntryById = async (id: string) => {
  try {
    return await ActivityEntry.findById(id);
  } catch (error) {
    return null;
  }
};

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
