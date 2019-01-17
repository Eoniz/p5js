
class Bird {
    constructor(brain) {
        this.x = 50;
        this.y = height / 2;

        // physics
        this.velocity = createVector();
        this.acceleration = createVector();
        this.GRAVITY = createVector(0, 0.2);

        this.r = random(100, 255);
        this.g = random(100, 255);
        this.b = random(100, 255);

        this.isDead = false;

        this.score = 0;
        this.fitness = 0;

        if(brain)
            this.brain = brain.copy();
        else
            this.brain = new NeuralNetwork(4, 4, 1);
    }

    render() {
        push();
        {
            noStroke();
            fill(this.r, this.g, this.b, 100);
            ellipse(this.x, this.y, 20, 20);
        }
        pop();
    }

    think(pipes) {
        let closest = pipes[0];
        closest.colorClosest = true;

        let inputs = [];
        inputs[0] = this.y / height;
        inputs[1] = closest.top / height;
        inputs[2] = closest.bottom / height;
        inputs[3] = closest.x / width;

        let output = this.brain.predict(inputs);
        if(output[0] > 0.5)
            this.up();
    }

    update() {
        this.score++;

        this.acceleration.add(this.GRAVITY);

        this.velocity.add(this.acceleration);
        this.velocity.limit(5);


        this.y += this.velocity.y;
        
        this.acceleration.mult(0);
        this.checkBounds();
    }

    mutate(percent, mutationChance) {
        let func = function mutateFunc(x) {
            if (random(1) < mutationChance) {
                let offset = randomGaussian() * percent;
                let newx = x + offset;
                return newx;
            } else {
                return x;
            }
        }

        this.x = 50;
        this.y = height / 2;
        this.velocity.mult(0);
        this.acceleration.mult(0);

        this.brain.mutate(func);
    }

    checkBounds() {
        if(this.y > height) {
            this.isDead = true;
        }
        if(this.y < 0) {
            this.y = 0;
            this.acceleration.y = 0;
        }
    }

    addForce(fx, fy, override) {
        if(override) {
            this.acceleration.x = fx;
            this.acceleration.y = fy;
            return;
        }

        this.acceleration.x += fx;
        this.acceleration.y += fy;
    }

    up() {
        this.addForce(0, -15, true);
    }
}

