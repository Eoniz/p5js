
var bestBrain;

function generateNext() {
    console.log("generateNext()");
    let sum = 0;
    for(let bird of deadBirds) {
        sum += bird.score;

        if(MAX_SCORE < bird.score) {
            bestBrain = bird.brain;
            MAX_SCORE = bird.score;
        }
    }

    for(let bird of deadBirds) {
        bird.fitness = bird.score / sum;
    }



    for(let i = 0; i < MAX_BIRDS; i++) {
        birds[i] = getDeadBirdAndMutate();
    }

    deadBirds = [];
    GEN_COUNT++;
}

function getDeadBirdAndMutate() {
    
    let index = 0;
    let r = random();

    while(r > 0) {
        r -= deadBirds[index].fitness;
        index++;
    }
    index--;

    let bird = deadBirds[index];
    let child = new Bird((bird.score < MAX_SCORE / 2) ? bestBrain : bird.brain);
    
    if(bird.score > MAX_SCORE / 2)
        child.mutate(0.5, 0.1);
    else
        child.mutate(0.5, 0.3);

    return child;
}