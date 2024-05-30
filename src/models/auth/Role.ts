import { Schema, Types, model } from "mongoose";

import Permission, { PermissionType } from "./Permission";

export type RoleType = {
  name: string;
  permissions: PermissionType[];
};

const RoleSchema = new Schema<RoleType>({
  name: { type: String, required: true },
  permissions: [{ type: Types.ObjectId, ref: Permission }],
});

export default model<RoleType>("Role", RoleSchema);
