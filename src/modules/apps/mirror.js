import App from '~/modules/app'
import * as bodyPix from '@tensorflow-models/body-pix';
import { resize } from '~/utils'
import PanelView from '~/modules/views/panel-view'

export default class Mirror extends App {
    constructor(stage, rate) {
        super(stage, rate)
        this.inputW = 640
        this.inputH = 480
        this.frontColor = '#FFFFFF'
        this.backColor = '#000000'
        this.ctx.fillStyle = this.backColor;
        this.ctx.strokeStyle = this.backColor;
        this.setup()
        this.ctx.translate(this.stage.width, 0)
        this.ctx.scale(-1, 1)
        this.input = document.createElement('video')
        resize(this.input, this.inputW, this.inputH)
/*         document.body.appendChild(this.input)
        this.view = new PanelView(stage) */
        navigator.mediaDevices.getUserMedia({
            video: true
        }).then(stream => {
            this.input.onloadedmetadata = () => {
                this.input.play();
                this.results()
            };
            this.input.srcObject = stream
        })
    }

    setup() {
        bodyPix.load().then(net => {
            this.bodypix = net
        });
    }

    modelReady() {

    }

    draw() {
        this.drawStage()
    }

    results(results) {
        this.ctx.clearRect(0, 0, this.stage.width, this.stage.height)
        if (results) {
            const mask = bodyPix.toMaskImageData(results, true);
            createImageBitmap(mask).then(renderer => {
                this.ctx.fillStyle = '#ffffff'
                this.ctx.rect(0, 0, this.stage.width, this.stage.height)
                this.ctx.fill()
                this.ctx.drawImage(renderer, 0, 0, this.stage.width, this.stage.height)
            })
        }
        this.bodypix.estimatePersonSegmentation(this.input).then(r => this.results(r));
    }

}
