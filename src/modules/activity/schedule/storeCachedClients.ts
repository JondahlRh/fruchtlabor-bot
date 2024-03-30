import ActivityEntry from "models/general/ActivityEntry";

import { AggregatedClients, CachedClient } from "..";

const storeCachedClients = async (
  cachedClients: CachedClient[],
  cacheTimer: number,
  retryNumber: number = 0
) => {
  const localClients = cachedClients.splice(0, cachedClients.length);

  const aggregatedClients = localClients.reduce<AggregatedClients>(
    (prev, cur) => {
      prev[cur.uuid] = {
        active: (prev[cur.uuid]?.active ?? 0) + (cur.active ? cacheTimer : 0),
        online: (prev[cur.uuid]?.online ?? 0) + cacheTimer,
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
    await ActivityEntry.insertMany(aggregatedClientsArray);
  } catch (error) {
    console.error(error);

    if (retryNumber === 3) return;
    retryNumber++;

    setTimeout(
      () => storeCachedClients(localClients, cacheTimer, retryNumber),
      Math.pow(retryNumber, 2) * 1000
    );
  }
};

export default storeCachedClients;
