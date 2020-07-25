export default class FpsCounter {
    constructor() {
        this.last = 0
        this.ms = 0
        this._fps = 0
        this.create()
    }

    update() {
        const now = performance.now()
        this.ms = now - this.last
        this.last = now
        this._fps = ((1000 / this.ms) + this.fps) / 2
    }

    draw() {
        this.element.innerText = (this.fps).toFixed(2) + `fps (${this.ms.toFixed(2)}ms)`
    }

    create() {
        this.element = document.createElement('p')
        document.body.appendChild(this.element)
        this.element.classList.add('fps-counter')
    }

    get fps() {
        return this._fps
    }
}
