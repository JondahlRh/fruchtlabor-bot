import { Schema, model } from "mongoose";

export type TsChannelgroupType = {
  id: number;
  name: string;
  description: string;
};

const TsChannelgroupSchema = new Schema<TsChannelgroupType>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
});

export default model<TsChannelgroupType>(
  "TsChannelgroup",
  TsChannelgroupSchema
);
