import mongoose from "mongoose";
import { z } from "zod";

export const TsServergroupZodSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  isTeammember: z.boolean(),
});

type TsServergroupType = z.infer<typeof TsServergroupZodSchema>;

const TsServergroupSchema = new mongoose.Schema<TsServergroupType>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  isTeammember: { type: Boolean, default: false },
});

export default mongoose.model<TsServergroupType>(
  "TsServergroup",
  TsServergroupSchema
);
