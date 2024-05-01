import mongoose from "mongoose";
import { z } from "zod";

export const TsChannelZodSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  isBotChannel: z.boolean(),
});

export type TsChannelType = z.infer<typeof TsChannelZodSchema>;

const TsChannelSchema = new mongoose.Schema<TsChannelType>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  isBotChannel: { type: Boolean, default: false },
});

export default mongoose.model<TsChannelType>("TsChannel", TsChannelSchema);
