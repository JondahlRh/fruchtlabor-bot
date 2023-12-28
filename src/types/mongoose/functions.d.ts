type AddgroupChannelType = {
  channel: TsChannelType;
  moveChannel: TsChannelType;
  servergroup: TsServergroupType;
  message: string;
};

type AfkChannelType = {
  isDefault: boolean;
  moveChannel: {
    member: TsChannelType;
    teammember: TsChannelType;
  };
  apply: TsCollectionType[];
  ignore: TsCollectionType[];
  conditions: {
    general: number;
    micMuted: number;
    sndMuted: number;
  };
};

type CustomChannelType = {
  channelParent: TsChannelType;
  channelGroup: TsChannelgroupType;
  prefix: string;
  permissions: PermissionType[];
};

type JoinMessageType = {
  servergroup: TsServergroupType;
  message: string;
};

type LobbyChannelType = {
  channelParent: TsChannelType;
  channelParentSiblings: TsChannelType[];
  description: TsDescriptionType;
  prefix: string;
  minimum: number;
  clientLimit: number;
  permissions: PermissionType[];
};

type OnlineChannelType = {
  channel: TsChannelType;
  servergroups: TsServergroupType[];
  title: string;
  collections: TsCollectionType[];
};

type SupportMessageType = {
  channel: TsChannelType;
  contactServergroups: TsServergroupType[];
  messageBody: string;
  ignore: TsCollectionType[];
  doNotDisturb: TsCollectionType[];
  specials: SupportSpecialType[];
};
