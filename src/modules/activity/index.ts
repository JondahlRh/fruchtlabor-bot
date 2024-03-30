import { schedule } from "node-cron";
import { TeamSpeak } from "ts3-nodejs-library";

import cacheOnlineClients from "./schedule/cacheOnlineClients";
import daily from "./schedule/daily";
import storeCachedClients from "./schedule/storeCachedClients";

const CACHE_TIMER = 100;

export type CachedClient = {
  uuid: string;
  active: boolean;
};

export type AggregatedClients = {
  [uuid: string]: {
    active: number;
    online: number;
  };
};

export default (teamspeak: TeamSpeak) => {
  console.log("feature enabled activity");

  const cachedClients: CachedClient[] = [];

  setInterval(() => cacheOnlineClients(teamspeak, cachedClients), CACHE_TIMER);

  schedule("* * * * *", () => storeCachedClients(cachedClients, CACHE_TIMER));

  // TODO: Will be moved to FLAT backend
  schedule("0 0 * * *", () => daily());
};
