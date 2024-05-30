import mongoose from "mongoose";

export type TsChannelType = {
  id: number;
  name: string;
  description: string;
  isBotChannel: boolean;
};

const TsChannelSchema = new mongoose.Schema<TsChannelType>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  isBotChannel: { type: Boolean, default: false },
});

export default mongoose.model<TsChannelType>("TsChannel", TsChannelSchema);
