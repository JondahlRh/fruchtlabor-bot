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
