import View from '~/modules/view'
import './style.scss'
import { create, resize } from '~/utils'

export default class DotsView extends View {
    constructor(stage, options) {
        super(stage)
        this.container = create('div', { id: 'simulator-container' })
        document.body.appendChild(this.container)
        this.dotsContainer = create('div', { id: 'dots-container' }, this.container)
        this.createDots(this.dotsContainer)
    }

    createDots(container) {
        this.dots = []
        this.bounds = getComputedStyle(container)
        this.dotW = (container.clientWidth) / (this.stage.width + this.stage.maxOffset.x + 1)
        container.style.height = this.dotW * this.stage.height + 'px'
        container.addEventListener('mousedown', () => this.emit('mousedown'))
        container.addEventListener('mouseup', () => this.emit('mouseup'))
        this.stage.matrix.forEach(c => {
            c.forEach(d => {
                const el = document.createElement('div')
                el.classList.add('dot')
                el.style.width = this.dotW + 'px'
                el.style.height = this.dotW + 'px'
                el.style.top = (this.dotW * (d.y + d.panel.offset.y)) + 'px'
                el.style.left = (this.dotW * (d.x + d.panel.offset.x)) + 'px'
                const dot = {
                    el,
                    x: d.x,
                    y: d.y
                }
                this.dots.push(dot)
                el.addEventListener('mouseover', () => this.emit('mouseover', dot))
                container.appendChild(el)
            })
        });
    }

    update() {
        this.dots.forEach(d => {
            d.el.classList.toggle('active', this.stage.get(d.x, d.y))
        })
    }

    destroy() {

    }
}
