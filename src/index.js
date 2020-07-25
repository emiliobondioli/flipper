const config = require('../config.js')
import './styles/index.scss'
import Bridge from '~/modules/bridge'
import Stage from '~/modules/stage'
import FpsCounter from '~/modules/fps-counter'
import App from '~/modules/apps'

const bridge = new Bridge(config.socket)
const panels = config.panels
const W = Math.max(...panels.map(p => p.bounds.x + p.bounds.width))
const H = Math.max(...panels.map(p => p.bounds.y + p.bounds.height))
let app = null
const fps = new FpsCounter()
const useAnimationFrame = true

bridge.on('command', m => {
    app.command(m)
})

const stage = new Stage({
    width: W,
    height: H,
    panels
})

setTimeout(() => {
    if (useAnimationFrame) run()
    else setTimeout(run, 0);
    updateFps()
}, 1000);
// Init app
app = new App.MlPong(stage, 3)

function run() {
    if (!app) return
    app.update()
    fps.update()
    const buffer = stage.buffer
    bridge.send(buffer)
    if (useAnimationFrame) requestAnimationFrame(run)
    else setTimeout(run, 1);
}

function updateFps() {
    fps.draw()
    requestAnimationFrame(updateFps)
}


