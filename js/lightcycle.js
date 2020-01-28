// jshint esversion: 6

class LightCycle {
    constructor(maxRows, maxColumns) {
      this.jetwall = [
        { row: 1, column: 5 },
        { row: 1, column: 4 },
        { row: 1, column: 3 },
        { row: 1, column: 2 },
        { row: 1, column: 1 },
      ];
      this.jetwall = [...this.jetwall];
      this.maxRows = maxRows;
      this.maxColumns = maxColumns;
      this.direction = "right";
      this.intervalId = undefined;
    }

    _moveForward() {
        let cycle = this.jetwall[0];
        switch (this.direction) {
          case "up":
            this.jetwall.unshift({
              row: (cycle.row - 1 + this.maxRows) % this.maxRows,
              column: cycle.column
            });
            break;
          case "down":
            this.jetwall.unshift({
              row: (cycle.row + 1) % this.maxRows,
              column: cycle.column
            });
            break;
          case "left":
            this.jetwall.unshift({
              row: cycle.row,
              column: (cycle.column - 1 + this.maxColumns) % this.maxColumns
            });
            break;
          case "right":
            this.jetwall.unshift({
              row: cycle.row,
              column: (cycle.column + 1) % this.maxColumns
            });
            break;
        }
    }

    goUp() {
      if (this.direction === "left" || this.direction === "right") {
        this.direction = "up";
      }
    }
  
    goDown() {
      if (this.direction === "left" || this.direction === "right") {
        this.direction = "down";
      }
    }
  
    goLeft() {
      if (this.direction === "up" || this.direction === "down") {
        this.direction = "left";
      }
    }
  
    goRight() {
      if (this.direction === "up" || this.direction === "down") {
        this.direction = "right";
      }
    }

    move() {
        this.intervalId = setInterval(this._moveForward.bind(this), 100);
    }
}