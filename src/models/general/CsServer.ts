import mongoose from "mongoose";

export type CsServerType = {
  name: string;
  description: string;
  ip: string;
  port: number;
};

const CsServerSchema = new mongoose.Schema<CsServerType>({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  ip: { type: String, required: true },
  port: { type: Number, required: true, validate: /^\d{1,5}$/ },
});

export default mongoose.model<CsServerType>("CsServer", CsServerSchema);
