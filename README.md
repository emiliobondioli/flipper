# Flipper

Flip dot controller library - to be used with [AlfaZeta XY5](https://flipdots.com/en/products-services/flip-dot-boards-xy5/)

## Wiring

| Color | Signal     |
| ----- | ---------- |
| Red   | +24V       |
| Black | -24V / GND |
| Green | -RS485     |
| Blue  | +RS485     |

## Middleware

The controller module is required for serial communication with the flip dot panels. Since it requires `serialport` it must be run in NodeJS context. It communicates with the client through a websocket.

```js
const FlipperController = require('flipper/controller')
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

The client module translates x/y coordinates to the related flip dot bytes. `set`, `get` and `fill` methods are used to interact with the dots:

```js
import FlipperClient from 'flipper/client'
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

The client expects an array of objects describing each panel's configuration.

```js
const panels = [
  {
    // Panel address in binary, note: 2 (0b10) is ignored
    address: 0b01,
    // Panel dimensions
    bounds: {
        x: 0,
        y: 0,
        width: 28,
        height: 7
    }
    // Dot buffer
    offset: {
        x: 0,
        y: 0
    }
  },
  ...
]
```
