// jshint esversion: 6

const player1Config = {
    startingRow: 1,
    startingColumn: 1,
    startingDirection: "right",
    baseSpeed: 200,         // lower is faster
    topSpeed: 50,
    fuel: 100,
    color: "#00FFFF"    // cyan
};

const player2Config = {
    startingRow: 50,
    startingColumn: 90,
    startingDirection: "left",
    baseSpeed: 200,         // lower is faster
    topSpeed: 50,
    fuel: 100,
    color: "#FF0080"    // fuchsia
};

let crashPosition = {};

class Game {
    constructor(ctx, canvas, updateScoreCallback, gameOverCallback) {
        console.log(`Canvas width ${canvas.width} height ${canvas.height}`);
        this.ctx = ctx;
        this.cellWidth = 15;
        this.grid = {
            maxRows: canvas.height / this.cellWidth,
            maxColumns: canvas.width / this.cellWidth
        };
        this.player1 = new LightCycle(this.grid, player1Config);
        this.player2 = new LightCycle(this.grid, player2Config);
        this.fuel = new Fuel(this.grid);
        this.updateScore = updateScoreCallback;
        this.gameOver = gameOverCallback;
        this.winner = "";
    }

    reset() {
        this._stopPlayers();
        this.player1.reset(player1Config);
        this.player2.reset(player2Config);
        this.winner = "";
        this.stopAnimation();
    }

    _drawJetwall() {
        this.ctx.fillStyle = player1Config.color;
        const cycle1 = game.player1.jetwall[0];
        this.ctx.fillRect(cycle1.column * this.cellWidth, cycle1.row * this.cellWidth, this.cellWidth, this.cellWidth);

        this.ctx.fillStyle = player2Config.color;
        const cycle2 = game.player2.jetwall[0];
        this.ctx.fillRect(cycle2.column * this.cellWidth, cycle2.row * this.cellWidth, this.cellWidth, this.cellWidth);
    }
    
    _hasCrashedOwnJetwall(cycle) {
        let crashed = false;
        cycle.jetwall.forEach((position, index) => {
            if (index != 0) {
                if (position.row === cycle.jetwall[0].row &&
                    position.column === cycle.jetwall[0].column) {
                    crashed = true;
                }
            }
        });
        return crashed;
    }

    _hasCrashedOtherJetwall(cycle1, cycle2) {
        let crashed = false;
        cycle2.jetwall.forEach((position, index) => {
            if (position.row === cycle1.jetwall[0].row &&
                position.column === cycle1.jetwall[0].column) {
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

    _getCrashPosition(cycle) {
        return {
            x: cycle.jetwall[0].column * this.cellWidth + this.cellWidth / 2,
            y: cycle.jetwall[0].row * this.cellWidth + this.cellWidth / 2
        };
    }

    _isFuelOnJetwall(cycle) {
        console.log("Checking isFuelOnJetwall");
        let isFuelOnJetwall = false;
        cycle.jetwall.forEach((position) => {
            if (position.row === this.fuel.row &&
                position.column === this.fuel.column) {
                console.log("Fuel was on jetwall");
                isFuelOnJetwall = true;
            }
        });
        return isFuelOnJetwall;
    }

    generateFuel() {
        this.fuel._placeFuel();
        while (this._isFuelOnJetwall(this.player1) || this._isFuelOnJetwall(this.player2)) {
            this.fuel._placeFuel();
        }
    }

    drawFuel() {
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(this.fuel.column * this.cellWidth, this.fuel.row * this.cellWidth, this.cellWidth, this.cellWidth);
    }

    hasPickedUpFuel(cycle) {
        if (cycle.jetwall[0].row === this.fuel.row && 
            cycle.jetwall[0].column === this.fuel.column) {
            return true;
        } else {
            return false;
        }
    }

    checkFuelPickup() {
        if (this.hasPickedUpFuel(this.player1)) {
            this.player1.addFuel();
            this.generateFuel();
            this.drawFuel();
        } else if (this.hasPickedUpFuel(this.player2)) {
            this.player2.addFuel();
            this.generateFuel();
            this.drawFuel();
        }
    }

    _stopPlayers() {
        this.player1.stop();
        this.player2.stop();
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
        this.stopAnimation();
        setTimeout(() => this.gameOver(this.winner, player1Config, player2Config), 1);
    }

    _update() {
        let gameOver = false;
        game.updateScore();
        this._drawJetwall();
        this._checkCrash();
        if (!this.fuel.row) {
            this.generateFuel();
            this.drawFuel();
        }
        this.checkFuelPickup();
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
                    this.player1.burnFuel();
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
                    this.player2.burnFuel();
                    break;
            }
        });
        document.addEventListener("keyup", e => {
            console.log(`Keyup ${e.keyCode} ${e.key}`);
            switch (e.keyCode) {
                case 190: // period
                    this.player1.slowDown();
                    this.player1.stopBurningFuel();
                    break;
                case 49: // 1
                    this.player2.slowDown();
                    this.player2.stopBurningFuel();
                    break;
            }
        });
    }

    clearGrid() {
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.ctx.beginPath();
    }

    explosionLoop(crashPosition) {
        requestAnimFrame(this.explosionLoop.bind(this));
        updateExplosions();
        updateParticles();
        launchExplosion(crashPosition);
    }

    stopAnimation() {
        window.cancelAnimationFrame(this.interval);
    }

    start() {
        this.clearGrid();
        this.player1.move();
        this.player2.move();
        this.interval = window.requestAnimationFrame(this._update.bind(this));
        this._assignControlsToKeys();
    }
}