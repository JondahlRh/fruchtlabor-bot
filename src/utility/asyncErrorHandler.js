/**
 * @param {Error} error
 * @param {String} functionname
 */
const catcher = async (error, functionname) => {
  console.table([
    {
      title: "An Error ocurred!",
      file: functionname,
      message: error.message,
    },
  ]);
};

/**
 * @param {Function} fn Function that should be wrapped in an error handler
 */
export default (fn) =>
  (...args) =>
    Promise.resolve(fn(...args).catch((error) => catcher(error, fn.name)));
