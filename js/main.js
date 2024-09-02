    const gameBoard = document.getElementById('gameBoard');
    const turnIndicator = document.getElementById('turnIndicator');

    // restartBtn 
    const restartBtn = document.getElementById('restartBtn');

    // result
    const scoreXDisplay = document.getElementById('scoreX');
    const scoreODisplay = document.getElementById('scoreO');

    const gridSize = 20;
    let board = Array(gridSize * gridSize).fill(null);
    let currentPlayer = 'X';
    let scoreX = 0;
    let scoreO = 0; 

    if (localStorage.getItem('scoreX')) {
        scoreX = parseInt(localStorage.getItem('scoreX'));
        scoreO = parseInt(localStorage.getItem('scoreO'));
        scoreXDisplay.textContent = `X: ${scoreX}`;
        scoreODisplay.textContent = `O: ${scoreO}`;
    }

    document.addEventListener('DOMContentLoaded', () => {
        for (let i = 0; i < gridSize * gridSize; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.setAttribute('data-index', i);
            gameBoard.appendChild(cell);
        }
    });

    function checkWin() {
        for (let i = 0; i < board.length; i++) {
            if (board[i]) {
                if (i % gridSize <= gridSize - 5 && checkLine(i, 1)) return board[i];
                if (Math.floor(i / gridSize) <= gridSize - 5 && checkLine(i, gridSize)) return board[i];
                if (i % gridSize <= gridSize - 5 && Math.floor(i / gridSize) <= gridSize - 5 && checkLine(i, gridSize + 1)) return board[i];
                if (i % gridSize >= 4 && Math.floor(i / gridSize) <= gridSize - 5 && checkLine(i, gridSize - 1)) return board[i];
            }
        }
        return null;
    }

    function checkLine(startIndex, step) {
        const symbol = board[startIndex];
        for (let i = 1; i < 5; i++) {
            if (board[startIndex + i * step] !== symbol) {
                return false;
            }
        }
        for (let i = 0; i < 5; i++) {
            document.querySelector(`.cell[data-index="${startIndex + i * step}"]`).classList.add('winning-cell');
        }
        return true;
    }

    function handleMove(e) {
        const cellIndex = e.target.getAttribute('data-index');

        if (board[cellIndex] || checkWin()) return;

        board[cellIndex] = currentPlayer;
        e.target.textContent = currentPlayer;

        const winner = checkWin();
        if (winner) {
            turnIndicator.textContent = `Player ${winner} Wins!`;
            if (winner === 'X') {
                scoreX++;
                localStorage.setItem('scoreX', scoreX);
            } else {
                scoreO++;
                localStorage.setItem('scoreO', scoreO);
            }
            scoreXDisplay.textContent = `X: ${scoreX}`;
            scoreODisplay.textContent = `O: ${scoreO}`;
        } else if (!board.includes(null)) {
            turnIndicator.textContent = "It's a Draw!";
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            turnIndicator.textContent = `Player ${currentPlayer}'s Turn`;
        }
    }

    function restartGame() {
        board.fill(null);
        document.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('winning-cell');
        });
        currentPlayer = 'X';
        turnIndicator.textContent = `Player X's Turn`;
    }

    gameBoard.addEventListener('click', handleMove);
    restartBtn.addEventListener('click', restartGame);
