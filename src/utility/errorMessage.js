const fs = require("fs");

const errorMessage = async (custom, error) => {
  const data = `\ndate: ${new Date()}\ncustom: ${custom}\nerror: ${error}\n`;
  fs.appendFile(`logs/errors.log`, data, (err) => {
    if (err) {
      console.error({ date: new Date(), custom, error, err });
    }
  });
};

module.exports = errorMessage;
