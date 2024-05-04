import mongoose from "mongoose";
import { z } from "zod";

export const PermissionZodSchema = z.object({
  name: z.string(),
});

export type PermissionType = z.infer<typeof PermissionZodSchema>;

const PermissionSchema = new mongoose.Schema<PermissionType>({
  name: { type: String, required: true },
});

export default mongoose.model<PermissionType>("Permission", PermissionSchema);
