import mongoose from "mongoose";
import { z } from "zod";

export const SupportLogZodSchema = z.object({
  channel: z.string(),
  client: z.string(),
  supportClientsListed: z.array(z.string()),
  supportClientsContact: z.array(z.string()),
});

export type SupportLogType = z.infer<typeof SupportLogZodSchema>;

const SupportLogSchema = new mongoose.Schema<SupportLogType>(
  {
    channel: { type: String, require: true },
    client: { type: String, require: true },
    supportClientsListed: [{ type: String, require: true }],
    supportClientsContact: [{ type: String, require: true }],
  },
  { timestamps: true }
);

export default mongoose.model<SupportLogType>("SupportLog", SupportLogSchema);
