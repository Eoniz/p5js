
var bestBrain;
var pool = [];

function generateNext() {
    
    let max = -Infinity;
    for(let grid of grids) {
        if(grid.snake.score > MAX_SCORE) {
            MAX_SCORE = grid.snake.score;
            MAX_APPLE_EATEN = grid.snake.parts.length - 3;
            bestBrain = grid.snake.brain;
        }

        if(max < grid.snake.score) {
            max = grid.snake.score;
        }
    }

    for(let grid of grids) {
        grid.snake.fitness = grid.snake.score / max;
    }

    pool = [];
    for(let i = 0; i < NB_POPULATION; i++) {
        let n = grids[i].snake.fitness * 1000;
        for(let j = 0; j < n; j++) {
            pool.push(grids[i].snake);
        }
    }

    for(let i = 0; i < NB_POPULATION; i++) {
        mutateSnake(grids[i].snake);
    }

    GEN_COUNT++;
    

    for(let grid of grids) {
        grid.reset();
    }
}

function mutateSnake(snake) {
    let child = random(pool);
    //snake.brain = (random() < 0.2) ? bestBrain.copy() : child.brain.copy();
    //snake.brain = bestBrain.copy();
    snake.brain = child.brain.copy();
    snake.mutate(0.2, 0.5);
}
