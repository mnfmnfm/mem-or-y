'use strict';

// Declare function to toggle between instructions and game.
function toggleGame() {
  var gameBtn = document.getElementById('game-btn');

  if (gameBtn.textContent === 'Play Game') {
    gameBtn.textContent = 'Instructions';
  } else if (gameBtn.textContent === 'Instructions') {
    gameBtn.textContent = 'Play Game';
  }

  document.getElementById('game-info').classList.toggle('hidden');
  document.getElementById('game-display').classList.toggle('hidden');
  document.getElementById('user-score').classList.toggle('hidden');
}

/*********************************/
/* Data related to Card objects. */
/*********************************/

// Declare variable to hold an array of Card instances.
var colorCards = [];

// Declare constructor for Card instances.
function Card(index = 0) {
  this.index = index;
  colorCards.push(this);
}
var colorCount = 0;
// Declare render() method for Card instances.
Card.prototype.render = function() {
  var cardContainer = document.getElementById('card-container');
  var newCard = document.createElement('div');
  newCard.classList.add('color-card');
  newCard.classList.add('data-id' + colorCount);
  newCard.id = this.index;
  cardContainer.appendChild(newCard);
};

// Create and render four initial Card instances.
for (let i = 0; i < 4; i++) {
  colorCount = i;
  new Card(i).render();
}

// Grab all rendered Card elements.
var cards = document.querySelectorAll('.color-card');

/*****************************************************/
/* Data related to the game sequence and user input. */
/*****************************************************/

// Declare array to hold random Card sequence numbers.
var cardSequence = [];

// Generate initial random sequence.
function initSequence() {
  for (let i = 0; i < colorCards.length; i++) {
    cardSequence.push(Math.floor(Math.random() * colorCards.length));
  }
  performSequence();
}

// Declare function that flashes Card elements in sequence.
function performSequence() {
  for (let i = 0; i < cards.length; i++) {
    cards[i].classList.remove('cyan');
  }
  // this is lovely.
  for (let i = 0; i < cardSequence.length; i++) {
    let timer = i;
    let cardIndex = cardSequence[i];
    let cardID = document.getElementById(colorCards[cardIndex].index);
    setTimeout(function() {
      cardID.classList.add('darkgoldenrod');
      setTimeout(function() {
        cardID.classList.remove('darkgoldenrod');
      }, 500);
    }, 1000 * (timer + 1));
  }
  setTimeout(addCardClicks, 1000 * (cardSequence.length + 1));
}

// Declare variable for counting clicks per round.
var clickCount = 0;

// Declare array to hold the IDs of clicked Card elements.
var clickedCards = [];

// Compare the clicked element to the corresponding sequence element.
function clickCompare(event) {
  clickedCards.push(parseInt(event.target.id));
  // Getting an element by the id of an element you already have... You could just use event.target instead!
  // let cardID = document.getElementById(event.target.id);
  if (clickedCards[clickCount] === cardSequence[clickCount]) {
    event.target.classList.add('cyan');
    setTimeout(function() {
      event.target.classList.remove('cyan');
    }, 500);
    clickCount++;
  } else {
    removeCardClicks();
    for (let i = 0; i < cards.length; i++) {
      cards[i].style.backgroundColor = 'crimson';
    }
    failResult();
  }
  // It's a little weird that you prevent this from happening on failure only by not incrementing the clickCount. I'd prefer that you structure your code more like:
  // if (lose)
  //   do the losing thing
  // else if (at end of sequence)
  //   do the end of sequence thing
  // else
  //   continue waiting for the next clicks in the sequence
  if (clickCount === cardSequence.length) {
    roundCount++;
    removeCardClicks();
    setTimeout(function() {
      for (let i = 0; i < cards.length; i++) {
        cards[i].classList.remove('darkgoldenrod');
        cards[i].classList.add('cyan');
      }
    }, 500);
    setTimeout(function() {
      successResult();
    }, 100);
  }
}

