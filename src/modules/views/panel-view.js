import View from '~/modules/view'

export default class PanelView extends View {
    constructor(stage, options) {
        super(stage)
        this.canvas = document.createElement('canvas')
        this.canvas.setAttribute('width', 500)
        this.canvas.setAttribute('height', 300)
        document.body.appendChild(this.canvas)
    }

    update() {
        const ctx = this.canvas.getContext('2d')
        ctx.save()
        ctx.scale(5, 5)
        ctx.clearRect(0, 0, this.stage.width, this.stage.height)
        this.stage.panels.forEach((panel, i) => {
            ctx.fillStyle = this.stage.colors[i]
            ctx.beginPath()
            ctx.rect(panel.bounds.x + panel.offset.x, panel.bounds.y + panel.offset.y, panel.bounds.width, panel.bounds.height)
            ctx.fill()
            for (let i = 0; i < panel.bounds.width; i++) {
                for (let j = 0; j < panel.bounds.height; j++) {
                    const x = i + panel.bounds.x
                    const y = j + panel.bounds.y
                    const d = this.stage.get(x, y) * 255
                    ctx.fillStyle = `rgba(${d},${d},${d},0.2)`
                    ctx.beginPath()
                    ctx.rect(x + panel.offset.x, y + panel.offset.y, 1, 1)
                    ctx.fill()
                }
            }
        })
        ctx.restore()
    }

    destroy() {
        document.body.removeChild(this.canvas)
    }
}
