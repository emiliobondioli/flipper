import App from "~/modules/app";
import PanelView from "~/modules/views/panel-view";

export default class Lowres extends App {
    constructor(stage, rate) {
        super(stage, rate);
        this.numCircles = 4;
        this.frontColor = "#FFFFFF";
        this.backColor = "#000000";
        this.ctx.fillStyle = this.frontColor;
        this.ctx.strokeStyle = this.frontColor;
        this.view = new PanelView(stage);
        this.circles = [];
        for (let i = 0; i < this.numCircles; i++) {
            this.circles.push(new Circle(stage, this.ctx));
        }
        setInterval(() => {
            this.circles.forEach((c, i) => {
                c.newPos();
            });
        }, 1000);
    }
    draw() {
        this.ctx.clearRect(0, 0, this.stage.width, this.stage.height);
        this.ctx.beginPath();
        this.circles.forEach((c, i) => {
            this.circles[i].move();
            this.circles[i].display();
        });
        this.ctx.fill();
        this.drawStage();
    }
}

class Circle {
    constructor(stage, context) {
        this.stage = stage;
        this.ctx = context;
        this.pos = {
            x: Math.random() * this.stage.width,
            y: Math.random() * this.stage.height
        };
        this.des = { x: 0, y: 0 };
        this.easing = 0.02;
        this.r = 1;
    }

    move() {
        this.dx = (this.des.x - this.pos.x) * this.easing;
        this.dy = (this.des.y - this.pos.y) * this.easing;
        this.pos.x += this.dx;
        this.pos.y += this.dy;
    }

    newPos() {
        this.des.x = Math.random() * this.stage.width;
        this.des.y = Math.random() * this.stage.height;
    }

    display() {
        this.ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI);
        this.ctx.arc(
            this.stage.width - this.pos.x,
            this.pos.y,
            this.r,
            0,
            2 * Math.PI
        );
        this.ctx.arc(
            this.stage.width - this.pos.x,
            this.stage.height - this.pos.y,
            this.r,
            0,
            2 * Math.PI
        );
        this.ctx.arc(
            this.pos.x,
            this.stage.height - this.pos.y,
            this.r,
            0,
            2 * Math.PI
        );
    }
}

