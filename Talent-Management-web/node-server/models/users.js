import mongoose from "mongoose";



const UserSchema = mongoose.Schema({
  
  password: {
    type: String,
    required: true,
  },
  dep: { 
    type: String, 
    required: true,
    enum: [
      'RH',
      'MANAGEMENT',
      'PRODUCTION',
      'HORS_PRODUCTION',
      'SUPPORT_PRODUCTION'
    ],
  }, 
  pos: { 
    type: String,
    required: true,
    enum: [
      'DIRECTOR',
      'MANAGER',
      'CONSULTANT'
    ],
  },
  firstname: {
    type: String,
    required: true,
  },

  lastname: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },
  
  isVerified: {
    type: Boolean, 
    default: false, 
  }
});

const Users = mongoose.model("users", UserSchema);
export default Users;