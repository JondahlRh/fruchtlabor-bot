import { RequestHandler } from "express";

import { RequestBodyError } from "../../../classes/htmlErrors";
import UnkownDatabaseError from "../../../classes/htmlErrors/UnkownDatabaseError";
import ActivityEntry from "../../../models/general/ActivityEntry";
import ActivityEntryDaily from "../../../models/general/ActivityEntryDaily";
import { ParamIdSchema } from "../../../types/apiBody";
import restrictedNext from "../utility/restrictedNext";

const activity = () => {
  const getActivityById: RequestHandler = async (req, res, next) => {
    const requestParam = ParamIdSchema.safeParse(req.params.id);

    if (!requestParam.success) {
      return restrictedNext(
        next,
        new RequestBodyError(requestParam.error.message)
      );
    }

    const id = requestParam.data;

    let activityEntries: ActivityEntryType[];
    try {
      activityEntries = await ActivityEntry.find({ uuid: id });
    } catch (error) {
      return restrictedNext(next, new UnkownDatabaseError());
    }

    let activityEntryDaily: ActivityEntryDailyType | null;
    try {
      activityEntryDaily = await ActivityEntryDaily.findOne({ uuid: id });
    } catch (error) {
      return restrictedNext(next, new UnkownDatabaseError());
    }

    const activityEntry = {
      activeTime: 0,
      onlineTime: 0,
    };
    for (const entry of activityEntries) {
      activityEntry.activeTime += entry.activeTime;
      activityEntry.onlineTime += entry.onlineTime;
    }

    activityEntry.activeTime += activityEntryDaily?.activeTime ?? 0;
    activityEntry.onlineTime += activityEntryDaily?.onlineTime ?? 0;

    res.json({
      client: id,
      activeTime: activityEntry.activeTime,
      onlineTime: activityEntry.onlineTime,
    });
  };

  const getActivityList: RequestHandler = async (req, res, next) => {
    let activityEntries: ActivityEntryType[];
    try {
      activityEntries = await ActivityEntry.find();
    } catch (error) {
      return restrictedNext(next, new UnkownDatabaseError());
    }

    let activityEntriesDaily: ActivityEntryType[];
    try {
      activityEntriesDaily = await ActivityEntryDaily.find();
    } catch (error) {
      return restrictedNext(next, new UnkownDatabaseError());
    }

    const combinedEntries = [...activityEntries, ...activityEntriesDaily];

    const groupedActivityEntries: ActivityEntryType[] = [];
    for (const client of combinedEntries) {
      const existingClient = groupedActivityEntries.find(
        (x) => x.uuid === client.uuid
      );

      if (existingClient === undefined) {
        groupedActivityEntries.push(client);
        continue;
      }

      existingClient.activeTime += client.activeTime;
      existingClient.onlineTime += client.onlineTime;
    }

    res.json(groupedActivityEntries);
  };

  return {
    getActivityById,
    getActivityList,
  };
};

export default activity;
