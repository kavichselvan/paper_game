const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  player1Name: { type: String, required: true },
  player2Name: { type: String, required: true },
  player1Score: { type: Number, default: 0 },
  player2Score: { type: Number, default: 0 },
  ties: { type: Number, default: 0 },
  rounds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Round' }]
});

module.exports = mongoose.model('Game', gameSchema);
