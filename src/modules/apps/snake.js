import App from '~/modules/app'
import { random } from '~/utils/'
import DotsView from '~/modules/views/dots-view'
import '~/assets/fonts/stylesheet.css'

export default class SnakeApp extends App {
    constructor(stage, rate) {
        super(stage, rate)
        this.setup()
        this.view = new DotsView(stage)
    }

    setup() {
        this.game = new Snake(this.ctx, { ...this.stage, x: 0, y: 5, height: this.stage.height - 1 })
    }

    draw() {
        this.game.update()
        this.drawStage()
    }

    key(e) {
        this.game.command(e.keyCode)
    }
    command(c) {
        this.game.command(c)
    }

    destroyed() {
        document.removeEventListener("keydown", this.key)
    }

}

class Snake {
    constructor(ctx, stage) {
        this.ctx = ctx
        this.stage = stage
        this.init()
    }

    init(options) {
        this.options = options;
        this.x = 0;
        this.y = this.stage.height / 2;
        this.r = 1;
        this.fruit = {
            x: 0,
            y: 0,
            active: false
        }
        this.speed = 1;
        this.score = 0;
        this.scoreSize = 5;
        this.currentDirection = 'RIGHT'
        this.playing = false;
        this.gameover = false
        this.velocity = {
            x: this.speed,
            y: 0
        };
        this.max_tail = 5
        this.tail = []
        this.t = 0;
        this.p = 0;
        this.frontColor = '#FFFFFF'
        this.backColor = '#000000'
        this.ctx.textBaseline = 'top';
        this.ctx.font = '8px unibody8'
        this.ctx.lineWidth = "1"
        this.startX = this.stage.width
        this.highScore = window.localStorage.getItem('snake_highscore') || 0;
        this.loopTimeout = null
    }

    update() {
        if (!this.playing) {
            if (this.gameover) this.showGameOver()
            else this.showStart();
            return
        }
        this.ctx.clearRect(0, 0, this.stage.width, this.stage.height);
        this.ctx.fillStyle = this.backColor;
        this.ctx.fillStyle = this.frontColor
        this.ctx.strokeStyle = this.frontColor
        this.ctx.stroke()
        if (this.x >= this.stage.width - 1 && this.velocity.x > 0) this.x = this.stage.x
        if (this.x <= this.stage.x + 1 && this.velocity.x < 0) this.x = this.stage.width
        if (this.y >= this.stage.y + this.stage.height - 1 && this.velocity.y > 0) this.y = this.stage.y
        if (this.y <= this.stage.y + 1 && this.velocity.y < 0) this.y = this.stage.y + this.stage.height
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        const pos = {
            x: Math.floor(this.x),
            y: Math.floor(this.y)
        }
        if (this.checkForDeath(pos)) return;
        let lastTail = this.t > 0 ? this.t - 1 : this.tail.length - 1
        if (!this.tail.length || (this.tail[lastTail].x != pos.x || this.tail[lastTail].y != pos.y)) {
            this.tail[this.t] = pos
            this.t++
        }
        this.drawSnake()
        if (this.t >= this.max_tail) this.t = 0;
        if (pos.x == this.fruit.x && pos.y == this.fruit.y && this.fruit.active) this.eatFruit()
        if (this.fruit.active) this.ctx.fillRect(this.fruit.x, this.fruit.y, 1, 1);
        this.updateScore()
    }

    drawSnake() {
        this.ctx.beginPath();
        for (let i = 0; i < this.tail.length; i++) {
            this.ctx.fillRect(this.tail[i].x, this.tail[i].y, this.r, this.r);
        }
        this.ctx.fill();
    }

    checkForDeath(pos) {
        this.tail.forEach(t => {
            if (pos.x == t.x && pos.y == t.y) {
                console.log(t, this.tail)
                this.gameOver()
                return true
            }
        })
        return false
    }

    showStart() {
        this.ctx.rect(0, 0, this.stage.width, this.stage.height)
        this.ctx.fill()
    }

    start() {
        this.score = 0;
        this.tail = [];
        this.max_tail = 5;
        this.x = this.stage.x + 1;
        this.y = this.stage.y + 1;
        this.t = 0;
        this.playing = true;
        this.createFruit();
    }

