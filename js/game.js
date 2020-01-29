// jshint esversion: 6

const player1Config = {
    startingRow: 1,
    startingColumn: 1,
    startingDirection: "right",
    color: "#00FFFF"    // cyan
};
const player2Config = {
    startingRow: 50,
    startingColumn: 50,
    startingDirection: "left",
    color: "#FF0080"    // fuchsia
};

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
    }

    _drawJetwall() {
        this.ctx.fillStyle = player1Config.color;
        const cycle1 = game.player1.jetwall[0];
        this.ctx.fillRect(cycle1.column * this.cellWidth, cycle1.row * this.cellWidth, 10, 10);

        this.ctx.fillStyle = player2Config.color;
        const cycle2 = game.player2.jetwall[0];
        this.ctx.fillRect(cycle2.column * this.cellWidth, cycle2.row * this.cellWidth, 10, 10);
    }
    
    _hasCrashedOwnJetwall(lightCycle) {
        let crashed = false;
        lightCycle.jetwall.forEach((position, index) => {
            if (index != 0) {
                if (position.row === lightCycle.jetwall[0].row && position.column === lightCycle.jetwall[0].column) {
                    crashed = true;
                }
            }
        });
        return crashed;
    }

    _hasCrashedEnemyJetwall(lightCycle, enemyLightCycle) {
        let crashed = false;
        enemyLightCycle.jetwall.forEach((position, index) => {
            if (position.row === lightCycle.jetwall[0].row && position.column === lightCycle.jetwall[0].column) {
                crashed = true;
            }
        });
        return crashed;
    }

    _hasDefeated(enemyLightCycle, lightCycle) {
        let lightCycleCrashed = false;
        if (this._hasCrashedOwnJetwall(lightCycle)) {
            lightCycleCrashed = true;
        }
        if (this._hasCrashedEnemyJetwall(lightCycle, enemyLightCycle)) {
            lightCycleCrashed = true;
        }
        return lightCycleCrashed;
    }

    _stopPlayers() {
        this.player1.stop();
        this.player2.stop();
    }

    _update() {
        let gameOver = false;
        this._drawJetwall();
        if (this._hasDefeated(this.player1, this.player2)) {
            console.log('player 1 wins');
            this._stopPlayers();
            this.gameOver();
            gameOver = true;
            window.cancelAnimationFrame(this.interval);
        }
        if (this._hasDefeated(this.player2, this.player1)) {
            console.log('player 2 wins');
            this._stopPlayers();
            this.gameOver();
            gameOver = true;
            window.cancelAnimationFrame(this.interval);
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
            }
        });   
    }

    start() {
        game.player1.move();
        game.player2.move();
        this.interval = window.requestAnimationFrame(this._update.bind(this));
        this._assignControlsToKeys();
    }
}
