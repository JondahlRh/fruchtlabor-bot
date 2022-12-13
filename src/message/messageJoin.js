const errorMessage = require("../errorMessage");
const fs = require("fs");

const clientMessage = async (client, message) => {
  try {
    await client.message(message);
  } catch (error) {
    return errorMessage("client message @ message", error);
  }
};

const messageJoin = async (props) => {
  const { client } = props.event;
  const { clientServergroups } = client.propcache;

  // get definition data
  let fsData;
  try {
    const data = fs.readFileSync(
      `src/utility/${process.env.VERSION}/teamspeakData.json`,
      "utf8"
    );
    fsData = JSON.parse(data);
  } catch (error) {
    return errorMessage("welcome message @ fs", error);
  }

  // check for guest and send welcome message
  if (clientServergroups[0] === fsData.groups.guest) {
    const message =
      "\n" +
      "Willkommen auf dem FruchtLabor Teamspeak. Über der Eingangshalle ist unser Supportbereich.\n" +
      "Falls du dem Clan beitreten willst, kannst du in den Channel 'Support | Clan Bewerbung' gehen.\n" +
      "Wenn du dich nur verifizieren lassen möchtest, damit du unsere Laberecke und unsere öffentliche\n" +
      "CS:GO Suche benutzen kannst, dann geh bitte in den Channel 'Support | Verifizierung + Ranganpassung'.";

    clientMessage(client, message);
  }

  // check for reportToTeamSup group
  if (
    clientServergroups.some((g) => fsData.groups.reportToTeamSup.includes(g))
  ) {
    const message =
      "Bitte melde dich in dem Channel 'Support | Wartezimmer' bei einem Teambetreuer.\n";

    clientMessage(client, message);
  }

  // check for reportToSupport group
  if (
    clientServergroups.some((g) => fsData.groups.reportToSupport.includes(g))
  ) {
    const message =
      "Bitte melde dich in dem Channel 'Support | Wartezimmer' bei einem Moderator.\n";

    clientMessage(client, message);
  }
};

module.exports = messageJoin;
