class Ship {
  constructor(length) {
    (this.length = length), (this.noOfHits = 0);
    this.sunkStatus = false;
    this.orientation = "horizontal";
    this.shipCoordinates = [];
  }

  hit() {
    this.noOfHits += 1;
  }

  isSunk() {
    if (this.length == this.noOfHits) {
      this.sunkStatus = true;
    }
    return this.sunkStatus;
  }

  changeOrientation() {
    if (this.orientation === "horizontal") {
      this.orientation = "vertical";
    } else {
      this.orientation = "horizontal";
    }
  }
}

class Gameboard {
  constructor() {
    this.board = [];
    this.missedAttacks = [];
    this.allShipsSunk = [];
    this.listOfShips = [];
  }

  // where location is [x, y]
  // need to check to see if ship is already placed there
  placeShip(ship, [x, y]) {
    let proposedCoordinates = [];

    for (let i = 0; i < ship.length; i++) {
      if (ship.orientation === "horizontal") {
        proposedCoordinates.push([x + i, y]);
      } else {
        proposedCoordinates.push([x, y + i]);
      }
    }

    // check if proposed coordinates for length of ship go past 10 squares and if they are already taken on the gameboard
    for (let [proposedX, proposedY] of proposedCoordinates) {
      if (proposedX > 10 || proposedY > 10) {
        return false;
      }
      let exists = this.board.some(
        ([xCoord, yCoord]) => xCoord === proposedX && yCoord === proposedY,
      );
      if (exists) {
        return false;
      }
    }
    // only allow coordinates if previous loop is true (i.e. no ship already exists in the coordinates)
    ship.shipCoordinates.push(...proposedCoordinates);
    this.board.push(...ship.shipCoordinates);
    this.listOfShips.push(ship);
  }

  receiveAttack([x, y]) {
    // look in listOfShips to see which one has coordinates matching
    for (let i = 0; i < this.listOfShips.length; i++) {
      let ship = this.listOfShips[i];
      let shipCoordinatesArray = ship.shipCoordinates;
      let hit = shipCoordinatesArray.some(
        ([shipX, shipY]) => shipX === x && shipY === y,
      );
      if (hit) {
        ship.hit();
        return;
      }
    }
    this.missedAttacks.push([x, y]);
  }

  allSunk() {
    for (let i = 0; i < this.listOfShips.length; i++) {
      let ship = this.listOfShips[i];
      this.allShipsSunk.push(ship.isSunk());
    }

    let allSunk = this.allShipsSunk.every((value) => value === true);
    return allSunk;
  }
}

export { Ship, Gameboard };
