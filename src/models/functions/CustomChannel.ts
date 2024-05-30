import mongoose from "mongoose";

import TsChannel, { TsChannelType } from "models/teamspeak/TsChannel";
import TsChannelgroup, {
  TsChannelgroupType,
} from "models/teamspeak/TsChannelgroup";

import { TsPermissionType } from "types/general";

type CustomChannelType = {
  channelParent: TsChannelType;
  channelGroup: TsChannelgroupType;
  prefix: string;
  permissions: TsPermissionType[];
};

const { ObjectId } = mongoose.Schema.Types;
const CustomChannelSchema = new mongoose.Schema<CustomChannelType>({
  channelParent: { type: ObjectId, ref: TsChannel, required: true },
  channelGroup: { type: ObjectId, ref: TsChannelgroup, required: true },
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
