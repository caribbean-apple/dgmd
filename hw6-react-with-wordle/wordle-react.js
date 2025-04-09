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

function letterComponent({char, colorClass}) {
  return React.createElement('span', {className: `letter ${colorClass}`}, char)
}

document.addEventListener('DOMContentLoaded', () => {
  // #previous-words
  //   -> .word-div
  //     -> .letter (span)
  //     -> .letter (span)
  //     -> .letter (span)
  //     -> .letter (span)
  //     -> .letter (span)
  //   -> .word-div
  //     -> .letter (span)
  //        ...

  let wordDivs = new Array(6)
  for (let i=0; i<wordDivs.length; i++) {
    let letters = new Array(5)
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
      
      letters[j] = React.createElement(
        letterComponent, 
        {char: thisLetter, colorClass: colorClass, key: j}, 
        null
      )
    }
    wordDivs[i] = React.createElement(
      'div',
      {className: 'word-div', key: i},
      letters
    )
  }
  // This is a container for the guess keys.
  // It must have a key as we will bundle it up with the keyboard.
  let wordDivsElement = React.createElement(
    'div', 
    {id: 'previous-words', key: 1}, 
    wordDivs
  )


  

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

      keys[j] = React.createElement(
        letterComponent,
        {char: key, colorClass: colorClass, key: j},
        null
      );
    }

    keyboardRows[i] = React.createElement(
      'div',
      {key: i},
      keys
    );
  }

  let keyboardElement = React.createElement(
    'div',
    {id: 'used-letters', key: 2},
    keyboardRows
  );

  
  let gameContainer = React.createElement(
    'div',
    {id: 'game-container'},
    [wordDivsElement, keyboardElement]
  );

  ReactDOM.render(
    gameContainer, 
    document.getElementById('myapp')
  );
});

