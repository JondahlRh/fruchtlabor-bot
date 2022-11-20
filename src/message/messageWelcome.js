const errorMessage = require("../errorMessage");
const fs = require("fs");

const messageWelcome = async (props) => {
  const { event } = props;

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

  // check for guest
  if (event.client.propcache.clientServergroups[0] !== fsData.groups.guest) {
    return;
  }

  // send message
  const message =
    "\n" +
    "Willkommen auf dem FruchtLabor Teamspeak. Über der Eingangshalle ist unser Supportbereich.\n" +
    "Falls du dem Clan beitreten willst, kannst du in den Channel 'Support | Clan Bewerbung' gehen.\n" +
    "Wenn du dich nur verifizieren lassen möchtest, damit du unsere Laberecke und unsere öffentliche\n" +
    "CS:GO Suche benutzen kannst, dann geh bitte in den Channel 'Support | Verifizierung + Ranganpassung'.";

  try {
    await event.client.message(message);
  } catch (error) {
    return errorMessage("welcome message @ message", error);
  }
};

module.exports = messageWelcome;
