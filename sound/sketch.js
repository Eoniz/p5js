var sound;
var fft;
var peakDetect;
var img;

var imgW, imgH;

var MAX_PARTICLES = 15;
var particles = [];

function preload() {
  sound = loadSound('assets/music.mp3')
  img = loadImage('assets/image.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  imgW = img.width;
  imgH = img.height;

  fft = new p5.FFT();
  peakDetect = new p5.PeakDetect(20, 100, 0.8);

  background(0);

  tooglePlay();
}

function tooglePlay() {
  console.log("Toogle()");
  (sound.isPlaying() ? sound.pause() : sound.loop());
}

function mouseClicked() {
  tooglePlay();
}

let ellipseWidth = 0;
let c = {r: 0, g: 0, b: 0};

function onBeat() {
  let minCol = 50;
  let maxCol = 150;
  
  for(let i = 0; i < MAX_PARTICLES; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  fft.analyze();
  peakDetect.update(fft);
  if(peakDetect.isDetected) {
    onBeat();
  }

  particles.forEach((particle) => {
    particle.draw();

    if(particle.isOffScreen()) {
      particles.splice(particles.indexOf(particle), 1);
    }
  });
  

  stroke(0);
  fill(255);
  text('click to play / pause', 10, 10);
  text('All rights to M83', 10, 40);
  text('M83 - Midnight City', 10, 70);
}

function Particle() {
  this.draw = function() {
    let _x = map(this.curX, 0, width, 0, imgW);
    let _y = map(this.curY, 0, height, 0, imgH);
    let c = img.get(_x, _y);
    let size = random(10, 15);

    stroke(50, 50, 50, 100);
    fill(c[0], c[1], c[2], 100);
    ellipse(this.curX, this.curY, size, size);

    this.curX += this.maxSpeed * cos(this.angle);
    this.curY += this.maxSpeed * sin(this.angle);
  }

  this.reload = function() {
    this.curX = width / 2;
    this.curY = height / 2;
    this.angle = map(random(), 0, 1, 0, 360);
    this.maxSpeed = random(10, 20);
  }

  this.isOffScreen = function() {
    return (this.curX < 0 || this.curX > width || this.curY < 0 || this.curY > height);
  }

  this.reload();
}