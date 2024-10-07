import React, { useState } from 'react';
import './App.css';

const Game = () => {
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [player1Choice, setPlayer1Choice] = useState('');
  const [player2Choice, setPlayer2Choice] = useState('');
  const [rounds, setRounds] = useState(0);
  const [score, setScore] = useState({ player1: 0, player2: 0, ties: 0 });
  const [roundWinner, setRoundWinner] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [finalWinner, setFinalWinner] = useState('');

  const choices = ['stone', 'paper', 'scissors'];

  const handlePlayerChoice = (player, choice) => {
    if (player === 1) {
      setPlayer1Choice(choice);
    } else {
      setPlayer2Choice(choice);
    }
  };

  const handleRound = () => {
    if (rounds < 6) {
      let result;
      if (player1Choice === player2Choice) {
        result = 'Tie';
        setScore((prev) => ({ ...prev, ties: prev.ties + 1 }));
      } else if (
        (player1Choice === 'stone' && player2Choice === 'scissors') ||
        (player1Choice === 'scissors' && player2Choice === 'paper') ||
        (player1Choice === 'paper' && player2Choice === 'stone')
      ) {
        result = `${player1Name} wins this round!`;
        setScore((prev) => ({ ...prev, player1: prev.player1 + 1 }));
      } else {
        result = `${player2Name} wins this round!`;
        setScore((prev) => ({ ...prev, player2: prev.player2 + 1 }));
      }

      setRoundWinner(result);
      setRounds(rounds + 1);
      setPlayer1Choice('');
      setPlayer2Choice('');

      // Check if the game is over after this round
      if (rounds + 1 === 6) {
        setGameOver(true);
        if (score.player1 > score.player2) {
          setFinalWinner(`${player1Name} wins the game!`);
        } else if (score.player1 < score.player2) {
          setFinalWinner(`${player2Name} wins the game!`);
        } else {
          setFinalWinner('It\'s a tie!');
        }
      }
    }
  };

  const handleStartGame = () => {
    if (!player1Name || !player2Name) {
      alert("Please enter names for both players.");
      return;
    }
    setGameStarted(true);
  };

  const handleNewGame = () => {
    setPlayer1Name('');
    setPlayer2Name('');
    setPlayer1Choice('');
    setPlayer2Choice('');
    setRounds(0);
    setScore({ player1: 0, player2: 0, ties: 0 });
    setRoundWinner('');
    setFinalWinner('');
    setGameOver(false);
    setGameStarted(false);
  };

  return (
    <div className="game-container">
      <h1>Stone Paper Scissors</h1>
      {!gameStarted ? (
        <div className="name-input">
          <input
            type="text"
            value={player1Name}
            onChange={(e) => setPlayer1Name(e.target.value)}
            placeholder="Enter Player 1 Name"
          />
          <input
            type="text"
            value={player2Name}
            onChange={(e) => setPlayer2Name(e.target.value)}
            placeholder="Enter Player 2 Name"
          />
          <button onClick={handleStartGame}>Start Game</button>
        </div>
      ) : (
        <div className="game-play">
          {gameOver ? (
            <div>
              <h2>{finalWinner}</h2>
              <h3>Final Score: {player1Name} - {score.player1}, {player2Name} - {score.player2}, Ties - {score.ties}</h3>
              <button className="new-game-button" onClick={handleNewGame}>Start New Game</button>
            </div>
          ) : (
            <>
              <div className="choices">
                <div className="player">
                  <h2>{player1Name}</h2>
                  {choices.map(choice => (
                    <button
                      key={choice}
                      className={`choice-button ${player1Choice === choice ? 'selected' : ''}`}
                      onClick={() => handlePlayerChoice(1, choice)}
                    >
                      {choice.charAt(0).toUpperCase() + choice.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="player">
                  <h2>{player2Name}</h2>
                  {choices.map(choice => (
                    <button
                      key={choice}
                      className={`choice-button ${player2Choice === choice ? 'selected' : ''}`}
                      onClick={() => handlePlayerChoice(2, choice)}
                    >
                      {choice.charAt(0).toUpperCase() + choice.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <button className="round-button" onClick={handleRound} disabled={!player1Choice || !player2Choice}>
                Play Round
              </button>
              <h3>{roundWinner}</h3>
              <h3>Rounds: {rounds} / 6</h3>
              <h3>Score: {player1Name} - {score.player1}, {player2Name} - {score.player2}, Ties - {score.ties}</h3>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Game;