    showGameOver() {
        this.ctx.clearRect(0, 0, this.stage.width, this.stage.height);
        this.ctx.fillStyle = this.backColor
        this.ctx.fillRect(0, 0, this.stage.width, this.stage.height);
        this.ctx.fillStyle = this.frontColor
        this.ctx.strokeStyle = this.frontColor
        this.ctx.fillText("GAME", 12, 0);
        this.ctx.fillText("OVER", 12, 6);
        this.ctx.rect(0, this.stage.height - 8.5, this.stage.width, this.stage.height - 4.5);
        this.ctx.stroke()
        this.ctx.save()
        this.ctx.fillText("SCORE " + this.score, 1, this.stage.height - 12);
        this.ctx.restore()
    }

    gameOver() {
        this.playing = 0;
        this.gameover = true;
        this.startX = this.stage.width
        setTimeout(() => {
            this.gameover = false
        }, 3000)

    }

    eatFruit() {
        this.score++;
        this.fruit.active = false;
        this.max_tail += 2;
        if (this.score > this.highScore) {
            this.highScore = this.score
            window.localStorage.setItem('snake_highscore', this.score)
        }
        this.createFruit()
    }

    createFruit() {
        console.log(this.stage)
        this.fruit.x = this.getRandomInt(this.stage.x + 1, this.stage.width - 1)
        this.fruit.y = this.getRandomInt(this.stage.y + 1, this.stage.height - this.stage.y)
        this.fruit.active = true;
        if (this.tail.some(t => {
            return t.x == this.fruit.x && t.y == this.fruit.y
        })) {
            this.createFruit()
        }
    }

    updateScore() {
        this.ctx.fillText(this.score.toString(), 0, -2.5);
        this.ctx.fillText("HI " + this.highScore.toString(), this.stage.width - 30, -2.5);
    }

    setDirection(dir) {
        switch (dir) {
            case 'RIGHT':
                this.velocity.x = this.speed;
                this.velocity.y = 0;
                break;
            case 'LEFT':
                this.velocity.x = -this.speed;
                this.velocity.y = 0;
                break;
            case 'DOWN':
                this.velocity.x = 0;
                this.velocity.y = this.speed;
                break;
            case 'TOP':
                this.velocity.x = 0;
                this.velocity.y = -this.speed;
                break;
        }
        this.currentDirection = dir;
    }

    disable() {
        this.disabled = true;
    }

    enable() {
        this.disabled = false;
    }

    exit() {
        this.playing = false
        this.ctx.clearRect(0, 0, this.stage.width, this.stage.height);
        clearTimeout(this.loopTimeout)
        this.loopTimeout = null
    }

    getRandomInt(min, max) {
        return Math.round(random(min, max))
    }

    command(code) {
        switch (code) {
            case 37:
            case 'RIGHT':
                if (this.currentDirection != 'RIGHT') this.setDirection('LEFT')
                break;
            case 38:
            case 'DOWN':
                if (this.currentDirection != 'DOWN') this.setDirection('TOP')
                break;
            case 39:
            case 'LEFT':
                if (this.currentDirection != 'LEFT') this.setDirection('RIGHT')
                break;
            case 40:
            case 'UP':
                if (this.currentDirection != 'TOP') this.setDirection('DOWN')
                break;
            case 'A':
                if (!this.startTimeout) {
                    this.startTimeout = setTimeout(e => {
                        this.startTimeout = null
                    }, 1000)
                    if (!this.playing) this.start();
                    else {
                        this.exit()
                        this.frontColor = '#FFFFFF'
                        this.backColor = '#000000'
                    }
                }
                break;
            case 'T':
                if (!this.turboTimeout && this.playing) {
                    if (this.frontColor == '#FFFFFF') {
                        this.frontColor = '#000000'
                        this.backColor = '#FFFFFF'
                    } else {
                        this.frontColor = '#FFFFFF'
                        this.backColor = '#000000'
                    }
                    this.turboTimeout = setTimeout(e => {
                        this.turboTimeout = null
                    }, 1000)
                }
                break;
        }
    }
}
