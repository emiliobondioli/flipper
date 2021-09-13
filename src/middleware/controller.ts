/** @module flipper/controller */

import WebSocket, { Server } from 'ws';
import SerialPort from 'serialport'
import { ControllerConfig } from '../types'
const pkg = require('../../package.json')

const defaults: ControllerConfig = {
    socket: {
        url: 'localhost',
        port: 3001
    },
    serial: {
        port: '',
        baudRate: 57600
    },
    mock: false,
    debug: false
}

export class Controller {
    private server: Server;
    private serial?: SerialPort
    private buffer?: Buffer
    public config: ControllerConfig;

    /**
     * 
     * @param {ControllerConfig} config 
     */
    constructor(config: ControllerConfig) {
        this.config = { ...defaults, ...config };
        console.log(`flipper controller v${pkg.version} listening on ${this.config.socket.url}:${this.config.socket.port}/`);
        this.server = new Server({ port: this.config.socket.port || 3001 });
        if (!this.config.mock) {
            this.serial = new SerialPort(this.config.serial.port, {
                baudRate: 57600,
                dataBits: 8,
                parity: 'none'
            })
        }
        this.setup();
    }

    private setup(): void {
        this.server.on('connection', (socket: WebSocket) => {
            console.log('websocket connection');
            socket.on('message', (data: string) => {
                // if (this.config.debug) console.log('buffer received')
                const d: object = JSON.parse(data)
                if (d) {
                    this.buffer = Buffer.from(Object.values(d))
                }
            })
        })
        this.write()
    }

    /**
     * Writes the current buffer to serial
     * @returns boolean
     */
    public write(): void {
        if (this.buffer && this.serial) {
            this.serial.write(this.buffer, (err) => {
                if (err) console.error(err.message)
            })
            this.serial.drain(err => {
                if (err) console.error(err)
                this.write()
            })
        } else {
            const t = 200
            setTimeout(this.write.bind(this), t)
        }
    }

}