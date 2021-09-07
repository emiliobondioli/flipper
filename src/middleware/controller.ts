/** @module flipper/controller */

import express from 'express'
import expressWs from 'express-ws';
import ws from 'ws'
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
    private app: expressWs.Application;
    private serial?: SerialPort
    private buffer?: Buffer
    public config: ControllerConfig;

    /**
     * 
     * @param {ControllerConfig} config 
     */
    constructor(config: ControllerConfig) {
        this.config = { ...defaults, ...config };
        this.app = expressWs(express()).app;
        this.app.listen(this.config.socket.port, () => console.log(`flipper controller v${pkg.version} listening on ${this.config.socket.url}:${this.config.socket.port}/`));
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
        this.app.ws('/', (socket: ws) => {
            console.log('websocket connection');
            socket.on('message', (data: string) => {
                // if (this.config.debug) console.log('buffer received')
                const d: object = JSON.parse(data)
                if (d) {
                    this.buffer = Buffer.from(Object.values(d))
                }
            })
        });
        this.write()
    }

    /**
     * Writes the current buffer to serial
     * @returns boolean
     */
    public write(): void {
        if (this.buffer && this.serial) {
            this.serial.write(this.buffer, (err) => {
                if (err) {
                    console.error('error on write: ', err.message)
                }
                this.write()
            })
        } else {
            const t = 200
            setTimeout(this.write.bind(this), t)
        }
    }

}