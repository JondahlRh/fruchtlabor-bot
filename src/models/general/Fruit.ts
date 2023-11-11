import mongoose from "mongoose";

const FruitSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

export default mongoose.model("Fruit", FruitSchema);
