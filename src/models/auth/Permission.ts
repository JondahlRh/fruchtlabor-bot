import mongoose from "mongoose";

export type PermissionType = {
  name: string;
};

const PermissionSchema = new mongoose.Schema<PermissionType>({
  name: { type: String, required: true },
});

export default mongoose.model<PermissionType>("Permission", PermissionSchema);
