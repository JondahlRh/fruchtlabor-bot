import mongoose from "mongoose";

const TsDescriptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
});

export default mongoose.model("TsDescription", TsDescriptionSchema);
