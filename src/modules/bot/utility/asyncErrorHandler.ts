import { TeamSpeak, TeamSpeakClient } from "ts3-nodejs-library";

import { saveErrorLog } from "./mongodb";

const catcher = async (error: Error, functionname: string) => {
  try {
    await saveErrorLog(error, functionname);
  } catch (err) {
    console.table([
      {
        function: functionname,
        message: error.message,
        name: error.name,
        stack: error.stack,
        dbError: err,
      },
    ]);
  }
};

type Params = [TeamSpeak, TeamSpeakClient?] | [TeamSpeakClient];
export default <T extends Params>(fn: (...args: T) => Promise<void>) =>
  (...args: T) =>
    Promise.resolve(
      fn(...args).catch((error: Error) => catcher(error, fn.name))
    );
