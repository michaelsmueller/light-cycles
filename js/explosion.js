// jshint esversion: 6

const EXPLOSION_ACCELERATION = 1.05;
// Minimum explosion brightness.
const EXPLOSION_BRIGHTNESS_MIN = 50;
// Maximum explosion brightness.
const EXPLOSION_BRIGHTNESS_MAX = 70;
// Base speed of explosions.
const EXPLOSION_SPEED = 3;
// Base length of explosion trails.
const EXPLOSION_TRAIL_LENGTH = 1;
// Determine if target position indicator is enabled.
const EXPLOSION_TARGET_INDICATOR_ENABLED = false;
// Minimum particle brightness.
const PARTICLE_BRIGHTNESS_MIN = 50;
// Maximum particle brightness.
const PARTICLE_BRIGHTNESS_MAX = 50;
// Base particle count per explosion.
const PARTICLE_COUNT = 10;
// Minimum particle decay rate.
const PARTICLE_DECAY_MIN = 0.015;
// Maximum particle decay rate.
const PARTICLE_DECAY_MAX = 0.03;
// Base particle friction.
// Slows the speed of particles over time.
const PARTICLE_FRICTION = 0.95;
// Base particle gravity.
// How quickly particles move toward a downward trajectory.
const PARTICLE_GRAVITY = 0.7;
// Variance in particle coloration.
const PARTICLE_HUE_VARIANCE = 20;
// Base particle transparency.
const PARTICLE_TRANSPARENCY = 1;
// Minimum particle speed.
const PARTICLE_SPEED_MIN = 1;
// Maximum particle speed.
const PARTICLE_SPEED_MAX = 10;
// Base length of explosion particle trails.
const PARTICLE_TRAIL_LENGTH = 5;
// Alpha level that canvas cleanup iteration removes existing trails.
// Lower value increases trail duration.
const CANVAS_CLEANUP_ALPHA = 0.3;
// Hue change per loop, used to rotate through different explosion colors.
const HUE_STEP_INCREASE = 0.5;
// Minimum number of ticks per manual explosion launch.
const TICKS_PER_EXPLOSION_MIN = 1;
// Minimum number of ticks between each automatic explosion launch.
const TICKS_PER_EXPLOSION_AUTOMATED_MIN = 20;
// Maximum number of ticks between each automatic explosion launch.
const TICKS_PER_EXPLOSION_AUTOMATED_MAX = 80;


window.requestAnimFrame = (() => {
    return  window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 2000 / 60);
            };
})();

