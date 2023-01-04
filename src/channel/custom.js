const errorMessage = require("../utility/errorMessage");
const pathReducer = require("../utility/pathReducer");

const custom = async (props) => {
  const { fsData, teamspeak, event, self } = props;

  const { cid, clid, clientType, clientNickname, clientDatabaseId } =
    event.client.propcache;

  // ignore querry users
  if (clientType === 1) return;

  // check for custom parent channel
  const customChannel = fsData.functions.channel.custom.find(
    (c) => pathReducer(c.channelParent, fsData.channel) === +cid
  );
  if (!customChannel) return;

  // generate channel name
  const channelName = customChannel.prefix + " - " + clientNickname;
  const sliceChannelName = channelName.slice(-channelName.length, 40);

  // check if channel exists
  let customChannelId;
  try {
    customChannelId = (await teamspeak.channelFind(sliceChannelName))[0].cid;
  } catch (err) {
    // create new channel
    let newCustomChannel;
    try {
      newCustomChannel = await teamspeak.channelCreate(sliceChannelName, {
        cpid: cid,
      });
      customChannelId = newCustomChannel.propcache.cid;
    } catch (error) {
      return errorMessage("custom channel @ channelCreate", error);
    }

    // add permissions
    const permissions = Object.entries(customChannel.permissions);
    for (const [permname, permvalue] of permissions) {
      try {
        await teamspeak.channelSetPerm(newCustomChannel, {
          permname,
          permvalue,
        });
      } catch (error) {
        return errorMessage("custom channel @ channelSetPerm", error);
      }
    }
  }

  // set channel manager group
  try {
    await teamspeak.setClientChannelGroup(
      fsData.channelgroup.channelManager,
      customChannelId,
      clientDatabaseId
    );
  } catch (error) {
    return errorMessage("custom channel @ setClientChannelGroup", error);
  }

  // move client to new channel
  try {
    await teamspeak.clientMove(clid, customChannelId);
  } catch (error) {
    return errorMessage("custom channel @ clientMove", error);
  }

  // move querry user back to def channel
  const botDefaultChannel = pathReducer(
    fsData.functions.botDefaultChannel,
    fsData.channel
  );
  if (self.propcache.cid !== botDefaultChannel) {
    try {
      await teamspeak.clientMove(self, botDefaultChannel);
    } catch (error) {
      return errorMessage("custom channel @ clientMove", error);
    }
  }
};

module.exports = custom;
