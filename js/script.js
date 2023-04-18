let blackjackGame = {
    'you': { 'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0 },
    'dealer': { 'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0 },
    // cards name
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A'],
    // cards value
    'cardsMap': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'K': 10, 'Q': 10, 'A': [1, 11] },
    // wins, losses and draws value
    'wins': 0,
    'losses': 0,
    'draws': 0,
 
    'isStand': false,
    'turnsOver': false
};

const YOU = blackjackGame['you']
const DEALER = blackjackGame['dealer']

// sounds.....
// giving specific sounds to each thing like hit button, win, loss 
const hitSound = new Audio('sounds/swish.m4a');
const winSound = new Audio('sounds/cash.mp3');
const lossSound = new Audio('sounds/aww.mp3');
// I need draw sound too 

document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);
document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);
document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);

function blackjackHit() {
    // if stand button should not be clicked or activated then only time the hit button should work
    if (blackjackGame['isStand'] === false) {
        let card = randomCard();
        showCard(card, YOU);
        updateScore(card, YOU);
        showScore(YOU);
    }
}

function randomCard() {
    // math.floor gives us +ve integers & math.random gives us random number and multiplying with 13 it gives us the cards value which we given above
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackGame['cards'][randomIndex];
}

// showCard will show us the cards to both sides YOU & DEALER
function showCard(card, activePlayer) {
    if (activePlayer['score'] <= 21) {
        // activePlayer will make the code available to both div's YOU & DEALER which make it versetile and not restricting writing same code again for DEALER
        let cardImage = document.createElement('img');
        cardImage.src = `images/${card}.png`;  //string templating
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }
}

function blackjackDeal() {
    if (blackjackGame['turnsOver'] === true) {

        blackjackGame['isStand'] = false;

        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
// for loop will remove all the images at once in both the you and the dealer box
        for (i = 0; i < yourImages.length; i++) {
            yourImages[i].remove();
        }

        for (i = 0; i < dealerImages.length; i++) {
            dealerImages[i].remove();
        }

        // giving initial value
        YOU['score'] = 0;
        DEALER['score'] = 0;
        //  we pass the value of YOU & DEALER 0 because we haven't pass any cards yet
        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').textContent = 0;
        // color of the YOU & DEALER value's
        document.querySelector('#your-blackjack-result').style.color = '#ffffff';
        document.querySelector('#dealer-blackjack-result').style.color = '#ffffff';

        // for reseting the play button after playing it
        document.querySelector('#blackjack-result').textContent = "Let's play";
        document.querySelector('#blackjack-result').style.color = 'black';

        blackjackGame['turnsOver'] = true;
    }
}
// it will update the score of YOU & DEALER when we pass the cards and we also put A's value (1, 11)
function updateScore(card, activePlayer) {
    if (card === 'A') {
        //If adding 11 keeps me below 21, add 11. Otherwise, add 1 
        if (activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21) {
            activePlayer['score'] += blackjackGame['cardsMap'][card][1];
        } else {
            activePlayer['score'] += blackjackGame['cardsMap'][card][0];
        }
    } else {
        activePlayer['score'] += blackjackGame['cardsMap'][card];
    }
}

// show's the score in the box and it also BUST us when value become above 21
function showScore(activePlayer) {
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    } else {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

// sleep function make sure that we delay our cards timing which were coming together in a deal (bot) function so that it give us real feel
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// async make sure that our function be in sync with the bot function
async function dealerLogic() {
    blackjackGame['isStand'] = true;

    while (DEALER['score'] < 16 && blackjackGame['isStand'] === true) {
        let card = randomCard();
        showCard(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(800);
    }

    // it will make sure that the turn is over and we can click on stand button
    blackjackGame['turnsOver'] = true;
    let winner = computeWinner();
    showResult(winner);
}

// compute winner will return who just won
// update the wins, draws and losses count
function computeWinner() {
    let winner;

    if (YOU['score'] <= 21) {
        // condition: when your score is higher score than dealer or when dealer busts but you're 21 or under
        if (YOU['score'] > DEALER['score'] || (DEALER['score'] > 21)) {
            blackjackGame['wins']++;
            winner = YOU;
// condition: when your score is less than dealer
        } else if (YOU['score'] < DEALER['score']) {
            blackjackGame['losses']++;
            winner = DEALER;
// condition: whne your score dealer score both are same 
        } else if (YOU['score'] === DEALER['score']) {
            blackjackGame['draws']++;
        }

        // condition: when you busts but dealer doesn't 
    } else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
        blackjackGame['losses']++;
        winner = DEALER;

        // condition: when you AND the dealer busts
    } else if (YOU['score'] > 21 && DEALER['score'] > 21) {
        blackjackGame['draws']++;
    }

    return winner;
}

// result content (message & message color)
function showResult(winner) {
    let message, messageColor;

    if (blackjackGame['turnsOver'] === true) {

        if (winner === YOU) {
            document.querySelector('#wins').textContent = blackjackGame['wins'];
            message = 'You won!';
            messageColor = 'green';
            winSound.play();

        } else if (winner === DEALER) {
            document.querySelector('#losses').textContent = blackjackGame['losses'];
            message = 'You lost!';
            messageColor = 'red';
            lossSound.play();

        } else {
            document.querySelector('#draws').textContent = blackjackGame['draws'];
            message = 'Match drew!';
            messageColor = 'yellow';
        }

        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;
    }
}
