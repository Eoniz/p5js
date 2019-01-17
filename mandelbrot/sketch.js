
function setup() {
  createCanvas(900, 900);

  sliderValX = createSlider(-2, 2.5, 1.5, 0.5);
  sliderValX.position(windowWidth / 2 - width / 2, 10);
  sliderValY = createSlider(-2, 2.5, 1.5, 0.5);
  sliderValY.position(windowWidth / 2 - width / 2, 50);

  sliderXX = createSlider(-2.5, 2.5, 0, 0.01);
  sliderXX.position(windowWidth / 2 - width / 2, 100);
  sliderYY = createSlider(-2.5, 2.5, 0, 0.01);
  sliderYY.position(windowWidth / 2 - width / 2, 140);

  sliderIteration = createSlider(1, 100, 100, 1);
  sliderIteration.position(windowWidth / 2 - width / 2, 200);

}

let _xx = 0;
let _yy = 0;

let valX = 1.5;
let valY = 1.5;

let sliderValX;
let sliderValY;

let sliderXX;
let sliderYY;

let sliderIteration;


function draw() {
  background(0);

  valX = sliderValX.value();
  valY = sliderValY.value();
  
  _xx = sliderXX.value();
  _yy = sliderYY.value();
  
  loadPixels();
  
  for(let x = 0; x < width; x++) {
    for(let y = 0; y < height; y++) {
      
      let x0 = map(x, 0, width, valX, -valY);
      let y0 = map(y, 0, height, -valX, valY);
      let xx = x0 + _xx;
      let yy = y0 + _yy;
      let iteration = 0;
      let max_iteration = sliderIteration.value();

      while(iteration < max_iteration) {
        let a = x0 * x0 - y0 * y0;
        let b = 2 * x0 * y0;
        x0 = a + xx;
        y0 = b + yy;

        if(x0 + y0 > 16)
          break;

        iteration++;
      }

      let r, g, b;
      if(iteration == max_iteration) {
        r = g = b = 0;
      } else if (iteration > max_iteration * 0.85) {
        b = iteration * 184 / max_iteration;
        r = iteration * 39 / max_iteration;
        b = iteration * 98 / max_iteration;
      } else if (iteration > max_iteration * 0.75) {
        b = iteration * 57 / max_iteration;
        r = iteration * 244 / max_iteration;
        b = iteration * 230 / max_iteration;
      }  else if (iteration > max_iteration * 0.5) {
        b = iteration * 155 / max_iteration;
        r = iteration * 210 / max_iteration;
        b = iteration * 78 / max_iteration;
      } else if (iteration > max_iteration * 0.25) {
        b = iteration * 255 / max_iteration;
        r = iteration * 255 / max_iteration;
        b = iteration * 255 / max_iteration;
      } else {
        b = iteration * 255 / max_iteration;
        r = iteration * 157 / max_iteration;
        b = iteration * 67 / max_iteration;
      }
      
      
      let idx = (x + y * width) * 4;

      pixels[idx] = r;
      pixels[idx + 1] = g;
      pixels[idx + 2] = b;
      pixels[idx + 3] = 255;
    }
  }
  translate(100, 100);
  updatePixels();
}