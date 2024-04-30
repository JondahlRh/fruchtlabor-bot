import mongoose from "mongoose";

import TsChannel, { TsChannelType } from "models/teamspeak/TsChannel";
import TsCollection, { TsCollectionType } from "models/teamspeak/TsCollection";
import TsServergroup, {
  TsServergroupType,
} from "models/teamspeak/TsServergroup";

export type OnlineChannelType = {
  channel: TsChannelType;
  servergroups: TsServergroupType[];
  title: string;
  collections: TsCollectionType[];
};

const { ObjectId } = mongoose.Schema.Types;
const OnlineChannelSchema = new mongoose.Schema<OnlineChannelType>({
  channel: { type: ObjectId, ref: TsChannel, require: true },
  servergroups: [{ type: ObjectId, ref: TsServergroup, require: true }],
  title: { type: String, require: true },
  collections: [{ type: ObjectId, ref: TsCollection }],
});

export default mongoose.model<OnlineChannelType>(
  "OnlineChannel",
  OnlineChannelSchema
);
