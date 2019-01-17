
const MAX_BIRDS = 100;

var birds = [];
var deadBirds = [];

var pipes = [];

var framecount = 0;

var sliderCycle;

var GEN_COUNT = 1;
var MAX_SCORE = 0;
var CURRENT_MAX_SCORE = 0;

function setup() {
  createCanvas(400, 600);

  for(let i = 0; i < MAX_BIRDS; i++)
    birds.push(new Bird());
  
  pipes.push(new Pipe(width, random(100, height - 200)))

  sliderCycle = createSlider(1, 100, 1);
}

function draw() {
  for(let cycle = 0; cycle < sliderCycle.value(); cycle++) {
    for(let i = birds.length - 1; i >= 0 ; i--) {
      let bird = birds[i];
      bird.update();

      if(bird.isDead) {
        deadBirds.push(birds.splice(i, 1)[0]);
      }
      
      bird.think(pipes);
    }

    for(let pipe of pipes) {
      pipe.update();
  
      pipe.hitBird = false;
      for(let i = birds.length - 1; i >= 0 ; i--) {
        if(pipe.contains(birds[i])) {
          pipe.hitBird = true;
          
          deadBirds.push(birds.splice(i, 1)[0]);
        }
      }
    }
  
    for(let i = 0; i < pipes.length; i++) {
      let pipe = pipes[i];
  
      if(pipe.isOffscreen()) {
        pipes.splice(i, 1);
      }
    }
  
    framecount++;
    if(framecount % 150 == 0) {
      pipes.push(new Pipe(width, random(100, height - 100)));
    }
  
    // If no more birds, clear all pipes, add one pipe at width, populate
    if(birds.length === 0) {
      framecount = 0;
      pipes = [];
      pipes.push(new Pipe(width, random(0, height - 100)))
      generateNext();
    }
  }

  background(0);
  for(let bird of birds) {
    bird.render();
  }

  for(let pipe of pipes) {
    pipe.render();
  }

  CURRENT_MAX_SCORE = birds[0].score;

  noStroke();
  fill(255);
  textSize(16);
  text("GENERATION : " + GEN_COUNT, 10, 30);
  text("MAX SCORE : " + MAX_SCORE, 10, 50);
  text("CURRENT SCORE : " + CURRENT_MAX_SCORE, 10, 70);
  text("BIRDS COUNT : " + birds.length, 10, 90);
}