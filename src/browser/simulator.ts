import { Client } from "./client"
import EventEmitter from "events";
import './simulator.scss'

export class Simulator extends EventEmitter {
    public container: HTMLElement
    private client: Client;
    private dots: Array<{
        el: HTMLElement,
        x: number,
        y: number
    }>

    constructor(client: Client, el: HTMLElement) {
        super()
        this.client = client
        this.dots = []
        this.container = document.createElement('div')
        this.container.classList.add('flip-dot-simulator')
        el.appendChild(this.container)
        this.setup()
    }

    setup(): void {
        const dotWidth = (this.container.clientWidth) / (this.client.width + this.client.maxOffset.x + 1)
        this.client.matrix.forEach(c => {
            c.forEach(d => {
                const el = document.createElement('div')
                el.classList.add('dot')
                el.style.width = dotWidth + 'px'
                el.style.height = dotWidth + 'px'
                el.style.top = (dotWidth * (d.y + d.panel.offset.y)) + 'px'
                el.style.left = (dotWidth * (d.x + d.panel.offset.x)) + 'px'
                el.addEventListener('click', e => {
                    this.emit('click', { ...dot, event: e })
                })
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
