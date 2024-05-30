import Role from "models/auth/Role";

const populate = ["premissions"];

export const findRoles = async () => {
  try {
    return await Role.find().populate(populate).lean();
  } catch (error) {
    return [];
  }
};

export const findRoleById = async (id: string) => {
  try {
    return await Role.findById(id).populate(populate).lean();
  } catch (error) {
    return null;
  }
};
