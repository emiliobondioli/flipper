import { PanelConfig } from '../types'

export default class Panel {
    public config: PanelConfig;
    public header: Uint8Array;

    constructor(config: PanelConfig) {
        this.config = config
        this.header = new Uint8Array([0x80, 0x85, config.address])
    }

    get bounds() {
        return this.config.bounds
    }

    get offset() {
        return this.config.offset
    }

    get x() {
        return this.bounds.x
    }

    get y() {
        return this.bounds.x
    }

    get width() {
        return this.bounds.width
    }

    get height() {
        return this.bounds.width
    }
}