import App from '~/modules/app'

export default class Spiral extends App {
    constructor(stage, rate) {
        super(stage, rate)
        this.r = 0;
        this.frontColor = '#FFFFFF'
        this.backColor = '#000000'
        this.ctx.fillStyle = this.frontColor;
        this.ctx.strokeStyle = this.frontColor;
        this.ctx.lineCap = 'round';
        this.ctx.strokeStyle = '#ffeb40';
        this.ctx.lineWidth = 0.5;
        this.ctx.translate(this.stage.width / 2, this.stage.height / 2);
    }

    draw() {
        this.ctx.clearRect(-this.stage.width / 2, -this.stage.height / 2, this.stage.width, this.stage.height);
        this.ctx.rotate(.009);  //controls rotation speed
        this.turn()
        this.ctx.stroke();
        this.drawStage()
    }

    turn() {
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        // How far to move from center
        const move_num = 1; // try different numbers for unique appearances
        // How far to rotate around center
        const rotate_num = 0.2;  // between 0 and 1
        // convert to radians.
        const rads = rotate_num * 2 * Math.PI;
        // calculate positioning around center
        for (let i = 1; i <= 100; i++) {
            const distance = i * move_num;
            const turn = i * rads;
            // position point to draw from
            const x = Math.cos(turn) * distance;
            const y = Math.sin(turn) * distance;
            // draw line
            this.ctx.lineTo(x, y);
        }
    }

}
