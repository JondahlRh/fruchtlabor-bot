import mongoose, { Types } from "mongoose";

import TsServergroup from "models/teamspeak/TsServergroup";

export type JoinMessageType = {
  servergroup: Types.ObjectId;
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
