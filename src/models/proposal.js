import mongoose from "mongoose";

const proposalSchema = new mongoose.Schema({
  id: { type: String, required: true},
  client_id: { type: String, required: true },
  produtc: { type: String, required: true },
  monthly_amount: { type: Number, required: true },
  status: { 
    type: String,
    enum: [ 'DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'CANCELED' ],
    default: 'DRAFT'
  },
  origin: {
    type: String,
    enum: ['APP', 'SITE', 'API'],
  },
  version: {
    type: Number,
    idempotencyKey: String,
    deletedAt: Date
  },

}, {timestamps: true });

export default mongoose.model('Proposal', proposalSchema);