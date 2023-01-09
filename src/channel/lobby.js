const errorMessage = require("../utility/errorMessage");
const pathReducer = require("../utility/pathReducer");
const readJsonFile = require("../utility/readJsonFile");

const queue = { length: 0, block: false };

const lobby = async (props) => {
  const { fsData, teamspeak } = props;

  // check for block and add queue or set block
  if (queue.block) return (queue.length += 1);
  queue.block = true;

  // get description data
  const fsDescription = readJsonFile(
    "description.json",
    "lobby channel @ fsDescription"
  );
  if (!fsDescription) return;

  // get fruits data
  const fsFruits = readJsonFile("fruits.json", "lobby channel @ fsFruits");
  if (!fsFruits) return;
  fsFruits.sort(() => 0.5 - Math.random());

  // function to delete channel
  const deleteChannel = async (cid) => {
    // delete channel
    try {
      await teamspeak.channelDelete(cid);
    } catch (error) {
      return errorMessage("lobby channel @ channelDelete", error);
    }
  };

  // function to create channel
  const createChannel = async (
    channelName,
    channelProperties,
    channelPermissions = {}
  ) => {
    // create channel
    let createdChannel;
    try {
      createdChannel = await teamspeak.channelCreate(
        channelName,
        channelProperties
      );
    } catch (error) {
      return errorMessage("lobby channel @ channelCreate", error);
    }

    // add permissions
    for (const [permname, permvalue] of Object.entries(channelPermissions)) {
      try {
        await teamspeak.channelSetPerm(createdChannel.propcache.cid, {
          permname,
          permvalue,
        });
      } catch (error) {
        return errorMessage("lobby channel @ channelSetPerm", error);
      }
    }
  };

  // function to move channel
  const moveChannel = async (cid, channelOrder) => {
    // move empty channel to top
    try {
      await teamspeak.channelEdit(cid, { channelOrder });
    } catch (error) {
      return errorMessage("lobby channel @ channelEdit", error);
    }
  };

  // loop all lobby channels
  for (const lobbyData of fsData.functions.channel.lobby) {
    // get all channels
    let channels;
    try {
      channels = await teamspeak.channelList();
    } catch (error) {
      errorMessage("lobby channel @ channelList", error);
      return;
    }

    // get all (empty) lobby channels
    const parentChannelId = pathReducer(
      lobbyData.channelParent,
      fsData.channel
    );
    const channelChildren = channels.filter(
      (c) => +c.propcache.pid === parentChannelId
    );
    const channelChildrenEmpty = channelChildren.filter(
      (c) => +c.propcache.totalClients === 0
    );

    // define createChannel properties
    const createProperties = {
      channelFlagPermanent: true,
      cpid: parentChannelId,
      channelOrder: channelChildren[0]?.propcache?.channelOrder,
      channelDescription: fsDescription.join("\n"),
      channelFlagMaxclientsUnlimited: !lobbyData?.clientLimit,
      channelMaxclients: lobbyData?.clientLimit || null,
    };

    // get all sibblings channels
    const sibblingsChannelIds = Object.values(
      fsData.channel[lobbyData.categorie]
    );
    const sibblingsChannels = channels.filter((c) =>
      sibblingsChannelIds.includes(+c.propcache.pid)
    );
    const unusedSibblingsChannelNames = fsFruits.filter(
      (c) => !sibblingsChannels.some((n) => n.propcache.channelName.includes(c))
    );

    // delete channels
    const channelsToBeDeleted = Math.max(
      0,
      Math.min(
        channelChildren.length - lobbyData.minimum,
        channelChildrenEmpty.length - 1
      )
    );
    for (let i = 0; i < channelsToBeDeleted; i++) {
      await deleteChannel(channelChildrenEmpty[i + 1].propcache.cid);
    }

    // create channels
    const channelsToBeCreated = Math.max(
      0,
      lobbyData.minimum - channelChildren.length,
      1 - channelChildrenEmpty.length
    );
    const newChannelNames = unusedSibblingsChannelNames.slice(
      0,
      channelsToBeCreated
    );
    for (const cName of newChannelNames) {
      const fullName = lobbyData.prefix
        ? `${lobbyData.prefix} - ${cName}`
        : cName;
      await createChannel(fullName, createProperties, lobbyData.permissions);
    }

    // check if empty channel is on top
    if (
      channelChildren[0].propcache.totalClients > 0 &&
      channelChildrenEmpty.length > 0
    ) {
      await moveChannel(
        channelChildrenEmpty[0].propcache.cid,
        channelChildren[0].propcache.channelOrder
      );
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
