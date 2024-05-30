import { ServerInfoType } from "services/sourceServerQueryService";

export const getCsServerDomain = (port: number, includePassword: boolean) => {
  const connect = `connect ${process.env.CS_SERVER_DOMAIN}:${port};`;
  const password = ` password ${process.env.CS_SERVER_PASSWORD};`;

  return connect + (includePassword ? password : "");
};

export const getPlayerCountLabel = (serverData: ServerInfoType) => {
  const players = serverData.players - serverData.bots;
  const maxplayers = serverData.max_players - serverData.bots;

  return `Spieler: ${players}/${maxplayers}`;
};
