import mongoose, { Types } from "mongoose";
import { PermissionType } from "types/general";

import TsChannel from "models/teamspeak/TsChannel";
import TsChannelgroup from "models/teamspeak/TsChannelgroup";

export type CustomChannelType = {
  channelParent: Types.ObjectId;
  channelGroup: Types.ObjectId;
  prefix: string;
  permissions: PermissionType[];
};

const { ObjectId } = mongoose.Schema.Types;
const CustomChannelSchema = new mongoose.Schema<CustomChannelType>({
  channelParent: { type: ObjectId, ref: TsChannel, require: true },
  channelGroup: { type: ObjectId, ref: TsChannelgroup, require: true },
  prefix: { type: String, default: "" },
  permissions: [
    {
      key: { type: String, required: true },
      value: { type: Number, required: true },
    },
  ],
});

export default mongoose.model<CustomChannelType>(
  "CustomChannel",
  CustomChannelSchema
);
