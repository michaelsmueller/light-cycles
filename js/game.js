// jshint esversion: 6

const player1Config = {
    startingRow: 1,
    startingColumn: 1,
    startingDirection: "right",
    baseSpeed: 120,              // lower is faster
    topSpeed: 60,
    fuel: 150,
    bulletCost: 20,
    color: "#00FFFF"             // cyan
};

const player2Config = {
    startingRow: 50,
    startingColumn: 90,
    startingDirection: "left",
    baseSpeed: 120,              // lower is faster
    topSpeed: 60,
    fuel: 150,
    bulletCost: 20,
    color: "#FF0080"             // fuchsia
};

const bulletConfig = {
    speed: 20,
    bulletWidth: 5,
    blastSize: 25,               // square of an odd number
    color: "#FBF455"             // yellow
};

const fuelConfig = {
    color: "#FBF455"             // yellow
};

let crashPosition = {};
let eventListenersAdded = false;

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
        this.bullets = [];
        this.updateScore = updateScoreCallback;
        this.gameOver = gameOverCallback;
        this.winner = "";
    }

    reset() {
        this._stopPlayers();
        this.player1.reset(player1Config);
        this.player2.reset(player2Config);
        this.fuel.reset();
        this.bullets = [];
        this.winner = "";
        this.stopAnimation();
    }

    _drawJetwall() {
        this.ctx.fillStyle = player1Config.color;
        const cycle1 = this.player1.jetwall[0];
        this.ctx.fillRect(cycle1.column * this.cellWidth, cycle1.row * this.cellWidth, this.cellWidth, this.cellWidth);

        this.ctx.fillStyle = player2Config.color;
        const cycle2 = this.player2.jetwall[0];
        this.ctx.fillRect(cycle2.column * this.cellWidth, cycle2.row * this.cellWidth, this.cellWidth, this.cellWidth);
    }
    
    _hasCrashedOwnJetwall(cycle) {
        let crashed = false;
        cycle.jetwall.forEach((position, index) => {
            if (index > 3) {       // impossible to crash own jetwall until 4th step (after 3 turns)
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
        cycle2.jetwall.forEach(position => {
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
        const x = this.fuel.column * this.cellWidth + this.cellWidth / 2;
        const y = this.fuel.row * this.cellWidth + this.cellWidth / 2;
        const radius = this.cellWidth / 2;
        this.ctx.fillStyle = fuelConfig.color;
        this.ctx.lineWidth = 0;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.closePath();
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

    shoot(cycle) {
        const bulletPosition = {
            row: cycle.jetwall[0].row,
            column: cycle.jetwall[0].column
        };
        const newBullet = new Bullet(this.grid, bulletPosition, cycle.direction, bulletConfig.speed);
        newBullet.moveBullet();
        this.bullets.push(newBullet);
    }

    drawBullets() {
        const halfCell = this.cellWidth / 2;
        this.bullets.forEach(bullet => {
            const x = bullet.position.column * this.cellWidth;
            const y = bullet.position.row * this.cellWidth;
            this.ctx.beginPath();
            switch (bullet.direction) {
                case "left":
                    this.ctx.moveTo(x, y + halfCell);
                    this.ctx.lineTo(x - 2 * halfCell, y + halfCell);
                    break;
                case "up":
                    this.ctx.moveTo(x + halfCell, y);
                    this.ctx.lineTo(x + halfCell, y - 2 * halfCell);
                    break;
                case "right":
                    this.ctx.moveTo(x + 2 * halfCell, y + halfCell);
                    this.ctx.lineTo(x + 4 * halfCell, y + halfCell);
                    break;
                case "down":
                    this.ctx.moveTo(x + halfCell, y + 2 * halfCell);
                    this.ctx.lineTo(x + halfCell, y + 4 * halfCell);
                    break;
            }
            this.ctx.strokeStyle = bulletConfig.color;
            this.ctx.lineWidth = bulletConfig.bulletWidth;
            this.ctx.stroke();
            this.ctx.closePath();
        });
    }

    _isBulletTrailOnJetWall(bullet, cycle) {
        let isBulletTrailOnJetWall = false;
        cycle.jetwall.forEach((position, index) => {
            if (index < 5) {      // only trying to avoid erasing bullet trails near "head"
                if (position.row === bullet.position.row &&
                    position.column === bullet.position.column) {
                    isBulletTrailOnJetWall = true;
                }
            }
        });
        return isBulletTrailOnJetWall;
    }

    eraseBulletTrails() {
        this.bullets.forEach(bullet => {
            const x = bullet.position.column * this.cellWidth;
            const y = bullet.position.row * this.cellWidth;

            if (!this._isBulletTrailOnJetWall(bullet, this.player1) && 
                !this._isBulletTrailOnJetWall(bullet, this.player2)) {
                this.ctx.clearRect(x, y, this.cellWidth, this.cellWidth);
            }
        });
    }

    _hasBulletHitJetwall(bullet, cycle) {
        let hasBulletHitJetwall = false;
        cycle.jetwall.forEach(position => {
            if (bullet.age > 1) {
                if (position.row === bullet.position.row &&
                    position.column === bullet.position.column) {
                    hasBulletHitJetwall = true;
                }
            }
        });
        return hasBulletHitJetwall;
    }

    _hasBulletHitFuel(bullet) {
        let hasBulletHitFuel = false;
        if (this.fuel.row === bullet.position.row &&
            this.fuel.column === bullet.position.column) {
            hasBulletHitFuel = true;
            console.log("Bullet hit fuel");
        }
        return hasBulletHitFuel;
    }

    drawBlast(bullet) {
        const blastWidth = Math.sqrt(bulletConfig.blastSize);
        const x = bullet.position.column - (blastWidth + 1) / 2 + 1;
        const y = bullet.position.row - (blastWidth + 1) / 2 + 1;

        this.ctx.fillStyle = "white";
        this.ctx.fillRect(x * this.cellWidth, y * this.cellWidth, blastWidth * this.cellWidth, blastWidth * this.cellWidth);
    }

    spliceJetwall(blast, cycle) {
        cycle.jetwall.forEach((position, index) => {
            if (position.row === blast.row &&
                position.column === blast.column) {
                cycle.jetwall.splice(index, 1);
                console.log(`Splicing jetwall at ${blast.row}, ${blast.column}`);
            }
        });
    }

    checkBlastHitsPlayers(blast) {
        const cycle1 = this.player1.jetwall[0];
        const cycle2 = this.player2.jetwall[0];
        if (cycle1.row === blast.row && cycle1.column === blast.column) {
            this.player1.crashed = true;
        }
        if (cycle2.row === blast.row && cycle2.column === blast.column) {
            this.player2.crashed = true;
        }
    }

    checkBlastHitsFuel(blast) {
        if (this.fuel.row === blast.row && this.fuel.column === blast.column) {
            this.fuel.destroyed = true;
        }
    }

    inflictBlastDamage(bullet) {
        console.log("Calling inflict BlastDamage");
        const blastWidth = Math.sqrt(bulletConfig.blastSize);
        const x = bullet.position.column - (blastWidth + 1) / 2 + 1;
        const y = bullet.position.row - (blastWidth + 1) / 2 + 1;
        for (let column = x; column < x + blastWidth; column++) {
            for (let row = y; row < y + blastWidth; row++) {  
                const blast = {
                    row: row,
                    column: column
                };
                this.checkBlastHitsPlayers(blast);
                this.checkBlastHitsFuel(blast);
                if (!this.player1.crashed && !this.player2.crashed) {
                    this.spliceJetwall(blast, this.player1);
                    this.spliceJetwall(blast, this.player2);
                    setTimeout(() => this.ctx.clearRect(column * this.cellWidth, row * this.cellWidth, this.cellWidth, this.cellWidth), 100);    
                } else {
                    setTimeout(() => this.drawBlast(bullet), 101);    // repaints full blast after partial clearing
                }
            }
        }
        if (this.fuel.destroyed) {
            this.generateFuel();
            this.drawFuel();
        }
    }

    _hasBulletHitSomething(bullet) {
        if (this._hasBulletHitJetwall(bullet, this.player1) ||
            this._hasBulletHitJetwall(bullet, this.player2) ||
            this._hasBulletHitFuel(bullet)) {
                return true;
        } else {
            return false;
        }
    }

    checkBulletStrike() {
        this.bullets.forEach(bullet => {
            if (this._hasBulletHitSomething(bullet)) {
                bullet.hitSomething = true;
                bullet.stop();
                this.drawBlast(bullet);
                this.inflictBlastDamage(bullet);
                this.bullets.splice(this.bullets.indexOf(bullet), 1);
            }
        });
        if (this.fuel.destroyed) {
            this.fuel.destroyed = false;
        }
    }

    stopBullets() {
        if (this.bullets.length > 0) {
            this.bullets.forEach(bullet => bullet.stop());
        }
    }

    _endingSequence() {
        this._stopPlayers();
        this.stopBullets();
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
        setTimeout(() => this.gameOver(this.winner, player1Config, player2Config), 500);
    }

    _update() {
        let gameOver = false;
        this.updateScore();
        if (this.bullets.length > 0) {
            this.drawBullets();
            this.eraseBulletTrails();
            this.checkBulletStrike();
        }
        this.checkFuelPickup();
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
        let player1ShotFired = false;
        let player2ShotFired = false;
        if (!eventListenersAdded) {
            eventListenersAdded = true;
            document.addEventListener("keydown", e => {
                console.log(`Keydown ${e.keyCode} ${e.key}`);
                if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                    e.preventDefault();
                }
                switch (e.keyCode) {
                    case 68: // d
                        this.player1.goLeft();
                        break;
                    case 82: // r
                        this.player1.goUp();
                        break;
                    case 71: // g
                        this.player1.goRight();
                        break;
                    case 70: // f
                        this.player1.goDown();
                        break;
                    case 49: // 1
                        this.player1.speedUp();
                        this.player1.burnFuel();
                        break;
                    case 50: // 2
                        if (e.repeat) {
                            console.log('Repeat keycode 50');
                            return;
                        } else if (!player1ShotFired && this.player1.fuel >= player1Config.bulletCost) {
                            player1ShotFired = true;
                            this.player1.useFuelForBullet();
                            this.shoot(this.player1);
                        }
                        break;
                    case 37: // left arrow
                        this.player2.goLeft();
                        break;
                    case 38: // up arrow up
                        this.player2.goUp();
                        break;
                    case 39: // right arrow
                        this.player2.goRight();
                        break;
                    case 40: // down arrow
                        this.player2.goDown();
                        break;
                    case 188: // , comma
                        this.player2.speedUp();
                        this.player2.burnFuel();
                        break;
                    case 190: // . period
                        if (e.repeat) {
                            console.log('Repeat keycode 190');
                            return;
                        } else if (!player2ShotFired && this.player2.fuel >= player2Config.bulletCost) {
                            player2ShotFired = true;
                            this.player2.useFuelForBullet();
                            this.shoot(this.player2);
                        }
                        break;
                }
            });
            document.addEventListener("keyup", e => {
                console.log(`Keyup ${e.keyCode} ${e.key}`);
                switch (e.keyCode) {
                    case 49: // 1
                        this.player1.slowDown();
                        this.player1.stopBurningFuel();
                        break;
                    case 50: // 2
                        player1ShotFired = false;
                        break;
                    case 188: // comma
                        this.player2.slowDown();
                        this.player2.stopBurningFuel();
                        break;
                    case 190: // . period
                        player2ShotFired = false;
                        break;
                }
            });
        }
    }

    clearGrid() {
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.ctx.beginPath();
    }

    explosionLoop(crashPosition) {
        this.explosionInterval = requestAnimFrame(this.explosionLoop.bind(this));
        updateExplosions();
        updateParticles();
        launchExplosion(crashPosition);
    }

    stopAnimation() {
        window.cancelAnimationFrame(this.interval);
        setTimeout(() => window.cancelAnimationFrame(this.explosionInterval), 1000);
    }

    start() {
        this.clearGrid();
        this.player1.move();
        this.player2.move();
        if (!this.fuel.row) {
            this.generateFuel();
            this.drawFuel();
        }
        this.interval = window.requestAnimationFrame(this._update.bind(this));
        this._assignControlsToKeys();
    }
}