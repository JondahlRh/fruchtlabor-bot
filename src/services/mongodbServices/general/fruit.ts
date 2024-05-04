import Fruit from "models/general/Fruit";

export const findFruits = async () => {
  try {
    return await Fruit.find();
  } catch (error) {
    return [];
  }
};

export const findFruitById = async (id: string) => {
  try {
    return await Fruit.findById(id);
  } catch (error) {
    return null;
  }
};
