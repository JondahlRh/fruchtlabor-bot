import { PermissionType, SupportSpecialType } from "./general";
import {
  TsChannelType,
  TsChannelgroupType,
  TsCollectionType,
  TsDescriptionType,
  TsServergroupType,
} from "./teamspeak";

export type AddgroupChannelType = {
  channel: TsChannelType;
  moveChannel: TsChannelType;
  servergroup: TsServergroupType;
  message: string;
};

export type AfkChannelType = {
  isDefault: boolean;
  moveChannel: {
    member: TsChannelType;
    teammember: TsChannelType;
  };
  apply: TsCollectionType;
  ignore: TsCollectionType;
  conditions: {
    general: number;
    micMuted: number;
    sndMuted: number;
  };
};

export type CustomChannelType = {
  channelParent: TsChannelType;
  channelGroup: TsChannelgroupType;
  prefix: string;
  permissions: PermissionType[];
};

export type JoinMessageType = {
  servergroup: TsServergroupType;
  message: string;
};

export type LobbyChannelType = {
  channelParent: TsChannelType;
  channelParentSiblings: TsChannelType[];
  description: TsDescriptionType;
  prefix: string;
  minimum: number;
  clientLimit: number;
  permissions: PermissionType[];
};

export type OnlineChannelType = {
  channel: TsChannelType;
  servergroups: TsServergroupType[];
  title: string;
  collections: TsCollectionType[];
};

export type SupportMessageType = {
  channel: TsChannelType;
  contactServergroups: TsServergroupType[];
  messageBody: string;
  ignore: TsCollectionType;
  doNotDisturb: TsCollectionType;
  specials: SupportSpecialType[];
};
