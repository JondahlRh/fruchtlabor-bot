export type TsChannelType = {
  channelId: number;
  name: string;
  description: string;
  isBotChannel: boolean;
};

export type TsChannelgroupType = {
  channelgroupId: number;
  name: string;
  description: string;
};

export type TsCollectionType = {
  name: string;
  label: string;
  channels: TsChannelType[];
  channelParents: TsChannelType[];
  servergroups: TsServergroupType[];
};

export type TsDescriptionType = {
  text: string;
};

export type TsServergroupType = {
  servergroupId: number;
  name: string;
  description: string;
  isTeammember: boolean;
};