/******************************************/
/* Data Related To Scoring & localStorage */
/******************************************/

// Declare variable to tally current round.
let roundCount = 0;

// Declare function to continue on round success.
function successResult() {
  var passScore = document.getElementById('pass-score');
  var runningScore = document.getElementById('running-score');
  passScore.textContent = roundCount;
  runningScore.textContent = roundCount;
  document.getElementById('game-pass').classList.toggle('hidden');
  cardSequence.push(Math.floor(Math.random() * colorCards.length));
  clickCount = 0;
  clickedCards = [];
}

// Declare function to update score upon failure.
function failResult() {
  var failScore = document.getElementById('fail-score');
  failScore.textContent = roundCount;
  document.getElementById('game-fail').classList.toggle('hidden');
  // eslint-disable-next-line no-undef
  for (let i = 0; i < allUsers.length; i++) {
    // eslint-disable-next-line no-undef
    if (allUsers[i].loggedIn === true) {
      // eslint-disable-next-line no-undef
      let currentUser = allUsers[i];
      currentUser.allScores.push(roundCount);
    }
  }
  // eslint-disable-next-line no-undef
  localStorage.setItem('users', JSON.stringify(allUsers));
  clickCount = 0;
  clickedCards = [];
}

// Declare function to play again on failure.
function playAgain() {
  if (localStorage.getItem('reload')) {
    toggleGame();
    localStorage.removeItem('reload');
  }
}

/***********************************************/
/* Functions & Data Related To Event Listeners */
/***********************************************/

// This is a pretty smooth way of doing the right thing on reload. Nice.
// Declare event listener on page load.
window.addEventListener('load', playAgain);

// Declare event listener for the game / instructions button.
document.getElementById('game-btn').addEventListener('click', toggleGame);

// Declare event listener for the START button to begin the game.
// All of these .getElementById calls take a bit of time. For the elements you're using repeatedly,
// it's more efficient to create a variable to hold the element. For example...

var gameStartElement = document.getElementById('game-start');
gameStartElement.addEventListener('click', function() {
  initSequence();
  gameStartElement.classList.add('hidden');
  document.getElementById('card-container').style.paddingTop = '5.6rem';
});

// Declare event listener for the continue button.
document.getElementById('continue-game').addEventListener('click', function() {
  document.getElementById('game-pass').classList.toggle('hidden');
  performSequence();
});

// Declare event listener for the 'Play Again' button.
document.getElementById('play-again').addEventListener('click', function() {
  localStorage.setItem('reload', 'true');
  location.reload();
});

// Declare functions for Card event handlers.
function cursorMouse(event) {
  // You don't need to set this cursor style only onMouseOver... You could set this as the cursor style on game start, and set it to default on game end.
  event.target.style.cursor = 'pointer';
  event.target.classList.add('darkgoldenrod');
}

function blueMouse(event) {
  event.target.classList.remove('darkgoldenrod');
}

function clickMouse(event) {
  clickCompare(event);
}

// Add event listeners to each Card element.
function addCardClicks() {
  // If you're adding both cursorMouse and yellowMouse for the same events,
  // you can consolidate them into a single function.
  cards.forEach(function(card) {
    card.addEventListener('mouseenter', cursorMouse);
  });
  cards.forEach(function(card) {
    card.addEventListener('mouseleave', blueMouse);
  });
  cards.forEach(function(card) {
    card.addEventListener('click', clickMouse);
  });
}

// Remove event listeners from each Card element.
function removeCardClicks() {
  cards.forEach(function(card) {
    card.removeEventListener('mouseenter', cursorMouse);
  });
  // You shouldn't need to explicitly set the default
  cards.forEach(function(card) {
    card.removeEventListener('mouseleave', blueMouse);
  });
  cards.forEach(function(card) {
    card.removeEventListener('click', clickMouse);
  });
}
