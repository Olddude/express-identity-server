import mongoose from 'mongoose';
import { v4 } from 'uuid';

const UserSchema = new mongoose.Schema({
  id: {type: String, default: v4(), unique: true, required: true},
  email: {type: String, default: '', unique: true, required: true},
  username: {type: String, default: '', unique: true, required: true},
  passwordHash: {type: String, default: '', required: true},
  firstname: {type: String, default: '', required: true},
  lastname: {type: String, default: '', required: true},
  avatar: {type: String, default: '/avatar.jpeg', required: true},
  roles: {type: [String], default: ['admin'], required: true},
  createdAt: {type: Date, default: Date.now, required: true},
  updatedAt: {type: Date, default: null, required: false},
  deletedAt: {type: Date, default: null, required: false},
});

const UserRepository = mongoose.model('User', UserSchema);

export default UserRepository;
