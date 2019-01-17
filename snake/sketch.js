
const NB_POPULATION = 200;
const NB_CELL_WIDTH = 20;
const NB_CELL_HEIGHT = 17;
const CELL_WIDTH = 32;
const CELL_HEIGHT = 32;
var GRID_X;
var GRID_Y;

var slider;

var grids = [];

var GEN_COUNT = 1;
var CURRENT_SCORE = 0;
var MAX_SCORE = 0;
var MAX_APPLE_EATEN = 0;

function setup() {
  createCanvas(800, 600);

  GRID_X = width / 2 - (CELL_WIDTH * NB_CELL_WIDTH) / 2;
  GRID_Y = height / 2 - (CELL_HEIGHT * NB_CELL_HEIGHT) / 2;

  slider = createSlider(1, 2000, 1);

  for(let i = 0; i < NB_POPULATION; i++)
    grids.push(new Grid());
}


function update() {
  let max = 0;
  let bestGrid = grids[0];
  for(let grid of grids) {
    grid.isBest = false;
    if(max < grid.snake.score && grid.snake.isDead() == false) {
      max = grid.snake.score;
      bestGrid = grid;
    }
  }
  CURRENT_SCORE = max;
  bestGrid.isBest = true;

  for(let i = 0; i < slider.value(); i++) {
    let atLeastOneAlive = false;
    for(let grid of grids) {
      grid.update();
      if(grid.snake.isDead() == false)
        atLeastOneAlive = true;
    }

    if(atLeastOneAlive == false) {
      generateNext();
      CURRENT_SCORE = 0;
    }
  }
}

function render() {
  background(0);

  for(let i = 0; i < grids.length; i++) { 
    grids[i].render((i == 0));
  }

  noStroke();
  fill(255);
  textWidth(32);
  text("GEN COUNT : " + GEN_COUNT, 15, 40);
  text("MAX SCORE : " + MAX_SCORE + " (" + MAX_APPLE_EATEN + ")", 15, 70);
  text("CURRENT MAX : " + CURRENT_SCORE, 15, 100);
  text("SPEED : " + slider.value() + "x" , 15, 130);
}


function draw() {
  update();
  render();
}

function keyPressed() {
  for(let grid of grids) 
    grid.keyPressed(keyCode);
}