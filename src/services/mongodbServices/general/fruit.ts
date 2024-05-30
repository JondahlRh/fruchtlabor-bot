import Fruit from "models/general/Fruit";

export const findFruits = async () => {
  try {
    return await Fruit.find().lean();
  } catch (error) {
    return [];
  }
};
