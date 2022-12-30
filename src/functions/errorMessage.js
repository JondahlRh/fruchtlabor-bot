const fs = require("fs");

const errorMessage = async (custom, error) => {
  // console.error({ date: new Date(), custom, error });

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + "-" + mm + "-" + dd;

  const data = `\ndate: ${new Date()}\ncustom: ${custom}\nerror: ${error}\n`;
  fs.appendFile(`logs/errors.log`, data, (err) => {
    if (err) {
      console.error({ date: new Date(), custom, error, err });
    }
  });
};

module.exports = errorMessage;
