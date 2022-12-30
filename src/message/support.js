const fs = require("fs");
const errorMessage = require("../functions/errorMessage");
const pathReducer = require("../functions/pathReducer");
const readJsonFile = require("../functions/readJsonFile");

const support = async (props) => {
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

  const fsData = readJsonFile(
    `${process.env.VERSION}/data.json`,
    "support message @ fsData"
  );
  if (!fsData) return;

  // get support groups
  let extraSupporterMessage;
  let extraUserMessage;
  const supportGroups = [];
  outer: for (const sup of fsData.functions.message.support) {
    if (pathReducer(sup.channel, fsData.channel) !== +cid) {
      continue outer;
    }

    extraUserMessage = sup.extraUserMessage;

    inner: for (const exception of sup.exceptions) {
      const exceptionGroupId = pathReducer(
        exception.servergroup,
        fsData.servergroup
      );
      if (!clientServergroups.some((sg) => exceptionGroupId === +sg)) {
        continue inner;
      }

      extraSupporterMessage = exception.extraSupporterMessage;
      exception.contact.forEach((con) => {
        supportGroups.push(fsData.servergroup.support[con]);
      });
      break outer;
    }

    sup.contact.forEach((con) => {
      supportGroups.push(fsData.servergroup.support[con]);
    });
    break outer;
  }

  if (supportGroups.length === 0) return;

  // get all channels
  let channels;
  try {
    channels = await teamspeak.channelList();
  } catch (error) {
    return errorMessage("support message @ channelList", error);
  }

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
    const { clientServergroups, cid } = client.propcache;
    const clientChannel = channels.find((c) => c.propcache.cid === cid);
    const { pid } = clientChannel.propcache;

    if (!clientServergroups.some((g) => supportGroups.includes(+g))) return;

    const ingame = Object.entries(fsData.channel.match).find(
      (m) => m[1] === +pid
    );
    const away = fsData.channel.afk.team.away === +cid;
    const meeting = fsData.channel.meeting.team === +cid;
    const noSupport = clientServergroups.some(
      (sg) => +sg === fsData.servergroup.noSupport
    );
    const doNotDisturb = clientServergroups.some(
      (sg) =>
        +sg === fsData.servergroup.live ||
        +sg === fsData.servergroup.doNotDisturb
    );

    if (ingame || away || meeting || noSupport || doNotDisturb) return;

    supportClients.push(client);
  });

  // get support message (first part)
  const supportUser = `[URL=client:///${clientUniqueIdentifier}]${clientNickname}[/URL]`;
  let supportMessage = "";
  const supportInlineMessage = extraSupporterMessage ? "meldet sich" : "wartet";
  if (extraSupporterMessage) {
    supportMessage += `[color=#ff4444][b]${extraSupporterMessage}: [/b][/color]`;
  }
  supportMessage += `Der User ${supportUser} ${supportInlineMessage} in dem Channel "${channelName}" `;

  // get user message (first part)
  let userMessage = `Hallo ${clientNickname}, `;

  // get support and user message (second part)
  switch (supportClients.length) {
    case 0:
      supportMessage = "";
      userMessage +=
        "es ist zur Zeit leider kein Supporter erreichbar. Komm gerne später noch einmal. " +
        extraUserMessage;
      break;
    case 1:
      supportMessage += "(Keine weiteren Suporter kontaktiert)";
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

module.exports = support;
