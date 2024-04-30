import mongoose from "mongoose";

import TsChannel, { TsChannelType } from "models/teamspeak/TsChannel";
import TsServergroup, {
  TsServergroupType,
} from "models/teamspeak/TsServergroup";

export type AddgroupChannelType = {
  channel: TsChannelType;
  moveChannel: TsChannelType;
  servergroup: TsServergroupType;
  message: string;
};

const { ObjectId } = mongoose.Schema.Types;
const AddgroupChannelSchema = new mongoose.Schema<AddgroupChannelType>({
  channel: { type: ObjectId, ref: TsChannel, require: true },
  moveChannel: { type: ObjectId, ref: TsChannel, require: true },
  servergroup: { type: ObjectId, ref: TsServergroup, require: true },
  message: { type: String, default: "" },
});

export default mongoose.model<AddgroupChannelType>(
  "AddgroupChannel",
  AddgroupChannelSchema
);
