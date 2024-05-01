import mongoose from "mongoose";
import { z } from "zod";

export const CsServerZodSchema = z.object({
  name: z.string(),
  description: z.string(),
  ip: z.string(),
  port: z.number(),
});

export type CsServerType = z.infer<typeof CsServerZodSchema>;

const CsServerSchema = new mongoose.Schema<CsServerType>({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  ip: { type: String, required: true },
  port: { type: Number, required: true, validate: /^\d{1,5}$/ },
});

export default mongoose.model<CsServerType>("CsServer", CsServerSchema);
