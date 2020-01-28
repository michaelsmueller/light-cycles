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
      this.direction = 'right';
      this.intervalId = undefined;
    }

    _moveForward() {
        let cycle = this.jetwall[0];
        // going right;
        this.jetwall.unshift({
            row: cycle.row,
            column: (cycle.column + 1) % this.maxColumns
        });
    }

    move() {
        this.intervalId = setInterval(this._moveForward.bind(this), 100);
    }
}