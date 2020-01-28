// jshint esversion: 6

class Game {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.cellWidth = 10;
        this.rows = canvas.width / this.cellWidth;
        this.columns = canvas.height / this.cellWidth;
    }

    _assignControlsToKeys() {
        document.addEventListener('keydown', e => {
            console.log(`Keydown ${e.keyCode} ${e.key}`);
            switch (e.keyCode) {
            case 38: // up arrow up
                this.player1.goUp();
                break;
            case 40: // down arrow
                this.player1.goDown();
                break;
            case 37: // left arrow
                this.player1.goLeft();
                break;
            case 39: // right arrow
                this.player1.goRight();
                break;
            }
        });   
    }

    start() {
        this.player1 = new LightCycle(canvas.width / this.cellWidth, canvas.height / this.cellWidth);
        this.player1.move();
        this._assignControlsToKeys();
    }
}
