type FruitType = {
  name: string;
};

type PermissionType = {
  key: string;
  value: string;
};

type SupportSpecialType = {
  servergroup: TsServergroupType;
  contactServergroups: TsServergroupType[];
  messagePrefix: {
    text: string;
    color: string;
  };
};

type CsServerType = {
  name: string;
  description: string;
  ip: string;
  port: number;
};
