const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    required:true,
    trim: true, 
    unique: true,
  },
  description: {
    type: String,
    required: true,
    trim: true, 
  },
  picture: {
    type: String,
    required: true
  },
});


module.exports = mongoose.models.club || mongoose.model('club', clubSchema);
