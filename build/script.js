import { WORDS } from "./words.js";

const NUM_OF_GUESSES = 6;
let guessingRemaining = NUM_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let correctGuessString = WORDS[Math.floor(Math.random() * WORDS.length)];
console.log(correctGuessString);

// Init Board
function initBoard(){
    let board = document.getElementById("game-board");
    for(let i = 0; i < NUM_OF_GUESSES; i++){
        let row = document.createElement("div");
        row.className = "letter-row";

        for(let j = 0; j < 5; j++){
            let box = document.createElement("div");
            box.className = "letter-box";
            row.appendChild(box);
        }
        board.appendChild(row);
    }
}

initBoard();

document.addEventListener("keyup",(e) => {
    if(guessingRemaining === 0){
        return;
    }
    let pressedKey = String(e.key);
    if(pressedKey === "Backspace" && nextLetter !=0){
        deleteLetter()
        return;
    }
    if(pressedKey === "Enter"){
        checkGuess();
        return;
    }
    let found = pressedKey.match(/[a-z]/gi);
    if(!found || found.length > 1){
        return;
    } else {
        insertLetter(pressedKey);
    }
})

//insert letter
function insertLetter(pressedKey){
    if (nextLetter === 5){
        return;
    }
    pressedKey = pressedKey.toLowerCase();

    let row = document.getElementsByClassName("letter-row")[6 - guessingRemaining];
    let box = row.children[nextLetter];
    box.textContent = pressedKey;
    box.classList.add("filled-box");
    currentGuess.push(pressedKey);
    nextLetter += 1
}

//delete letter
function deleteLetter(){
    let row = document.getElementsByClassName("letter-row")[6 - guessingRemaining];
    let box = row.children[nextLetter -1];
    box.textContent = "";
    box.classList.remove("filled-box");
    currentGuess.pop();
    nextLetter -=1;
}

//  check guess
function checkGuess(){
    let row = document.getElementsByClassName("letter-row")[6 - guessingRemaining];
    let guessString = "";
    let correctGuess = Array.from(correctGuessString);

    for(const val of currentGuess){
        guessString += val;
    }

    if(guessString.length != 5){
        toastr.error("Not enough letters!");
        return;
    }

    if(!WORDS.includes(guessString)){
        toastr.error("Word not in list");
        return;
    }

    for(let i = 0; i < 5; i++){
        let letterColour = "";
        let box = row.children[i];
        let letter = currentGuess[i];

        let letterPosition = correctGuess.indexOf(currentGuess[i]);
        //is letter in current guess?
        if(letterPosition === -1){
            letterColour = "grey";
        } else {
            //letter is in the word
            //if correctGuess index == currentGuess index  - correct position
            if(currentGuess[i] === correctGuess[i]){
                // shade green
                letterColour = "green";
            } else {
                letterColour = "yellow";
            }
            correctGuess[letterPosition] = "#";
        }

        let delay = 250 * i;
        setTimeout(() => {
            //shade box
            box.style.backgroundColor = letterColour;
            shadeKeyBoard(letter, letterColour);
        }, delay)
    }
    if(guessString === correctGuessString){
        toastr.success("You guess right!");
        guessingRemaining = 0;
        return;
    } else {
        guessingRemaining -= 1;
        currentGuess = [];
        nextLetter = 0;

        if(guessingRemaining === 0){
            toastr.error("You've run out of guesses, game over!");
            toastr.info(`The right word was: "${correctGuessString}"`);

        }
    }
}

function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor
            if (oldColor === 'green') {
                return
            } 

            if (oldColor === 'yellow' && color !== 'green') {
                return
            }

            elem.style.backgroundColor = color
            break
        }
    }
}

document.getElementById("keyboard").addEventListener("click",(e) =>{
    const target = e.target;
    if(!target.classList.contains("kb-button")){
        return;
    }
    let key = target.textContent;
    if(key === "Del"){
        key = "Backspace";
    }
    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}));
})