// Get a random number within the specified range.
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// Calculate the distance between two points.
function calculateDistance(aX, aY, bX, bY) {
    let xDistance = aX - bX;
    let yDistance = aY - bY;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

function Explosion (startX, startY, endX, endY) {
    // Set current coordinates.
    this.x = startX;
    this.y = startY;
    // Set starting coordinates.
    this.startX = startX;
    this.startY = startY;
    // Set end coordinates.
    this.endX = endX;
    this.endY = endY;
    // Get the distance to the end point.
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
    // Set the speed.
    this.speed = EXPLOSION_SPEED;
    // Set the acceleration.
    this.acceleration = EXPLOSION_ACCELERATION;
    // Set the brightness.
    this.brightness = random(EXPLOSION_BRIGHTNESS_MIN, EXPLOSION_BRIGHTNESS_MAX);
    // Set the radius of click-target location.
    this.targetRadius = 1;
}

Explosion.prototype.update = function(index) {
    // Remove the oldest trail particle.
    this.trail.pop();
    // Add the current position to the start of trail.
    this.trail.unshift([this.x, this.y]);

    // Increase speed based on acceleration rate.
    this.speed *= this.acceleration;

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

// Draw a explosion.
// Use CanvasRenderingContext2D methods to create strokes as explosion paths. 
Explosion.prototype.draw = function() {
    // Begin a new path for explosion trail.
    ctx.beginPath();
    // Get the coordinates for the oldest trail position.   
    let trailEndX = this.trail[this.trail.length - 1][0];
    let trailEndY = this.trail[this.trail.length - 1][1];
    // Create a trail stroke from trail end position to current explosion position.
    ctx.moveTo(trailEndX, trailEndY);
    ctx.lineTo(this.x, this.y);
    // Set stroke coloration and style.
    // Use hue, saturation, and light values instead of RGB.
    ctx.strokeStyle = `hsl(${hue}, 100%, ${this.brightness}%)`;
    // Draw stroke.
    ctx.stroke();
};

// Creates a new particle at provided 'x' and 'y' coordinates.
function Particle(x, y) {
    // Set current position.
    this.x = x;
    this.y = y;
    // To better simulate a explosion, set the angle of travel to random value in any direction.
    this.angle = random(0, Math.PI * 2);
    // Set friction.
    this.friction = PARTICLE_FRICTION;
    // Set gravity.
    this.gravity = PARTICLE_GRAVITY;
    // Set the hue to somewhat randomized number.
    // This gives the particles within a explosion explosion an appealing variance.
    this.hue = random(hue - PARTICLE_HUE_VARIANCE, hue + PARTICLE_HUE_VARIANCE);
    // Set brightness.
    this.brightness = random(PARTICLE_BRIGHTNESS_MIN, PARTICLE_BRIGHTNESS_MAX);
    // Set decay.
    this.decay = random(PARTICLE_DECAY_MIN, PARTICLE_DECAY_MAX);    
    // Set speed.
    this.speed = random(PARTICLE_SPEED_MIN, PARTICLE_SPEED_MAX);
    // Create an array to track current trail particles.
    this.trail = [];
    // Trail length determines how many trailing particles are active at once.
    this.trailLength = PARTICLE_TRAIL_LENGTH;
    // While the trail length remains, add current point to trail list.
    while(this.trailLength--) {
        this.trail.push([this.x, this.y]);
    }
    // Set transparency.
    this.transparency = PARTICLE_TRANSPARENCY;
}

// Update a particle prototype.
// 'index' parameter is index in 'particles' array to remove, if journey is complete.
Particle.prototype.update = function(index) {
    // Remove the oldest trail particle.
    this.trail.pop();
    // Add the current position to the start of trail.
    this.trail.unshift([this.x, this.y]);

    // Decrease speed based on friction rate.
    this.speed *= this.friction;
    // Calculate current position based on angle, speed, and gravity (for y-axis only).
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;

    // Apply transparency based on decay.
    this.transparency -= this.decay;
    // Use decay rate to determine if particle should be destroyed.
    if(this.transparency <= this.decay) {
        // Destroy particle once transparency level is below decay.
        particles.splice(index, 1);
    }
};

// Draw a particle.
// Use CanvasRenderingContext2D methods to create strokes as particle paths. 
Particle.prototype.draw = function() {
    // Begin a new path for particle trail.
    ctx.beginPath();
    // Get the coordinates for the oldest trail position.   
    let trailEndX = this.trail[this.trail.length - 1][0];
    let trailEndY = this.trail[this.trail.length - 1][1];
    // Create a trail stroke from trail end position to current particle position.
    ctx.moveTo(trailEndX, trailEndY);
    ctx.lineTo(this.x, this.y);
    // Set stroke coloration and style.
    // Use hue, brightness, and transparency instead of RGBA.
    ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.transparency})`;
    ctx.stroke();
};

// Create particle explosion at 'x' and 'y' coordinates.
function createParticles(x, y) {
    // Set particle count.
    // Higher numbers may reduce performance.
    let particleCount = PARTICLE_COUNT;
    while(particleCount--) {
        // Create a new particle and add it to particles collection.
        particles.push(new Particle(x, y));
    }
}

// Launch explosions automatically.
function launchExplosion(position) {
    let startX = position.x;
    let startY = position.y;
    // Set end position to random position, somewhere in the top half of screen.
    let endX = position.x;
    let endY = position.y;
    // Create new explosion and add to collection.
    explosions.push(new Explosion(startX, startY, endX, endY));
}

// Update all active explosions.
function updateExplosions() {
    // Loop backwards through all explosions, drawing and updating each.
    for (let i = explosions.length - 1; i >= 0; --i) {
        explosions[i].draw();
        explosions[i].update(i);
    }
}

// Update all active particles.
function updateParticles() {
    // Loop backwards through all particles, drawing and updating each.
    for (let i = particles.length - 1; i >= 0; --i) {
        particles[i].draw();
        particles[i].update(i);
    }
}

// === END APP HELPERS ===

