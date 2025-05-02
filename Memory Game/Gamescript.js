const topics = {
  planets: [
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
  ],
  fruits: [
    "Apple",
    "Banana",
    "Cherry",
    "Date",
    "Fig",
    "Grape",
    "Kiwi",
    "Lemon",
    "Mango",
    "Nectarine",
    "Orange",
    "Papaya",
    "Quince",
    "Raspberry",
  ],
  carbrands: [
    "Toyota",
    "Ford",
    "Ferrari",
    "Honda",
    "BMW",
    "Porsche",
    "Audi",
    "Bugatti",
    "Nissan",
    "Hyundai",
    "Kia",
    "Mazda",
    "Subaru",
    "Tesla",
  ],
  vegetables: [
    "Carrot",
    "Broccoli",
    "Asparagus",
    "Cauliflower",
    "Corn",
    "Cucumber",
    "Eggplant",
    "Capsicum",
    "Lettuce",
    "Mushrooms",
    "Onion",
    "Potato",
    "Pumpkin",
    "Spinach",
  ],
  bikes: [
    "Yamaha",
    "Honda",
    "Suzuki",
    "Kawasaki",
    "Ducati",
    "BMW",
    "Harley",
    "Triumph",
    "KTM",
    "Aprilia",
    "RE",
    "Bajaj",
    "Hero",
    "TVS",
  ],
};

let selectedTopic = "planets";
let selectedDifficulty = null;
let selectedCards = [];
let matchedCards = [];
let timer;
let currentCardCount;
let currentTime;

document.getElementById("start-game").addEventListener("click", () => {
  document.querySelector(".title-screen").style.display = "none";
  document.querySelector(".difficulty-screen").style.display = "block";
});

document.querySelectorAll(".difficulty-buttons button").forEach((button) => {
  button.addEventListener("click", () => {
    selectedDifficulty = button.id;
    document.querySelector(".difficulty-screen").style.display = "none";
    document.querySelector(".topic-screen").style.display = "block";
  });
});

document.querySelectorAll(".topic-buttons button").forEach((button) => {
  button.addEventListener("click", () => {
    selectedTopic = button.id;
    document.querySelector(".topic-screen").style.display = "none";
    document.querySelector(".control-panel").style.display = "block";
    document.querySelector(".game-board").style.display = "grid";
    startGame();
  });
});

function createBoard(cardCount) {
  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = "";
  const cards = [];
  const topicCards = topics[selectedTopic];
  for (let i = 0; i < cardCount / 2; i++) {
    cards.push(topicCards[i % topicCards.length]);
    cards.push(topicCards[i % topicCards.length]);
  }
  cards.sort(() => 0.5 - Math.random());
  cards.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card", "hidden");
    cardElement.dataset.planet = card;
    cardElement.textContent = card;
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
    if (matchedCards.length === document.querySelectorAll(".card").length) {
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

function startGame() {
  let cardCount, time;
  switch (selectedDifficulty) {
    case "beginner":
      cardCount = 10;
      time = 40;
      break;
    case "easy":
      cardCount = 20;
      time = 60;
      break;
    case "medium":
      cardCount = 30;
      time = 90;
      break;
    case "hard":
      cardCount = 46;
      time = 120;
      break;
    case "expert":
      cardCount = 60;
      time = 160;
      break;
  }
  currentCardCount = cardCount;
  currentTime = time;
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
  let timeLeft = seconds;
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

document.getElementById("reset").addEventListener("click", resetGame);
document
  .getElementById("go-back")
  .addEventListener("click", showDifficultyScreen);
