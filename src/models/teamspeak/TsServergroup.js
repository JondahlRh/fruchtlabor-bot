import mongoose from "mongoose";

const TsServergroupSchema = new mongoose.Schema({
  servergroupId: { type: Number, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
});

export default mongoose.model("TsServergroup", TsServergroupSchema);
