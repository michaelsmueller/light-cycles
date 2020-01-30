// jshint esversion: 6

let ctx, game, audioCtx, bufferLoader;
let explosions = [], particles = [];
let hue = 120;
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
    audioCtx = new AudioContext();
    console.log('Audio context started');

    bufferLoader = new BufferLoader(
        audioCtx,
        [
            // "audio/soopertrack.mp3",  // Extrawelt - Soopertrack Original (High Quality)
            "audio/the-grid.mp3" // Daft Punk - The Grid (Joseph Darwed Orchestral Rework) [Tron Soundtrack] [HD 1080p]
        ],
        playMusic
        );
    bufferLoader.load();
}

function playMusic(bufferList) {
    const music = audioCtx.createBufferSource();
    music.buffer = bufferList[0];
    music.connect(audioCtx.destination);
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
        start();
    };
});