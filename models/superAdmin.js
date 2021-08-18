const mongoose = require("mongoose");

const superAdminSchema = new mongoose.Schema({
  full_name: {
    type: String,
    trim: true, 
  },
  email: {
    type: String,
    unique: true,
    trim: true, 
  },
  password: {
    type: String,
    trim: true
  },
  picture: {
    type: String,
  },
  role : {
    type : String,
    default : 'superAdmin'
  },
  isLoggedIn: {
    type: Boolean
  },
  passwordResetToken : {
    type: String,
  },
  passwordResetExpiresIn: {
    type: Date
  }
});

module.exports = mongoose.models.superAdmin || mongoose.model('superAdmin', superAdminSchema);
