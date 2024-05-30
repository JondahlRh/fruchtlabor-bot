import { Schema, Types, model } from "mongoose";

import Permission, { PermissionType } from "./Permission";
import Role, { RoleType } from "./Role";

type UserType = {
  username: string;
  apikey: string;
  isOwner: boolean;
  roles: RoleType[];
  permissions: PermissionType[];
};

const UserSchema = new Schema<UserType>({
  username: { type: String, required: true },
  apikey: { type: String, required: true },
  isOwner: { type: Boolean, default: false },
  roles: [{ type: Types.ObjectId, ref: Role }],
  permissions: [{ type: Types.ObjectId, ref: Permission }],
});

export default model<UserType>("User", UserSchema);
