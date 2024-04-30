import mongoose from "mongoose";

export type SupportLogType = {
  channel: string;
  client: string;
  supportClientsListed: string[];
  supportClientsContact: string[];
};

const SupportLogSchema = new mongoose.Schema<SupportLogType>(
  {
    channel: { type: String, require: true },
    client: { type: String, require: true },
    supportClientsListed: [{ type: String, require: true }],
    supportClientsContact: [{ type: String, require: true }],
  },
  { timestamps: true }
);

export default mongoose.model<SupportLogType>("SupportLog", SupportLogSchema);
