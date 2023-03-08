const CARDS_DISPLAY_ELEMENT = document.querySelector(".cards-display");
const DRAW_PILE = {
  element: document.querySelector(".draw-pile"),
  countElement: document.querySelector(".draw-pile > .counter"),
  cards: []
}
const DISCARD_PILE = {
  element: document.querySelector(".discard-pile"),
  countElement: document.querySelector(".discard-pile > .counter"),
  cards: []
}
const HAND = {
  element: document.querySelector(".hand"),
  containerElement: document.querySelector(".hand > .cards-container"),
  cards: []
}


// Create the card element to be reproduced
const CARD_ELEMENT = document.createElement("div");
CARD_ELEMENT.classList.add("card-element");


// Pile functions
const reset = () => {
  DRAW_PILE.cards = [];
  DISCARD_PILE.cards = [];
  HAND.cards = [];
}

const makeCardElement = cardText => {
  const newCard = CARD_ELEMENT.cloneNode(true);
  newCard.innerText = cardText;
  newCard.addEventListener("click", ev => {
    discardCard(newCard);
  });
  return newCard;
}

const addCardToPile = (card, pile) => {
  pile.cards.push(card);
  updatePileCount(pile);
}

const removeCardFromPile = (card, pile) => {
  pile.cards = pile.cards.filter(currCard => currCard != card);
  updatePileCount(pile);
}

const updatePileCount = pile => {
  pile.countElement.innerText = pile.cards.length;
}

// Hand functions
const drawCard = () => {
  if(DRAW_PILE.cards.length === 0) return;

  const card = DRAW_PILE.cards[0];
  removeCardFromPile(card, DRAW_PILE);
  HAND.cards.push(card);
  HAND.element.replaceChildren(...HAND.cards);

  if(DRAW_PILE.cards.length === 0) shuffleDiscardPileIntoDrawPile();
}

const discardCard = card => {
  HAND.cards = HAND.cards.filter(currCard => currCard != card);
  HAND.element.replaceChildren(...HAND.cards);
  addCardToPile(card, DISCARD_PILE);
  if (HAND.cards.length === 0 && DRAW_PILE.cards.length === 0) shuffleDiscardPileIntoDrawPile();
}

const shuffleDiscardPileIntoDrawPile = () => {
  if (DISCARD_PILE.cards.length === 0) return;

  shuffleArray(DISCARD_PILE.cards);
  DRAW_PILE.cards = DRAW_PILE.cards.concat(DISCARD_PILE.cards);
  DISCARD_PILE.cards = [];
  updatePileCount(DRAW_PILE);
  updatePileCount(DISCARD_PILE);
}

const START_DECK_BUTTON = document.querySelector(".start-deck");
const CARDS_TEXT_ELEMENT = document.querySelector(".cards-input > textarea")

// Bootstrap the elements
START_DECK_BUTTON.addEventListener("click", ev => {
  start();
});

const start = () => {
  reset();
  const text = CARDS_TEXT_ELEMENT.value;
  const cards = text.split(/\n/)
    .filter(cardText => cardText.length > 0)
    .map(cardText => makeCardElement(cardText));
  cards.forEach(card => addCardToPile(card, DRAW_PILE));
  shuffleArray(DRAW_PILE.cards);
  CARDS_DISPLAY_ELEMENT.style.visibility = "visible";
}

DRAW_PILE.element.addEventListener("click", ev => {
  drawCard();
});

DISCARD_PILE.element.addEventListener("click", ev => {
  shuffleDiscardPileIntoDrawPile();
});


// Utils
const shuffleArray = array => {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

CARDS_DISPLAY_ELEMENT.style.visibility = "hidden";
