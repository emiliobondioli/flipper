
export default class App {
    constructor(stage, rate) {
        this.rate = rate || 1
        this.stage = stage
        this.canvas = new OffscreenCanvas(stage.width, stage.height)
        this.ctx = this.canvas.getContext('2d',{alpha: false})
        this._frames = 0
        document.addEventListener('keydown', this.key.bind(this))
    }

    create() {}

    update() {
        this._frames++
        if (this._frames >= this.rate) {
            this._frames = 0
            this.draw()
        }
        if (this.view) this.view.update()
    }

    draw() {}

    destroy() {
        document.removeEventListener('keydown', this.key)
        if (this.view) this.view.destroy()
    }

    drawStage(threshold = 0) {
        const pixels = this.ctx.getImageData(0, 0, this.stage.width, this.stage.height).data
        let x = 0, y = 0;
        for (let i = 0; i < pixels.length; i += 4) {
            this.stage.set(x, y, pixels[i+3] > threshold)
            x++
            if (x >= this.stage.width) {
                y++
                x = 0
            }
        }
    }

    key(e) {

    }

    command(c) {

    }

}
