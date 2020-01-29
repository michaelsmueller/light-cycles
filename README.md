# Light Cycles

Inspired by __Tron__. The purpose of this game is to "__derez__" (destroy) the enemy "__Light Cycle__." Light Cycles move in straight lines and leave behind solid "__jetwalls__" in their wake. Crashing into any jetwall will cause a player to derez.

The game screen is a two-dimensional board, the "__Game Grid__," that the players race around. The player is represented by a Light Cycle. Each player can use one of four keys to change the direction (up, down, left, right) of their Light Cycle. Players can also use __fusion__ power to speed up their Light Cycle.

The game is over when either player crashes into a jetwall, including their own.

Extras:
* Each player has a limited quantity of fusion fuel (deuterium or tritium). Fuel appears sporadically on the screen which can be collected to refill the fusion tank.

* * *

## MVP

### Technique
HTML5 __Canvas__ and vanilla __JavaScript__

### Game states

* __Start Screen__
  * Title
  * Play button
* __Game Screen__
  * Canvas
* __Game Over Screen__
  * Play again button
  * Go to start screen button

### Game
* Create board
* Create two players
* Player 1 key controls
  * Change direction: up, down, right, left
  * Speed up: . (period)
* Player 2 key controls
  * Change direction: w - up, s - down, d - right, a - left
  * Speed up: 1

* * *

## BACKLOG

### Collisions
* Game Over

### Fusion power
* Player has limited quantity of fusion fuel
* Deuterium or tritium appears on board which player can pick it up to refuel fusion tank

### Computer opponent (AI)
* Implement various racing strategies
* Add multiple opponents

### Score
* Add game score: number of opponents destroyed, survival time / jetwall length, level reached 
* Create High Score Screen
* Show latest score on Start Screen
* Add high score button to Start Screen

### Audio
* Add sound effects to Light Cycle movements
* Add background music
* Add music on / off button to Start screen.

### Player colors
* Add Choose color button to Start Screen

### Add pause

### Levels
* New levels increase computer AI difficulty (speed or ability)
* New levels have barriers
* New levels have Recognizer or Light Tanks

* * *

## Data structure

__main.js__
*(view)*
````
createStartScreen(id);
createGameGrid(id);
createGameOverScreen(id);
destroyStartScreen();
destroyGameGrid();
destroyGameOverScreen();
var game = new Game({
    this.rows,
    this.columns,
    this.ctx: ctx,
    this.backgroundcolor = ['0','0','0'],
    this.lightCycle1,
    this.lightCycle2
  });
Game.drawGrid();
Game.init();
Game.paintJetwall();

````

__game.js__
*(controller)*
````
function Game(options){};
Game.drawGrid()
Game.drawLightCycles();
Game.pause();
Game.resume();
Game.gameOver();
Game.start();    // create Game, two Players, start players, Game paint players
LightCycle.start();
LightCycle.checkCollision();
garbageCollector;
````

__player.js__
*(model)*
````
function LightCycle(){
  this.jetwall,  // array
  this.direction,
  this.velocity,
  this.color
};
LightCycle.start();
LightCycle.move();
````

## Links
[Light Cycles on Trello](https://trello.com/b/G1fQBfIW/light-cycles)

[Light Cycles on Github](https://github.com/michaelsmueller/light-cycles)