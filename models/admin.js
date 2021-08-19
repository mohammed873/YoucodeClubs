const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
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
  isRessted: {
    type: Boolean
  },
  role : {
    type : String,
    default : 'admin'
  },
  isLoggedIn: {
    type: Boolean
  },
  club_id: {
    type: mongoose.Types.ObjectId,
    ref: "club",
    required : true
  },
  passwordResetToken : {
    type: String,
  },
  passwordResetExpiresIn: {
    type: Date
  }
});

module.exports = mongoose.models.admin || mongoose.model('admin', AdminSchema);
