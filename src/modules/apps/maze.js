import App from "~/modules/app";
import DotsView from "~/modules/views/dots-view";

export default class Lowres extends App {
    constructor(stage, rate) {
        super(stage, rate);
        this.frontColor = "#FFFFFF";
        this.backColor = "#000000";
        this.ctx.fillStyle = this.frontColor;
        this.ctx.strokeStyle = this.frontColor;
        this.view = new DotsView(stage);

        this.numMaze = 1;
        this.mazes = [];
        for (let i = 0; i < this.numMaze; i++) {
            this.mazes.push(new Cell(stage, this.ctx));
        }
    }
    draw() {
        this.ctx.beginPath();
        this.mazes.forEach((c, i) => {
            this.mazes[i].edges();
            this.mazes[i].move();
            this.mazes[i].display();
        });
        this.ctx.fill();
        this.drawStage();
    }
}

class Cell {
    constructor(stage, context) {
        this.stage = stage;
        this.back = false;
        this.ctx = context;
        this.pos = {
            x: Math.random() * this.stage.width,
            y: Math.random() * this.stage.height
        };
        this.size = 1;
    }

    clearB() {
        this.back = true;
    }

    edges() {
        if (
            this.pos.x >= this.stage.width ||
            this.pos.x <= 0 ||
            this.pos.y <= 0 ||
            this.pos.y >= this.stage.width
        ) {
            this.pos.x = this.stage.width / 2;
            this.pos.y = this.stage.height / 2;
            this.clearB();
        }
    }

    move() {
        let r = Math.random();
        if (r <= 0.5) {
            if (r <= 0.25) this.pos.x += this.size;
            else this.pos.x -= this.size;
        } else {
            if (r <= 0.75) this.pos.y += this.size;
            else this.pos.y -= this.size;
        }
    }

    backgroundClear() {
        this.ctx.clearRect(0, 0, this.stage.width, this.stage.height);
        this.back = false;
    }

    display() {
        if (this.back) this.backgroundClear();
        this.ctx.rect(
            this.stage.width - this.pos.x - this.size,
            this.pos.y,
            this.size,
            this.size
        );
        this.ctx.rect(this.pos.x, this.pos.y, this.size, this.size);
    }
}
