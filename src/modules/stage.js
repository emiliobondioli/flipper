import chroma from 'chroma-js'

const pi2 = Math.PI * 2
const PANEL_TERMINATOR = new Uint8Array([0x8F])
const PANEL_BUFFER_SIZE = 32
const PANEL_W = 28
const PANEL_H = 7

export default class Stage {
    constructor(options) {
        this.width = options.width
        this.height = options.height
        this.panels = options.panels.map(p => {
            return {
                ...p,
                header: new Uint8Array([0x80, 0x85, p.address])
            }
        })
        this.maxOffset = {
            x: Math.max(...this.panels.map(p => p.offset.x)),
            y: Math.max(...this.panels.map(p => p.offset.y))
        }
        this.colors = chroma.scale(['#fafa6e', '#2A4858'])
            .mode('lch').colors(this.panels.length)
        this.matrix = []
        this.init()
    }

    /**
     * Send buffer data to the middleware
     * @param {array} data
     */
    send(data) {
        this.socket.emit('data', data)
    }

    /**
     * Set the status of a single dot
     * @param {number} x - The x coordinate
     * @param {number} y - The y coordinate
     * @param {number,string} value - 0: off, 1: on, 'toggle': toggle on/off
     */
    set(x, y, value = 1) {
        let d = null
        if (isNaN(x)) {
            d = x
            value = y
        } else {
            d = this.matrix[x][y]
        }
        if (value === 'toggle') d.value = !d.value
        else d.value = value
        if (d.value) this.buffer[d.buffer_id] = bit_set(this.buffer[d.buffer_id], d.r)
        else this.buffer[d.buffer_id] = bit_clear(this.buffer[d.buffer_id], d.r)
    }

    /**
     * Get the status of a single dot
     * @param {number} x - The x coordinate
     * @param {number} y - The y coordinate
     * @return {number} Dot object
     */
    get(x, y) {
        return this.matrix[x][y].value
    }

    /**
     * Gets the buffer id based on coords
     * @param {number} x
     * @param {number} y
     */
    id(x, y) {
        return this.matrix[x][y].buffer_id
    }

    /**
     * Sets the status for all the dots
     * @param {number} value - Dot status, see set for options
     */
    fill(value = 1) {
        this.matrix.forEach(col => {
            col.forEach(dot => {
                this.set(dot, value)
            })
        })
    }

    /**
     * Creates the dot matrix and buffer
     */
    init() {
        let id = 0
        const bufferLength = PANEL_BUFFER_SIZE * this.panels.length
        this.buffer = new Uint8Array(bufferLength)
        const panels = this.panels.slice().sort((a, b) => {
            return (a.x * 1000 + a.y) - (b.x * 1000 + b.y)
        })
        panels.forEach((panel, i) => {
            const start = i * PANEL_BUFFER_SIZE
            this.buffer.set(panel.header, start)
            const dot_start = start + panel.header.length
            const end = start + PANEL_BUFFER_SIZE - 1
            console.log(`Generating panel ${i} |`, `start: ${start} - dot_start:${dot_start} - end: ${end}`)
            for (let c = 0; c < PANEL_W; c++) {
                const x = panel.bounds.x + c
                this.matrix[x] = this.matrix[x] || []
                for (let r = 0; r < PANEL_H; r++) {
                    const y = panel.bounds.y + r
                    this.matrix[x][y] = {
                        x,
                        c,
                        y,
                        r,
                        value: 0,
                        id,
                        buffer_id: dot_start + c,
                        panel
                    }
                    id++
                }
            }
            this.buffer.set(PANEL_TERMINATOR, end)
        })
        console.log(this.matrix, this.buffer)
    }
}

function bit_test(num, bit) {
    return ((num >> bit) % 2 != 0)
}

function bit_set(num, bit) {
    return num | 1 << bit;
}

function bit_clear(num, bit) {
    return num & ~(1 << bit);
}

function bit_toggle(num, bit) {
    return bit_test(num, bit) ? bit_clear(num, bit) : bit_set(num, bit);
}
