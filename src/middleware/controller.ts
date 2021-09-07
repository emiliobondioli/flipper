/** @module flipper/controller */

import express from 'express'
import expressWs from 'express-ws';
import ws from 'ws'
import SerialPort from 'serialport'
import { ControllerConfig } from '../types'

const defaults: ControllerConfig = {
    socket: {
        url: 'localhost',
        port: 3001
    },
    serial: {
        port: '',
        baudRate: 57600
    },
    rate: 60,
    mock: false
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
        this.app.listen(this.config.socket.port, () => console.log(`flipper controller listening on ${this.config.socket.url}:${this.config.socket.port}/`));
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
                this.buffer = Buffer.from(JSON.parse(data))
            })
        });
        this.write()
    }

    /**
     * Writes the current buffer to serial
     * @returns boolean
     */
    public write(): boolean {
        if (!this.buffer || !this.serial) return false
        const t = 1000 / this.config.rate
        setTimeout(this.write.bind(this), t)
        return this.serial.write(this.buffer, (err) => {
            if (err) {
                return console.log('Error on write: ', err.message)
            }
        })
    }

}