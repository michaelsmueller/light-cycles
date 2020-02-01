// jshint esversion: 6

const player1Config = {
    startingRow: 1,
    startingColumn: 1,
    startingDirection: "right",
    speed: 100,         // lower is faster
    color: "#00FFFF"    // cyan
};

const player2Config = {
    startingRow: 50,
    startingColumn: 50,
    startingDirection: "left",
    speed: 100,         // lower is faster
    color: "#FF0080"    // fuchsia
    // color: "#FDBD01"    // gold
};

let crashPosition = {};

class Game {
    constructor(ctx, canvas, callback) {
        console.log(`Canvas width ${canvas.width} height ${canvas.height}`);
        this.ctx = ctx;
        this.cellWidth = 10;
        this.grid = {
            maxRows: canvas.height / this.cellWidth,
            maxColumns: canvas.width / this.cellWidth
        };
        this.player1 = new LightCycle(this.grid, player1Config);
        this.player2 = new LightCycle(this.grid, player2Config);
        this.gameOver = callback;
        this.winner = "";
    }

    reset() {
        this._stopPlayers();
        this.player1.reset(player1Config);
        this.player2.reset(player2Config);
        this.winner = "";
    }

    _drawJetwall() {
        this.ctx.fillStyle = player1Config.color;
        const cycle1 = game.player1.jetwall[0];
        this.ctx.fillRect(cycle1.column * this.cellWidth, cycle1.row * this.cellWidth, 10, 10);

        this.ctx.fillStyle = player2Config.color;
        const cycle2 = game.player2.jetwall[0];
        this.ctx.fillRect(cycle2.column * this.cellWidth, cycle2.row * this.cellWidth, 10, 10);
    }
    
    _hasCrashedOwnJetwall(cycle) {
        let crashed = false;
        cycle.jetwall.forEach((position, index) => {
            if (index != 0) {
                if (position.row === cycle.jetwall[0].row && position.column === cycle.jetwall[0].column) {
                    crashed = true;
                }
            }
        });
        return crashed;
    }

    _hasCrashedOtherJetwall(cycle1, cycle2) {
        let crashed = false;
        cycle2.jetwall.forEach((position, index) => {
            if (position.row === cycle1.jetwall[0].row && position.column === cycle1.jetwall[0].column) {
                crashed = true;
            }
        });
        return crashed;
    }

    _checkCrash() {
        if (this._hasCrashedOwnJetwall(this.player1)) {
            this.player1.crashed = true;
        }
        if (this._hasCrashedOtherJetwall(this.player1, this.player2)) {
            this.player1.crashed = true;
        }
        if (this._hasCrashedOwnJetwall(this.player2)) {
            this.player2.crashed = true;
        }
        if (this._hasCrashedOtherJetwall(this.player2, this.player1)) {
            this.player2.crashed = true;
        }
    }

    _stopPlayers() {
        this.player1.stop();
        this.player2.stop();
    }

    _getCrashPosition(cycle) {
        return {
            x: cycle.jetwall[0].column * this.cellWidth + this.cellWidth / 2,
            y: cycle.jetwall[0].row * this.cellWidth + this.cellWidth / 2
        };
    }

    _endingSequence() {
        this._stopPlayers();
        if (this.player1.crashed && this.player2.crashed) {
            this.winner = "neither";
            crashPosition = this._getCrashPosition(this.player1);
            this.explosionLoop(crashPosition);
            crashPosition = this._getCrashPosition(this.player2);
        } else if (this.player1.crashed) {
            this.winner = "Player 2";
            crashPosition = this._getCrashPosition(this.player1);
        } else {
            this.winner = "Player 1";
            crashPosition = this._getCrashPosition(this.player2);
        }
        this.explosionLoop(crashPosition);
        this.gameOver(this.winner);
        window.cancelAnimationFrame(this.interval);
    }

    _update() {
        let gameOver = false;
        this._drawJetwall();
        this._checkCrash();
        if (this.player1.crashed || this.player2.crashed) {
            this._endingSequence();
            gameOver = true;
        }
        if (!!this.interval && !gameOver) {
            this.interval = window.requestAnimationFrame(this._update.bind(this));
        }
    }
    
    _assignControlsToKeys() {
        document.addEventListener("keydown", e => {
            console.log(`Keydown ${e.keyCode} ${e.key}`);
            if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                e.preventDefault();
            }
            switch (e.keyCode) {
                case 37: // left arrow
                    this.player1.goLeft();
                    break;
                case 38: // up arrow up
                    this.player1.goUp();
                    break;
                case 39: // right arrow
                    this.player1.goRight();
                    break;
                case 40: // down arrow
                    this.player1.goDown();
                    break;
                case 190: // period
                    this.player1.speedUp();
                    break;
            }
            switch (e.keyCode) {
                case 65: // a
                    this.player2.goLeft();
                    break;
                case 87: // w
                    this.player2.goUp();
                    break;
                case 68: // d
                    this.player2.goRight();
                    break;
                case 83: // s
                    this.player2.goDown();
                    break;
                case 49: // 1
                    this.player2.speedUp();
                    break;
            }
        });
        document.addEventListener("keyup", e => {
            console.log(`Keyup ${e.keyCode} ${e.key}`);
            switch (e.keyCode) {
                case 190: // period
                    this.player1.slowDown();
                    break;
                case 49: // 1
                    this.player2.slowDown();
                    break;
            }
        });
    }

    clearGrid() {
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }

    explosionLoop(crashPosition) {
        requestAnimFrame(this.explosionLoop.bind(this));
        updateExplosions();
        updateParticles();
        launchExplosion(crashPosition);
    }

    start() {
        this.clearGrid();
        this.player1.move();
        this.player2.move();
        this.interval = window.requestAnimationFrame(this._update.bind(this));
        this._assignControlsToKeys();
    }
}