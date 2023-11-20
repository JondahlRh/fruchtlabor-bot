import mongoose from "mongoose";

const AsyncErrorSchema = new mongoose.Schema({
  function: { type: String, required: true },
  message: { type: String, required: true },
  name: { type: String, required: true },
  stack: { type: String, default: "" },
});

export default mongoose.model("AsyncError", AsyncErrorSchema);
