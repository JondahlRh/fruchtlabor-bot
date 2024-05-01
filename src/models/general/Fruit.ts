import mongoose from "mongoose";
import { z } from "zod";

export const FruitZodSchema = z.object({
  name: z.string(),
});

export type FruitType = z.infer<typeof FruitZodSchema>;

const FruitSchema = new mongoose.Schema<FruitType>({
  name: { type: String, required: true },
});

export default mongoose.model<FruitType>("Fruit", FruitSchema);
