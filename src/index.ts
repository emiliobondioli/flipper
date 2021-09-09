import { Client } from './browser/client'
import { Simulator } from './browser/simulator'
import panels from '../panels.sample'
import { ClientConfig } from './types'

const config: ClientConfig = {
    socket: {
        url: 'ws://192.168.1.128',
        port: 3001
    },
    stage: {
        offsetRelativeDraw: true,
        panels
    },
    debug: true
}

const client = new Client(config)
const simulator = new Simulator(client, document.getElementById('app') || document.body)

const bounds = {
    x: 10, y: 0, width: 20, height: 20
}
function update() {
    for (let i = 0; i < bounds.width; i++) {
        for (let j = 0; j < bounds.height; j++) {
            client.set(bounds.x + i, bounds.y + j, true)
        }
    }
    simulator.update()
    client.send()
}

setTimeout(update, 100)