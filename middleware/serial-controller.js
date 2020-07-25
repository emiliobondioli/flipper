require('dotenv').config()
const config = require('../config.js')
const io = require('socket.io')
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const server = new io();
server.listen(config.socket.port)

let debounceCmd = false
let debounceSensor = false
let lastMessage = [null, null]

// Config
const port = process.env.port
if (!port) {
    console.log('COM port not configured')
    process.exit()
}
let com = new SerialPort(port, {
    baudRate: 57600,
    databits: 8,
    parity: 'none'
}, false)
const BUFFER_SIZE = (config.panels[0].bounds.width + 4) * config.panels.length
let buffer = new Uint8Array(BUFFER_SIZE);

server.on('connect', (socket) => {
    console.log('client connected')
    socket.on('data', message => {
        buffer = message.data
    })
});

function writeBuffer() {
    com.write(buffer, function (err) {
        if (err) {
            return console.log('Error on write: ', err.message)
        }
        writeBuffer()
    })
}
writeBuffer()

if (process.env.in_port) {
    const serialIn = new SerialPort(process.env.in_port)
    const parser = serialIn.pipe(new Readline({ delimiter: '\r\n' }))
    parser.on('data', (data) => {
        const msg = data.split('/')
        if(lastMessage[0] === msg[0] && lastMessage[1] === msg[1]) return
        switch (msg[0]) {
            case 'S':
                if (!debounceSensor) {
                    server.emit('sensor', msg[1])
                    debounceSensor = true
                    setTimeout(() => {
                        debounceSensor = false
                    }, 50);
                }
                break
            case 'C':
                if (!debounceCmd) {
                    server.emit('command', msg[1])
                    debounceCmd = true
                    setTimeout(() => {
                        debounceCmd = false
                    }, 50);
                }
                break
        }
    })

}
