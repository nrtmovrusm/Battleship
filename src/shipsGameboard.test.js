import { Ship, Gameboard } from "./shipsGameboard";

describe("class Ship", () => {
  let ship;

  beforeEach(() => {
    ship = new Ship(3);
  });

  test("create ship with length 3", () => {
    expect(ship.length).toEqual(3);
  });

  test("return false if ship not sunk at start", () => {
    expect(ship.sunkStatus).toBe(false);
  });

  test("noOfHits increases with hit function", () => {
    ship.hit();
    expect(ship.noOfHits).toEqual(1);
  });

  test("return false if ship hit less times than length", () => {
    ship.hit();
    ship.hit();
    expect(ship.sunkStatus).toBe(false);
  });

  test("return true if ship with length 3 hit 3 times", () => {
    ship.noOfHits = 3;
    expect(ship.isSunk()).toBe(true);
  });

  test("change orientation of ship that has default horizontal orientation", () => {
    ship.changeOrientation();
    expect(ship.orientation).toBe("vertical");
  });
});

describe("Gameboard", () => {
  let gameboard;
  let ship;

  beforeEach(() => {
    gameboard = new Gameboard();
    ship = new Ship(3);
  });

  test("placing ships on initial turn across multiple squares", () => {
    gameboard.placeShip(ship, [3, 2]);
    expect(ship.shipCoordinates).toEqual([
      [3, 2],
      [4, 2],
      [5, 2],
    ]);
  });

  test("gameboard has coordinates from ship placement", () => {
    gameboard.placeShip(ship, [3, 2]);
    expect(gameboard.board).toEqual([
      [3, 2],
      [4, 2],
      [5, 2],
    ]);
  });

  test("gameboard with multiple ships adds to board array", () => {
    let ship2 = new Ship(2);
    gameboard.placeShip(ship, [3, 2]);
    gameboard.placeShip(ship2, [3, 5]);
    expect(gameboard.board).toEqual([
      [3, 2],
      [4, 2],
      [5, 2],
      [3, 5],
      [4, 5],
    ]);
  });

  test("cannot place second ship that clashes with an already placed ship", () => {
    let ship2 = new Ship(2);
    gameboard.placeShip(ship, [3, 2]);
    gameboard.placeShip(ship2, [4, 2]);
    expect(gameboard.board).toEqual([
      [3, 2],
      [4, 2],
      [5, 2],
    ]);
  });

  test("cannot directly place ship beyond 10 squares", () => {
    expect(gameboard.placeShip(ship, [11, 2])).toBe(false);
  });

  test("cannot implicitly place ship beyond 10 squares", () => {
    expect(gameboard.placeShip(ship, [9, 2])).toBe(false);
  });

  test("[x,y] matching ship placement leads to hit for correct ship", () => {
    let ship2 = new Ship(2);
    gameboard.placeShip(ship, [3, 2]);
    gameboard.placeShip(ship2, [3, 5]);
    gameboard.receiveAttack([4, 2]);
    expect(ship.noOfHits).toEqual(1);
  });

  test("[x,y] NOT matching ships gets added to missed attacks array", () => {
    let ship2 = new Ship(2);
    gameboard.placeShip(ship, [3, 2]);
    gameboard.placeShip(ship2, [3, 5]);
    gameboard.receiveAttack([6, 2]);
    expect(gameboard.missedAttacks).toEqual([[6, 2]]);
  });

  test("allSunk returns true if all ships have been sunk", () => {
    let ship2 = new Ship(2);
    gameboard.placeShip(ship, [3, 2]);
    gameboard.placeShip(ship2, [3, 5]);
    ship.sunkStatus = true;
    ship2.sunkStatus = true;
    expect(gameboard.allSunk()).toBe(true);
  });
});
