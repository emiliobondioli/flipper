import App from '~/modules/app'
import PanelView from '~/modules/views/panel-view'

export default class MlPong extends App {
    constructor(stage, rate) {
        super(stage, rate)
        this.frontColor = '#FFFFFF'
        this.backColor = '#000000'
        this.ctx.fillStyle = this.frontColor;
        this.ctx.strokeStyle = this.frontColor;
        this.view = new PanelView(stage)
        this.player1 = new Player(stage, { x: 0, y: stage.height / 2 })
        this.player2 = new Player(stage, { x: stage.width - 2, y: stage.height / 2 })
        this.players = [this.player1, this.player2]
        this.ctx.textBaseline = 'top';
        this.ctx.font = '8px unibody8'
        this.ctx.lineWidth = "1"
        this.ctx.textAlign = "center";
        this.resetBall()
    }

    draw() {
        this.updateBall()
        this.ctx.clearRect(0, 0, this.stage.width, this.stage.height)
        this.player1.draw(this.ctx)
        this.player2.draw(this.ctx)
        this.drawScore()
        this.ctx.rect(this.ball.x, this.ball.y, 1, 1)
        this.ctx.fill()
        this.drawStage(250)
    }

    drawScore() {
        this.ctx.fillText(this.player1.score + '-' + this.player2.score, this.stage.width / 2 + 0.5, 0.5);
    }

    updateBall() {
        if (this.ball.x <= 0) this.score(this.player2)
        if (this.ball.x >= this.stage.width) this.score(this.player1)
        this.players.forEach(p => {
            if (this.ball.x >= p.x && this.ball.x <= p.x + p.width
                && this.ball.y >= p.y && this.ball.y <= p.y + p.height) this.ball.velocity.x = -this.ball.velocity.x
        });
        if (this.ball.y <= 0 || this.ball.y >= this.stage.height) this.ball.velocity.y = -this.ball.velocity.y
        this.ball.x += this.ball.velocity.x
        this.ball.y += this.ball.velocity.y
    }

    score(player) {
        player.score++
        this.resetBall()
    }

    resetBall() {
        this.ball = {
            x: this.stage.width / 2,
            y: this.stage.height / 2,
            velocity: {
                x: -1,
                y: -1
            }
        }
    }

    key(e) {
        this.command(e.keyCode)
    }

    command(c) {
        switch (c) {
            case 38:
                this.player2.move(-1)
                break;
            case 'DOWN':
                this.player1.move(-1)
                break;
            case 40:
                this.player2.move(1)
                break;
            case 'UP':
                this.player1.move(1)
                break;
        }
    }

}

class Player {
    constructor(stage, { x, y }) {
        this.y = y;
        this.x = x;
        this.score = 0;
        this.stage = stage
        this.width = 1
        this.height = 5
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.rect(this.x, this.y, 2, this.height)
        ctx.fill()
    }

    move(direction) {
        const newPos = this.y + direction
        if (newPos >= 0 && (newPos + this.height) <= this.stage.height) this.y += direction
    }
}
