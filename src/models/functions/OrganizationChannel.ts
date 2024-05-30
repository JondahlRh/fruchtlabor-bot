import { Schema, Types, model } from "mongoose";
import { z } from "zod";

import TsChannel, { TsChannelZodSchema } from "models/teamspeak/TsChannel";

const LinkZodSchema = z.object({
  url: z.string(),
  label: z.string(),
});

const CategorieZodSchema = z.object({
  title: z.string(),
  links: z.array(LinkZodSchema),
});

export const OrganizationChannelZodSchema = z.object({
  channel: TsChannelZodSchema,
  title: z.string(),
  body: z.string(),
  openJobAds: CategorieZodSchema,
  closedJobAds: CategorieZodSchema,
  categories: z.array(CategorieZodSchema),
});

export type OrganizationChannelType = z.infer<
  typeof OrganizationChannelZodSchema
>;

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
