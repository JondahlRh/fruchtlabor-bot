type TsChannelType = {
  channelId: number;
  name: string;
  description: string;
  isBotChannel: boolean;
};

type TsChannelgroupType = {
  channelgroupId: number;
  name: string;
  description: string;
};

type TsCollectionType = {
  name: string;
  label: string;
  channels: TsChannelType[];
  channelParents: TsChannelType[];
  servergroups: TsServergroupType[];
};

type TsDescriptionType = {
  text: string;
};

type TsServergroupType = {
  servergroupId: number;
  name: string;
  description: string;
  isTeammember: boolean;
};
