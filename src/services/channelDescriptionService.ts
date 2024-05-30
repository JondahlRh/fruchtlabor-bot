import { ServerGroupClientEntry } from "ts3-nodejs-library/lib/types/ResponseTypes";

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

export const getDataTitle = (
  content: string,
  align: "left" | "center" | "right",
  largeSize = false,
  whitespaces = 0
) => {
  const size = largeSize ? 12 : 10;
  const spaces = Array(whitespaces).fill(" ").join("");

  return ` [th][${align}]${spaces}[size=${size}][b]${content}[/b]${spaces}[/th]\n`;
};

export const getDataEntry = (
  content: string,
  align: "left" | "center" | "right",
  whitespaces = 0
) => {
  const spaces = Array(whitespaces).fill(" ").join("");

  return ` [td][${align}]${spaces}[size=10]${content}${spaces}[/td]\n`;
};

export const getDataHorizontal = () => {
  return ` [td][hr][/td]\n`;
};

export const getClientClicker = (serverGroupClient: ServerGroupClientEntry) => {
  const escapedClientName = serverGroupClient.clientNickname
    .replaceAll("[", "\\[")
    .replaceAll("]", "\\]");

  return `[URL=client:///${serverGroupClient.clientUniqueIdentifier}]${escapedClientName}[/URL]`;
};

export const getUrlLink = (url: string, label: string) => {
  return `[url=${url}]${label}[/url]`;
};

export const getListRow = (
  items: string[],
  minDisplayCount: number,
  defaultValue: string
) => {
  let description = "[tr][td][list]";

  while (items.length < minDisplayCount) {
    items.push(defaultValue);
  }

  for (const value of items) {
    description += `  [*] ${value}`;
  }

  description += "[/list][/td][/tr]";
  return description;
};
