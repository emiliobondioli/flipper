# Flipper

Flip dot controller library - to be used with [AlfaZeta XY5](https://flipdots.com/en/products-services/flip-dot-boards-xy5/)

## Install

```
npm i @ebondioli/flipper
```

## Basic usage
The `Controller` module is required for serial communication with the flip dot panels. Since it requires the `serialport` module it must be run in NodeJS context.

### Standalone
Flipper can be run in a NodeJS script using the `Controller` and `Stage` modules as follows:

```js
const { Controller, Stage } = require('@ebondioli/flipper/controller')
// the controller will continuously write its buffer to the configured serial port
const controller = new Controller({
    serial: {
        port: '/dev/ttyUSB0',
        baudRate: 57600
    },
    mock: false,    // if true disables serial communication
    debug: false    // enable debug logging
})
const stage = new Stage({    
  panels: [
      // panel list, see below Panels section for options
  ],
  // configuration for different panel types and dimensions, defaults are for AlfaZeta XY5
  panelConfig: {
      width: 28,
      height: 7,
      header: [0x80, 0x85],
      terminator: [0x8F]
  }
})
// flips ON the dot at (0,0)
stage.set(0, 0, true);
// flips OFF the dot at (0,1)
stage.set(0, 1, false);
// sends the updated buffer to the controller
controller.set(stage.buffer)
```

### Websocket Client/Server
If you need to work in the browser, a simple Websocket client/server solution is provided:

#### NodeJS middleware
```js
const { Controller, Server } = require('@ebondioli/flipper/controller')
const controller = new Controller({ /* options */ })
// the server module will automatically update the controller buffer when receiving data
const server = new Server(controller, { 
  socket: {
      url: 'ws://localhost',
      port: 3001
  },
  mock: false,
  debug: false
})
```
#### Browser script
`Client` extends the `Stage` module and allows for easy websocket communication
```js
import { Client } from "@ebondioli/flipper/browser";
const client = new Client({
  socket: {
    url: "ws://localhost",
    port: 3001,
  },
  stage: { 
    // stage config, see above for options 
  },
  mock: false, // if true disables socket communication
});
// flips ON the dot at (0,0)
client.set(0, 0, true);       
// sends the current buffer to the socket server, usually called on an interval or requestAnimationFrame
client.send();                        
```
## Panels
A panels config object is required to correctly convert the stage's dots to bytes
```js
const panels = [
  {
    // panel address in binary
    // note: for some reason address 2 (0b10) does not work with the tested AlphaZeta panels (2015 version)
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
]
```

## Stage
The `Stage` module translates x/y coordinates to the related flip dot bytes. `set`, `get` and `fill` methods are used to interact with the dots.

```js
client.set(0, 0, true | false);       // flips or unflips a single dot at (0,0)
client.toggle(0, 0);                  // toggles a single dot at (0,0)
client.fill(true | false | "toggle"); // flips, unflips or toggles all dots
```

## Simulator

A simple simulator is provided as a separate module for ease of development. It connects to the `client` module and replicates the panels configuration and positioning.

Example usage in a browser/frontend app:

```js
import { Client, Simulator } from "@ebondioli/flipper/browser";
import "@ebondioli/flipper/style";

const client = new Client(config);
// istantiate the simulator passing the client instance to connect to and a dom element where to mount it
const simulator = new Simulator(client, document.querySelector("#app"));

// call after the client has been updated to update the simulator view, e.g. in an interval or requestAnimationFrame
simulator.update();
```

The default css for the simulator can be included using:

```js
import "@ebondioli/flipper/simulator/style";
```
