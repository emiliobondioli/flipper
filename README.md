# Flipper
Flip dot controller in Node.js - to be used with [AlfaZeta XY5](https://flipdots.com/en/products-services/flip-dot-boards-xy5/)

## Wiring
| Color      | Signal |
| ----------- | ----------- |
| Red      | +24V       |
| Black   | -24V / GND        |
| Green      | -RS485       |
| Blue      | +RS485       |

## Setup
`npm install`

## Launch middleware
The middleware needs to be running to use the panel. It communicates with the flip-dot panels through a usb serial port using RS485 protocol.

You need to set the serial port in a `.env` file:
```env
PORT=COM22
```

To find out your port run with the device connected:
```shell
npx @serialport/list
```

To launch the middleware use:

`node serial.js`

## How it works
### Configuration
The middleware expects an array of objects describing each panel's configuration.

```js
const panels = [
  {
    // Panel address in binary, note: 2 (0b10) is ignored
    address: 0b01, 
    // Panel dimensions
    bounds: { 
      width: 28,
      height: 7
    }
    // Dot buffer
    buffer: [...]
  },
  ...
]
```
The **dot buffer** is a unidimensional array of values, depending on the type of data you're sending it can be:
- your grid, ordered by columns (ex. `[c1.0, c1.1, c1.2, c1.3, c1.4, c1.5, c1.6, c2.0, c2.1, ...]`)
- a pixel buffer with rgb values, taken directly from `context.getImageData`, the middleware will sort out the correct order of rows and columns based on the panel dimensions you set in the config object.

### Communication
The app communicates with the middleware using [socket.io](https://github.com/socketio/socket.io).
To send grid data to the panel use:
```js
socket.emit("grid-data", {
  panels: panels // panels is the array containing all your panels
})
```
To send pixel data to the panel use:
```js
socket.emit("pixel-data", {
  panels: panels // panels is the array containing all your panels
})
```
## Applications

### Simulator
Simulate the output.

`npm run sim`

Communication with the flip dot display is mantained, you can also test the output on the display.

### Flip-dot tests
Test various applications and serial communication.

`npm run dev`
