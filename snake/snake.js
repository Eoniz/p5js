
/**
 * Inputs => {
 *  distRightToFood (-1 if nothing)
 *  distBottomToFood (-1 if nothing)
 *  distLeftToFood (-1 if nothing)
 *  distTopToFood (-1 if nothing)
 *  globalDistToFood ()
 * 
 * }
 * Hidden => (16*16)+2
 * Outputs => 4
 */

class Snake {
    constructor(x, y) {
        this.startPosX = x;
        this.startPosY = y;

        this.init();

        this.hStart = random(0, 155);
        this.s = 145;
        this.b = 255;

        this.isBest = false;

        this.brain = new NeuralNetwork(6, 6, 2);
    }

    reset() {
        this.init();
    }

    init() {
        this.parts = [];
        this.parts.push(createVector(this.startPosX, this.startPosY));
        for(let i = 1; i < 3; i++) {
            this.parts.push(createVector(this.startPosX - i, this.startPosY));
        }

        this.direction = 0; // 0 => right ; 1 => bottom; 2 => left; 3 => up
        this.nextDir = 0;

        this.score = 0;
        this.fitness = 0;

        this.dead = false;
    }

    think(gold_x, gold_y) {
        if(this.dead)
            return;

        let grid = [NB_CELL_WIDTH];
        for(let i = 0; i < NB_CELL_WIDTH; i++) {
            grid[i] = [NB_CELL_HEIGHT];
            for(let j = 0; j < NB_CELL_HEIGHT; j++) {
                grid[i][j] = 0;
            }
        }

        

        for(let i = 1; i < this.parts.length; i++) {
            let part = this.parts[i];

            grid[part.x][part.y] = 1;
        }

        let head = this.parts[0];
        let distRightWall = NB_CELL_WIDTH - 1 - this.parts[0].x;
        if(head.x <= NB_CELL_WIDTH - 2) {
            if(grid[head.x + 1][head.y] == 1)
                distRightWall = 0;
        }

        let distLeftWall = this.parts[0].x;
        if(head.x > 0) {
            if(grid[head.x - 1][head.y] == 1)
                distLeftWall = 0;
        }

        let distBottomWall = NB_CELL_HEIGHT - 1 - this.parts[0].y;
        if(head.y <= NB_CELL_HEIGHT - 2) {
            if(grid[head.x][head.y + 1] == 1)
                distBottomWall = 0;
        }

        let distTopWall = this.parts[0].y;
        if(head.y > 0) {
            if(grid[head.x][head.y - 1] == 1)
                distTopWall = 0;
        }

        // create vector to determinate the side
        let vX = ((this.direction == 0) ? 1 : ((this.direction == 2) ? -1 : 0));
        let vY = ((this.direction == 1) ? -1 : ((this.direction == 3) ? 1 : 0));
        
        let U = createVector(vX , vY);
        let SM = createVector(gold_x - this.parts[0].x, this.parts[0].y - gold_y);

        let cross = p5.Vector.cross(U, SM); // cross < 0 => right | cross > 0 => left
        
        let frontDirDist = 0;
        let rightDirDist = 0;
        let leftDirDist = 0;

        if(this.direction == 0) {
            frontDirDist = distRightWall;
            leftDirDist = distTopWall;
            rightDirDist = distBottomWall;
        } else if(this.direction == 1) {
            frontDirDist = distBottomWall;
            leftDirDist = distRightWall;
            rightDirDist = distLeftWall;
        } else if(this.direction == 2) {
            frontDirDist = distLeftWall;
            leftDirDist = distBottomWall;
            rightDirDist = distTopWall;
        } else if(this.direction == 3) {
            frontDirDist = distTopWall;
            leftDirDist = distLeftWall;
            rightDirDist = distRightWall;
        }

        let globalDist = Math.floor(dist(head.x, head.y, gold_x, gold_y) / NB_CELL_WIDTH);
        let willDie = frontDirDist == 0;

        let inputs = [];
        inputs.push((cross.z == 0) ? 1 : 0); // is in front
        inputs.push((cross.z > 0) ? 1 : 0); // is in left
        inputs.push((cross.z < 0) ? 1 : 0); // is in right

        inputs.push((frontDirDist > 0) ? 1 : 0); // is front cleared
        inputs.push((leftDirDist > 0) ? 1 : 0); // is left cleared
        inputs.push((rightDirDist > 0) ? 1 : 0); // is right cleared


        let outputs = this.brain.predict(inputs);
        if(outputs[0] > 0.5) {
            this.left();
        }
        if(outputs[1] > 0.5) {
            this.right();
        }
    }

