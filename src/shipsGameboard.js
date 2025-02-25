class Ship {
  constructor(length) {
    (this.length = length), (this.noOfHits = 0);
    this.sunkStatus = false;
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
}

export { Ship };
