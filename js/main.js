// jshint esversion: 6

let ctx, game;
let canvas = document.getElementById('game-grid');
canvas.width = 900;
canvas.height = 700;
ctx = canvas.getContext('2d');

function gameOver() {
    console.log("Game over");
    canvas.style = "display: none";
}

function start() {
    console.log('Instantiating game');
    game = new Game(ctx, canvas, gameOver);
    game.start();
}

document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM content loaded');
    document.getElementById('start').onclick = () => {
        console.log('onClick event fired');
        start();
    };
});