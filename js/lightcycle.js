// jshint esversion: 6

class LightCycle {
    constructor(grid, playerConfig) {
      console.log(`maxRows ${grid.maxRows} maxColumns ${grid.maxColumns}`);
      this.maxRows = grid.maxRows;
      this.maxColumns = grid.maxColumns;
      this.startingRow = playerConfig.startingRow;
      this.startingColumn = playerConfig.startingColumn;
      this.direction = playerConfig.startingDirection;
      this.startingJetwall = [ { row: this.startingRow, column: this.startingColumn } ];
      this.jetwall = [...this.startingJetwall];
      this.baseSpeed = playerConfig.speed;
      this.speed = playerConfig.speed;
      this.crashed = false;
      this.intervalId = undefined;
    }

    reset(playerConfig) {
      this.startingRow = playerConfig.startingRow;
      this.startingColumn = playerConfig.startingColumn;
      this.direction = playerConfig.startingDirection;
      this.jetwall = [...this.startingJetwall];
      this.baseSpeed = playerConfig.speed;
      this.speed = playerConfig.speed;
      this.crashed = false;
      this.intervalId = undefined;
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
      this.speed = this.baseSpeed - 50;
    }

    slowDown() {
      this.speed = this.baseSpeed;
    }

    stop() {
      clearTimeout(this.timeoutId);
    }
}