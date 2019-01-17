
var maxRockets = 50;
var duration = 800;
var population;
var count = 0;
var generationCount = 0;

var targetPos;

var obstacles = [];

function setup() {
  createCanvas(720, 720);

  population = new Population();
  targetPos = createVector(width / 2, 100);

  obstacles[0] = new Obstacle(200, 450, width - 400, 50);
  obstacles[1] = new Obstacle(0, 300, 250, 50);
  obstacles[2] = new Obstacle(width - 250, 300, 250, 50);
}

function draw() {
  background(0);

  count++;
  if(count == duration || allRocketsDead()) {
    count = 0;
    population.reset();
    generationCount++;
  }

  for(let obstacle of obstacles) {
    obstacle.render();
  }

  fill(255, 0, 0);
  ellipse(targetPos.x, targetPos.y, 25, 25);

  population.update();

  noStroke();
  fill(255);
  textSize(32);
  text("duration : " + count + " / " + duration, 20, 40);
  text("generation count : " + generationCount, 20, 70);
}

function allRocketsDead() {
  return population.areAllDead();
}

function Obstacle(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;

  this.isOverlapping = function(px, py) {
    return (px >= this.x && px <= this.x + this.w) &&
      (py >= this.y && py <= this.y + this.h);
  }

  this.render = function() {
    fill(190, 60, 60, 255);
    push();
    translate(this.x, this.y);
    rect(0, 0, this.w, this.h);
    pop();
  }
}

function Population() {
  this.rockets = [];
  this.pool = [];

  for(let i = 0; i < maxRockets; i++) {
    this.rockets[i] = new Rocket();
  }

  this.update = function() {
    for(let i = 0; i < maxRockets; i++) {
      this.rockets[i].update();
      this.rockets[i].render();
    }
  }

  this.reset = function() {
    this.eval();
    this.rockets = this.naturalSelection();
  }

  this.areAllDead = function() {
    for(let i = 0; i < maxRockets; i++)
      if(this.rockets[i].state == 0)
        return false;
    
    return true;
  }

  this.eval = function() {
    let maxFit = 0;
    let minFit = 100000;
    
    for(let i = 0; i < maxRockets; i++) {
      this.rockets[i].getFitness();
      if(maxFit < this.rockets[i].fitness)
        maxFit = this.rockets[i].fitness;
      if(minFit > this.rockets[i].fitness)
        minFit = this.rockets[i].fitness;
    }
    console.log("maxfit : " + maxFit + " | minfit : " + minFit);

    /**
     * Normalize to [0, 1]
     */
    for(let i = 0; i < maxRockets; i++) {
      this.rockets[i].fitness /= maxFit;
    }

    this.pool = [];
    /**
     * add more of closest rockets
     */
    for(let i = 0; i < maxRockets; i++) {
      let n = (1 - this.rockets[i].fitness) * 100;
      for(let j = 0; j < n; j++) {
        this.pool.push(this.rockets[i]);
      }
    }
  }

  this.naturalSelection = function() {
    let newRockets = [];
    for(let i = 0; i < this.rockets.length; i++) {
      let dnaParentA = random(this.pool).dna;
      let dnaParentB = random(this.pool).dna;
      let childDNA = dnaParentA.createChildWith(dnaParentB);
      childDNA.mutate();

      newRockets[i] = new Rocket(childDNA);
    }

    return newRockets;
  }

}

var maxMag = 0.4;
function DNA(genes) {
  

  if(genes)
    this.genes = genes;
  else {
    this.genes = [];
    for(let i = 0; i < duration; i++) {
      this.genes[i] = p5.Vector.random2D();
      this.genes[i].setMag(maxMag);
    }
  }

  this.createChildWith = function(other) {
    let newGenes = [];

    let split = floor(random(duration));
    for(let i = 0; i < duration; i++) {
      newGenes[i] = (i < split) ? this.genes[i] : other.genes[i]; 
    }

    return new DNA(newGenes);
  }

  this.mutate = function() {
    for(let i = 0; i < duration; i++) {
      let r = random();
      if(r <= 0.001) {
        this.genes[i] = p5.Vector.random2D();
        this.genes[i].setMag(maxMag);
      }
    }
  }

}

function Rocket(dna) {
  this.pos = createVector(width / 2, height - 10);
  this.velocity = createVector();
  this.acceleration = createVector();
  this.fitness = 0;
  this.state = 0; // 0 => looking for / 1 => on target / -1 => crashed
  this.time = 0;
  this.distClosest = height * 2;

  if(dna)
    this.dna = dna;
  else
    this.dna = new DNA();

  

  this.maxSpeed = 5;
  this.w = 20;
  this.h = 15;

  // COLOR
  this.r = random(255);
  this.g = random(255);
  this.b = random(255);

  this.getFitness = function() {
    let d = dist(this.pos.x, this.pos.y, targetPos.x, targetPos.y);
    
    let facTime = this.time;
    let facClose = this.distClosest;
    this.fitness = facClose + facTime;

    if(this.state == 1) {
      this.fitness /= 10;
    }

    if(this.state == -1) {
      this.fitness *= 10;
    }

    return this.fitness;
  }

  this.applyForce = function(force) {
    this.acceleration.add(force);
  }

  this.update = function() {
    if(this.state == 0) {
      this.applyForce(this.dna.genes[count]);
      this.velocity.add(this.acceleration);
      this.velocity.limit(5);
      this.pos.add(this.velocity);

      if(this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height) {
        this.state = -1
        this.time = duration
      }
    }
  
    let distToTarget = dist(this.pos.x, this.pos.y, targetPos.x, targetPos.y);
    if(distToTarget < this.distClosest) {
      this.distClosest = distToTarget;
      this.time = count;
    }

    if(distToTarget < 25) {
      this.state = 1;
      this.pos = targetPos.copy();
      this.distClosest = 0;
      this.time = count;
    }

    for(let obstacle of obstacles) {
      if(obstacle.isOverlapping(this.pos.x, this.pos.y)) {
        this.state = -1;
        this.time = duration;
      }
    }

    this.acceleration.mult(0);
  }

  this.render = function() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.velocity.heading());

    noStroke();
    fill(this.r, this.g, this.b, 255);
    beginShape();
    {
      vertex(this.w / 2, 0)
      vertex(-this.w / 2, -this.h / 2);
      vertex(-this.w / 2, this.h / 2);
    }
    endShape(CLOSE);

    pop();
  }


}