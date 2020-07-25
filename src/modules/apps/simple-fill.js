import App from '~/modules/app'

export default class SimpleFill extends App {
    constructor(stage, options) {
        super(stage)
        this.x = 0
        this.y = 0
    }

    update() {
        this.stage.set(this.x, this.y, 'toggle')
        this.x++
        if (this.x >= this.stage.width) {
            this.x = 0
            this.y++
        }
        if (this.y >= this.stage.height) this.y = 0
    }
}
