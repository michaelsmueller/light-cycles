// jshint esversion: 6

class LightCycle {
    constructor(grid, playerConfig) {
      console.log(`maxRows ${grid.maxRows} maxColumns ${grid.maxColumns}`);
      this.maxRows = grid.maxRows;
      this.maxColumns = grid.maxColumns;
      this.setInitialConfig(playerConfig);
    }

    setInitialConfig(playerConfig) {
      this.startingRow = playerConfig.startingRow;
      this.startingColumn = playerConfig.startingColumn;
      this.direction = playerConfig.startingDirection;
      this.jetwall = [ { row: this.startingRow, column: this.startingColumn } ];
      this.speed = playerConfig.baseSpeed;
      this.baseSpeed = playerConfig.baseSpeed;
      this.topSpeed = playerConfig.topSpeed;
      this.fuel = playerConfig.fuel;
      this.crashed = false;
      this.intervalId = undefined;
    }

    reset(playerConfig) {
      this.setInitialConfig(playerConfig);
    }

    _moveForward() {
        let cycle = this.jetwall[0];
        switch (this.direction) {
          case "left":
            this.jetwall.unshift({
              row: cycle.row,
              column: (cycle.column - 1 + this.maxColumns) % this.maxColumns
            });
            break;
          case "up":
            this.jetwall.unshift({
              row: (cycle.row - 1 + this.maxRows) % this.maxRows,
              column: cycle.column
            });
            break;
          case "right":
            this.jetwall.unshift({
              row: cycle.row,
              column: (cycle.column + 1) % this.maxColumns
            });
            break;
          case "down":
            this.jetwall.unshift({
              row: (cycle.row + 1) % this.maxRows,
              column: cycle.column
            });
            break;
        }
    }

    goLeft() {
      if (this.direction === "up" || this.direction === "down") {
        this.direction = "left";
      }
    }

    goUp() {
      if (this.direction === "left" || this.direction === "right") {
        this.direction = "up";
      }
    }
  
    goRight() {
      if (this.direction === "up" || this.direction === "down") {
        this.direction = "right";
      }
    }

    goDown() {
      if (this.direction === "left" || this.direction === "right") {
        this.direction = "down";
      }
    }

    move() {
      const repeatSetTimout = function () {
        this._moveForward();
        this.timeoutId = setTimeout(repeatSetTimout.bind(this), this.speed);
      };
      this.timeoutId = setTimeout(repeatSetTimout.bind(this), this.speed);
    }

    speedUp() {
      if (this.fuel > 0) {
        this.speed = this.topSpeed;
      }
    }

    slowDown() {
      this.speed = this.baseSpeed;
    }

    burnFuel() {
      if (!this.burnFuelId && this.fuel > 0) {
        this.burnFuelId = setInterval( () => {
          if (this.fuel > 0) {
            this.fuel -= 1;
          } else {
            this.slowDown();
            this.stopBurningFuel();
          }
        }, this.topSpeed);
      } 
    }

    stopBurningFuel() {
      if (this.burnFuelId) {
        clearInterval(this.burnFuelId);
        this.burnFuelId = null;
      }
    }

    addFuel() {
      this.fuel += 20;
    }

    stop() {
      clearTimeout(this.timeoutId);
    }
}

class Fuel {
  constructor(grid) {
    console.log("new Fuel contructor object");
    this.maxRows = grid.maxRows;
    this.maxColumns = grid.maxColumns;
    this.row = null;
    this.column = null;
  }

  reset() {
    this.row = null;
    this.column = null;
  }

  _returnRandom(max) {
    return Math.floor(Math.random() * max);
  }

  _placeFuel() {
    this.row = this._returnRandom(this.maxRows);
    this.column = this._returnRandom(this.maxColumns);
  }
}