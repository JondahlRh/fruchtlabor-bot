const fruits = require("./utility/fruits");
const descriptionBanner = require("./utility/descriptionBanner");

const propsTalk = { clientLimit: false, joinPower: 5 };
const propsCsgoPublic = { clientLimit: 5, joinPower: 0 };
const propsCsgoMember = { clientLimit: 5, joinPower: 20 };
const propsCsgoWingman = { clientLimit: 2, joinPower: 0 };

// custom channel system
const custom = async (teamspeak, event, self) => {
  const eClient = event.client.propcache;

  // Channels: 19 "Support", 78 "Suche", 127 "andere games"
  let customChannelName;
  let customChannelJoinPower = 0;
  switch (eClient.cid) {
    case "19":
      customChannelName = "Support" + " - " + eClient.clientNickname;
      customChannelJoinPower = 35;
      break;
    case "78":
      customChannelName = "Spielersuche" + " - " + eClient.clientNickname;
      customChannelJoinPower = 20;
      break;
    case "127":
      customChannelName = "Customchannel" + " - " + eClient.clientNickname;
      break;
  }

  if (customChannelName) {
    let customChannelID;
    try {
      customChannelID = (await teamspeak.channelFind(customChannelName))[0].cid;
    } catch (error) {}

    if (!customChannelID) {
      const newChannel = await teamspeak.channelCreate(customChannelName, { cpid: eClient.cid });
      customChannelID = self.propcache.cid;

      await teamspeak.channelSetPerm(newChannel, {
        permname: "i_channel_needed_join_power",
        permvalue: customChannelJoinPower,
      });
    }

    await teamspeak.setClientChannelGroup(
      "90",
      customChannelID,
      eClient.clientDatabaseId
    );
    await teamspeak.clientMove(eClient.clid, customChannelID);
  }

  try {
    await teamspeak.clientMove(self, await teamspeak.getChannelById("19"));
  } catch (error) {}
};

// lobby channel system
const lobbyChannelSystem = async (props) => {
  const {
    parentChannel, // req
    teamspeak, // req
    filterChannels, // req
    properties = {},
    preFix = "",
    block,
  } = props;

  if (block.isBlogged) return;
  block.start();
  const channelList = await teamspeak.channelList();
  block.end();

  // randomize all fruits and find first unused fruit
  const newChannelList = channelList.filter((c) =>
    filterChannels.includes(c.propcache.pid)
  );
  fruits.sort(() => 0.5 - Math.random());
  const newFruit =
    fruits.find((f) =>
      newChannelList.every((c) => !c.propcache.channelName.includes(f))
    ) || Date.now();

  // get all channels and filter match channel and empty match channel
  const allChannels = channelList.filter(
    (c) => c.propcache.pid === parentChannel
  );
  const emptyChannels = allChannels.filter(
    (c) => c.propcache.totalClients === 0
  );

  // delete all empty channels except the first one (except: minimun of channels reached)
  const channelMinimum = 2;
  const CV = allChannels.length <= channelMinimum ? channelMinimum : 1;
  for (let i = CV; i < emptyChannels.length; i++) {
    try {
      await teamspeak.channelDelete(emptyChannels[i].propcache.cid, 1);
    } catch (error) {
      console.log({
        date: new Date(),
        customErrorMsg: "error @ deletingChannel",
        errorMsg: error.msg,
        channel: {
          n: emptyChannels[i].propcache.channelName,
          i: emptyChannels[i].propcache.cid,
        },
      });
    }
  }

  // create new channel if there is no empty channel
  // (with properties and permissions)
  // else: move the empty channel to the top (if needed)
  if (emptyChannels.length === 0) {
    let newChannel;
    try {
      if (emptyChannels.length > 0) return;
      newChannel = await teamspeak.channelCreate(preFix + newFruit, {
        channelFlagPermanent: true,
        cpid: parentChannel,
        channelOrder: allChannels[0]?.propcache?.channelOrder,
        channelDescription: descriptionBanner,
        channelFlagMaxclientsUnlimited: !properties?.clientLimit,
        channelMaxclients: properties?.clientLimit || null,
      });
    } catch (error) {
      console.log({
        date: new Date(),
        customErrorMsg: "error @ creatingChannel",
        errorMsg: error.msg,
      });
    }
    try {
      await teamspeak.channelSetPerm(newChannel, {
        permname: "i_channel_needed_join_power",
        permvalue: properties?.joinPower,
      });
    } catch (error) {
      console.log({
        date: new Date(),
        customErrorMsg: "error @ addingPermission",
        errorMsg: error.msg,
      });
    }
  } else {
    if (allChannels[0].propcache.totalClients > 0) {
      try {
        await teamspeak.channelEdit(emptyChannels[0].propcache.cid, {
          channelOrder: allChannels[0].propcache.channelOrder,
        });
      } catch (error) {
        console.log({
          date: new Date(),
          customErrorMsg: "error @ movingChannel",
          errorMsg: error.msg,
        });
      }
    }
  }
};
const lobby = (teamspeak, event, block) => {
  // lobbyChannelSystem({
  //   parentChannel: "130910",
  //   teamspeak,
  //   filterChannels: ["130910"],
  //   properties: propsTalk,
  //   block,
  // });

  const csgoChannelList = ["4275", "4274", "4277", "4276", "4325"];

  lobbyChannelSystem({
    parentChannel: "40",
    teamspeak,
    filterChannels: ["40"],
    properties: propsTalk,
    block,
  });
  lobbyChannelSystem({
    parentChannel: "4275",
    teamspeak,
    filterChannels: csgoChannelList,
    properties: propsCsgoPublic,
    preFix: "● Wettkampf | Öffentlich - ",
    block,
  });
  lobbyChannelSystem({
    parentChannel: "4274",
    teamspeak,
    filterChannels: csgoChannelList,
    properties: propsCsgoMember,
    preFix: "● Wettkampf | Clanintern - ",
    block,
  });
  lobbyChannelSystem({
    parentChannel: "4277",
    teamspeak,
    filterChannels: csgoChannelList,
    properties: propsCsgoPublic,
    preFix: "● FaceIt | Öffentlich - ",
    block,
  });
  lobbyChannelSystem({
    parentChannel: "4276",
    teamspeak,
    filterChannels: csgoChannelList,
    properties: propsCsgoMember,
    preFix: "● FaceIt | Clanintern - ",
    block,
  });
  lobbyChannelSystem({
    parentChannel: "4325",
    teamspeak,
    filterChannels: csgoChannelList,
    properties: propsCsgoWingman,
    preFix: "● Wingman - ",
    block,
  });
};

// const lobby2 = async (teamspeak, event, block) => {
//   const t = Date.now();
//   console.time(t);

//   if (block.isBlogged) return;
//   block.start();
//   const channelList = await teamspeak.channelList();
//   block.end();

//   console.timeEnd(t);
// };

module.exports = { custom, lobby /* lobby2 */ };
