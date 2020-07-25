import config from '../config.js'
const panels = config.panels
const io = require('socket.io');
const server = new io();
const SerialPort = require('serialport')
const terminator = new Int8Array([0x8F])
require('dotenv').config()
server.listen(4000)
let all_panels;

// Config
const port = process.env.port
if(!port) {
    console.log('COM port not configured')
    process.exit()
}
const length = (panels[0].bounds.width + 4) * panels.length
all_panels = new Int8Array(length)

function writeBuffer() {
    com.write(Buffer.from(all_panels), function (err) {
      if (err) {
        return console.log('Error on write: ', err.message)
      }
      writeBuffer()
    })
}


setInterval(switchValues, 500);

let value = 0;

function switchValues() {
  value = !value;
  for (let p = 0; p < panels.length; p++) {
    const panel = panels[p]
    const buffer = new Int8Array(panel.bounds.width)
    for(let i = 0; i < panel.bounds.width; i++) {
      buffer[i] = value ? 255 : 0
    }
    all_panels.set(getPanelBuffer(buffer, panel.address), p * 32);
  }
}

function getPanelBuffer(data, address) {
  const header = new Int8Array([0x80, 0x85, address])
  const message = new Int8Array(data.length + 4)
  message.set(header, 0)
  message.set(data, 3)
  message.set(terminator, 3 + data.length)
  return message;
}

var com = new SerialPort(port, {
  baudRate: 57600,
  databits: 8,
  parity: 'none'
}, false)

writeBuffer()

com.on('error', function (err) {
  console.log('Error: ', err.message)
})
