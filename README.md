# Flipper

Flip dot controller library - to be used with [AlfaZeta XY5](https://flipdots.com/en/products-services/flip-dot-boards-xy5/)

## Wiring

| Color | Signal     |
| ----- | ---------- |
| Red   | +24V       |
| Black | -24V / GND |
| Green | -RS485     |
| Blue  | +RS485     |

## Install
```
npm i @ebondioli/flipper
```

## Middleware

The `controller` module is required for serial communication with the flip dot panels. Since it requires `serialport` it must be run in NodeJS context. It communicates with the client through a websocket.

Example usage in a middleware script:

```js
const FlipperController = require('@ebondioli/flipper/controller')
const controller = new FlipperController({
    socket: {
        url: 'ws://localhost'
        port: 3001
    }
    serial: {
        port: '/dev/ttyUSB0'
        baudRate: 57600
    }
    mock: false,    // if true disables serial communication
    rate: 60;       // serial messages per second
})
```

## Client

The `client` module translates x/y coordinates to the related flip dot bytes. `set`, `get` and `fill` methods are used to interact with the dots.

Example usage in a browser/frontend app:

```js
import FlipperClient from '@ebondioli/flipper/client'
const client = new FlipperClient({
    socket: {
        url: 'ws://localhost'
        port: 3001
    }
    stage: {
        panels: []
    }
})

client.set(0, 0, true | false | 'toggle') // Flips, unflips or toggles a single dot at (0,0)
client.fill(true | false | 'toggle') // Flips, unflips or toggles all dots
client.send() // Sends the current buffer to the middleware, usually called on an interval or requestAnimationFrame
```

### Configuration

The `client` expects an array of objects describing each panel's configuration.

```js
const panels = [
  {
    // Panel address in binary
    // note: for some reason address 2 (0b10) does not work with the current flip dot panels
    address: 0b01,
    // Panel dimensions
    bounds: {
        x: 0,
        y: 0,
        width: 28,
        height: 7
    },
    // used to align the simulator view with the actual panels positioning
    offset: {
        x: 0,
        y: 0
    }
  },
  ...
]
```

## Simulator
A simple simulator is provided as a separate module for ease of development. It connects to the `client` module and replicates the panels configuration and positioning. 

Example usage in a browser/frontend app:

```js
import FlipperClient from '@ebondioli/flipper/client'
import FlipperSimulator from '@ebondioli/flipper/simulator'

const client = new FlipperClient(config);
// Istantiate the simulator passing the client instance to connect to and a dom element where to mount it
const simulator = new FlipperSimulator(client, document.querySelector("#app"));

// Call after the client has been updated, e.g. in an interval or requestAnimationFrame
simulator.update()
```