const catcher = async (error: Error, functionname: string) => {
  console.table([
    {
      title: "An Error ocurred!",
      file: functionname,
      message: error.message,
    },
  ]);
};

export default (fn: Function) =>
  (...args: any) =>
    Promise.resolve(
      fn(...args).catch((error: Error) => catcher(error, fn.name))
    );
