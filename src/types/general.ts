export type TsPermissionType = {
  key: string;
  value: string;
};

export type VisibleLinkType = {
  label: string;
  url: string;
};

export type SingleCategorieType = {
  title: string;
  link: VisibleLinkType;
};

export type MultiCategorieType = {
  title: string;
  links: VisibleLinkType[];
};
