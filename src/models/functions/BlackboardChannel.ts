import { Schema, Types, model } from "mongoose";

import { VisibleLinkSchema } from "models/general/general";
import TsChannel, { TsChannelType } from "models/teamspeak/TsChannel";

import { SingleCategorieType } from "types/general";

type BlackboardChannelType = {
  channel: TsChannelType;
  title: string;
  body: string;
  news: SingleCategorieType[];
  generals: SingleCategorieType[];
};

const NewsSchema = {
  title: { type: String, required: true },
  link: VisibleLinkSchema,
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
