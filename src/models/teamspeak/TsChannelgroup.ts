import mongoose from "mongoose";

export type TsChannelgroupType = {
  id: number;
  name: string;
  description: string;
};

const TsChannelgroupSchema = new mongoose.Schema<TsChannelgroupType>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
});

export default mongoose.model<TsChannelgroupType>(
  "TsChannelgroup",
  TsChannelgroupSchema
);
