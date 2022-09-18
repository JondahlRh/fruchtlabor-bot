const support = async (teamspeak, event) => {
  const supporterListSGID = [];
  const supporterList = [];
  let supMessage = "";
  let supMessageSupporterList;
  let cliMessage;
  let cliMessageExtra = "";
  let cliMessageSupporterList = "";

  // return if server query user
  if (event.client.propcache.clientType === 1) return;

  // check if client should contact the support
  const shouldContactSupport = event.client.propcache.clientServergroups.some((group) =>
    ["318", "2480"].includes(group)
  );

  // check the channel of the client and add matching notification servergroup
  switch (event.client.propcache.cid) {
    case "24": // Wartezimmer
      supporterListSGID.push("2559");
      if (!shouldContactSupport) {
        supporterListSGID.push("2554");
      }
      break;
    case "25": // Verifizierung + Ranganpassung
      supporterListSGID.push("2554", "2559");
      cliMessageExtra = "Du kannst uns zur Ranganpassung auch schriftlich kontaktieren. ";
      break;
    case "27": // Clan Bewerbung
      supporterListSGID.push("2556", "2559");
      cliMessageExtra =
        "Du kannst gerne die Steamprofillinks von allen Accounts bereithalten. " +
        "Das Gespräch dauert in der Regel 20 bis 30 Minuten. ";
      break;
    case "22621": // Skin-Beratung
      supporterListSGID.push("320");
      break;
    case "61154": // Coaching
      supporterListSGID.push("2558");
      break;
    case "68837": // Kummerkasten
      supporterListSGID.push("2484", "2485");
      break;
    case "108922": // IT-Beratung
      supporterListSGID.push("328");
      break;

    default:
      return;
  }

  // get current match channels
  const matchChannels = [];
  const matchChannelNames = [
    "Wettkampf | Clanintern",
    "Wettkampf | Öffentlich",
    "Wingman - ",
    "FaceIT | Clanintern",
    "FaceIT | Öffentlich",
    "Teamchannel | ",
  ];
  for (const channelName of matchChannelNames) {
    matchChannels.push(...(await teamspeak.channelFind(channelName)));
  }

  // loop all online clients
  const clientList = await teamspeak.clientList({ clientType: 0 });
  for (const client of clientList) {
    const clientSGID = client.propcache.clientServergroups;

    // continue when client isn't in notification group or should not be notified
    if (!supporterListSGID.some((group) => clientSGID.includes(group))) continue;

    // channel: "Team/Staff - AFK", "Teambesprechung"
    if (["13", "8"].includes(client.propcache.cid)) continue;
    // channel: Matchmaking, Wingman and FaceIt
    if (matchChannels.some((channel) => client.propcache.cid === channel.cid)) continue;
    // groups: "No Support!", "LIVE", "Do Not Disturb!"
    if (["59", "2482", "2541"].some((group) => clientSGID.includes(group))) continue;

    supporterList.push(client);
  }

  // add specific start of the message of client should contact the support
  if (shouldContactSupport) {
    supMessage = "[color=#ff4444][b]Support Gespräch: [/b][/color]";
  }

  // add the beginning of the messages
  const cliClicker = `[URL=client:///${event.client.propcache.clientUniqueIdentifier}]${event.client.propcache.clientNickname}[/URL]`;
  const inText = shouldContactSupport ? "meldet sich" : "wartet";
  supMessage += `Der User ${cliClicker} ${inText} in dem Channel "${event.channel.propcache.channelName}" `;
  cliMessage = `Lieber ${event.client.propcache.clientNickname}, `;

  // check for list of support and add matching text beginning
  switch (supporterList.length) {
    case 0:
      cliMessage +=
        "es ist zur Zeit leider kein Supporter erreichbar. Komm gerne später noch einmal.";
      break;
    case 1:
      supMessage += "(Keine weiteren Suporter kontaktiert)";
      cliMessage += `bitte warte kurz, wir helfen dir gleich. ${cliMessageExtra}Folgender Supporter wurde kontaktiert:`;
      break;
    case 2:
      supMessage += "(Dieser weitere Supporter wurde kontaktiert:";
      cliMessage += `bitte warte kurz, wir helfen dir gleich. ${cliMessageExtra}Folgende Supporter wurden kontaktiert:`;
      break;

    default:
      supMessage += "(Diese weiteren Supporter wurden kontaktiert:";
      cliMessage += `bitte warte kurz, wir helfen dir gleich. ${cliMessageExtra}Folgende Supporter wurden kontaktiert:`;
      break;
  }

  // fill the other supporters and send the full message (to the supporter)
  for (const supporter of supporterList) {
    supMessageSupporterList = "";
    if (supporterList.length > 1) {
      for (const otherSupporter of supporterList) {
        if (supporter.propcache.clid === otherSupporter.propcache.clid) continue;
        supMessageSupporterList += `[URL=client:///${otherSupporter.propcache.clientUniqueIdentifier}]${otherSupporter.propcache.clientNickname}[/URL], `;
      }
      supMessageSupporterList = supMessageSupporterList.slice(0, -2) + ")";
    }

    // console.log({
    //   name: supporter.propcache.clientNickname,
    //   msg: `${supMessage} ${supMessageSupporterList}`,
    // });
    supporter.message(`${supMessage} ${supMessageSupporterList}`);
  }

  // fill all supporter and send the full message (to the client)
  if (supporterList.length > 1) {
    for (const supporter of supporterList) {
      cliMessageSupporterList += `[URL=client:///${supporter.propcache.clientUniqueIdentifier}]${supporter.propcache.clientNickname}[/URL], `;
    }
    cliMessageSupporterList = cliMessageSupporterList.slice(0, -2);
  }

  // console.log({
  //   name: event.client.propcache.clientNickname,
  //   msg: `${cliMessage} ${cliMessageSupporterList}`,
  // });
  event.client.message(`${cliMessage} ${cliMessageSupporterList}`);
};

module.exports = { message: support };
