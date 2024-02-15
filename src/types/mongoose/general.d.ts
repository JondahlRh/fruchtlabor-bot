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

type ActivityEntryType = {
  uuid: string;
  activeTime: number;
  onlineTime: number;
  createdAt: Date;
  updatedAt: Date;
};

type ActivityEntryDailyType = {
  uuid: string;
  activeTime: number;
  onlineTime: number;
};
