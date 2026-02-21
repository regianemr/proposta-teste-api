import mongoose from "mongoose";

const auditSchema = new mongoose.Schema({
  id: { type: String, required: true},
  proposal_id: { type: String, required: true },
  actor: { type: String, required: true },
  event: { type: String,
    enum: [ 'CREATED', 'UPDATED_FIELDS', 'STATUS_CHANGED', 'DELETED_LOGICAL'] 
  },
  payload: Object,

}, {timestamps: true });

export default mongoose.model('Audit', auditSchema);