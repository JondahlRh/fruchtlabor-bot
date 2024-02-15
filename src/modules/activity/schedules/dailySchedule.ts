import ActivityEntry from "../../../models/general/ActivityEntry";
import ActivityEntryDaily from "../../../models/general/ActivityEntryDaily";

export default async () => {
  try {
    const activityEntries = await ActivityEntryDaily.find();
    await ActivityEntryDaily.deleteMany();

    for (const activityEntry of activityEntries) {
      new ActivityEntry({
        uuid: activityEntry.uuid,
        activeTime: activityEntry.activeTime,
        onlineTime: activityEntry.onlineTime,
      }).save();
    }
  } catch (error) {}
};
