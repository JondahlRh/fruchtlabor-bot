import mongoose from "mongoose";

import Permission, { PermissionType } from "./Permission";
import Role, { RoleType } from "./Role";

type UserType = {
  username: string;
  apikey: string;
  isOwner: boolean;
  roles: RoleType[];
  permissions: PermissionType[];
};

const { ObjectId } = mongoose.Schema.Types;
const UserSchema = new mongoose.Schema<UserType>({
  username: { type: String, required: true },
  apikey: { type: String, required: true },
  isOwner: { type: Boolean, default: false },
  roles: [{ type: ObjectId, ref: Role }],
  permissions: [{ type: ObjectId, ref: Permission }],
});

export default mongoose.model<UserType>("User", UserSchema);
