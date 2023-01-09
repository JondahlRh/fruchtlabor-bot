const fs = require("fs");
const errorMessage = require("./errorMessage");

const readMaplist = (customError) => {
  try {
    const data = fs.readFileSync(
      "files/fl-intern-communitymaplist.txt",
      "utf8"
    );
    return data.split("\n");
  } catch (error) {
    errorMessage(customError, error);
    return [""];
  }
};

module.exports = readMaplist;
