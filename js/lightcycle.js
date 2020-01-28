// jshint esversion: 6

class LightCycle {
    constructor(maxRows, maxColumns, row) {
      this.row = row;
      this.jetwall = [
        { row: this.row, column: 5 },
        { row: this.row, column: 4 },
        { row: this.row, column: 3 },
        { row: this.row, column: 2 },
        { row: this.row, column: 1 },
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
        this.intervalId = setInterval(this._moveForward.bind(this), 100);
    }
}