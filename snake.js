class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.box = 20;
        this.rows = this.canvas.height / this.box;
        this.cols = this.canvas.width / this.box;
        this.obstacleCount = 5;
        this.obstacles = [];
        this.snake = [{ x: 8, y: 10 }];
        this.direction = 'RIGHT';
        this.score = 0;
        this.gameOver = false;
        this.food = null;
    }

    init() {
        this.generateObstacles();
        this.food = this.spawnFood();
        this.draw();
        this.gameLoop();
    }

    generateObstacles() {
        this.obstacles = [];
        for (let i = 0; i < this.obstacleCount; i++) {
            this.obstacles.push(this.getRandomPosition());
        }
    }

    getRandomPosition() {
        let position;
        do {
            position = {
                x: Math.floor(Math.random() * this.cols),
                y: Math.floor(Math.random() * this.rows)
            };
        } while (this.isPositionOccupied(position));

        return position;
    }

    isPositionOccupied(pos) {
        const onSnake = this.snake.some(segment => segment.x === pos.x && segment.y === pos.y);
        const onObstacle = this.obstacles.some(obstacle => obstacle.x === pos.x && obstacle.y === pos.y);
        return onSnake || onObstacle;
    }

    drawSquare(x, y, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x * this.box, y * this.box, this.box - 2, this.box - 2);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.obstacles.forEach(obstacle => {
            this.drawSquare(obstacle.x, obstacle.y, '#777');
        });

        for (let i = 0; i < this.snake.length; i++) {
            this.drawSquare(this.snake[i].x, this.snake[i].y, i === 0 ? '#0f0' : '#090');
        }

        this.drawSquare(this.food.x, this.food.y, '#f00');
    }

    update() {
        if (this.gameOver) return;

        let head = { x: this.snake[0].x, y: this.snake[0].y };
        if (this.direction === 'LEFT') head.x--;
        if (this.direction === 'RIGHT') head.x++;
        if (this.direction === 'UP') head.y--;
        if (this.direction === 'DOWN') head.y++;

        if (head.x < 0) head.x = this.cols - 1;
        if (head.x >= this.cols) head.x = 0;
        if (head.y < 0) head.y = this.rows - 1;
        if (head.y >= this.rows) head.y = 0;

        for (let i = 0; i < this.snake.length; i++) {
            if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
                this.endGame();
                return;
            }
        }

        if (this.obstacles.some(obstacle => head.x === obstacle.x && head.y === obstacle.y)) {
            this.endGame();
            return;
        }

        if (head.x === this.food.x && head.y === this.food.y) {
            this.snake.unshift(head);
            this.score++;
            document.getElementById('score').textContent = 'Score: ' + this.score;
            this.food = this.spawnFood();
        } else {
            this.snake.unshift(head);
            this.snake.pop();
        }
    }

    spawnFood() {
        return this.getRandomPosition();
    }

    endGame() {
        this.gameOver = true;
        setTimeout(() => {
            alert('Game Over! Your score: ' + this.score);
            location.reload();
        }, 100);
    }

    gameLoop() {
        this.update();
        this.draw();

        if (!this.gameOver) {
            setTimeout(() => this.gameLoop(), 100);
        }
    }
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft' && game.direction !== 'RIGHT') game.direction = 'LEFT';
    if (e.key === 'ArrowUp' && game.direction !== 'DOWN') game.direction = 'UP';
    if (e.key === 'ArrowRight' && game.direction !== 'LEFT') game.direction = 'RIGHT';
    if (e.key === 'ArrowDown' && game.direction !== 'UP') game.direction = 'DOWN';
});

const game = new Game('game');
game.init();