// jshint esversion: 6

let ctx, game, audioContext, bufferLoader;
let canvas = document.getElementById('game-grid');
canvas.width = 900;
canvas.height = 700;
ctx = canvas.getContext('2d');


function gameOver() {
    console.log("Game over");
    // add something cool here
}

function startAudio() {
    document.AudioContext = document.AudioContext || document.webkitAudioContext;
    audioContext = new AudioContext();
    console.log('Audio context started');
}

function bufferAudio() {
    bufferLoader = new BufferLoader(
        audioContext,
        [
            "audio/the-grid.mp3"
            // Daft Punk - The Grid (Joseph Darwed Orchestral Rework) [Tron Soundtrack] [HD 1080p]
        ],
        playAudio
        );
    bufferLoader.load();
}

function playAudio(bufferList) {
    let music = audioContext.createBufferSource();
    music.buffer = bufferList[0];
    music.connect(audioContext.destination);
    music.start(0);
}

function start() {
    console.log('Instantiating game');
    game = new Game(ctx, canvas, gameOver);
    game.start();
}

document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM content loaded');
    document.getElementById('start').onclick = () => {
        console.log('Start game button clicked');
        startAudio();
        bufferAudio();
        start();
    };
});