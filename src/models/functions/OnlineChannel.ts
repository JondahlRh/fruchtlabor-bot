import mongoose, { Types } from "mongoose";

import TsChannel from "models/teamspeak/TsChannel";
import TsCollection from "models/teamspeak/TsCollection";
import TsServergroup from "models/teamspeak/TsServergroup";

export type OnlineChannelType = {
  channel: Types.ObjectId;
  servergroups: Types.Array<Types.ObjectId>;
  title: string;
  collections: Types.Array<Types.ObjectId>;
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
