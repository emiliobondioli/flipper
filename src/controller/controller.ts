/** @module flipper/controller */

import SerialPort from 'serialport'
import { ControllerConfig } from '../types'
const version = '__MODULE_VERSION__';

const defaults: ControllerConfig = {
    serial: {
        port: '',
        baudRate: 57600
    },
    mock: false,
    debug: false
}

export class Controller {
    private serial?: SerialPort
    private buffer?: Buffer
    public config: ControllerConfig;

    /**
     * 
     * @param {ControllerConfig} config 
     */
    constructor(config: ControllerConfig) {
        this.config = { ...defaults, ...config };
        console.log(`flipper controller v${version} initialized (${this.config.serial.port})`);
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
        this.write()
    }

    /**
     * Sets the current buffer
     */
    public set(values: any[]): void {
        this.buffer = Buffer.from(values)
    }

    /**
     * Writes the current buffer to serial
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