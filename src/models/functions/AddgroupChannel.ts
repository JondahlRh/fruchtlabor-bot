import { Schema, Types, model } from "mongoose";

import TsChannel, { TsChannelType } from "models/teamspeak/TsChannel";
import TsServergroup, {
  TsServergroupType,
} from "models/teamspeak/TsServergroup";

type AddgroupChannelType = {
  channel: TsChannelType;
  moveChannel: TsChannelType;
  servergroup: TsServergroupType;
  message: string;
};

const AddgroupChannelSchema = new Schema<AddgroupChannelType>({
  channel: { type: Types.ObjectId, ref: TsChannel, required: true },
  moveChannel: { type: Types.ObjectId, ref: TsChannel, required: true },
  servergroup: { type: Types.ObjectId, ref: TsServergroup, required: true },
  message: { type: String, default: "" },
});

export default model<AddgroupChannelType>(
  "AddgroupChannel",
  AddgroupChannelSchema
);
