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

export default (fn: Function) =>
  (...args: any) =>
    Promise.resolve(
      fn(...args).catch((error: Error) => catcher(error, fn.name))
    );
