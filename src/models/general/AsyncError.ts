import mongoose from "mongoose";

export type AsyncErrorType = {
  timestamp: Date;
  function: string;
  message: string;
  name: string;
  stack: string;
};

const AsyncErrorSchema = new mongoose.Schema<AsyncErrorType>({
  timestamp: { type: Date, required: true },
  function: { type: String, required: true },
  message: { type: String, required: true },
  name: { type: String, required: true },
  stack: { type: String, default: "" },
});

export default mongoose.model<AsyncErrorType>("AsyncError", AsyncErrorSchema);
