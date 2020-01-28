// jshint esversion: 6
let ctx, game;
let canvas = document.getElementById('game-grid');
canvas.width = 800;
canvas.height = 1000;
ctx = canvas.getContext('2d');

function start() {
    console.log('Instantiating game');
    game = new Game(ctx, canvas);
    game.start();
}

document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM content loaded');
    document.getElementById('start').onclick = () => {
        console.log('onClick event fired');
        start();
    };
});