    left() {
        if(this.direction == 0)
            this.nextDir = 3;
        
        if(this.direction == 1)
            this.nextDir = 0;
        
        if(this.direction == 2)
            this.nextDir = 1;
        
        if(this.direction == 3)
           this.nextDir = 2;
    }

    right() {
        if(this.direction == 0)
            this.nextDir = 1;
        
        if(this.direction == 1)
            this.nextDir = 2;
        
        if(this.direction == 2)
            this.nextDir = 3;
        
        if(this.direction == 3)
           this.nextDir = 0;
    }

    render() {
        colorMode(HSB, 255);
        for(let i = 0; i < this.parts.length; i++) {
            let part = this.parts[i];
            push();
            {
                

                translate(part.x * CELL_WIDTH, part.y * CELL_HEIGHT);
                if(this.isDead())
                    fill(255, 0, 0, 30);
                else
                    fill(this.hStart + 7*i, this.s, this.b, (this.isBest) ? 255 : 10);
                
                noStroke();
                rect(0, 0, CELL_WIDTH, CELL_HEIGHT);
                
            }
            pop();
        }
        colorMode(RGB, 255);
    }

    update(gold_x, gold_y) {
        //let d = dist(this.parts[0].x, this.parts[0].y, gold_x, gold_y);
        //let dmapped = map(d, 0, NB_CELL_WIDTH, 10, 0);
        let startDist = dist(this.parts[0].x, this.parts[0].y, gold_x, gold_y);

        for(let i = this.parts.length - 1; i >= 1; i--) {
            let part = this.parts[i];
            let nextPart = this.parts[i - 1];

            part.x = nextPart.x;
            part.y = nextPart.y;
        }

        this.updateDirection();

        if(this.direction == 0) {
            this.parts[0].x++;
        }
        if(this.direction == 1) {
            this.parts[0].y++;
        }
        if(this.direction == 2) {
            this.parts[0].x--;
        }
        if(this.direction == 3) {
            this.parts[0].y--;
        }

        /**
         * SCORE
         */

        let endDist = dist(this.parts[0].x, this.parts[0].y, gold_x, gold_y);
        if(endDist < startDist)
            this.score += 1;
        else
            this.score -= 2; //2;
        
        if(this.score < 1)
            this.score = 1;

        /**
         * DEAD
         */

        if(this.parts[0].x < 0) this.dead = true;
        if(this.parts[0].y < 0) this.dead = true;
        if(this.parts[0].x >= NB_CELL_WIDTH) this.dead = true;
        if(this.parts[0].y >= NB_CELL_HEIGHT) this.dead = true;

        for(let i = 1; i < this.parts.length; i++) {
            if(this.headIsOn(this.parts[i].x, this.parts[i].y))
                this.dead = true;
        }
    }

    angleDir(a, b) {
        return map(atan2(b.y - a.y, b.x - a.x), -PI, PI, 0, TWO_PI);
    }

    mutate(percent, mutationChance) {
        let func = function funcMutate (x) {
            if (random(1) < mutationChance) {
                let offset = randomGaussian() * percent;
                let newx = x + offset;
                return newx;
            } else {
                return x;
            }
        }

        this.brain.mutate(func);
    }

    headIsOn(_x, _y) {
        return this.parts[0].x == _x && this.parts[0].y == _y;
    }

    grow() {
        let lastPart = this.parts[this.parts.length - 1];
        this.parts.push(createVector(lastPart.x, lastPart.y));
        this.score += 100;
    }

    isDead() {
        return this.dead;
    }

    updateDirection() {
        if(this.direction == 0 && this.nextDir == 2)
            return;
        if(this.direction == 2 && this.nextDir == 0)
            return;
        if(this.direction == 1 && this.nextDir == 3)
            return;
        if(this.direction == 3 && this.nextDir == 1)
            return;

        this.direction = this.nextDir;
    }

    changeDirection(value) {
        this.nextDir = value;
    }

    keyPressed(key) {
        if(key === 39) {
            this.nextDir = 0;
        }

        if(key === 40) {
            this.nextDir = 1;
        }

        if(key === 37) {
            this.nextDir = 2;
        }

        if(key === 38) {
            this.nextDir = 3;
        }
    }
}