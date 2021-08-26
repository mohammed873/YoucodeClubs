const mongoose = require("mongoose");

const clubActivitySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    trim: true, 
  },
  description: {
    type: String,
    trim: true
  },
  picture: {
    type: String,
  },
  club_id: {
    type: mongoose.Types.ObjectId,
    ref: "club",
    required : true
  },
  date: {
    type: Date
  },
});

module.exports = mongoose.models.clubActivity || mongoose.model('clubActivity', clubActivitySchema);
