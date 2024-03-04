import mongoose from "mongoose";

const CsServerSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  ip: { type: String, required: true },
  port: { type: Number, required: true, validate: /^\d{1,5}$/ },
});

export default mongoose.model("CsServer", CsServerSchema);
