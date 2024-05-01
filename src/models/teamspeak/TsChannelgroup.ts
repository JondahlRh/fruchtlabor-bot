import mongoose from "mongoose";
import { z } from "zod";

export const TsChannelgroupZodSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
});

export type TsChannelgroupType = z.infer<typeof TsChannelgroupZodSchema>;

const TsChannelgroupSchema = new mongoose.Schema<TsChannelgroupType>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
});

export default mongoose.model<TsChannelgroupType>(
  "TsChannelgroup",
  TsChannelgroupSchema
);
