import mongoose, { Types } from "mongoose";
import { PermissionType } from "types/general";

import TsChannel from "models/teamspeak/TsChannel";
import TsDescription from "models/teamspeak/TsDescription";

export type LobbyChannelType = {
  channelParent: Types.ObjectId;
  channelParentSiblings: Types.Array<Types.ObjectId>;
  description: Types.ObjectId;
  prefix: string;
  minimum: number;
  clientLimit: number;
  permissions: PermissionType[];
};

const { ObjectId } = mongoose.Schema.Types;
const LobbyChannelSchema = new mongoose.Schema<LobbyChannelType>({
  channelParent: { type: ObjectId, ref: TsChannel, require: true },
  channelParentSiblings: [{ type: ObjectId, ref: TsChannel, require: true }],
  description: { type: ObjectId, ref: TsDescription, require: true },
  prefix: { type: String, default: "" },
  minimum: { type: Number, default: 2 },
  clientLimit: { type: Number, default: -1 },
  permissions: [
    {
      key: { type: String, required: true },
      value: { type: Number, required: true },
    },
  ],
});

export default mongoose.model<LobbyChannelType>(
  "LobbyChannel",
  LobbyChannelSchema
);
