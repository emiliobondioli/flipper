/** @module flipper/controller */

import WebSocket, { Server } from 'ws';
import { ServerConfig } from '../types'
import { Controller } from './controller';
const pkg = require('../../package.json')

const defaults: ServerConfig = {
    socket: {
        url: 'localhost',
        port: 3001
    },
    mock: false,
    debug: false,
}

export class SocketServer {
    private server: Server;
    private controller: Controller;
    public config: ServerConfig;

    /**
     * 
     * @param {ServerConfig} config 
     */
    constructor(controller: Controller, config: ServerConfig) {
        this.config = { ...defaults, ...config };
        console.log(`flipper server v${pkg.version} listening on ${this.config.socket.url}:${this.config.socket.port}/`);
        this.server = new Server({ port: this.config.socket.port || 3001 });
        this.controller = controller
        this.setup();
    }

    private setup(): void {
        this.server.on('connection', (socket: WebSocket) => {
            console.log('websocket connection');
            socket.on('message', (data: string) => {
                // if (this.config.debug) console.log('buffer received')
                const d: object = JSON.parse(data)
                if (d) {
                    this.controller.set(Object.values(d))
                }
            })
        })
    }
}