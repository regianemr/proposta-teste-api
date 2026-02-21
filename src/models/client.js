import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  id: { type: String, required: true},
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  document: { type: Number, required: true },
}, {timestamps: true });

export default mongoose.model('Client', clientSchema);