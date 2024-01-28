type TsChannelType = {
  id: number;
  name: string;
  description: string;
  isBotChannel: boolean;
};

type TsChannelgroupType = {
  id: number;
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
  id: number;
  name: string;
  description: string;
  isTeammember: boolean;
};
