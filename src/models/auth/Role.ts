import mongoose from "mongoose";
import { z } from "zod";

import Permission, { PermissionZodSchema } from "./Permission";

export const RoleZodSchema = z.object({
  name: z.string(),
  permissions: z.array(PermissionZodSchema),
});

export type RoleType = z.infer<typeof RoleZodSchema>;

const { ObjectId } = mongoose.Schema.Types;
const RoleSchema = new mongoose.Schema<RoleType>({
  name: { type: String, require: true },
  permissions: [{ type: ObjectId, ref: Permission }],
});

export default mongoose.model<RoleType>("Role", RoleSchema);
