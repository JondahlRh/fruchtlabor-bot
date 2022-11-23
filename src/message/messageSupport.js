const fs = require("fs");
const errorMessage = require("../errorMessage");

const messageSupport = async (props) => {
  const { teamspeak, event } = props;

  const {
    clientServergroups,
    cid,
    clientType,
    clientUniqueIdentifier,
    clientNickname,
  } = event.client.propcache;
  const { channelName } = event?.channel?.propcache || {
    channelName: event.cid,
  };

  // ignore querry users
  if (clientType === 1) return;

  // get definition data
  let fsData;
  try {
    const data = fs.readFileSync(
      `src/utility/${process.env.VERSION}/teamspeakData.json`,
      "utf8"
    );
    fsData = JSON.parse(data);
  } catch (error) {
    return errorMessage("support message @ fs", error);
  }

  // get clients with report to support group
  const reportToSupport =
    clientServergroups.some((group) =>
      fsData.groups.reportToSupport.includes(group)
    ) && fsData.channels.supportWaiting.allg === cid;

  // get support groups
  const supportGroups = [];
  switch (cid) {
    case fsData.channels.supportWaiting.allg:
      supportGroups.push(fsData.groups.support.mod);
      if (!reportToSupport) {
        supportGroups.push(fsData.groups.support.allg);
      }
      break;
    case fsData.channels.supportWaiting.veri:
      supportGroups.push(fsData.groups.support.mod);
      supportGroups.push(fsData.groups.support.allg);
      break;
    case fsData.channels.supportWaiting.appl:
      supportGroups.push(fsData.groups.support.mod);
      supportGroups.push(fsData.groups.support.appl);
      break;
    case fsData.channels.supportWaiting.coach:
      supportGroups.push(fsData.groups.support.coach);
      break;
    case fsData.channels.supportWaiting.skin:
      supportGroups.push(fsData.groups.support.skin);
      break;
    case fsData.channels.supportWaiting.distress:
      supportGroups.push(fsData.groups.support.distress);
      break;

    default:
      return;
  }

  // get all channels
  let channels;
  try {
    channels = await teamspeak.channelList();
  } catch (error) {
    return errorMessage("support message @ channelList", error);
  }

  // get match channels
  const matchChannels = channels.filter((c) =>
    fsData.channels.match.includes(c.propcache.pid)
  );

  // get all clients
  let clients;
  try {
    clients = await teamspeak.clientList({ clientType: 0 });
  } catch (error) {
    return errorMessage("support message @ clientList", error);
  }

  // get support clients
  const supportClients = [];
  clients.forEach((client) => {
    const { clientServergroups: aClientServergroups, cid: aCid } =
      client.propcache;

    if (!supportGroups.some((g) => aClientServergroups.includes(g))) return;

    if (matchChannels.some((c) => c.cid === aCid)) return;
    if (
      fsData.channels.afk.includes(aCid) ||
      fsData.channels.meeting.includes(aCid)
    ) {
      return;
    }
    if (
      fsData.groups.noSupport.some((g) => aClientServergroups.includes(g)) ||
      fsData.groups.dnd.some((g) => aClientServergroups.includes(g))
    ) {
      return;
    }

    supportClients.push(client);
  });

  // get support message (first part)
  const supportUser = `[URL=client:///${clientUniqueIdentifier}]${clientNickname}[/URL]`;
  let supportMessage = "";
  const supportInlineMessage = reportToSupport ? "meldet sich" : "wartet";
  if (reportToSupport) {
    supportMessage += `[color=#ff4444][b]Support Gespräch: [/b][/color]`;
  }
  supportMessage += `Der User ${supportUser} ${supportInlineMessage} in dem Channel "${channelName}" `;

  // get user message (first part)
  let userMessage = `Hallo ${clientNickname}, `;
  let extraUserMessage = "";
  switch (cid) {
    case fsData.channels.supportWaiting.veri:
      extraUserMessage =
        "Du kannst uns zur Ranganpassung auch schriftlich kontaktieren. ";
      break;
    case fsData.channels.supportWaiting.appl:
      extraUserMessage =
        "Du kannst gerne die Steamprofil-Links von allen Accounts bereithalten. " +
        "Das Gespräch dauert ca. 20 Minuten. ";
    default:
      break;
  }

  // get support and user message (second part)
  switch (supportClients.length) {
    case 0:
      userMessage +=
        "es ist zur Zeit leider kein Supporter erreichbar. Komm gerne später noch einmal.";
      break;
    case 1:
      supportMessage += "(Keine weiteren Suporter kontaktiert";
      userMessage +=
        "bitte warte kurz, wir helfen dir gleich. " +
        extraUserMessage +
        "Folgender Supporter wurde kontaktiert: ";
      break;
    case 2:
      supportMessage += "(Dieser weitere Supporter wurde kontaktiert: ";
      userMessage +=
        "bitte warte kurz, wir helfen dir gleich. " +
        extraUserMessage +
        "Folgende Supporter wurden kontaktiert: ";
      break;

    default:
      supportMessage += "(Diese weiteren Supporter wurde kontaktiert: ";
      userMessage +=
        "bitte warte kurz, wir helfen dir gleich. " +
        extraUserMessage +
        "Folgende Supporter wurden kontaktiert: ";
      break;
  }

  // filter & map supporters and send support message
  supportClients.forEach(async (c) => {
    const otherSupporter = supportClients
      .filter((fc) => fc !== c)
      .map((mc) => {
        return `[URL=client:///${mc.propcache.clientUniqueIdentifier}]${mc.propcache.clientNickname}[/URL]`;
      })
      .join(", ");

    try {
      await c.message(supportMessage + otherSupporter + ")");
    } catch (error) {
      return errorMessage("support message @ supportMessage", error);
    }
  });

  // map supporters
  const userSupporter = supportClients
    .map((mc) => {
      return `[URL=client:///${mc.propcache.clientUniqueIdentifier}]${mc.propcache.clientNickname}[/URL]`;
    })
    .join(", ");

  // send user message
  try {
    await event.client.message(userMessage + userSupporter);
  } catch (error) {
    return errorMessage("support message @ userMessage", error);
  }
};

module.exports = messageSupport;
