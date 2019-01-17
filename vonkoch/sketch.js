
let limit = 300;
let slider;

function setup() {
  createCanvas(windowWidth, windowHeight);

  slider = createSlider(5, 300, 300, 0.01);
  slider.position(windowWidth / 2 - width / 2 + 5, 10);

  stroke(126, 170, 255);
  strokeWeight(2);
}

let angle = 0;
function draw() {
  background(0);
  
  let size = width / 2;
  
  translate(width / 2, height / 2);
  //rotate(angle);

  stroke(55, 174, 140);
  push();
  koch(size);

  translate(size, 0);
  rotate(2 * PI / 3.0);
  koch(size);

  translate(size, 0);
  rotate(2 * PI / 3.0);
  koch(size);
  pop();


  stroke(229, 107, 98);
  push();
  rotate(-PI / 3);
  koch(size);

  translate(size, 0);
  rotate(2 * PI / 3.0);
  koch(size);

  translate(size, 0);
  rotate(2 * PI / 3.0);
  koch(size);
  pop();


  stroke(55, 174, 140);
  push();
  rotate(-PI);
  koch(size);

  translate(size, 0);
  rotate(2 * PI / 3.0);
  koch(size);

  translate(size, 0);
  rotate(2 * PI / 3.0);
  koch(size);
  pop();

  stroke(229, 107, 98);
  translate(-width / 2, 0);
  push();
  koch(size);

  translate(size, 0);
  rotate(2 * PI / 3.0);
  koch(size);

  translate(size, 0);
  rotate(2 * PI / 3.0);
  koch(size);
  pop();

  angle += 0.01;
}

function koch(len) {
  if(len < slider.value()) {
    line(0, 0, len, 0);
  } else {
    koch(len / 3.0);
    push();
    {
      translate(len / 3.0, 0);
      rotate(-PI / 3.0);
      koch(len / 3.0);
    }
    pop();

    push();
    {
      translate(len / 3.0, 0);
      rotate(-PI / 3.0);
      translate(len / 3.0, 0);
      rotate(2 * PI / 3.0);
      koch(len / 3.0);
    }
    pop();

    push();
    {
      translate(2 * len / 3.0, 0);
      koch(len / 3.0);
    }
    pop();
  }
}

function mouseClicked() {
  if(limit > 5) limit = limit / 3.0;
  else limit = 300;
}