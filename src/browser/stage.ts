import { Dot, StageConfig } from "../types"
import { bitclear, bitset } from "../utils"
import Panel from "./panel"

const PANEL_TERMINATOR = new Uint8Array([0x8F])
const PANEL_W = 28
const PANEL_H = 7
const PANEL_BUFFER_SIZE = 32

export default class Stage {
    public width: number
    public height: number;
    public buffer: Uint8Array;
    public maxOffset: {
        x: number,
        y: number
    }
    public matrix: Array<Array<Dot>>;
    private panels: Array<Panel>;

    constructor(config: StageConfig) {
        this.width = Math.max(...config.panels.map(p => p.bounds.x + p.bounds.width))
        this.height = Math.max(...config.panels.map(p => p.bounds.y + p.bounds.height))
        this.maxOffset = {
            x: Math.max(...config.panels.map(p => p.offset.x)),
            y: Math.max(...config.panels.map(p => p.offset.y)),
        }
        this.panels = config.panels.map(p => {
            return new Panel(p)
        }).sort((a, b) => {
            return (a.x * 1000 + a.y) - (b.x * 1000 + b.y)
        })
        this.matrix = []
        const bufferLength = PANEL_BUFFER_SIZE * this.panels.length
        this.buffer = new Uint8Array(bufferLength)
        this.init()
    }

    /**
     * Creates the dot matrix and buffer
     */
    init() {
        let id = 0
        this.panels.forEach((panel, i) => {
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
                        col: c,
                        y,
                        row: r,
                        value: false,
                        id,
                        bufferId: dot_start + c,
                        panel
                    }
                    id++
                }
            }
            this.buffer.set(PANEL_TERMINATOR, end)
        })
    }

    /**
     * Set the status of a single dot
     * @param {number} x - The x coordinate
     * @param {number} y - The y coordinate
     * @param {number,boolean, string} value - 0: off, 1: on, 'toggle': toggle on/off
     */
    set(x: number | Dot, y: number, value: number | boolean | string): boolean;

    /**
     * Set the status of a single dot
     * @param {Dot} dot - The x coordinate
     * @param {number,boolean, string} value - 0: off, 1: on, 'toggle': toggle on/off
     */
    set(dot: Dot, value: number | boolean | string): boolean;

    set(x: number | Dot, y: number | boolean | string, value: number | boolean | string = 1): boolean {
        if (typeof x === "number") return this.setCoordinates(x, Number(y), !!value)
        else return this.setDot(x, !!y)
    }

    /**
     * Set the status of a single dot
     * @param {number} x - The x coordinate
     * @param {number} y - The y coordinate
     * @param {number,string} value - 0: off, 1: on, 'toggle': toggle on/off
     */
    setCoordinates(x: number, y: number, value: number | boolean | string = 1): boolean {
        let d: Dot = this.matrix[x][y]
        return this.setDot(d, value)
    }

    /**
     * Set the status of a single dot
     * @param {Dot} dot - The x coordinate
     * @param {number} y - The y coordinate
     * @param {number,string} value - 0: off, 1: on, 'toggle': toggle on/off
     */
    setDot(dot: Dot, value: number | boolean | string = 1): boolean {
        if (value === 'toggle') dot.value = !dot.value
        else dot.value = !!value
        if (dot.value) this.buffer[dot.bufferId] = bitset(this.buffer[dot.bufferId], dot.row)
        else this.buffer[dot.bufferId] = bitclear(this.buffer[dot.bufferId], dot.row)
        return dot.value
    }

    /**
     * Get the status of a single dot
     * @param {number} x - The x coordinate
     * @param {number} y - The y coordinate
     * @return {number} Dot object
     */
    get(x: number, y: number): boolean {
        return this.matrix[x][y].value
    }

    /**
     * Gets the buffer id based on coords
     * @param {number} x
     * @param {number} y
     */
    id(x: number, y: number) {
        return this.matrix[x][y].bufferId
    }

    /**
     * Sets the status for all the dots
     * @param {number} value - Dot status, see set for options
     */
    fill(value: number = 1) {
        this.matrix.forEach(col => {
            col.forEach(dot => {
                this.set(dot, value)
            })
        })
    }
}