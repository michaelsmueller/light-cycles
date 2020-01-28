// jshint esversion: 6

class Game {
    constructor(ctx, canvas) {
        console.log(`Canvas width ${canvas.width} height ${canvas.height}`);
        this.ctx = ctx;
        this.cellWidth = 10;
        this.rows = canvas.width / this.cellWidth;
        this.columns = canvas.height / this.cellWidth;
        this.player1 = new LightCycle(canvas.width / this.cellWidth, canvas.height / this.cellWidth);
    }

    _drawJetwall() {
        this.ctx.fillStyle = "#75e7f1";
        game.player1.jetwall.forEach(position => {
          ctx.fillRect(position.column * this.cellWidth, position.row * this.cellWidth, 9, 9);
        });
    }
    
    _update() {
        this._drawJetwall();
        if (!!game.interval) {
            this.interval = window.requestAnimationFrame(this._update.bind(this));
        }
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
        game.player1.move();
        this.interval = window.requestAnimationFrame(this._update.bind(this));
        this._assignControlsToKeys();
    }
}
