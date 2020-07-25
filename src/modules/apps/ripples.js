import App from '~/modules/app'
import PanelView from '~/modules/views/panel-view'

export default class Ripples extends App {
    constructor(stage, rate) {
        super(stage, rate)
        this.r = 0;
        this.max_r = 20
        this.frontColor = '#FFFFFF'
        this.backColor = '#000000'
        this.ctx.fillStyle = this.frontColor;
        this.ctx.strokeStyle = this.frontColor;
        this.circles = []
        for (let i = 0; i < 20; i++) {
            this.circles.push(i)
        }
        this.view = new PanelView(stage)
    }

    draw() {
        this.ctx.clearRect(0, 0, this.stage.width, this.stage.height)
        this.circles.forEach((c, i) => {
            this.circles[i] += 1 / i
            if (this.circles[i] > this.max_r) this.circles[i] = 0
            this.ctx.beginPath();
            this.ctx.arc(this.stage.width / 2, this.stage.height / 2, c, 0, 2 * Math.PI);
            this.ctx.stroke();
        });
        this.drawStage()
    }

}
