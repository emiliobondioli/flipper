import { Dot, StageConfig, PanelConfig } from "../types"
import { bitclear, bitset } from "../utils"
import Panel from "./panel"

const defaults: StageConfig = {
    panelConfig: {
        width: 28,
        height: 7,
        header: [0x80, 0x85],
        terminator: [0x8F]
    },
    panels: [
        {
            address: 0b01,
            bounds: {
                x: 0,
                y: 0,
                width: 28,
                height: 7,
            },
            offset: {
                x: 0,
                y: 0,
            },
        },
    ],
}

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
    private panelConfig: PanelConfig | undefined

    constructor(config: StageConfig) {
        config = { ...defaults, ...config || {} }
        this.panelConfig = config.panelConfig || defaults.panelConfig
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
        const bufferLength = this.bufferSize * this.panels.length
        this.buffer = new Uint8Array(bufferLength)
        this.init()
    }

    /**
     * Creates the dot matrix and buffer
     */
    init() {
        let id = 0
        const PANEL_W = this.panelConfig?.width || 28
        const PANEL_H = this.panelConfig?.height || 7
        const PANEL_TERMINATOR = new Uint8Array(this.panelConfig?.terminator || [0x8F])
        const PANEL_HEADER = this.panelConfig?.header || [0x80, 0x85]
        this.panels.forEach((panel, i) => {
            const header = new Uint8Array([...PANEL_HEADER, panel.address])
            const start = i * this.bufferSize
            this.buffer.set(header, start)
            const dot_start = start + header.length
            const end = start + this.bufferSize - 1
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
     * @param {number,boolean} value - 0: off, 1: on
     */
    set(x: number | Dot, y: number, value: number | boolean): boolean;

    /**
     * Set the status of a single dot
     * @param {Dot} dot - The x coordinate
     * @param {number,boolean} value - 0: off, 1: on
     */
    set(dot: Dot, value: number | boolean): boolean;

    set(x: number | Dot, y: number | boolean, value: number | boolean = 1): boolean {
        if (typeof x === "number") return this.setCoordinates(x, Number(y), !!value)
        else return this.setDot(x, !!y)
    }

    /**
     * Set the status of a single dot
     * @param {number} x - The x coordinate
     * @param {number} y - The y coordinate
     * @param {number,string} value - 0: off, 1: on
     */
    setCoordinates(x: number, y: number, value: number | boolean = 1): boolean {
        let d: Dot = this.matrix[x][y]
        return this.setDot(d, value)
    }

    /**
     * Set the status of a single dot
     * @param {Dot} dot - The x coordinate
     * @param {number,string} value - 0: off, 1: on
     */
    setDot(dot: Dot, value: number | boolean = 1): boolean {
        dot.value = !!value
        if (dot.value) this.buffer[dot.bufferId] = bitset(this.buffer[dot.bufferId], dot.row)
        else this.buffer[dot.bufferId] = bitclear(this.buffer[dot.bufferId], dot.row)
        return dot.value
    }

    /**
     * Toggle status of a single dot
     * @param {number} x - The x coordinate
     * @param {number} y - The y coordinate
     * @param {number,boolean} value - 0: off, 1: on
     */
    toggle(x: number | Dot, y: number, value: number | boolean): boolean;

    /**
     * Toggle the status of a single dot
     * @param {Dot} dot - The x coordinate
     */
    toggle(dot: Dot, value: number | boolean): boolean;

    toggle(x: number | Dot, y: number | boolean): boolean {
        if (typeof x === "number") return this.toggleCoordinates(x, Number(y))
        else return this.setDot(x, !!y)
    }

    /**
     * Toggle the status of a single dot
     * @param {number} x - The x coordinate
     * @param {number} y - The y coordinate
     */
    toggleCoordinates(x: number, y: number): boolean {
        let d: Dot = this.matrix[x][y]
        return this.toggleDot(d)
    }

    /**
     * Toggle the status of a single dot
     * @param {Dot} dot - The x coordinate
     */
    toggleDot(dot: Dot) {
        return this.setDot(dot, !dot.value)
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

    get bufferSize() {
        const config = this.panelConfig
        if (!config) return 32
        return (config.header.length + 1) + config.terminator.length + config.width
    }
}