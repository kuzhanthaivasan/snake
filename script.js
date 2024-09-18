document.addEventListener("DOMContentLoaded", function() {
    const gameArea = document.getElementById('gameArea');
    const scoreDisplay = document.getElementById('scoreDisplay');  // For showing score
    const gameOverDisplay = document.getElementById('gameOverDisplay');  // For showing game over
    const restartButton = document.getElementById('restartButton');  // Restart button
    const gameWidth = 400;
    const gameHeight = 400;
    const snakeSize = 20;

    let snake = [{ x: 200, y: 200 }];  // Initial snake position
    let direction = { x: 1, y: 0 };    // Start by moving to the right
    let cat = createCat();  // Create initial cat
    let score = 0;  // Score counter
    let gameOver = false;  // Game over flag

    let snakeElement = createSnakeElement(snake[0].x, snake[0].y);
    gameArea.appendChild(snakeElement);
    gameArea.appendChild(cat);

    // Function to create a snake segment
    function createSnakeElement(x, y) {
        let div = document.createElement('div');
        div.classList.add('snake');
        div.style.left = x + 'px';
        div.style.top = y + 'px';
        return div;
    }

    // Function to create a cat (food) element
    function createCat() {
        let div = document.createElement('div');
        div.classList.add('cat');
        randomizeCatPosition(div);
        return div;
    }

    // Function to randomly position the cat
    function randomizeCatPosition(cat) {
        let x = Math.floor(Math.random() * (gameWidth / snakeSize)) * snakeSize;
        let y = Math.floor(Math.random() * (gameHeight / snakeSize)) * snakeSize;
        cat.style.left = x + 'px';
        cat.style.top = y + 'px';
    }

    // Function to move the snake
    function moveSnake() {
        if (gameOver) return;  // If the game is over, don't move the snake

        let head = { ...snake[0] };  // Copy the head of the snake
        head.x += direction.x * snakeSize;
        head.y += direction.y * snakeSize;

        // Check for boundary crossing and wrap the snake around
        if (head.x >= gameWidth) head.x = 0;
        if (head.x < 0) head.x = gameWidth - snakeSize;
        if (head.y >= gameHeight) head.y = 0;
        if (head.y < 0) head.y = gameHeight - snakeSize;

        // Check if the snake's head hits the cat
        if (head.x === parseInt(cat.style.left) && head.y === parseInt(cat.style.top)) {
            // Snake grows
            snake.push({ ...snake[snake.length - 1] });  // Add a new segment to the tail
            randomizeCatPosition(cat);  // Move the cat to a new random position
            score++;  // Increase score
            scoreDisplay.innerText = `Score: ${score}`;  // Update score display
        } else {
            snake.pop();  // Remove the last part of the snake (tail)
        }

        // Check for self-collision (if the head hits any part of the body)
        if (isSelfCollision(head)) {
            endGame();
            return;
        }

        snake.unshift(head); // Add the new head position
        renderSnake();
    }

    // Function to check if the snake hits itself
    function isSelfCollision(head) {
        for (let i = 1; i < snake.length; i++) {  // Skip the head (start from 1)
            if (snake[i].x === head.x && snake[i].y === head.y) {
                return true;
            }
        }
        return false;
    }

    // Function to render the snake
    function renderSnake() {
        gameArea.innerHTML = '';  // Clear the game area
        for (let part of snake) {
            gameArea.appendChild(createSnakeElement(part.x, part.y));
        }
        gameArea.appendChild(cat);  // Keep the cat in the game area
    }

    // Function to end the game
    function endGame() {
        gameOver = true;
        gameOverDisplay.innerText = `Game Over! You caught the cat ${score} times.`;
        restartButton.style.display = 'block';  // Show the restart button
    }

    // Restart game function
    function restartGame() {
        // Reset game state
        snake = [{ x: 200, y: 200 }];
        direction = { x: 1, y: 0 };
        score = 0;
        gameOver = false;
        scoreDisplay.innerText = `Score: ${score}`;
        gameOverDisplay.innerText = '';
        restartButton.style.display = 'none';  // Hide the restart button
        randomizeCatPosition(cat);
        renderSnake();
    }

    // Listen for arrow key presses to change direction
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowUp' && direction.y === 0) {
            direction = { x: 0, y: -1 };
        } else if (event.key === 'ArrowDown' && direction.y === 0) {
            direction = { x: 0, y: 1 };
        } else if (event.key === 'ArrowLeft' && direction.x === 0) {
            direction = { x: -1, y: 0 };
        } else if (event.key === 'ArrowRight' && direction.x === 0) {
            direction = { x: 1, y: 0 };
        }
    });

    // Move the snake every 100 milliseconds
    setInterval(moveSnake, 100);

    // Add event listener for the restart button
    restartButton.addEventListener('click', restartGame);
});
