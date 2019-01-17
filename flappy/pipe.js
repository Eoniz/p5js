
class Pipe {

    /**
     * *** <= 0
     * *** <= y
     * 
     * *** <= y + space
     * ***
     * ***
     * *** <= height
     */

    constructor(x, y) {
        this.SPACING = 150;
        this.WIDTH = 50;
        
        this.x = x;
        this.y = y;
        this.top = y;
        this.bottom = this.top + this.SPACING;
        this.hitBird = false;
        this.colorClosest = false;
    }

    render() {
        push();
        {
            translate(this.x, 0);

            if(this.hitBird)
                fill(255, 0, 0);
            else if(this.colorClosest)
                fill(167, 97, 213);
            else
                fill(255);

            rect(0, 0, this.WIDTH, this.top);
            rect(0, this.bottom, this.WIDTH, height);
        }
        pop();
    }

    update() {
        let speed = 2;

        this.x -= speed;
    }

    isOffscreen() {
        return this.x < -this.WIDTH;
    }

    contains(other) {
        return ( (other.x >= this.x && other.x <= this.x + this.WIDTH) &&
            ( (other.y <= this.y) || (other.y >= this.bottom) ));
    }
}