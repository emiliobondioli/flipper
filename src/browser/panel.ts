import { PanelOptions } from '../types'

export default class Panel {
    public config: PanelOptions;
    public address: number;

    constructor(config: PanelOptions) {
        this.config = config
        this.address = config.address
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