import { Schema, model } from "mongoose";

type FruitType = {
  name: string;
};

const FruitSchema = new Schema<FruitType>({
  name: { type: String, required: true, unique: true },
});

export default model<FruitType>("Fruit", FruitSchema);
