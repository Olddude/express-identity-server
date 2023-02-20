import mongoose from 'mongoose';
import { v4 } from 'uuid';

const ClientSchema = new mongoose.Schema({
  id: {type: String, default: v4(), unique: true, required: true},
  secret: {type: String, default: v4(), required: true},
  scope: {type: String, default: 'default', required: true},
  createdAt: {type: Date, default: Date.now, required: true},
  updatedAt: {type: Date, default: null, required: false},
  deletedAt: {type: Date, default: null, required: false},
});

const ClientRepository = mongoose.model('Client', ClientSchema);

export default ClientRepository;
