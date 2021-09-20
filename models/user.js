const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
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
    required : true
  },
  role : {
    type : String,
    default : 'user'
  },
  isLoggedIn: {
    type: Boolean
  },
  club_id: [{
    type: mongoose.Types.ObjectId,
    ref: "club",
    required : true
  }],
  activationCode : {
    type : String
  },
  passwordResetToken : {
    type: String,
  },
  passwordResetExpiresIn: {
    type: Date
  }
});

module.exports = mongoose.models.user || mongoose.model('user', UserSchema);
