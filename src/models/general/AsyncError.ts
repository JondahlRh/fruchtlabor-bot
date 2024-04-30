import mongoose from "mongoose";

export type AsyncErrorType = {
  function: string;
  message: string;
  name: string;
  stack: string;
};

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
