import { Schema, model } from "mongoose";

type AsyncErrorType = {
  function: string;
  message: string;
  name: string;
  stack: string;
};

const AsyncErrorSchema = new Schema<AsyncErrorType>(
  {
    function: { type: String, required: true },
    message: { type: String, required: true },
    name: { type: String, required: true },
    stack: { type: String, default: "" },
  },
  { timestamps: true }
);

export default model<AsyncErrorType>("AsyncError", AsyncErrorSchema);
