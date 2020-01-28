// jshint esversion: 6

class Game {
    constructor(ctx, canvas) {
        console.log(`Canvas width ${canvas.width} height ${canvas.height}`);
        this.ctx = ctx;
        this.cellWidth = 10;
        this.rows = canvas.width / this.cellWidth;
        this.columns = canvas.height / this.cellWidth;
        this.player1 = new LightCycle(canvas.width / this.cellWidth, canvas.height / this.cellWidth, 1);
        this.player2 = new LightCycle(canvas.width / this.cellWidth, canvas.height / this.cellWidth, 10);
    }

    _drawJetwall() {
        this.ctx.fillStyle = "#00FFFF";
        const cycle1 = game.player1.jetwall[0];
        this.ctx.fillRect(cycle1.column * this.cellWidth, cycle1.row * this.cellWidth, 9, 9);

        this.ctx.fillStyle = "#FF0080";
        const cycle2 = game.player2.jetwall[0];
        this.ctx.fillRect(cycle2.column * this.cellWidth, cycle2.row * this.cellWidth, 9, 9);
    }
    
    _update() {
        this._drawJetwall();
        if (!!game.interval) {
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
