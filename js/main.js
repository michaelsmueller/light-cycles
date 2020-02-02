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
    // music.stop(0);
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

function gameOver(winner, player1Config, player2Config) {
    stopMusic();

    const gameOverScreen = document.getElementById('game-over-screen');
    gameOverScreen.classList.toggle("hidden");

    const winnerMessage = document.getElementById('winner-message');
    switch (winner) {
        case "neither":
            winnerMessage.innerText = "Both players have derezzed.";
            winnerMessage.style.backgroundColor = "white";
            break;
        case "Player 1":
            winnerMessage.innerText = "Player 1 has won – Player 2 derezzed.";
            winnerMessage.style.backgroundColor = player1Config.color;
            break;
        case "Player 2":
            winnerMessage.innerText = "Player 2 has won – Player 1 derezzed.";
            winnerMessage.style.backgroundColor = player2Config.color;
            break;
    }

    const restartButton = document.getElementById('restart');
    restartButton.onclick = () => {
        console.log('Restart game button clicked');
        gameOverScreen.classList.toggle("hidden");
        start();
    };
}

function hideStartScreen() {
    const startScreen = document.getElementById('start-screen');
    startScreen.classList.toggle("hidden");
}

// function hideScrollBars() {
//     document.documentElement.style.overflow = "hidden";
//     // document.documentElement.style.overflow = 'auto';    // to put them back
// }

document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM content loaded');
    // startAudio();
    const startButton = document.getElementById('start');
    startButton.onclick = () => {
        console.log('Start game button clicked');
        hideStartScreen();
        html.requestFullscreen();
        // hideScrollBars();
        setupCanvas();
        // startCycleAudio();
        start();
    };
});