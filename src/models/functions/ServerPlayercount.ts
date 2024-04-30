import mongoose from "mongoose";

import CsServer, { CsServerType } from "models/general/CsServer";
import TsChannel, { TsChannelType } from "models/teamspeak/TsChannel";

export type ServerPlayercountType = {
  title: string;
  description: string;
  channel: TsChannelType;
  server: CsServerType;
};

const { ObjectId } = mongoose.Schema.Types;
const ServerPlayercountSchema = new mongoose.Schema<ServerPlayercountType>({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  channel: { type: ObjectId, ref: TsChannel, require: true },
  server: { type: ObjectId, ref: CsServer, require: true },
});

export default mongoose.model<ServerPlayercountType>(
  "ServerPlayercount",
  ServerPlayercountSchema
);
