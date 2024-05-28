import { ServerInfoType } from "./sourceServerQueryService";

export const emptyRow = "[tr][/tr]\n";
export const horizontalRow = "[tr][td][hr][/td][/tr]\n";

export const getSpacerRow = (size = 100) => {
  if (size < 0) size = 0;
  return `[tr][td]${Array(size).fill(" ").join("")}[/td][/tr]\n`;
};

export const getTitleRow = (title: string) => {
  return `[tr][td][center][size=16][b]${title}[/b][/td][/tr]\n`;
};

export const getSubtitleRow = (subtitle: string) => {
  return `[tr][td][center][size=12][b]${subtitle}[/b][/td][/tr]\n`;
};

export const getTextRow = (text: string) => {
  return `[tr][td][center][size=10]${text}[/td][/tr]\n`;
};

export const getBodyRows = (body: string) => {
  return body
    .split("\n")
    .map((row) => `[tr][td][center][size=10]${row}[/size][/td][/tr]\n`)
    .join("");
};

export const getConnectLink = (host: string, port: number) => {
  return `[url=steam://connect/${host}:${port}?appid=730/${process.env.CS_SERVER_PASSWORD}]${process.env.CS_SERVER_DOMAIN}:${port}[/url]`;
};

export const getConnectCopy = (port: number) => {
  return `connect ${process.env.CS_SERVER_DOMAIN}:${port}; password ${process.env.CS_SERVER_PASSWORD}`;
};

export const getPlayerStatus = (serverData: ServerInfoType) => {
  const players = serverData.players - serverData.bots;
  const maxplayers = serverData.max_players - serverData.bots;

  return `Spieler: ${players}/${maxplayers}`;
};

export const getDataEntry = (content: string) => {
  return ` [td][size=10][b]${content}[/b][/td]\n`;
};
