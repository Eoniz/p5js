
class Grid {
    constructor() {
        this.snake = new Snake(3, 1);
        this.gold = createVector();
        
        this.frameCount = 5;
        this.counter = 0;

        this.isBest = false;

        this.deadTimer = 1000;

        this.resetGold();
    }

    resetGold() {
        this.deadTimer = 1000;

        let possiblePos = [];
        for(let i = 0; i < NB_CELL_WIDTH; i++) {
            possiblePos[i] = [];
            for(let j = 0; j < NB_CELL_HEIGHT; j++) {
                possiblePos[i][j] = true;
            }
        }

        for(let part of this.snake.parts) {
            possiblePos[part.x][part.y] = false;
        }

        let _x = 0, _y = 0;
        do {
            _x = floor(random(2, NB_CELL_WIDTH - 2));
            _y = floor(random(2, NB_CELL_HEIGHT - 2));
        } while(possiblePos[_x][_y] == false);

        this.gold = createVector(_x, _y);
    }

    reset() {
        this.counter = 0;

        this.snake.reset();
        this.resetGold();
    }

    render(drawGrid) {
        push();
        {
            translate(GRID_X, GRID_Y);

            if(drawGrid) {
                for(let i = 0; i < NB_CELL_WIDTH; i++) {
                    for(let j = 0; j < NB_CELL_HEIGHT; j++) {
                        push();
                        {
                            translate(i * CELL_WIDTH, j * CELL_HEIGHT);
                            
                            fill(0);
                            stroke(50);
                            strokeWeight(1);
                            rect(0, 0, CELL_WIDTH, CELL_HEIGHT);
                        }
                        pop();
                    }
                }
            }

            if(this.snake.isDead() == false) {
                colorMode(HSB, 255);
                noStroke();
                fill(this.snake.hStart, this.snake.s, this.snake.b, (this.isBest) ? 255 : 10);
                rect(this.gold.x * CELL_WIDTH, this.gold.y * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
                colorMode(RGB, 255);

                this.snake.render();
            }
        }
        pop();
    }

    update() {
        if(++this.counter % this.frameCount != 0)
            return;

        this.snake.isBest = this.isBest;

        if(this.snake.isDead() == false) {
            
            this.snake.think(this.gold.x, this.gold.y);
            this.snake.update(this.gold.x, this.gold.y);

            if(this.snake.headIsOn(this.gold.x, this.gold.y)) {
                this.resetGold();
                this.snake.grow();
            }

            if(--this.deadTimer == 0) {
                this.snake.dead = true;
            }
        }
    }

    keyPressed(key) {
        this.snake.keyPressed(key);
    }
}