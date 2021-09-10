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
        panels
    },
    debug: false,
    mock: true
}

const client = new Client(config)
const simulator = new Simulator(client, document.getElementById('app') || document.body)

const bounds = {
    x: 7.5, y: 0, width: 48, height: 28
}

const canvas = document.createElement('canvas')
const w = client.width + client.maxOffset.x
const h = client.height + client.maxOffset.y
canvas.width = w
canvas.height = h
canvas.style.position = 'absolute'
canvas.style.bottom = '0'
canvas.style.imageRendering = 'pixelated'
document.body.appendChild(canvas)
const ctx = canvas.getContext('2d', { alpha: false })

function update() {
    if (!ctx) return
    ctx.fillStyle = '#000000'
    ctx.beginPath()
    ctx.rect(0, 0, w, h)
    ctx.fill()
    ctx.lineWidth = 1
    ctx.strokeStyle = '#ffffff'
    ctx.beginPath()
    ctx.rect(bounds.x, bounds.y, bounds.width, bounds.height)
    ctx.stroke()
    canvasToDots(ctx)
    simulator.update()
    client.send()
}

function canvasToDots(ctx: CanvasRenderingContext2D) {
    const threshold = 200
    const pixels = ctx.getImageData(0, 0, w, h).data;
    let x = 0;
    let y = 0;
    for (let i = 0; i < pixels.length; i += 4) {
        client.setRelative(x, y, pixels[i] > 0 && pixels[i + 3] > threshold);
        x++;
        if (x >= w) {
            y++;
            x = 0;
        }
    }
}

document.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowRight':
            bounds.x++
            break
        case 'ArrowLeft':
            bounds.x--
            break
        case 'ArrowUp':
            bounds.y--
            break
        case 'ArrowDown':
            bounds.y++
            break
    }
    update()
})

setTimeout(update, 100)