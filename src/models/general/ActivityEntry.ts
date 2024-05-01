import mongoose from "mongoose";
import { z } from "zod";

export const ActivityEntryZodSchema = z.object({
  uuid: z.string(),
  active: z.number(),
  online: z.number(),
});

export type ActivityEntryType = z.infer<typeof ActivityEntryZodSchema>;

const ActivityEntrySchema = new mongoose.Schema<ActivityEntryType>({
  uuid: { type: String, required: true },
  active: { type: Number, required: true },
  online: { type: Number, required: true },
});

export default mongoose.model<ActivityEntryType>(
  "ActivityEntry",
  ActivityEntrySchema
);
