const errorMessage = require("../utility/errorMessage");
const pathReducer = require("../utility/pathReducer");

const live = async (props) => {
  const { fsData, teamspeak, event } = props;

  const { channel, servergroup, message } = fsData.functions.group.live;
  const { clientServergroups, cid } = event.client.propcache;

  const channelId = pathReducer(channel, fsData.channel);
  const servergroupId = pathReducer(servergroup, fsData.servergroup);

  // check for get channel
  if (+cid !== channelId) return;

  // move client
  try {
    await event.client.move(fsData.channel.default);
  } catch (error) {
    errorMessage("message @ groupLive", error);
  }

  // ignore clients with LIVE group
  if (clientServergroups.some((sg) => +sg === servergroupId)) return;

  // add servergroup
  try {
    await teamspeak.serverGroupAddClient(event.client, servergroupId);
  } catch (error) {
    errorMessage("serverGroupAddClient @ groupLive", error);
  }

  // message client
  try {
    await event.client.message(message);
  } catch (error) {
    errorMessage("message @ groupLive", error);
  }
};

module.exports = live;
