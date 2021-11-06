// Setup
const Application = PIXI.Application;
const app = new Application({
    width: 500,
    height: 500,
    transparent: false,
    antialias: true
});

app.renderer.backgroundColor = 0x18020C;
app.renderer.resize(window.innerWidth, window.innerHeight);
app.renderer.view.style.position = 'absolute';

document.body.appendChild(app.view);

const Graphics = PIXI.Graphics;

// Colors
const colors = [ '0x634B66', '0x9590A8', '0xBBCBCB', '0xE5FFDE' ]; 

// Create card array and first card
const cardWidth = 300;
const cardHeight = 500;
const cards = []
cards[0] = newCard();

function newCard(){
    let cardData = {
        value: Math.ceil(Math.random() * 10),
        color: colors[Math.floor(Math.random() * colors.length)]
    }
    let container = new PIXI.Container();
    // Rectangle
    container.addChild(MakeRect(cardData.color));
    // Value text
    texty = new PIXI.Text(cardData.value, GetStyle());
    container.addChild(texty);
    texty.position.set(cardWidth / 2, cardHeight / 3);

    app.stage.addChild(container);

    return {
        cardData: cardData, 
        container: container
    };
}


// Read input
canGuess = true;
const higher = 'higher';
const lower = 'lower';

// Arrow keys
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp') {
        Guess(higher);
    }
    if (e.key === 'ArrowDown') {
        Guess(lower);
    }
});

// On screen buttons
const buttWidth = 250;
const buttHeight = 200;
const buttPosX = app.view.width - (app.view.width / 3);

const buttHigher = makeButton('Higher');
buttHigher.position.set(buttPosX, app.view.height / 3);
buttHigher.on('pointerdown', () => {
    Guess(higher);
});

const buttLower = makeButton('Lower');
buttLower.position.set(buttPosX, app.view.height - (app.view.height / 3));
buttLower.on('pointerdown', () => {
    Guess(lower);
});


function Guess(guess) {
    if (!canGuess) return;
    canGuess = false;
    T = 0;
    console.log(`Guessed next card would be ${guess}`);
    let currentCardVal = cards[cards.length -1].cardData.value;
    let nextCard = newCard();
    let nextCardVal = nextCard.cardData.value;
    cards.push(nextCard);

    if (guess === higher) {
        if (currentCardVal < nextCardVal) {
            console.log('Guessed correct!');
            return;
        } 
        if (currentCardVal > nextCardVal) {
            console.log('Doh! Not right');
            return;
        }
    }
    if (guess === lower) {
        if (currentCardVal > nextCardVal) {
            console.log('Guessed correct!');
            return;
        } 
        if (currentCardVal < nextCardVal) {
            console.log('Doh! Not right');
            return;
        }
    }
    console.log('Uh oh... Errr....');
}


// Ticker. used for animation
const offScreenX = -cardWidth;
const onScreenX = (app.view.width / 2) - cardWidth / 2;
const offScreenY = (app.view.height / 3) - cardHeight / 2;
const onScreenyY = (app.view.height / 2) - cardHeight / 2;
const initialRotation = - Math.PI / 2;
let T = 0;

app.ticker.add(delta => loop(delta));
function loop(delta) {
    T += (delta/60) * 2; // delta/60 is seconds, is easy to read this way
    let currentContainer = cards[cards.length -1].container
    if (T < 1){
        currentContainer.position.x = lerp(offScreenX, onScreenX, easeOutSine(easeOutSine(T)));     
        currentContainer.position.y = lerp(offScreenY, onScreenyY, easeOutSine(easeOutSine(T)));  
        currentContainer.rotation = lerp(initialRotation, 0, easeOutSine(easeOutSine(T)));   
    } else {
        currentContainer.position.x = onScreenX;     
        currentContainer.position.y = onScreenyY;
        currentContainer.rotation = 0;
        canGuess = true;
    }
}

function makeButton(text) {
    const butt = new PIXI.Container();
    const rect = new Graphics();
    rect.beginFill(0xAAA0BB)
    .drawRect(0, 0, buttWidth, buttHeight)
    .endFill();

    texty = new PIXI.Text(text, GetStyle());
    butt.addChild(rect);
    butt.addChild(texty);
    app.stage.addChild(butt);
    butt.interactive = true;
    butt.buttonMode = true;

    return butt;
}

function easeOutSine(T) {
    return Math.sin((T * Math.PI) / 2);
}

function lerp(a, b, T) {
    return clamp(a + ((b - a) * T), a, b); 
}

function clamp(x, a, b) {
    return x < a ? a : x > b ? b : x;
}

function MakeRect(color) {
    const rectangle = new Graphics();
    rectangle.beginFill(color)
        .drawRect(0, 0, cardWidth, cardHeight)
        .endFill();
    return rectangle;
}

function GetStyle(){
    const style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fonstSize: 48,
        fill: '0xffffff',
        stroke: '0x000000',
        strokeThickness: 2,
    })
    return style;
}

/* Colors
0x18020C
0x634B66
0x9590A8
0xBBCBCB
0xE5FFDE
*/