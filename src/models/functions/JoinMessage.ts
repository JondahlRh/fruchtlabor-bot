import mongoose from "mongoose";

import TsServergroup, { TsServergroupType } from "models/teamspeak/TsServergroup";

export type JoinMessageType = {
  servergroup: TsServergroupType;
  message: string;
};

const { ObjectId } = mongoose.Schema.Types;
const JoinMessageSchema = new mongoose.Schema<JoinMessageType>({
  servergroup: { type: ObjectId, ref: TsServergroup, require: true },
  message: { type: String, require: true },
});

export default mongoose.model<JoinMessageType>(
  "JoinMessage",
  JoinMessageSchema
);
