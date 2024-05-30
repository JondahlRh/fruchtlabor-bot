import { Schema, model } from "mongoose";

export type CsServerType = {
  name: string;
  description: string;
  host: string;
  port: number;
};

const CsServerSchema = new Schema<CsServerType>({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  host: { type: String, required: true },
  port: { type: Number, required: true, validate: /^\d{1,5}$/ },
});

CsServerSchema.index({ host: 1, port: 1 }, { unique: true });

export default model<CsServerType>("CsServer", CsServerSchema);
