

var montains = [];

var nmbLayer = 25;
var bg = [];

var birdImg = [];

function Bird() {
  this.x = random(width);
  this.y = random(height);
  this.z = random(nmbLayer - 5, nmbLayer - 1);

  this.acceleration = createVector(0, 0, 0);
  this.maxSpeed = map(this.z, nmbLayer - 6, nmbLayer - 1, 0.8, 2);
  this.maxForce = 0.01;
  this.velocity = createVector(random(0, 2) >= 1 ? this.maxSpeed : -this.maxSpeed, 0, 0);
  this.position = createVector(this.x, this.y, this.z);

  this.sprite = createSprite(this.x, this.y, 134, 245);
  this.sprite.addAnimation("main", birdImg[0], birdImg[1], birdImg[2], birdImg[3], birdImg[2], birdImg[1]);
  this.sprite.animation.frameDelay = 5;

  //this.sprite.velocity.x = map(this.z, 0, nmbLayer, 3 / (nmbLayer / 2), 3);
  

  this.ang = random(100);

  this.run = function(boids) {
    this.flock(boids);
    this.update();
    this.borders();
  }

  this.applyForce = function(force) {
    this.acceleration.add(force);
  }

  this.flock = function(boids) {
    let sep = this.separate(boids);
    let ali = this.align(boids);
    let coh = this.cohesion(boids);

    sep.mult(1.5);
    ali.mult(1.0);
    coh.mult(1.0);

    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
  }

  this.update = function() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);

    this.acceleration.mult(0);

    this.maxSpeed = map(this.position.z, nmbLayer - 6, nmbLayer - 1, 0.8, 2);
    let theta = this.velocity.heading();

    this.sprite.rotation = degrees(theta);

    if(this.position.z < nmbLayer - 6)
      this.position.z = nmbLayer - 6;

    if(this.position.z > nmbLayer - 2)
      this.position.z = nmbLayer - 2;

    this.sprite.position = this.position;
    this.sprite.scale = map(this.position.z, nmbLayer - 5, nmbLayer - 1, 0.05, 0.1);
    this.sprite.depth = floor(this.position.z);
  }

  this.seek = function(target) {
    let desired = p5.Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(this.maxSpeed);

    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxForce);
    return steer;
  }

  this.separate = function(boids) {
    let desiredseparation = 20.0;
    let steer = createVector(0,0, 0);
    let count = 0;
    // For every boid in the system, check if it's too close
    for (let i = 0; i < boids.length; i++) {
      let d = p5.Vector.dist(this.position,boids[i].position);
      // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
      if ((d > 0) && (d < desiredseparation)) {
        // Calculate vector pointing away from neighbor
        let diff = p5.Vector.sub(this.position,boids[i].position);
        diff.normalize();
        diff.div(d);        // Weight by distance
        steer.add(diff);
        count++;            // Keep track of how many
      }
    }
    // Average -- divide by how many
    if (count > 0) {
      steer.div(count);
    }
  
    // As long as the vector is greater than 0
    if (steer.mag() > 0) {
      // Implement Reynolds: Steering = Desired - Velocity
      steer.normalize();
      steer.mult(this.maxSpeed);
      steer.sub(this.velocity);
      steer.limit(this.maxforce);
    }
    return steer;
  }
  
  // Alignment
  // For every nearby boid in the system, calculate the average velocity
  this.align = function(boids) {
    let neighbordist = 30;
    let sum = createVector(0,0, 0);
    let count = 0;
    for (let i = 0; i < boids.length; i++) {
      let d = p5.Vector.dist(this.position,boids[i].position);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(boids[i].velocity);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxSpeed);
      let steer = p5.Vector.sub(sum,this.velocity);
      steer.limit(this.maxforce);
      return steer;
    } else {
      return createVector(0,0);
    }
  }
  
  // Cohesion
  // For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
  this.cohesion = function(boids) {
    let neighbordist = 30;
    let sum = createVector(0,0, 0);   // Start with empty vector to accumulate all locations
    let count = 0;
    for (let i = 0; i < boids.length; i++) {
      let d = p5.Vector.dist(this.position,boids[i].position);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(boids[i].position); // Add location
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      return this.seek(sum);  // Steer towards the location
    } else {
      return createVector(0,0);
    }
  }

  this.borders = function() {
    if(this.sprite.position.x > width) {
      this.sprite.position.x = 0;
    }

    if(this.sprite.position.x < 0) {
      this.sprite.position.x = width;
    }

    if(this.sprite.position.y < 0) {
      this.sprite.position.y = height + 100;
    }

    if(this.sprite.position.y > height + 100) {
      this.sprite.position.y = 0;
    }
  }
}

function Flock() {
  this.boids = [];

  this.run = function() {
    for(let boid of this.boids) {
      boid.run(this.boids);
    }
  }

  this.addBoid = function(boid) {
    this.boids.push(boid);
  }
}

function Mountain(depth) {
  this.x = windowWidth / 2;
  this.y = windowHeight / 2;
  this.z = depth;
  
  this.img = createImage(windowWidth, windowHeight);
  this.img.copy(bg[depth], 0, 0, windowWidth, windowHeight, 0, 0, windowWidth, windowHeight);
  

  this.sprite = createSprite(this.x, this.y, windowWidth, windowHeight);
  this.sprite.addImage("mountain", this.img);
  this.sprite.depth = depth;
}

