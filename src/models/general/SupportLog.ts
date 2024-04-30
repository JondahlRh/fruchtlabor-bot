import mongoose from "mongoose";

export type SupportLogType = {
  timestamp: Date;
  channel: string;
  client: string;
  supportClientsListed: string[];
  supportClientsContact: string[];
};

const SupportLogSchema = new mongoose.Schema<SupportLogType>({
  timestamp: { type: Date, required: true },
  channel: { type: String, require: true },
  client: { type: String, require: true },
  supportClientsListed: [{ type: String, require: true }],
  supportClientsContact: [{ type: String, require: true }],
});

export default mongoose.model<SupportLogType>("SupportLog", SupportLogSchema);
