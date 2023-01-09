const errorMessage = require("./errorMessage");

const pathReducer = (path, location) => {
  try {
    const data = path.reduce((prev, cur) => prev[cur], location);
    if (typeof data === "number") return data;
    throw new Error(`${JSON.stringify(data)} is not a number`);
  } catch (error) {
    errorMessage("path conversion @ path reducer", error);
    return 0;
  }
};

module.exports = pathReducer;
