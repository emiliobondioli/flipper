import Client from "./client"
import './simulator.scss'

export default class Simulator {
    public container: HTMLElement
    private client: Client;
    private dots: Array<{
        el: HTMLElement,
        x: number,
        y: number
    }>

    constructor(client: Client, el: HTMLElement) {
        this.client = client
        this.dots = []
        this.container = document.createElement('div')
        this.container.classList.add('flip-dot-simulator')
        el.appendChild(this.container)
        this.setup()
    }

    setup(): void {
        this.el.appendChild(this.container)
        const dotWidth = (this.container.clientWidth) / (this.client.width + this.client.maxOffset.x + 1)

        this.client.matrix.forEach(c => {
            c.forEach(d => {
                const el = document.createElement('div')
                el.classList.add('dot')
                el.style.width = dotWidth + 'px'
                el.style.height = dotWidth + 'px'
                el.style.top = (dotWidth * (d.y + d.panel.offset.y)) + 'px'
                el.style.left = (dotWidth * (d.x + d.panel.offset.x)) + 'px'
                const dot = {
                    el,
                    x: d.x,
                    y: d.y
                }
                this.dots.push(dot)
                this.container.appendChild(el)
            })
        });

    }

    update() {
        this.dots.forEach(d => {
            d.el.classList.toggle('active', this.client.get(d.x, d.y))
        })
    }
}
