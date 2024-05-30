import { Schema, Types, model } from "mongoose";

import { PermissionSchema } from "models/general/general";
import TsChannel, { TsChannelType } from "models/teamspeak/TsChannel";
import TsDescription, {
  TsDescriptionType,
} from "models/teamspeak/TsDescription";

import { TsPermissionType } from "types/general";

type LobbyChannelType = {
  channelParent: TsChannelType;
  channelParentSiblings: TsChannelType[];
  description: TsDescriptionType;
  prefix: string;
  minimum: number;
  clientLimit: number;
  permissions: TsPermissionType[];
};

const LobbyChannelSchema = new Schema<LobbyChannelType>({
  channelParent: { type: Types.ObjectId, ref: TsChannel, required: true },
  channelParentSiblings: [{ type: Types.ObjectId, ref: TsChannel }],
  description: { type: Types.ObjectId, ref: TsDescription, required: true },
  prefix: { type: String, default: "" },
  minimum: { type: Number, default: 2 },
  clientLimit: { type: Number, default: -1 },
  permissions: [PermissionSchema],
});

export default model<LobbyChannelType>("LobbyChannel", LobbyChannelSchema);
