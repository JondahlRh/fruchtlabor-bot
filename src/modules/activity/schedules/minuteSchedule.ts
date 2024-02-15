import ActivityEntryDaily from "../../../models/general/ActivityEntryDaily";

export default async (cachedClients: CachedClient[]) => {
  const localCachedClient = [...cachedClients];
  cachedClients.splice(0, cachedClients.length);

  const localActivityEntries: ActivityEntryDailyType[] = [];
  for (const client of localCachedClient) {
    const existingClient = localActivityEntries.find(
      (x) => x.uuid === client.uuid
    );

    if (existingClient === undefined) {
      localActivityEntries.push({
        uuid: client.uuid,
        activeTime: client.active ? 1 : 0,
        onlineTime: 1,
      });
      continue;
    }

    existingClient.activeTime += client.active ? 1 : 0;
    existingClient.onlineTime += 1;
  }

  try {
    const activityEntries = await ActivityEntryDaily.find();
    for (const client of localActivityEntries) {
      const existingClient = activityEntries.find(
        (x) => x.uuid === client.uuid
      );

      if (existingClient === undefined) {
        new ActivityEntryDaily({
          uuid: client.uuid,
          activeTime: client.activeTime,
          onlineTime: client.onlineTime,
        }).save();
        continue;
      }

      existingClient.activeTime += client.activeTime;
      existingClient.onlineTime += client.onlineTime;
      existingClient.save();
    }
  } catch (error) {}
};
