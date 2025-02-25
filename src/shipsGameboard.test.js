import { Ship } from "./shipsGameboard";

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
});
