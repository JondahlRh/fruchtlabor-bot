import mongoose from "mongoose";
import { z } from "zod";

export const TsDescriptionZodSchema = z.object({
  text: z.string(),
});

export type TsDescriptionType = z.infer<typeof TsDescriptionZodSchema>;

const TsDescriptionSchema = new mongoose.Schema<TsDescriptionType>({
  text: { type: String, required: true },
});

export default mongoose.model<TsDescriptionType>(
  "TsDescription",
  TsDescriptionSchema
);
