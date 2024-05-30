import Fruit from "models/general/Fruit";

export const findFruits = async () => {
  try {
    return await Fruit.find().lean();
  } catch (error) {
    return [];
  }
};

export const findFruitById = async (id: string) => {
  try {
    return await Fruit.findById(id).lean();
  } catch (error) {
    return null;
  }
};
