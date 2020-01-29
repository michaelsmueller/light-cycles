// jshint esversion: 6

class LightCycle {
    constructor(grid, playerConfig) {
      console.log(`maxRows ${grid.maxRows} maxColumns ${grid.maxColumns}`);
      this.maxRows = grid.maxRows;
      this.maxColumns = grid.maxColumns;
      this.startingRow = playerConfig.startingRow;
      this.startingColumn = playerConfig.startingColumn;
      this.direction = playerConfig.startingDirection;
      this.jetwall = [ { row: this.startingRow, column: this.startingColumn } ];
      this.jetwall = [...this.jetwall];
      this.velocity = 100;
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
      // this.intervalId = setInterval(this._moveForward.bind(this), this.velocity);
      let counter = 1;
      const repeatSetTimout = function () {
        // console.log(`Counter is ${counter}`);
        counter += 1;
        this._moveForward();
        this.timeoutId = setTimeout(repeatSetTimout.bind(this), this.velocity);
      };
      this.timeoutId = setTimeout(repeatSetTimout.bind(this), this.velocity);
    }

    accelerate() {
      console.log("Accelerating");
      // clearInterval(this.intervalId);
      this.velocity = 50;
      // this.intervalId = setInterval(this._moveForward.bind(this), this.velocity);
    }

    stop() {
      clearInterval(this.intervalId);
    }
}