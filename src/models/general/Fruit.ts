import mongoose from "mongoose";

type FruitType = {
  name: string;
};

const FruitSchema = new mongoose.Schema<FruitType>({
  name: { type: String, required: true },
});

export default mongoose.model<FruitType>("Fruit", FruitSchema);
