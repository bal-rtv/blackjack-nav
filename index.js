var playerScore;
var maritScore;

var deck;
var playerHand;
var maritHand;

// Constants
const BLACKJACK_PTS = 21;
const TURN_LIMIT = 17;
const PLAYER_WIN_MSG = "You win!";
const MARIT_WIN_MSG = "Marit wins!";
const TIE_MSG = "Its a tie!";

// To initialize the game
async function initializeGame() {
  // Get a shuffled deck
  deck = await getShuffledDeck();
  playBlackJack();
}

// Getting shuffled cards from the given API
async function getShuffledDeck() {
  const response = await fetch("https://blackjack.ekstern.dev.nav.no/shuffle");
  const deck = await response.json();
  return deck;
}

// Getting a card from top of cards
function drawCard() {
  if (deck.length === 0) {
    return null;
  }
  return deck.pop();
}

/**
 * Calculates the sum of the given cards
 * @param hand - cards to calculate the sum of
 * @returns      the sum of the given cards
 */
function calculateHandValue(hand) {
  var sum = 0;
  for (const card of hand) {
    if (["K", "Q", "J"].includes(card.value)) {
      sum += 10;
    } else if (card.value === "A") {
      sum += 11;
    } else {
      sum += parseInt(card.value);
    }
  }
  return sum;
}

/**
 * Builds a new img tag for the given card
 * @param   card - card to create an img tag for
 * @returns        img tag for the given card
 */
function buildNewCardImgTag(newCard) {
  const cardImg = document.createElement("img");
  const card = newCard.suit + newCard.value;
  cardImg.src = "./cards/" + card + ".png";
  cardImg.alt = newCard.suit + " " + newCard.value;
  return cardImg;
}

// Disabling buttons used in the game
function disableBtns() {
  document.getElementById("hit").disabled = true;
  document.getElementById("pass").disabled = true;
}

/**
 * Toggles hit buttons visibility
 * @param {boolean} isActive - The state of the button
 */
function toggleHitBtn(isActive) {
  document.getElementById("hit").disabled = isActive;
}

/**
 * Toggles pass buttons visibility
 * @param {boolean} isActive - The state of the button
 */
function togglePassBtn(isActive) {
  document.getElementById("pass").disabled = isActive;
}

/**
 * Returns true if the sum is 21, false otherwise
 * @param   sum - The sum of the cards
 * @returns       true if the sum is 21, false otherwise
 */
function checkBlackJack(sum) {
  return sum === BLACKJACK_PTS ? true : false;
}

// Adds a card to the players hand and updates the score
// Checks the status after the players turn
function playerTurn() {
  const newCard = drawCard();
  playerHand.push(newCard);
  const cardImg = buildNewCardImgTag(newCard);
  document.getElementById("player-cards").append(cardImg);
  playerScore = calculateHandValue(playerHand);
  document.getElementById("player-sum").innerText = playerScore;
  statusAfterPlayerTurn();
}

// Checks the status after the players turn
function statusAfterPlayerTurn() {
  if (checkBlackJack(playerScore)) {
    endGame(PLAYER_WIN_MSG);
  } else if (playerScore >= TURN_LIMIT && playerScore <= BLACKJACK_PTS) {
    toggleHitBtn(true);
    togglePassBtn(false);
  } else if (calculateHandValue(playerHand) > BLACKJACK_PTS) {
    endGame(MARIT_WIN_MSG);
  }
}

// Adds a card to the Marits hand.
function maritTurn() {
  while (maritScore < playerScore) {
    const newCard = drawCard();
    maritHand.push(newCard);
    maritScore = calculateHandValue(maritHand);
    const cardImg = buildNewCardImgTag(newCard);
    document.getElementById("marit-cards").append(cardImg);
    document.getElementById("marit-sum").innerText = maritScore;
  }
  statusAfterMaritTurn();
}

// Checks the status after the Marits turn
function statusAfterMaritTurn() {
  if (maritScore === playerScore) {
    endGame(TIE_MSG);
  } else if (maritScore > BLACKJACK_PTS) {
    endGame(PLAYER_WIN_MSG);
  } else if (maritScore > playerScore) {
    endGame(MARIT_WIN_MSG);
  }
}

// Hands two cards to the players
function deliverTwoCards() {
  playerHand = [drawCard(), drawCard()];
  maritHand = [drawCard(), drawCard()];

  // Display the cards
  for (const card of playerHand) {
    const cardImg = buildNewCardImgTag(card);
    document.getElementById("player-cards").append(cardImg);
  }
  for (const card of maritHand) {
    const cardImg = buildNewCardImgTag(card);
    document.getElementById("marit-cards").append(cardImg);
  }
}

/**
 * Checks for winner with the given scores,
 * if there is no winner, it checks for the turn limit.
 * If the player has less than the turn limit, it enables the pass button.
 * If the player has more than the turn limit, it enables the hit button.
 * @param  playerScore - The sum of the players cards
 * @param  maritScore  - The sum of Marits cards
 */
function checkWinner(playerScore, maritScore) {
  if (checkBlackJack(playerScore)) {
    endGame(PLAYER_WIN_MSG);
  } else if (checkBlackJack(maritScore)) {
    endGame(MARIT_WIN_MSG);
  } else if (playerScore < TURN_LIMIT) {
    togglePassBtn(true);
  } else if (playerScore >= TURN_LIMIT) {
    toggleHitBtn(true);
  }
}

/**
 * Displays the modal dialog with the given result.
 * @param {string} result - The result of the game
 */
function showModalDialog(result) {
  const modal = document.getElementById("myModal");
  const dialogText = document.getElementById("dialogText");
  document.getElementById("marit-sum-result").innerText = maritScore;
  document.getElementById("player-sum-result").innerText = playerScore;
  dialogText.innerText = result;
  modal.style.display = "block";
}

// Hide the modal dialog
function hideModalDialog() {
  const modal = document.getElementById("myModal");
  modal.style.display = "none";
}

/**
 * Ends the game by displaying the modal dialog with the given result.
 * Disables the buttons.
 * @param {string} resultText - The result of the game
 */
function endGame(resultText) {
  disableBtns();
  setTimeout(function () {
    showModalDialog(resultText);
  }, 1000);
}

// Starts the black jack game
async function playBlackJack() {
  // Deliver two cards to the player and Marit
  deliverTwoCards();

  // Calculate the sum of the cards
  playerScore = calculateHandValue(playerHand);
  maritScore = calculateHandValue(maritHand);

  // Check for winner after first cards
  checkWinner(playerScore, maritScore);

  // Display the sum of the cards
  document.getElementById("marit-sum").innerText = maritScore;
  document.getElementById("player-sum").innerText = playerScore;

  // Add event listeners to the buttons
  document.getElementById("hit").addEventListener("click", playerTurn);
  document.getElementById("pass").addEventListener("click", maritTurn);
  document.getElementById("restart").addEventListener("click", function () {
    restartGame();
    hideModalDialog();
  });
}

// Restarts the game
function restartGame() {
  location.reload(true);
}

// Starting the game.
initializeGame();
