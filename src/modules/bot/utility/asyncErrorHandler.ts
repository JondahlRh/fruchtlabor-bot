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

// eslint-disable-next-line
export default (fn: Function) =>
  // eslint-disable-next-line
  (...args: any) =>
    Promise.resolve(
      fn(...args).catch((error: Error) => catcher(error, fn.name))
    );
