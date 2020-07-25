import App from '~/modules/app'
import DotsView from '~/modules/views/dots-view'

export default class DotSimulator extends App {
    constructor(stage, rate) {
        super(stage)
        this.view = new DotsView(stage)
        this.createButtons()
        this.view.on('mouseover', dot => {
            this.toggle(dot)
        })
        this.view.on('mousedown', e => {
            this.drawing = true
        })
        this.view.on('mouseup', e => {
            this.drawing = false
        })
    }

    toggle(dot) {
        if (!this.drawing) return
        this.stage.set(dot.x, dot.y, 'toggle')
    }

    fill(value) {
        this.stage.fill(value)
    }

    createButtons() {
        this.buttons = {}
        this.buttons.clear = this.createButton('btn-clear', 'Clear', () => this.fill(0))
        this.buttons.fill = this.createButton('btn-fill', 'Fill', () => this.fill(1))
        this.buttons.toggle = this.createButton('btn-toggle', 'Toggle', () => this.fill('toggle'))
    }

    createButton(id, label, callback) {
        const button = document.createElement('button')
        button.id = id
        button.innerText = label
        button.classList.add('btn')
        this.view.container.appendChild(button)
        button.addEventListener('click', () => {
            callback()
        })
        return button
    }

}
