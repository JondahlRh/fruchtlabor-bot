const fs = require("fs");
const errorMessage = require("./errorMessage");

const readMaplist = (filename, customError) => {
  try {
    const data = fs.readFileSync(`files/${filename}`, "utf8");
    return data.split("\n");
  } catch (error) {
    errorMessage(customError, error);
    return [""];
  }
};

module.exports = readMaplist;
