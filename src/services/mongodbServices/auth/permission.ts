import Permission from "models/auth/Permission";

export const findPermissions = async () => {
  try {
    return await Permission.find();
  } catch (error) {
    return [];
  }
};

export const findPermissionById = async (id: string) => {
  try {
    return await Permission.findById(id);
  } catch (error) {
    return null;
  }
};
