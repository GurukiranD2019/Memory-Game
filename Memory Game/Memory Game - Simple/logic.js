document.getElementById("start-game").addEventListener("click", () => {
  document.querySelector(".title-screen").style.display = "none";
  document.querySelector(".difficulty-screen").style.display = "block";
});

const planets = [
  "Mercury",
  "Venus",
  "Earth",
  "Mars",
  "Jupiter",
  "Saturn",
  "Uranus",
  "Neptune",
  "Titan",
  "Calisto",
  "Pluto",
  "Eris",
  "Sun",
  "Moon",
  "Euporie",
  "Garymede",
];
let selectedCards = [];
let matchedCards = [];
let timer;
let timeLeft;
let currentCardCount;
let currentTime;

function createBoard(cardCount) {
  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = "";
  const cards = [];
  for (let i = 0; i < cardCount / 2; i++) {
    cards.push(planets[i % planets.length]);
    cards.push(planets[i % planets.length]);
  }
  cards.sort(() => 0.5 - Math.random());
  cards.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card", "hidden");
    cardElement.dataset.planet = card;
    cardElement.addEventListener("click", revealCard);
    gameBoard.appendChild(cardElement);
  });
}

function revealCard() {
  if (selectedCards.length < 2 && !this.classList.contains("open")) {
    this.classList.remove("hidden");
    this.classList.add("open");
    selectedCards.push(this);
    if (selectedCards.length === 2) {
      checkForMatch();
    }
  }
}

function checkForMatch() {
  const [card1, card2] = selectedCards;
  if (card1.dataset.planet === card2.dataset.planet) {
    card1.classList.add("matched");
    card2.classList.add("matched");
    disableCards();
    if (matchedCards.length === currentCardCount) {
      showMessage("Congratulations, you win!", "Go back", showDifficultyScreen);
    }
  } else {
    card1.classList.add("mismatched");
    card2.classList.add("mismatched");
    setTimeout(() => {
      card1.classList.remove("mismatched", "open");
      card2.classList.remove("mismatched", "open");
      card1.classList.add("hidden");
      card2.classList.add("hidden");
      selectedCards = [];
    }, 1000);
  }
}

function disableCards() {
  selectedCards.forEach((card) =>
    card.removeEventListener("click", revealCard)
  );
  matchedCards.push(...selectedCards);
  selectedCards = [];
}

function startGame(cardCount, time) {
  currentCardCount = cardCount;
  currentTime = time;
  document.querySelector(".difficulty-screen").style.display = "none";
  document.querySelector(".control-panel").style.display = "block";
  document.querySelector(".game-board").style.display = "grid";
  createBoard(cardCount);
  startTimer(time);
}

function resetGame() {
  selectedCards = [];
  matchedCards = [];
  clearInterval(timer);
  createBoard(currentCardCount);
  startTimer(currentTime);
  document.querySelector(".game-board").style.display = "grid";
}

function startTimer(seconds) {
  timeLeft = seconds;
  document.getElementById("timer").textContent = `Time left: ${timeLeft}s`;
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = `Time left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      showMessage("Time's up! Game over.", "Try again", showDifficultyScreen);
    }
  }, 1000);
}

function showMessage(message, buttonText, buttonAction) {
  document.querySelector(".control-panel").style.display = "none";
  document.querySelector(".game-board").style.display = "none";
  const messageScreen = document.getElementById("message-screen");
  document.getElementById("message").textContent = message;
  const messageButton = document.getElementById("message-button");
  messageButton.textContent = buttonText;
  messageButton.onclick = buttonAction;
  messageScreen.style.display = "block";
}

function showDifficultyScreen() {
  document.getElementById("message-screen").style.display = "none";
  document.querySelector(".difficulty-screen").style.display = "block";
  document.querySelector(".game-board").style.display = "none";
  document.querySelector(".control-panel").style.display = "none";
  clearInterval(timer);
}

document
  .getElementById("easy")
  .addEventListener("click", () => startGame(10, 25));
document
  .getElementById("medium")
  .addEventListener("click", () => startGame(20, 45));
document
  .getElementById("hard")
  .addEventListener("click", () => startGame(30, 60));
document.getElementById("reset").addEventListener("click", resetGame);
document
  .getElementById("go-back")
  .addEventListener("click", showDifficultyScreen);
