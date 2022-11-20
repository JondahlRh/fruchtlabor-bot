const fs = require("fs");
const errorMessage = require("../errorMessage");

const queue = { length: 0, block: false };

const channelLobby = async (props) => {
  const { teamspeak } = props;

  // check for block and set block
  if (queue.block) return (queue.length += 1);
  queue.block = true;

  // get definition data
  let fsData;
  try {
    const data = fs.readFileSync(
      `src/utility/${process.env.VERSION}/teamspeakData.json`,
      "utf8"
    );
    fsData = JSON.parse(data);
  } catch (error) {
    return errorMessage("lobby channel @ fs (fsData)", error);
  }

  // get random list of fruits
  let fruits;
  try {
    const data = fs.readFileSync(`src/utility/fruits.json`, "utf8");
    fruits = JSON.parse(data);
    fruits.sort(() => 0.5 - Math.random());
  } catch (error) {
    return errorMessage("lobby channel @ fs (fruits)", error);
  }

  for (const l of fsData.channels.lobby) {
    // get all channels
    let channels;
    try {
      channels = await teamspeak.channelList();
    } catch (error) {
      errorMessage("lobby channel @ channelList", error);
      continue;
    }

    // get all lobby channels and empty lobby channels
    const lobbyChannels = channels.filter((c) => c.propcache.pid === l.cid);
    const emptyLobbyChannels = lobbyChannels.filter(
      (c) => c.propcache.totalClients === 0
    );

    // define createChannel properties
    const createProperties = {
      channelFlagPermanent: true,
      cpid: l.cid,
      channelOrder: lobbyChannels[0]?.propcache?.channelOrder,
      channelDescription: l?.description || null,
      channelFlagMaxclientsUnlimited: !l?.clientLimit,
      channelMaxclients: l?.clientLimit || null,
    };

    // get lobbyChannelName
    const filterList = fsData.channels[l.list];
    const filterLobbyChannels = channels.filter((c) =>
      filterList.includes(c.propcache.pid)
    );
    const lobbyChannelName = fruits.find((f) =>
      filterLobbyChannels.every((c) => !c.propcache.channelName.includes(f))
    );

    // create minimum amount of channels
    if (lobbyChannels.length < l.minimum) {
      const lobbyChannelName2 = fruits.find(
        (f) =>
          f !== lobbyChannelName &&
          filterLobbyChannels.every((c) => !c.propcache.channelName.includes(f))
      );
      const lobbyChannelNames = [lobbyChannelName, lobbyChannelName2];

      for (let i = 0; i < l.minimum - lobbyChannels.length; i++) {
        try {
          await teamspeak.channelCreate(
            l.name + lobbyChannelNames[i],
            createProperties
          );
        } catch (error) {
          errorMessage("lobby channel @ channelCreate", error);
          continue;
        }
      }
      continue;
    }
    // remove empty channel (except 1 or minimum of channels)
    if (emptyLobbyChannels.length > 1) {
      const CV = lobbyChannels.length <= l.minimum ? l.minimum : 1;
      for (let i = CV; i < emptyLobbyChannels.length; i++) {
        try {
          await teamspeak.channelDelete(emptyLobbyChannels[i].propcache.cid, 1);
        } catch (error) {
          errorMessage("lobby channel @ channelDelete", error);
          continue;
        }
      }
    }
    // create empty channel
    if (emptyLobbyChannels.length < 1) {
      try {
        await teamspeak.channelCreate(
          l.name + lobbyChannelName,
          createProperties
        );
      } catch (error) {
        errorMessage("lobby channel @ channelCreate", error);
        continue;
      }
      continue;
    }
    // move empty channel (to the top)
    if (lobbyChannels[0].propcache.totalClients > 0) {
      try {
        await teamspeak.channelEdit(emptyLobbyChannels[0].propcache.cid, {
          channelOrder: lobbyChannels[0].propcache.channelOrder,
        });
      } catch (error) {
        errorMessage("lobby channel @ channelEdit", error);
        continue;
      }
    }
  }

  // remove block and check for queue
  queue.block = false;
  if (queue.length > 0) {
    queue.length -= 1;
    channelLobby({ teamspeak });
  }
};

module.exports = channelLobby;
