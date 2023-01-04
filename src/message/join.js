const errorMessage = require("../utility/errorMessage");
const pathReducer = require("../utility/pathReducer");

const join = async (props) => {
  const { fsData, event } = props;
  const { clientServergroups } = event.client.propcache;

  for (const type of fsData.functions.message.join) {
    // check for sending condition
    const sendJoinMessage = clientServergroups.some(
      (sg) => pathReducer(type.servergroup, fsData.servergroup) === +sg
    );
    if (!sendJoinMessage) continue;

    // send message
    try {
      await event.client.message(type.message.join("\n"));
    } catch (error) {
      return errorMessage("client message @ message", error);
    }
  }
};

module.exports = join;
