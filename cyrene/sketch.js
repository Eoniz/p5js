
var MAX_ROOT = 1000;
var root = [];

function preload() {
  for(let i = 0; i < MAX_ROOT; i++) {
    root[i] = sqrt(i);
  }
  console.log(root.length);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360);

  background(0);
  translate(width / 2, height / 2);
  info = firstTriangle();

  distToA = width * 15 / 1920;
}

let lastAng;

// 1920  -> 15
// width -> width * 15 / 1920
let distToA;

let index = 2;
let counter = 0;

var info;

function firstTriangle() {
  index = 2;
  counter = 0;

  lastAng = 0;

  let hyp = sqrt(2);
  let ang = acos(1 / hyp);
  let _xB = distToA;
  let _yB = sin(-ang) * hyp * distToA;

  let c = map(index, 0, MAX_ROOT, 0, 360);
  fill(c, 50, 50, 50);
  stroke(0);

  beginShape(TRIANGLES);
  vertex(0, 0);
  vertex(_xB, _yB);
  vertex(distToA, 0);
  endShape(CLOSE);

  lastAng += ang;
  index++;

  return {ang: lastAng, x: _xB, y: _yB, hyp: hyp};
}

function draw() {
  translate(width / 2, height / 2);
  if(index > MAX_ROOT - 1) {
    background(0);
    info = firstTriangle();
    
    return;
  }

  if(counter++ > 1) {
    info = draw_part(index++, info.ang, info.x, info.y, info.hyp);
    counter = 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
  distToA = width * 15 / 1920;
  info = firstTriangle();
}

function draw_part(index, lastAng, lastX, lastY, lHyp) {
  let _hyp = root[index];

  let ang = Math.acos(lHyp / _hyp);
  let _x = (cos(ang + lastAng)) * _hyp * distToA;
  let _y = (sin(-ang - lastAng)) * _hyp * distToA;

  let c = map(index, 0, MAX_ROOT, 0, 360);
  stroke(c, 360, 360, 60);
  
  fill(c, 360, 360, 50);

  beginShape(TRIANGLES);
  vertex(0, 0);
  vertex(_x, _y);
  vertex(lastX, lastY);
  endShape(CLOSE);

  noFill();
  stroke(360);
  ellipse(_x, _y, 2, 2);

  lastAng += ang;
  return {ang: lastAng, x: _x, y: _y, hyp: _hyp};
}