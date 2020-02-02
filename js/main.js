// jshint esversion: 6

let ctx, game, canvas, audioCtx, bufferLoader, music, cycleSound;
let explosions = [], particles = [];
let html = document.documentElement;

function setupCanvas() {
    canvas = document.getElementById("game-grid");
    canvas.classList.toggle("hidden", false);
    canvas.width = 1350;
    canvas.height = 810;
    ctx = canvas.getContext('2d');
}

function startAudio() {
    document.AudioContext = document.AudioContext || document.webkitAudioContext;
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
    console.log('Audio context started');

    bufferLoader = new BufferLoader(
        audioCtx,
        [
            "audio/the-grid.mp3" // Daft Punk - The Grid (Joseph Darwed Orchestral Rework) [Tron Soundtrack] [HD 1080p]
        ],
        playMusic
        );
    bufferLoader.load();
}

function playMusic(bufferList) {
    if (music) {
        stopMusic();
    }
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
    console.log("Starting cycle audio");
    cycleSound = new Audio('audio/cycle-short.mp3');
    cycleSound.loop = true;
    cycleSound.play();
}

function start() {
    console.log('Instantiating game');
    if (game) {
        game.reset();
    } else {
        game = new Game(ctx, canvas, gameOver);
    }
    game.start();
}

function gameOver(winner) {
    stopMusic();
    if (winner === "neither") {
        alert("Both players have derezzed.");
    } else {
        alert(`${winner} has won.`);
    }
}

function hideStartScreen() {
    const startScreen = document.getElementById('start-screen');
    startScreen.classList.toggle("hidden");
}

document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM content loaded');
    startAudio();
    const startButton = document.getElementById('start');
    startButton.onclick = () => {
        console.log('Start game button clicked');
        hideStartScreen();
        // html.requestFullscreen();
        setupCanvas();
        // startCycleAudio();
        start();
    };
});