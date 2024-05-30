import { Schema, model } from "mongoose";

export type PermissionType = {
  name: string;
};

const PermissionSchema = new Schema<PermissionType>({
  name: { type: String, required: true },
});

export default model<PermissionType>("Permission", PermissionSchema);
