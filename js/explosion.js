// jshint esversion: 6

const EXPLOSION_COLOR = "white";
const EXPLOSION_SPEED = 10;
const EXPLOSION_TRAIL_LENGTH = 1;
const PARTICLE_COLOR = "white";
const PARTICLE_COUNT = 50;
const PARTICLE_DECAY = 0.015;
const PARTICLE_FRICTION = 1;   // size of explosion
const PARTICLE_SPEED = 80;
const PARTICLE_TRAIL_LENGTH = 1;

window.requestAnimFrame = (() => {
    return  window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })
();

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function calculateDistance(aX, aY, bX, bY) {
    let xDistance = aX - bX;
    let yDistance = aY - bY;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

function Explosion (startX, startY, endX, endY) {
    this.x = startX;
    this.y = startY;
    this.startX = 0;
    this.startY = 0;
    this.endX = endX;
    this.endY = endY;
    this.distanceToEnd = calculateDistance(startX, startY, endX, endY);
    this.distanceTraveled = 0;
    // Create an array to track current trail particles.
    this.trail = [];
    // Trail length determines how many trailing particles are active at once.
    this.trailLength = EXPLOSION_TRAIL_LENGTH;
    // While the trail length remains, add current point to trail list.
    while(this.trailLength--) {
        this.trail.push([this.x, this.y]);
    }
    // Calculate the angle to travel from start to end point.
    this.angle = Math.atan2(endY - startY, endX - startX);
    this.speed = EXPLOSION_SPEED;
    this.targetRadius = 1;
}

Explosion.prototype.update = function(index) {
    // Remove the oldest trail particle.
    this.trail.pop();
    // Add the current position to the start of trail.
    this.trail.unshift([this.x, this.y]);
    // Calculate current velocity for both x and y axes.
    let xVelocity = Math.cos(this.angle) * this.speed;
    let yVelocity = Math.sin(this.angle) * this.speed;
    // Calculate the current distance travelled based on starting position, current position, and velocity.
    // This can be used to determine if explosion has reached final position.
    this.distanceTraveled = calculateDistance(this.startX, this.startY, this.x + xVelocity, this.y + yVelocity);

    // Check if final position has been reached (or exceeded).
    if(this.distanceTraveled >= this.distanceToEnd) {
        // Destroy explosion by removing it from collection.
        explosions.splice(index, 1);
        // Create particle explosion at end point.  Important not to use this.x and this.y, 
        // since that position is always one animation loop behind.
        createParticles(this.endX, this.endY);      
    } else {
        // End position hasn't been reached, so continue along current trajectory by updating current coordinates.
        this.x += xVelocity;
        this.y += yVelocity;
    }
};

Explosion.prototype.draw = function() {
    // ctx.beginPath(); 
    // let trailEndX = this.trail[this.trail.length - 1][0];
    // let trailEndY = this.trail[this.trail.length - 1][1];
    // ctx.moveTo(trailEndX, trailEndY);
    // ctx.lineTo(this.x, this.y);
    // ctx.strokeStyle = EXPLOSION_COLOR;
    // ctx.stroke();
};

function Particle(x, y) {
    this.x = x;
    this.y = y;
    // To better simulate a explosion, set the angle of travel to random value in any direction.
    this.angle = random(0, Math.PI * 2);
    this.friction = PARTICLE_FRICTION;
    this.decay = PARTICLE_DECAY;    
    this.speed = PARTICLE_SPEED;
    // Create an array to track current trail particles.
    this.trail = [];
    // Trail length determines how many trailing particles are active at once.
    this.trailLength = PARTICLE_TRAIL_LENGTH;
    // While the trail length remains, add current point to trail list.
    while(this.trailLength--) {
        this.trail.push([this.x, this.y]);
    }
}

// 'index' parameter is index in 'particles' array to remove, if journey is complete.
Particle.prototype.update = function(index) {
    // Remove the oldest trail particle.
    this.trail.pop();
    // Add the current position to the start of trail.
    this.trail.unshift([this.x, this.y]);

    // Decrease speed based on friction rate.
    this.speed *= this.friction;
    // Calculate current position based on angle and speed (for y-axis only).
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
};

Particle.prototype.draw = function() {
    ctx.beginPath();  
    let trailEndX = this.trail[this.trail.length - 1][0];
    let trailEndY = this.trail[this.trail.length - 1][1];
    ctx.moveTo(trailEndX, trailEndY);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = PARTICLE_COLOR;
    ctx.lineWidth = 2;
    ctx.stroke();
};

function createParticles(x, y) {
    let particleCount = PARTICLE_COUNT;
    while(particleCount--) {
        particles.push(new Particle(x, y));
    }
}

function launchExplosion(position) {
    let startX = position.x;
    let startY = position.y;
    let endX = position.x;
    let endY = position.y;
    explosions.push(new Explosion(startX, startY, endX, endY));
}

function updateExplosions() {
    // Loop backwards through all explosions, drawing and updating each.
    for (let i = explosions.length - 1; i >= 0; --i) {
        explosions[i].draw();
        explosions[i].update(i);
    }
}

function updateParticles() {
    // Loop backwards through all particles, drawing and updating each.
    for (let i = particles.length - 1; i >= 0; --i) {
        particles[i].draw();
        particles[i].update(i);
    }
}