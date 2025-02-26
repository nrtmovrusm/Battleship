/*eslint no-unused-vars: "off"*/

import "./styles.css";
import { Ship, Gameboard, Player } from "./shipsGameboard";

function initializePlayers() {
  let player1 = new Player("Player 1", 1);
  let player2 = new Player("Player 2", 2);
  return { player1, player2 };
}

function initializeShips(player) {
  const shipLengths = [1, 1, 1, 1, 2, 2, 2, 3, 3, 4];
  let fleetOfShips = shipLengths.map((length) => new Ship(length));
  player.board.placeShip(fleetOfShips[0], [1, 1]);
  player.board.placeShip(fleetOfShips[1], [10, 3]);
  player.board.placeShip(fleetOfShips[2], [9, 8]);
  player.board.placeShip(fleetOfShips[3], [4, 10]);
  player.board.placeShip(fleetOfShips[4], [1, 3]);
  player.board.placeShip(fleetOfShips[5], [6, 8]);
  player.board.placeShip(fleetOfShips[6], [6, 5]);
  player.board.placeShip(fleetOfShips[7], [2, 5]);
  player.board.placeShip(fleetOfShips[8], [2, 7]);
  player.board.placeShip(fleetOfShips[9], [4, 1]);
}

function displayNewGameboard(playerNo) {
  const boardDisplay = document.querySelector(`.board-display-${playerNo}`);
  for (let i = 1; i < 11; i++) {
    for (let j = 1; j < 11; j++) {
      const div = document.createElement("div");
      div.classList.add("square");
      div.classList.add("active");
      div.id = `x${j}y${i}`;
      div.textContent = " ";
      boardDisplay.append(div);
    }
  }
}

function updateGameboard(player) {
  const boardDisplay = document.querySelector(`.board-display-${player.id}`);
  for (let [x, y] of player.board.board) {
    const shipSquare = boardDisplay.querySelector(`#x${x}y${y}`); //need \\ to escape since class starts with number
    shipSquare.classList.add("ship");
  }
}

function selectOpponentSquare(player) {
  let opponent;
  if (player.id == 1) {
    opponent = player2;
  } else {
    opponent = player1;
  }

  const instructions = document.querySelector(".instructions-box");
  instructions.textContent = `${player.name}'s turn. Select square on opponent's grid to attack.`;
  let opponentBoard = document.querySelector(`.board-display-${opponent.id}`);
  const opponentSquares = opponentBoard.querySelectorAll(".active");

  opponentSquares.forEach((square) => {
    square.addEventListener("click", squareClicks);
  });

  function squareClicks(e) {
    let selectedSquareID = e.target.id;
    // ex: takes no12 --> [1, 2]
    let coordinatesXY = selectedSquareID.split("x")[1].split("y");
    let coordinates = [parseInt(coordinatesXY[0]), parseInt(coordinatesXY[1])];
    // returns true if hit and false if missed
    if (opponent.board.receiveAttack(coordinates)) {
      e.target.classList.add("hit");
      // continue turn if you hit the ship
      instructions.textContent = `Ship hit! Continue your turn.`;
      let ships = opponent.board.listOfShips;
      console.log(ships);
      console.log(opponent.board.allSunk());
      if (opponent.board.allSunk()) {
        instructions.textContent = `${opponent.name} has lost! ${player.name} wins!`;
        endGame(); // Ends the game if the opponent loses
        return; // Stops further attacks
      }
    } else {
      e.target.classList.add("miss");
      e.target.classList.add("disabled");
      e.target.classList.remove("active");
      e.target.removeEventListener("click", squareClicks);
      // change players if you miss the ship
      changePlayerTurn(player);
      instructions.textContent = `Missed! ${opponent.name}'s turn.`;
    }
    // Remove event listener after click to prevent re-clicking same spot
    e.target.disabled = true;
    e.target.classList.add("disabled");
    e.target.classList.remove("active");
    e.target.removeEventListener("click", squareClicks);
  }

  function endGame() {
    const allSquares = document.querySelectorAll(".square");
    allSquares.forEach((square) => {
      square.disabled = true;
      square.classList.add("disabled");
      square.classList.remove("active");
      square.removeEventListener("click", squareClicks);
    });
  }
}

function changePlayerTurn(currentPlayer) {
  currentPlayer.id === 1
    ? selectOpponentSquare(player2)
    : selectOpponentSquare(player1);
}

function startNewGame() {
  // gameboard has 20 arrays as ships occupy more coordinates than just starting coordinate
  initializeShips(player1);
  initializeShips(player2);
  displayNewGameboard(1);
  displayNewGameboard(2);
  updateGameboard(player1);
  updateGameboard(player2);

  //start with player 1's turn
  selectOpponentSquare(player1);
}

let { player1, player2 } = initializePlayers();
startNewGame();
