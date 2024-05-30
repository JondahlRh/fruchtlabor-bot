import mongoose from "mongoose";
import { z } from "zod";

import Permission, { PermissionZodSchema } from "./Permission";
import Role, { RoleZodSchema } from "./Role";

const UserZodSchema = z.object({
  username: z.string(),
  apikey: z.string(),
  isOwner: z.boolean(),
  roles: z.array(RoleZodSchema),
  permissions: z.array(PermissionZodSchema),
});

type UserType = z.infer<typeof UserZodSchema>;

const { ObjectId } = mongoose.Schema.Types;
const UserSchema = new mongoose.Schema<UserType>({
  username: { type: String, required: true },
  apikey: { type: String, required: true },
  isOwner: { type: Boolean, default: false },
  roles: [{ type: ObjectId, ref: Role }],
  permissions: [{ type: ObjectId, ref: Permission }],
});

export default mongoose.model<UserType>("User", UserSchema);
