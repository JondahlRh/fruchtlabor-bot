import mongoose from "mongoose";
import { z } from "zod";

const FruitZodSchema = z.object({
  name: z.string(),
});

type FruitType = z.infer<typeof FruitZodSchema>;

const FruitSchema = new mongoose.Schema<FruitType>({
  name: { type: String, required: true },
});

export default mongoose.model<FruitType>("Fruit", FruitSchema);
