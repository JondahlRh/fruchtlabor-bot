import ActivityEntry from "models/general/ActivityEntry";
import ActivityEntryD from "models/general/ActivityEntryD";

import { AggregatedClients } from "..";

const daily = async (retryNumber: number = 0) => {
  const activityEntries = await ActivityEntry.find();
  await ActivityEntry.deleteMany();

  const aggregatedClients = activityEntries.reduce<AggregatedClients>(
    (prev, cur) => {
      prev[cur.uuid] = {
        active: prev[cur.uuid]?.active ?? 0 + cur.active,
        online: prev[cur.uuid]?.active ?? 0 + cur.online,
      };

      return prev;
    },
    {}
  );

  const aggregatedClientsArray = Object.entries(aggregatedClients).map(
    ([uuid, values]) => ({
      uuid,
      active: values.active,
      online: values.online,
    })
  );

  try {
    await ActivityEntryD.insertMany(aggregatedClientsArray);
  } catch (error) {
    console.error(error);

    if (retryNumber === 3) return;
    retryNumber++;

    setTimeout(() => daily(retryNumber), Math.pow(retryNumber, 2) * 1000);
  }
};

export default daily;
