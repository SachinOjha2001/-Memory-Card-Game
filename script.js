const board = document.getElementById("game-board");
const restartBtn = document.getElementById("restart");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const winMessage = document.getElementById("win-message");
const finalScore = document.getElementById("final-score");

let cardValues = ["🍕", "🎈", "🚗", "🌟", "🐶", "🎮", "🍩", "📚"];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matches = 0;
let timer = 0;
let timerInterval = null;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function startTimer() {
  timer = 0;
  timerInterval = setInterval(() => {
    timer++;
    timerDisplay.textContent = `Time: ${timer}s`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function createBoard() {
  board.innerHTML = "";
  scoreDisplay.textContent = "Moves: 0";
  timerDisplay.textContent = "Time: 0s";
  winMessage.classList.add("hidden");

  moves = 0;
  matches = 0;
  firstCard = null;
  secondCard = null;
  lockBoard = false;

  clearInterval(timerInterval);
  startTimer();

  const shuffled = shuffle([...cardValues, ...cardValues]);

  shuffled.forEach((value) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.value = value;

    card.innerHTML = `
      <div class="front">${value}</div>
      <div class="back"></div>
    `;

    card.addEventListener("click", handleCardClick);
    board.appendChild(card);
  });
}

function handleCardClick(e) {
  if (lockBoard) return;
  const card = e.currentTarget;
  if (card === firstCard || card.classList.contains("flip")) return;

  card.classList.add("flip");

  if (!firstCard) {
    firstCard = card;
  } else {
    secondCard = card;
    lockBoard = true;
    moves++;
    scoreDisplay.textContent = `Moves: ${moves}`;

    if (firstCard.dataset.value === secondCard.dataset.value) {
      firstCard.removeEventListener("click", handleCardClick);
      secondCard.removeEventListener("click", handleCardClick);
      matches++;
      resetTurn();

      if (matches === cardValues.length) {
        stopTimer();
        setTimeout(() => {
          finalScore.textContent = `You finished in ${moves} moves and ${timer} seconds.`;
          winMessage.classList.remove("hidden");
        }, 500);
      }
    } else {
      setTimeout(() => {
        firstCard.classList.remove("flip");
        secondCard.classList.remove("flip");
        resetTurn();
      }, 1000);
    }
  }
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

restartBtn.addEventListener("click", createBoard);

// Start game on load
createBoard();
alert("Best Of Luck")