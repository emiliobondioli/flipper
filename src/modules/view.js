import { EventEmitter } from 'events'

export default class View extends EventEmitter {
    constructor(stage) {
        super(stage)
        this.stage = stage
    }

    create() {

    }

    update() {

    }

    destroy() {

    }
}
