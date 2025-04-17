const MIGHT = ['m', 'i', 'g', 'h', 't'];
const FLOOD = ['f', 'l', 'o', 'o', 'd'];
const STRAY = ['s', 't', 'r', 'a', 'y'];
const BOARD_CONTENTS = [MIGHT, FLOOD, STRAY, [], [], []];
const ANSWER = ['m', 'o', 'o', 'd', 'y'];

const KEYBOARD = [
  'qwertyuiop'.split(''),
  'asdfghjkl'.split(''),
  'zxcvbnm'.split('')
];

console.log("Script loaded");

function LetterComponent({char, colorClass}) {
  return <span className={`letter ${colorClass}`}>{char}</span>
}

// For some reason, when I include this event listener, nothing works.
// So instead, I just added the script to the end of <body>.
// This only happened when adding in Babel. I decided to just
// keep it this way, as we will be using Babel differently later
// when we use create react app anyway, so no need to debug this 
// way of doing things.
// document.addEventListener('DOMContentLoaded', () => {

// Create an element for each letter from the letter component.
// Place it in a div corresponding to its row.
let wordDivs = new Array(6);
for (let i=0; i<wordDivs.length; i++) {
  let letters = new Array(5);
  for (let j=0; j<letters.length; j++) {
    const thisLetter = BOARD_CONTENTS[i].length > 0 ? BOARD_CONTENTS[i][j] : "";
    let colorClass;

    if (thisLetter === "") {
      colorClass = 'black-background';
    } else if (thisLetter === ANSWER[j]) {
      colorClass = 'green-background';
    } else if (ANSWER.includes(thisLetter)) {
      colorClass = 'yellow-background';
    } else {
      colorClass = 'gray-background';
    }
    
    letters[j] = <LetterComponent char={thisLetter} colorClass={colorClass} key={j} />
  }
  wordDivs[i] = <div className='word-div' key={i}>{letters}</div>
}

// This is a container for the guess keys.
// It must have a key as we will bundle it up with the keyboard.
let wordDivsElement = <div id='previous-words' key={1}>{wordDivs}</div>

let keyboardRows = new Array(KEYBOARD.length);
for (let i = 0; i < KEYBOARD.length; i++) {
  let keys = new Array(KEYBOARD[i].length);
  for (let j = 0; j < KEYBOARD[i].length; j++) {
    let key = KEYBOARD[i][j];
    let colorClass = 'black-background';
    
    // Check if the letter is in any of the words so far
    for (let word of BOARD_CONTENTS) {
      if (word.includes(key)) {
        if (ANSWER.includes(key)) {
          if (word[ANSWER.indexOf(key)] === key) {
            colorClass = 'green-background';
          } else {
            colorClass = 'yellow-background';
          }
        }
        else {
          colorClass = 'gray-background';
        }
      }
    }

    keys[j] = <LetterComponent char={key} colorClass={colorClass} key={j} />
  }

  keyboardRows[i] = <div key={i}>{keys}</div>
}

let keyboardElement = <div id='used-letters' key={2}>{keyboardRows}</div>
let wordleGameContainer = <div className="wordle-game">{[wordDivsElement, keyboardElement]}</div>

// It turns out ReactDOM.render() is deprecated. 
// The best practice approach at present is this instead:
const root = ReactDOM.createRoot(document.getElementById('myapp'));
root.render(wordleGameContainer);
