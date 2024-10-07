const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message || err);
    process.exit(1);
  });

const Game = require('./models/Game');
const Round = require('./models/Round');

app.post('/api/game/start', async (req, res) => {
  try {
    const { player1Name, player2Name } = req.body;
    const newGame = new Game({ player1Name, player2Name, rounds: [] });
    await newGame.save();
    res.status(201).json({ message: 'Game started successfully!', gameId: newGame._id });
  } catch (err) {
    res.status(500).json({ message: 'Error starting game', error: err.message });
  }
});

app.post('/api/game/:gameId/round', async (req, res) => {
  try {
    const { gameId } = req.params;
    const { player1Choice, player2Choice } = req.body;

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    let roundWinner = 'Tie';
    if (player1Choice.toLowerCase() === 'stone' && player2Choice.toLowerCase() === 'scissors' ||
        player1Choice.toLowerCase() === 'scissors' && player2Choice.toLowerCase() === 'paper' ||
        player1Choice.toLowerCase() === 'paper' && player2Choice.toLowerCase() === 'stone') {
      roundWinner = game.player1Name;
      game.player1Score = (game.player1Score || 0) + 1;
    } else if (player2Choice.toLowerCase() === 'stone' && player1Choice.toLowerCase() === 'scissors' ||
               player2Choice.toLowerCase() === 'scissors' && player1Choice.toLowerCase() === 'paper' ||
               player2Choice.toLowerCase() === 'paper' && player1Choice.toLowerCase() === 'stone') {
      roundWinner = game.player2Name;
      game.player2Score = (game.player2Score || 0) + 1;
    } else {
      game.ties = (game.ties || 0) + 1;
    }

    const newRound = new Round({ player1Choice, player2Choice, roundWinner });
    game.rounds.push(newRound);
    await game.save();

    res.status(200).json({ message: 'Round played successfully', round: newRound, scores: { player1: game.player1Score, player2: game.player2Score, ties: game.ties } });
  } catch (err) {
    res.status(500).json({ message: 'Error playing round', error: err.message });
  }
});

app.get('/api/game', async (req, res) => {
  try {
    const games = await Game.find();
    res.status(200).json(games);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving games', error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
