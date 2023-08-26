import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
  },
  accessType: {
    type: String, // Currently only accepting "admin" or "employee" as values
    required: [true],
  },
});

const User = mongoose.model('User', userSchema);
export default User;
