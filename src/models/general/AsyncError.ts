import mongoose from "mongoose";
import { z } from "zod";

const AsyncErrorZodSchema = z.object({
  function: z.string(),
  message: z.string(),
  name: z.string(),
  stack: z.string(),
});

type AsyncErrorType = z.infer<typeof AsyncErrorZodSchema>;

const AsyncErrorSchema = new mongoose.Schema<AsyncErrorType>(
  {
    function: { type: String, required: true },
    message: { type: String, required: true },
    name: { type: String, required: true },
    stack: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model<AsyncErrorType>("AsyncError", AsyncErrorSchema);
