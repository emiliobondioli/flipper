# Flipper

Flip dot controller library - to be used with [AlfaZeta XY5](https://flipdots.com/en/products-services/flip-dot-boards-xy5/)

## Wiring

| Color | Signal |
| ----- | ------ |
| Red   | +24V   |
| Black | GND    |
| Green | -RS485 |
| Blue  | +RS485 |

## Install

```
npm i @ebondioli/flipper
```

## Controller

The `controller` module is required for serial communication with the flip dot panels. Since it requires `serialport` it must be run in NodeJS context. It communicates with the client through a websocket.

Example usage in a middleware script:

```js
const FlipperController = require('@ebondioli/flipper/controller')
const controller = new FlipperController({
    socket: {
        url: 'ws://localhost',
        port: 3001
    },
    serial: {
        port: '/dev/ttyUSB0',
        baudRate: 57600
    },
    mock: false,    // if true disables serial communication
    rate: 60       // serial messages per second
})
```

## Client

The `client` module translates x/y coordinates to the related flip dot bytes. `set`, `get` and `fill` methods are used to interact with the dots.

Example usage in a browser/frontend app:

```js
import FlipperClient from "@ebondioli/flipper/client";
const client = new FlipperClient({
  socket: {
    url: "ws://localhost",
    port: 3001,
  },
  stage: {
    panels: [
      /** panel list, see below for options */
    ],
  },
  mock: false, // if true disables socket communication
});

client.set(0, 0, true | false);       // flips or unflips a single dot at (0,0)
client.toggle(0, 0);                  // toggles a single dot at (0,0)
client.fill(true | false | "toggle"); // flips, unflips or toggles all dots
client.send();                        // sends the current buffer to the middleware, usually called on an interval or requestAnimationFrame
```

### Configuration

Example `client` config object:

```js
const config = {
  socket: {
    url: "ws://localhost",
    port: 3001,
  },
  stage: {
    // configuration for different panel types and dimensions, defaults are for AlfaZeta XY5
    panelConfig: {
        width: 28,
        height: 7,
        header: [0x80, 0x85],
        terminator: [0x8F]
    }
    panels: [
      {
        // panel address in binary
        // note: for some reason address 2 (0b10) does not work with the current flip dot panels
        address: 0b01,
        // panel dimensions
        bounds: {
          x: 0,
          y: 0,
          width: 28,
          height: 7,
        },
        // used to align the simulator view with the actual panels positioning
        offset: {
          x: 0,
          y: 0,
        },
      },
    ],
  },
};
```

## Simulator

A simple simulator is provided as a separate module for ease of development. It connects to the `client` module and replicates the panels configuration and positioning.

Example usage in a browser/frontend app:

```js
import FlipperClient from "@ebondioli/flipper/client";
import FlipperSimulator from "@ebondioli/flipper/simulator";

const client = new FlipperClient(config);
// istantiate the simulator passing the client instance to connect to and a dom element where to mount it
const simulator = new FlipperSimulator(client, document.querySelector("#app"));

// call after the client has been updated to update the simulator view, e.g. in an interval or requestAnimationFrame
simulator.update();
```

The default css for the simulator can be included using:

```js
import "@ebondioli/flipper/simulator/style";
```
