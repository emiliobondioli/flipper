import { Client } from './browser/client'
import { Simulator } from './browser/simulator'
import panels from '../panels.sample'
import { ClientConfig } from './types'

const config: ClientConfig = {
    stage: {
        panels
    }
}

const client = new Client(config)
const simulator = new Simulator(client, document.getElementById('app') || document.body)