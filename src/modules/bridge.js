import io from 'socket.io-client';
import EventEmitter from 'events'

export default class Bridge extends EventEmitter {
    constructor(options) {
        super();
        console.log('Initializing socket', options)
        this.socket = io(options.url + ':' + options.port)
        this.socket.on('command', c => {
            this.emit('command', c)
        })
    }

    send(data) {
        const buffer = Buffer.from(data)
        this.socket.emit('data', { data: buffer })
    }
}
