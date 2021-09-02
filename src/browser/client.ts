import { ClientConfig } from "../types";
import Stage from "./stage";

const defaults: ClientConfig = {
    socket: {
        url: 'ws://localhost',
        port: 3001
    },
    stage: {
        panels: [{
            address: 0b100,
            offset: {
                x: 0,
                y: 0,
            },
            bounds: {
                x: 0,
                y: 0,
                width: 28,
                height: 7
            }
        }]
    }
}

export default class Client extends Stage {
    private socket: WebSocket;
    public config: ClientConfig;

    constructor(config: ClientConfig) {
        super(config.stage)
        this.config = { ...defaults, ...config };
        this.socket = new WebSocket(`${this.config.socket.url}:${this.config.socket.port}`)
    }

    /**
     * Sends the current buffer to the flip-dot middleware
     */
    send(): void {
        this.socket.send(JSON.stringify(this.buffer))
    }

}