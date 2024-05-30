import Permission from "models/auth/Permission";

export const findPermissions = async () => {
  try {
    return await Permission.find().lean();
  } catch (error) {
    return [];
  }
};

export const findPermissionById = async (id: string) => {
  try {
    return await Permission.findById(id).lean();
  } catch (error) {
    return null;
  }
};
