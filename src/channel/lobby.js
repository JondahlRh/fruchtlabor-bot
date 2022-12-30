const errorMessage = require("../functions/errorMessage");
const pathReducer = require("../functions/pathReducer");
const readJsonFile = require("../functions/readJsonFile");

const queue = { length: 0, block: false };

const lobby = async (props) => {
  const { fsData, teamspeak } = props;

  // check for block and add queue or set block
  if (queue.block) return (queue.length += 1);
  queue.block = true;

  const fsDescription = readJsonFile(
    "description.json",
    "lobby channel @ fsDescription"
  );
  if (!fsDescription) return;

  const fsFruits = readJsonFile("fruits.json", "lobby channel @ fsFruits");
  if (!fsFruits) return;
  fsFruits.sort(() => 0.5 - Math.random());

  for (const l of fsData.functions.channel.lobby) {
    // get all channels
    let channels;
    try {
      channels = await teamspeak.channelList();
    } catch (error) {
      errorMessage("lobby channel @ channelList", error);
      return;
    }

    // get all lobby channels and empty lobby channels
    const lobbyChannelPid = pathReducer(l.channelParent, fsData.channel);
    const lobbyChannels = channels.filter(
      (c) => +c.propcache.pid === lobbyChannelPid
    );
    const emptyLobbyChannels = lobbyChannels.filter(
      (c) => c.propcache.totalClients === 0
    );

    // define createChannel properties
    const createProperties = {
      channelFlagPermanent: true,
      cpid: lobbyChannelPid,
      channelOrder: lobbyChannels[0]?.propcache?.channelOrder,
      channelDescription: fsDescription.join("\n") || null,
      channelFlagMaxclientsUnlimited: !l?.clientLimit,
      channelMaxclients: l?.clientLimit || null,
    };

    // get lobbyChannelName
    const filterList = Object.entries(fsData.channel[l.categorie]).map(
      (c) => c[1]
    );
    const filterLobbyChannels = channels.filter((c) =>
      filterList.includes(c.propcache.pid)
    );
    const lobbyChannelName = fsFruits.find((f) =>
      filterLobbyChannels.every((c) => !c.propcache.channelName.includes(f))
    );

    // delete lobby channels
    if (emptyLobbyChannels.length > 1 && lobbyChannels.length > l.minimum) {
      const cv = lobbyChannels.length < l.minimum ? l.minimum : 1;

      for (let i = cv; i < emptyLobbyChannels.length; i++) {
        console.log({
          lo: lobbyChannels.length,
          em: emptyLobbyChannels.length,
        });
      }
    }

    // create lobby channels
    if (emptyLobbyChannels.length === 0 || lobbyChannels.length < l.minimum) {
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
    if (emptyLobbyChannels.length < 1 || lobbyChannels.length < l.minimum) {
      if (lobbyChannels.length + 1 < l.minimum) {
        setTimeout(() => {
          lobby({ fsData, teamspeak });
        }, 0);
      }

      let newChannel;
      try {
        newChannel = await teamspeak.channelCreate(
          `${l.prefix} ${l.prefix ? "-" : ""} ${lobbyChannelName}`,
          createProperties
        );
      } catch (error) {
        errorMessage("lobby channel @ channelCreate", error);
        continue;
      }

      // add permissions
      const permissions = l.permissions ? Object.entries(l.permissions) : [];
      for (const [permname, permvalue] of permissions) {
        try {
          await teamspeak.channelSetPerm(newChannel, {
            permname,
            permvalue,
          });
        } catch (error) {
          return errorMessage("lobby channel @ channelSetPerm", error);
        }
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

  // remove block, check for queue
  queue.block = false;
  if (queue.length > 0) {
    queue.length -= 1;
    lobby({ fsData, teamspeak });
  }
};

module.exports = lobby;
