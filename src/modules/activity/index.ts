import { schedule } from "node-cron";
import { TeamSpeak } from "ts3-nodejs-library";

import dailySchedule from "./schedules/dailySchedule";
import localSchedule from "./schedules/localSchedule";
import minuteSchedule from "./schedules/minuteSchedule";

export default (teamspeak: TeamSpeak) => {
  let dailyRunning = false;
  const cachedClients: CachedClient[] = [];

  schedule("0 0 * * *", async () => {
    dailyRunning = true;
    await dailySchedule();
    dailyRunning = false;
    minuteSchedule(cachedClients);
  });

  schedule("* * * * * *", () => {
    localSchedule(teamspeak, cachedClients);
  });

  schedule("* * * * *", () => {
    if (dailyRunning) return;
    minuteSchedule(cachedClients);
  });
};
