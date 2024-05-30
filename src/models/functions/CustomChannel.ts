import { Schema, Types, model } from "mongoose";

import { PermissionSchema } from "models/general/general";
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

const CustomChannelSchema = new Schema<CustomChannelType>({
  channelParent: { type: Types.ObjectId, ref: TsChannel, required: true },
  channelGroup: { type: Types.ObjectId, ref: TsChannelgroup, required: true },
  prefix: { type: String, default: "" },
  permissions: [PermissionSchema],
});

export default model<CustomChannelType>("CustomChannel", CustomChannelSchema);
