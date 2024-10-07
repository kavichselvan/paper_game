const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
  player1Choice: { type: String, required: true },
  player2Choice: { type: String, required: true },
  roundWinner: { type: String, required: true }
});

module.exports = mongoose.model('Round', roundSchema);
