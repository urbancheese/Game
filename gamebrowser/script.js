document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.querySelector('.game-board');
    const timerDisplay = document.getElementById('time');
    const movesDisplay = document.getElementById('moves');
    const gameOverScreen = document.querySelector('.game-over');
    const finalTimeDisplay = document.getElementById('final-time');
    const finalMovesDisplay = document.getElementById('final-moves');
    const restartButton = document.getElementById('restart-button');
    const darkModeCheckbox = document.getElementById('dark-mode-checkbox');
    const body = document.body;

    let cards = [];
    let flippedCards = [];
    let matchedCards = [];
    let moves = 0;
    let timerInterval;
    let startTime;

    const cardImages = [
        'apple.png', 'apple.png',
        'banana.png', 'banana.png',
        'cherry.png', 'cherry.png',
        'grape.png', 'grape.png',
        'lemon.png', 'lemon.png',
        'orange.png', 'orange.png',
        'pear.png', 'pear.png',
        'strawberry.png', 'strawberry.png'
    ];

    // Function to enable dark mode
    function enableDarkMode() {
        body.classList.add('dark-mode');
        darkModeCheckbox.checked = true;
        localStorage.setItem('darkMode', 'enabled');
    }

    // Function to disable dark mode
    function disableDarkMode() {
        body.classList.remove('dark-mode');
        darkModeCheckbox.checked = false;
        localStorage.setItem('darkMode', null);
    }

    // Check if dark mode was previously enabled
    if (localStorage.getItem('darkMode') === 'enabled') {
        enableDarkMode();
    }

    // Dark mode toggle event listener
    darkModeCheckbox.addEventListener('change', () => {
        if (darkModeCheckbox.checked) {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    });

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function createCard(image) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-back"></div>
                <div class="card-front">
                    <img src="images/${image}" alt="${image.split('.')[0]}">
                </div>
            </div>
        `;
        card.dataset.image = image;
        card.addEventListener('click', flipCard);
        return card;
    }

    function setupBoard() {
        shuffleArray(cardImages);
        cardImages.forEach(image => {
            const card = createCard(image);
            cards.push(card);
            gameBoard.appendChild(card);
        });
    }

    function startTimer() {
        startTime = Date.now();
        timerInterval = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            const minutes = Math.floor(elapsedTime / 60000);
            const seconds = Math.floor((elapsedTime % 60000) / 1000);
            timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function updateMoves() {
        moves++;
        movesDisplay.textContent = moves;
    }

    function flipCard() {
        if (flippedCards.length < 2 && !this.classList.contains('flipped') && !this.classList.contains('matched')) {
            this.classList.add('flipped');
            flippedCards.push(this);

            if (flippedCards.length === 1 && moves === 0) {
                startTimer();
            }

            if (flippedCards.length === 2) {
                updateMoves();
                const card1Image = flippedCards[0].dataset.image;
                const card2Image = flippedCards[1].dataset.image;

                if (card1Image === card2Image) {
                    // Match found
                    flippedCards.forEach(card => card.classList.add('matched'));
                    matchedCards.push(...flippedCards);
                    flippedCards = [];
                    if (matchedCards.length === cards.length) {
                        gameOver();
                    }
                } else {
                    // No match
                    setTimeout(() => {
                        flippedCards.forEach(card => card.classList.remove('flipped'));
                        flippedCards = [];
                    }, 1000);
                }
            }
        }
    }

    function gameOver() {
        stopTimer();
        finalTimeDisplay.textContent = timerDisplay.textContent;
        finalMovesDisplay.textContent = moves;
        gameOverScreen.classList.remove('hidden');
    }

    function restartGame() {
        stopTimer();
        cards = [];
        flippedCards = [];
        matchedCards = [];
        moves = 0;
        timerDisplay.textContent = '00:00';
        movesDisplay.textContent = '0';
        gameBoard.innerHTML = '';
        gameOverScreen.classList.add('hidden');
        setupBoard();
    }

    restartButton.addEventListener('click', restartGame);

    // make sure your images dir is correct
    setupBoard();
});