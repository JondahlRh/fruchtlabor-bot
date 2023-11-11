import { TsServergroupType } from "./teamspeak";

export type FruitType = {
  name: string;
};

export type PermissionType = {
  key: string;
  value: string;
};

export type SupportSpecialType = {
  servergroup: TsServergroupType;
  contactServergroups: TsServergroupType[];
  messagePrefix: {
    text: string;
    color: string;
  };
};
