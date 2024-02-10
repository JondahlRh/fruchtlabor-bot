import mongoose from "mongoose";

const SupportLogSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  channel: { type: String, require: true },
  client: { type: String, require: true },
  supportClientsListed: [{ type: String, require: true }],
  supportClientsContact: [{ type: String, require: true }],
});

export default mongoose.model("SupportLog", SupportLogSchema);
