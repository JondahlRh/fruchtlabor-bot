import { TeamSpeak } from "ts3-nodejs-library";

export default async () => {
  const teamspeak = await TeamSpeak.connect({
    host: process.env.TEAMSPEAK_IP,
    serverport: process.env.TEAMSPEAK_PORT,
    username: process.env.TEAMSPEAKQUERY_USERNAME,
    password: process.env.TEAMSPEAKQUERY_PASSWORD,
    nickname: "Fruchtlabor Bot",
  });
  console.log(`connected - ${process.env.NODE_ENV}: ${new Date()}`);
};
