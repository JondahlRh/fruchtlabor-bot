const fs = require("fs");
const errorMessage = require("./errorMessage");

const readJsonFile = (filePath, customError) => {
  try {
    const data = fs.readFileSync(`src/json/${filePath}`, "utf8");
    return JSON.parse(data);
  } catch (error) {
    errorMessage(customError, error);
  }
};

module.exports = readJsonFile;
