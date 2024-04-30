import mongoose from "mongoose";

import CsServer, { CsServerType } from "models/general/CsServer";
import TsChannel, { TsChannelType } from "models/teamspeak/TsChannel";

export type ServerOverviewType = {
  title: string;
  subtitle: string;
  description: string;
  channel: TsChannelType;
  servers: CsServerType[];
};

const { ObjectId } = mongoose.Schema.Types;
const ServerOverviewSchema = new mongoose.Schema<ServerOverviewType>({
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  description: { type: String, default: "" },
  channel: { type: ObjectId, ref: TsChannel, require: true },
  servers: [{ type: ObjectId, ref: CsServer, require: true }],
});

export default mongoose.model<ServerOverviewType>(
  "ServerOverview",
  ServerOverviewSchema
);