function preload() {
  birdImg[0] = loadImage('img/bird01.png');
  birdImg[1] = loadImage('img/bird02.png');
  birdImg[2] = loadImage('img/bird03.png');
  birdImg[3] = loadImage('img/bird04.png');
}

var flock;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for(let i = 0; i < nmbLayer; i++)
    bg[i] = createGraphics(windowWidth, windowHeight);

  for(let z = nmbLayer - 1; z >= 0; z--) {
    let minHeight = -height / 6;
    let maxHeight = map(z, nmbLayer, 0, -height / 1.2, minHeight);
    let m = [];

    let nextX = -300;
    for(let x = 0; x < 20; x++) {
      let last = {};
      if(x != 0) {
        last = m[x - 1];
      }
      let width = random(30, 250);
      let _x = nextX + width;
      let _y = (last.y) ?
        random(last.y - 75, last.y + 75)
      : random(-100, maxHeight);

      if(_y < maxHeight) _y = maxHeight;

      let trees = [];
      if(z < nmbLayer / 1.5 && x > 0) {
        let minR = 1;
        let maxR = 5;
        let nmb = random(minR, maxR);

        let space = abs(_x  - last.x) / nmb;
        
        for(let t = 0; t < nmb; t++) {
          let _xx = map(t, 0, nmb, last.x, _x);
          let _yy = map(_xx, last.x, _x, last.y, _y);

          let tree = createTree(_xx, _yy, z);
          trees.push(tree);
        }
      }

      m.push({x: _x, y: _y, z, trees: trees});

      nextX = _x;
    }

    montains.push(m);
  }

  for(let i = 0; i < nmbLayer; i++)
    bg[i].translate(0, height);
  
  for(let i = 0; i < montains.length; i++) {
    let layer = montains[i];
    for(let j = 0; j < layer.length - 1; j++) {
      let current = layer[j];  
      let next = layer[j + 1];

      let deg1 = nmbLayer * 0.20;
      let deg2 = nmbLayer * 0.50;

      let col_r, col_g, col_b;
      if(current.z >= 0 && current.z < deg1) {
        col_r = map(current.z, deg1, 0, 86, 46);
        col_g = map(current.z, deg1, 0, 0, 17);
        col_b = map(current.z, deg1, 0, 45, 45);
      } else if(current.z >= deg1 && current.z < deg2) {
        col_r = map(current.z, deg2, deg1, 200, 84);
        col_g = map(current.z, deg2, deg1, 41, 0);
        col_b = map(current.z, deg2, deg1, 61, 50);
      } else {
        col_r = map(current.z, nmbLayer, deg2, 252, 240);
        col_g = map(current.z, nmbLayer, deg2, 128, 68);
        col_b = map(current.z, nmbLayer, deg2, 74, 58);
      }


      bg[i].stroke(col_r, col_g, col_b);
      bg[i].fill(col_r, col_g, col_b);

      for(let tree of current.trees) 
        renderTree(tree, bg[i], col_r, col_g, col_b);
      
        bg[i].beginShape();
      {
        bg[i].vertex(current.x - 0.5, 0);
        bg[i].vertex(current.x - 0.5, current.y);
        bg[i].vertex(next.x + 0.5, next.y);
        bg[i].vertex(next.x + 0.5, 0);
      }
      bg[i].endShape();
      
    }
  }

  flock = new Flock();

  for(let i = 0; i < 20; i++) {
    let bird = new Bird();
    flock.addBoid(bird);
  }

  for(let i = 0; i < nmbLayer; i++) {
    new Mountain(i);
  }
}

function createTree(x, y, z) {
  let tree = {};

  let _scale = map(z, 0, nmbLayer, 5, 0.1);
  let _w = random(5, map(z, nmbLayer, 0, 10, 30)) * _scale;
  

  let nmbBr = random(3, 5);
  
  if(_w < 100)
    nmbBr /= 1.5;

  let _h = _w * 1.5;
  let _hBr = _h / nmbBr;

  points = [];
  for(let i = 0; i <= nmbBr; i++) {
    let _wi = map(i, 0, nmbBr, 5 * _scale , _w / 2);
    if(i == 0)
      _wi = 0;

    let _he = map(i, 0, nmbBr, 5, _h);

    let _x = _wi;
    let _y = _he;
    points.push({x: _x, y: _y});
  }

  tree.x = x;
  tree.y = y;
  tree.w = _w;
  tree.h = _h;
  tree.diff = (10 * _scale);
  tree.points = points;

  return tree;
}

function renderTree(tree, graphics, r, g, b) {
  if(!tree)
    return;

  let x = tree.x;
  let y = tree.y;
  let h = tree.h;
  let w = tree.w;
  let diff = tree.diff;
  let points = tree.points;

  graphics.push();
  {
    graphics.translate(x, y - h + diff);

    graphics.fill(r, g, b)

    for(let p of points) {
      
      graphics.beginShape(TRIANGLES);

      graphics.vertex(0, 0);
      graphics.vertex(p.x, p.y);
      graphics.vertex(0, p.y);

      graphics.vertex(0, 0);
      graphics.vertex(-p.x, p.y);
      graphics.vertex(0, p.y);
      graphics.endShape(CLOSE);
    }

    
  }
  graphics.pop();
}

function draw() {
  background(255, 170, 102);

  flock.run();

  drawSprites();
}
