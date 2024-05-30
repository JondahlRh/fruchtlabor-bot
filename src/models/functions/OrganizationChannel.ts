import { Schema, Types, model } from "mongoose";

import TsChannel, { TsChannelType } from "models/teamspeak/TsChannel";

import { MultiCategorieType } from "types/general";

type OrganizationChannelType = {
  channel: TsChannelType;
  title: string;
  body: string;
  openJobAds: MultiCategorieType;
  closedJobAds: MultiCategorieType;
  categories: MultiCategorieType[];
};

const LinkSchema = {
  url: { type: String, required: true },
  label: { type: String, required: true },
};

const CategorieSchema = {
  title: { type: String, required: true },
  links: [LinkSchema],
};

const OrganizationChannelSchema = new Schema<OrganizationChannelType>({
  channel: { type: Types.ObjectId, ref: TsChannel, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  openJobAds: CategorieSchema,
  closedJobAds: CategorieSchema,
  categories: [CategorieSchema],
});

export default model<OrganizationChannelType>(
  "OrganizationChannel",
  OrganizationChannelSchema
);
