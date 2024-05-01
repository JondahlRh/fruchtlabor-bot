import mongoose from "mongoose";
import { z } from "zod";

export const ActivityEntryDZodSchema = z.object({
  uuid: z.string(),
  active: z.number(),
  online: z.number(),
});

export type ActivityEntryDType = z.infer<typeof ActivityEntryDZodSchema>;

const ActivityEntryDSchema = new mongoose.Schema<ActivityEntryDType>(
  {
    uuid: { type: String, required: true },
    active: { type: Number, required: true },
    online: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ActivityEntryDType>(
  "ActivityEntryD",
  ActivityEntryDSchema
);
