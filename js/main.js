// jshint esversion: 6

let ctx, game, audioCtx, bufferLoader, music, cycleSound;
let explosions = [], particles = [];
let canvas = document.getElementById('game-grid');
canvas.width = 900;
canvas.height = 700;
ctx = canvas.getContext('2d');


function gameOver(winner) {
    stopMusic();
    if (winner === "neither") {
        console.log("Both players have derezzed.");
    } else {
        console.log(`${winner} has won.`);
    }
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
    music = audioCtx.createBufferSource();
    music.buffer = bufferList[0];
    console.log(music);
    music.connect(audioCtx.destination);
    music.start(0);
}

function stopMusic() {
    music.stop(0);
}

function startCycleAudio() {
    // console.log("Starting cycle audio");
    // cycleSound = new Audio('audio/cycle-short.mp3');
    // cycleSound.loop = true;
    // cycleSound.play();
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
        startCycleAudio();
        start();
    };
});