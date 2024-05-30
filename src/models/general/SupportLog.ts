import { Schema, model } from "mongoose";

type SupportLogType = {
  channel: string;
  client: string;
  supportClientsListed: string[];
  supportClientsContact: string[];
};

const SupportLogSchema = new Schema<SupportLogType>(
  {
    channel: { type: String, required: true },
    client: { type: String, required: true },
    supportClientsListed: [{ type: String, required: true }],
    supportClientsContact: [{ type: String, required: true }],
  },
  { timestamps: true }
);

export default model<SupportLogType>("SupportLog", SupportLogSchema);
