const custom = async (teamspeak, event, self) => {
  const eClient = event.client.propcache;

  const customChannelName =
    (eClient.cid === "78" ? "Spielersuche" : "Customchannel") + " - " + eClient.clientNickname;

  if (["78", "127"].includes(eClient.cid)) {
    let customChannelID;
    try {
      customChannelID = (await teamspeak.channelFind(customChannelName))[0].cid;
    } catch (error) {}

    if (!customChannelID) {
      await teamspeak.channelCreate(customChannelName, { cpid: eClient.cid });
      customChannelID = self.propcache.cid;
    }

    await teamspeak.setClientChannelGroup("90", customChannelID, eClient.clientDatabaseId);
    await teamspeak.clientMove(eClient.clid, customChannelID);
  }

  try {
    await teamspeak.clientMove(self, await teamspeak.getChannelById("19"));
  } catch (error) {}
};

module.exports = { custom };
