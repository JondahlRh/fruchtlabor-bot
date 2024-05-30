import { Schema, model } from "mongoose";

export type TsChannelType = {
  id: number;
  name: string;
  description: string;
  isBotChannel: boolean;
};

const TsChannelSchema = new Schema<TsChannelType>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  isBotChannel: { type: Boolean, default: false, unique: true },
});

export default model<TsChannelType>("TsChannel", TsChannelSchema);
