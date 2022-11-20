const fs = require("fs");
const errorMessage = require("../errorMessage");

const channelCustom = async (props) => {
  const { teamspeak, event, self } = props;

  const { cid, clid, clientNickname, clientDatabaseId } =
    event.client.propcache;

  // get definition data
  let fsData;
  try {
    const data = fs.readFileSync(
      `src/utility/${process.env.VERSION}/teamspeakData.json`,
      "utf8"
    );
    fsData = JSON.parse(data);
  } catch (error) {
    return errorMessage("custom channel @ fs", error);
  }

  // check for custom parent channel
  const customChannel = fsData.channels.custom.find((c) => c.cid === cid);
  if (customChannel) {
    const channelName = customChannel.name + " - " + clientNickname;
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
      const permissions = customChannel.permissions
        ? Object.entries(customChannel.permissions)
        : [];
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

    // set chanel manager group
    try {
      await teamspeak.setClientChannelGroup(
        fsData.groups.channelManager,
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
    if (self.propcache.cid !== fsData.channels.botChannel) {
      try {
        await teamspeak.clientMove(self, fsData.channels.botChannel);
      } catch (error) {
        return errorMessage("custom channel @ clientMove", error);
      }
    }
  }
};

module.exports = channelCustom;
