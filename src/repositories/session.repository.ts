import mongoose from 'mongoose';
import { v4 } from 'uuid';

const SessionSchema = new mongoose.Schema({
  session: {type: String, default: v4(), required: true},
  expires: {type: Date, default: Date.now, required: true},
});

const SessionRepository = mongoose.model('Session', SessionSchema);

export default SessionRepository;
