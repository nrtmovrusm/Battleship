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

  fleetOfShips.forEach((ship) => {
    placeShipRandomly(player, ship);
  });
}

function placeShipRandomly(player, ship) {
  let isPlaced = false;

  while (!isPlaced) {
    let x = Math.floor(Math.random() * 10) + 1; // +1 to eliminate picking 0
    let y = Math.floor(Math.random() * 10) + 1;

    let orientation = Math.random() < 0.5 ? "horizontal" : "vertical";
    ship.orientation = orientation;

    // if able to place on board then returns true
    if (player.board.placeShip(ship, [x, y])) {
      isPlaced = true;
    }
  }
}

function displayNewGameboard(playerNo) {
  const boardDisplay = document.querySelector(`.board-display-${playerNo}`);
  for (let i = 1; i < 11; i++) {
    for (let j = 1; j < 11; j++) {
      const div = document.createElement("div");
      div.classList.add("square");
      div.classList.add("active");
      div.classList.add(`${playerNo}`);
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

const instructions = document.querySelector(".instructions-box");

function selectOpponentSquare(player) {
  let opponent;
  if (player.id == 1) {
    opponent = player2;
  } else {
    opponent = player1;
  }
  // If it's Player 2 (the computer's turn)
  if (player.id === 2) {
    instructions.textContent = `${player.name}'s turn. Computer is selecting a square to attack...`;
    // Delay the computer's move for effect
    computerTurn();
  } else {
    instructions.textContent = `${player.name}'s turn. Select square on opponent's grid to attack.`;
    let opponentBoard = document.querySelector(`.board-display-${opponent.id}`);
    const opponentSquares = opponentBoard.querySelectorAll(".active");

    opponentSquares.forEach((square) => {
      square.addEventListener("click", squareClicks);
    });
  }
}

function computerTurn() {
  setTimeout(() => {
    let opponentBoard = document.querySelector(`.board-display-1`);
    const opponentSquares = Array.from(
      opponentBoard.querySelectorAll(".active"),
    );
    const randomSquare =
      opponentSquares[Math.floor(Math.random() * opponentSquares.length)];

    let selectedSquareID = randomSquare.id;
    let coordinatesXY = selectedSquareID.split("x")[1].split("y");
    let coordinates = [parseInt(coordinatesXY[0]), parseInt(coordinatesXY[1])];

    if (player1.board.receiveAttack(coordinates)) {
      randomSquare.classList.add("hit");
      instructions.textContent = `Ship hit! Computer continues its turn.`;

      // end game if all player1 sinks have sunk
      if (player1.board.allSunk()) {
        instructions.textContent = `${player1.name} has lost! Computer wins!`;
        endGame();
        return;
      }

      computerTurn();
    } else {
      randomSquare.classList.add("miss");
      instructions.textContent = `Missed! Player 1's turn.`;
      setTimeout(() => {
        changePlayerTurn(player2); // After a miss, the turn changes back to Player 1
      }, 1000);
    }

    // Disable the square and remove event listeners
    randomSquare.disabled = true;
    randomSquare.classList.add("disabled");
    randomSquare.classList.remove("active");
    randomSquare.removeEventListener("click", squareClicks); // Remove click listener
  }, 2000);
}

function squareClicks(e) {
  let selectedSquareID = e.target.id;
  // console.log(e.target.classList.contains('2')); // returns true
  // ex: takes no12 --> [1, 2]
  let coordinatesXY = selectedSquareID.split("x")[1].split("y");
  let coordinates = [parseInt(coordinatesXY[0]), parseInt(coordinatesXY[1])];

  let opponent = e.target.classList.contains("2") ? player2 : player1;
  let player = e.target.classList.contains("2") ? player1 : player2;
  // returns true if hit and false if missed
  if (opponent.board.receiveAttack(coordinates)) {
    e.target.classList.add("hit");
    // continue turn if you hit the ship
    instructions.textContent = `Ship hit! Continue your turn.`;
    let ships = opponent.board.listOfShips;
    console.log(ships);
    console.log(opponent.board.allSunk());
    if (opponent.board.allSunk()) {
      instructions.textContent = `Computer has lost! ${player.name} wins!`;
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

const randomizeBtn = document.querySelector(".random");
randomizeBtn.addEventListener("click", () => {
  clearBoard();
  player1.reset();
  player2.reset();
  startNewGame();
});

function clearBoard() {
  const boardDisplay = document.querySelector(`.board-display-1`);
  while (boardDisplay.firstChild) {
    boardDisplay.removeChild(boardDisplay.firstChild);
  }
  const boardDisplay2 = document.querySelector(".board-display-2");
  while (boardDisplay2.firstChild) {
    boardDisplay2.removeChild(boardDisplay2.firstChild);
  }
}
