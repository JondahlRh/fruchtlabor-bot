const errorMessage = require("../functions/errorMessage");
const fs = require("fs");
const readJsonFile = require("../functions/readJsonFile");
const pathReducer = require("../functions/pathReducer");

const join = async (props) => {
  const { client } = props.event;
  const { clientServergroups } = client.propcache;

  const fsData = readJsonFile(
    `${process.env.VERSION}/data.json`,
    "welcome message @ fsData"
  );
  if (!fsData) return;

  for (const type of fsData.functions.message.join) {
    const sendJoinMessage = clientServergroups.some(
      (sg) => pathReducer(type.servergroup, fsData.servergroup) === +sg
    );

    if (!sendJoinMessage) continue;

    try {
      await client.message(type.message.join("\n"));
    } catch (error) {
      return errorMessage("client message @ message", error);
    }
  }
};

module.exports = join;
