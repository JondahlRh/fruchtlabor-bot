import mongoose from "mongoose";

import TsServergroup, {
  TsServergroupType,
} from "models/teamspeak/TsServergroup";

type JoinMessageType = {
  servergroup: TsServergroupType;
  message: string;
};

const { ObjectId } = mongoose.Schema.Types;
const JoinMessageSchema = new mongoose.Schema<JoinMessageType>({
  servergroup: { type: ObjectId, ref: TsServergroup, required: true },
  message: { type: String, required: true },
});

export default mongoose.model<JoinMessageType>(
  "JoinMessage",
  JoinMessageSchema
);
