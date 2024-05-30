import { Schema, Types, model } from "mongoose";

import TsChannel, { TsChannelType } from "models/teamspeak/TsChannel";

import { SingleCategorieType } from "types/general";

type BlackboardChannelType = {
  channel: TsChannelType;
  title: string;
  body: string;
  news: SingleCategorieType[];
  generals: SingleCategorieType[];
};

const LinkSchema = {
  url: { type: String, required: true },
  label: { type: String, required: true },
};

const NewsSchema = {
  title: { type: String, required: true },
  link: LinkSchema,
};

const BlackboardChannelSchema = new Schema<BlackboardChannelType>({
  channel: { type: Types.ObjectId, ref: TsChannel, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  news: [NewsSchema],
  generals: [NewsSchema],
});

export default model<BlackboardChannelType>(
  "BlackboardChannel",
  BlackboardChannelSchema
);
