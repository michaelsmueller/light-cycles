// jshint esversion: 6
let ctx, game;
let canvas = document.getElementById('game-grid');
ctx = canvas.getContext('2d');

function start() {
    console.log('Function start');
    game = new Game(ctx, canvas);
    game.start();
}

document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM content loaded');
    document.getElementById('start').onclick = () => {
        console.log('Start onClick');
        start();
    };
});