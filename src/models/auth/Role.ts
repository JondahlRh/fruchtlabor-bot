import mongoose from "mongoose";

import Permission, { PermissionType } from "./Permission";

export type RoleType = {
  name: string;
  permissions: PermissionType[];
};

const { ObjectId } = mongoose.Schema.Types;
const RoleSchema = new mongoose.Schema<RoleType>({
  name: { type: String, required: true },
  permissions: [{ type: ObjectId, ref: Permission }],
});

export default mongoose.model<RoleType>("Role", RoleSchema);
