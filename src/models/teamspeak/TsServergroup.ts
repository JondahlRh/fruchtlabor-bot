import mongoose from "mongoose";

const TsServergroupSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  isTeammember: { type: Boolean, default: false },
});

export default mongoose.model("TsServergroup", TsServergroupSchema);
