let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameOver = false;
let isAI = false;
let scores = { X: 0, O: 0, Draw: 0 };

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function makeMove(index) {
    if (gameOver || board[index] !== '') return;

    board[index] = currentPlayer;
    document.getElementsByClassName('cell')[index].innerText = currentPlayer;

    if (checkWinner(currentPlayer)) {
        showWinPopup(`Congratulations, Player ${currentPlayer} wins!`);
        scores[currentPlayer]++;
        updateScores();
        gameOver = true;
    } else if (board.every(cell => cell !== '')) {
        document.getElementById('message').innerText = "It's a tie!";
        scores.Draw++;
        updateScores();
        gameOver = true;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateMessage();
        if (isAI && currentPlayer === 'O' && !gameOver) {
            setTimeout(aiMove, 500);
        }
    }
}

function checkWinner(player) {
    return winPatterns.some(pattern => {
        return pattern.every(index => board[index] === player);
    });
}

function updateMessage() {
    if (!gameOver) {
        document.getElementById('message').innerText = `Player ${currentPlayer}'s turn`;
    }
}

function updateScores() {
    document.getElementById('xScore').innerText = `X: ${scores.X}`;
    document.getElementById('oScore').innerText = `O: ${scores.O}`;
    document.getElementById('drawScore').innerText = `Draw: ${scores.Draw}`;
}

function resetGame() {
    currentPlayer = 'X';
    board = ['', '', '', '', '', '', '', '', ''];
    gameOver = false;
    document.getElementById('message').innerText = `Player ${currentPlayer}'s turn`;
    Array.from(document.getElementsByClassName('cell')).forEach(cell => {
        cell.innerText = '';
    });
    closePopup();
}

function resetScores() {
    scores = { X: 0, O: 0, Draw: 0 };
    updateScores();
}

function startTwoPlayer() {
    isAI = false;
    resetGame();
}

function startAI() {
    isAI = true;
    resetGame();
}

function aiMove() {
    const bestMove = minimax(board, 'O').index;
    board[bestMove] = 'O';
    document.getElementsByClassName('cell')[bestMove].innerText = 'O';

    if (checkWinner('O')) {
        showWinPopup(`Congratulations, Player O wins!`);
        scores.O++;
        updateScores();
        gameOver = true;
    } else if (board.every(cell => cell !== '')) {
        document.getElementById('message').innerText = "It's a tie!";
        scores.Draw++;
        updateScores();
        gameOver = true;
    } else {
        currentPlayer = 'X';
        updateMessage();
    }
}

function minimax(newBoard, player) {
    const availSpots = newBoard.reduce((acc, val, idx) => {
        if (val === '') acc.push(idx);
        return acc;
    }, []);

    if (winPatterns.some(pattern => pattern.every(idx => newBoard[idx] === 'X'))) {
        return { score: -10 };
    } else if (winPatterns.some(pattern => pattern.every(idx => newBoard[idx] === 'O'))) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }

    const moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        const move = {};
        move.index = availSpots[i];
        newBoard[availSpots[i]] = player;

        if (player === 'O') {
            const result = minimax(newBoard, 'X');
            move.score = result.score;
        } else {
            const result = minimax(newBoard, 'O');
            move.score = result.score;
        }

        newBoard[availSpots[i]] = '';
        moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function showWinPopup(message) {
    document.getElementById('winMessage').innerText = message;
    document.getElementById('winPopup').classList.remove('hidden');
}

function closePopup() {
    document.getElementById('winPopup').classList.add('hidden');
}

// Initialize the game
updateMessage();
updateScores();
