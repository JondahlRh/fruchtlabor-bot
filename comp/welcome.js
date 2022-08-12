const welcome = async (teamspeak, event) => {
  if (+event.client.propcache.clientServergroups[0] !== 9) return;
  const client = await teamspeak.getClientByUid(event.client.propcache.clientUniqueIdentifier);

  const message =
    "Willkommen auf dem FruchtLabor Teamspeak. Über der Eingangshalle ist unser Supportbereich. " +
    "Wenn du dich verifizieren lassen möchtest, damit du unsere Laberecke und unsere öffentliche " +
    "CS:GO Suche benutzen kannst, dann geh bitte in den Channel 'Support | Verifizierung + Ranganpassung'. " +
    "Falls du dem Clan beitreten willst, kannst du in den Channel 'Support | Clan Bewerbung' gehen.";

  // console.log({ name: client.propcache.clientNickname, msg: message });
  client.message(message);
};

module.exports = welcome;
