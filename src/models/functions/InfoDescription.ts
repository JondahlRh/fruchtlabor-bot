import { Schema, Types, model } from "mongoose";

import TsChannel, { TsChannelType } from "models/teamspeak/TsChannel";

type Link = {
  label: string;
  url: string;
};

export type Entry = {
  type: "linkOnly" | "hereLabel" | "table";
  title: string;
  subtitle?: string;
  links: Link[];
};

export type InfoDescriptionType = {
  name: string;
  channel: TsChannelType;
  title: string;
  subtitle?: string;
  description?: string;
  entrySections: Entry[][];
};

const LinkSchema = {
  label: { type: String, required: true },
  url: { type: String, required: true },
};

const EntrySchema = {
  type: {
    type: String,
    enum: ["linkOnly", "hereLabel", "table"],
    required: true,
  },
  title: { type: String, required: true },
  subtitle: { type: String },
  links: [LinkSchema],
};

const InfoDescriptionSchema = new Schema<InfoDescriptionType>({
  name: { type: String, required: true, unique: true },
  channel: { type: Types.ObjectId, ref: TsChannel, required: true },
  title: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String },
  entrySections: [[EntrySchema]],
});

export default model<InfoDescriptionType>(
  "InfoDescription",
  InfoDescriptionSchema
);
