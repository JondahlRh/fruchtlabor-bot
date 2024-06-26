export const getCsServerConnectLink = (
  host: string,
  port: number,
  label: string
) => {
  return `[url=steam://connect/${host}:${port}/${process.env.CS_SERVER_PASSWORD}?appid=730]${label}[/url]`;
};

export const getClientUrl = (name: string, uid: string) => {
  const escapedName = name.replaceAll("[", "\\[").replaceAll("]", "\\]");
  return `[url=client:///${uid}]${escapedName}[/url]`;
};

export const getGeneralUrl = (link: string, label: string) => {
  return `[url=${link}]${label}[/url]`;
};
