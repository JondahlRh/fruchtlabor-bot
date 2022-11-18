const query = require("source-server-query");

const online = async (teamspeak) => {
  const serverNoAwp = await query.info("5.9.50.9", 27003);
  const serverComMaps = await query.info("5.9.50.9", 27004);
  const serverDuels = await query.info("5.9.50.9", 25005);
  const serverDefault = await query.info("5.9.50.9", 27011);

  // console.log({ serverNoAwp, serverDefault, serverComMaps, serverDuels });

  teamspeak.channelEdit("131494", {
    channelName: `● Duels (1v1) | Online: ${serverDuels.players || 0}`,
  });
  teamspeak.channelEdit("15094", {
    channelName: `● Retakes NoAWP | Online: ${serverNoAwp.players || 0}`,
  });
  teamspeak.channelEdit("51566", {
    channelName: `● Retakes Standard | Online: ${serverDefault.players || 0}`,
  });
  teamspeak.channelEdit("18855", {
    channelName: `● Retakes Communitymaps | Online: ${serverComMaps.players || 0}`,
  });
};

module.exports = { online };
