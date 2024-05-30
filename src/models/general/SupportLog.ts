import mongoose from "mongoose";
import { z } from "zod";

const SupportLogZodSchema = z.object({
  channel: z.string(),
  client: z.string(),
  supportClientsListed: z.array(z.string()),
  supportClientsContact: z.array(z.string()),
});

type SupportLogType = z.infer<typeof SupportLogZodSchema>;

const SupportLogSchema = new mongoose.Schema<SupportLogType>(
  {
    channel: { type: String, required: true },
    client: { type: String, required: true },
    supportClientsListed: [{ type: String, required: true }],
    supportClientsContact: [{ type: String, required: true }],
  },
  { timestamps: true }
);

export default mongoose.model<SupportLogType>("SupportLog", SupportLogSchema);
