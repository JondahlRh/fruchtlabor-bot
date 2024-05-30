import { Schema, Types, model } from "mongoose";

import { VisibleLinkSchema } from "models/general/general";
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

const CategorieSchema = {
  title: { type: String, required: true },
  links: [VisibleLinkSchema],
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
