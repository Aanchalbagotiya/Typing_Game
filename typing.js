const words = 'in one good real one not school set they state high life consider on and not come what also for set point can want as while with of order child about school thing never hold find order each too between program work end you home place around while place problem end begin interest while public or where see time those increase interest be give end think seem small as both another a child same eye you between way do who into again good fact than under very head become real possible some write know however late each that with because that place nation only for each change form consider we would interest with world so order or run more open that large write turn never over open each over change still old take hold need give by consider line only leave while what set up number part form want against great problem can because head so first this here would course become help year first end want both fact public long word down also long for without new turn against the because write seem line interest call not if line thing what work people way may old consider leave hold want life between most place may if go who need fact such program where which end off child down change to from people high during people find to however into small new general it do that could old for last get another hand much eye great no work and with but good there last think can around use like number never since world need what we around part show new come seem while some and since still small these you general which seem will place come order form how about just also they with state late use both early too lead general seem there point take general seem few out like might under if ask while such interest feel word right again how about system such between late want fact up problem stand new say move a lead small however large public out by eye here over so be way use like say people work for since interest so face order school good not most run problem group run she late other problem real form what just high no man do under would to each too end point give number child through so this large see get form also all those course to work during about he plan still so like down he look down where course at who plan way so since come against he all who at world because while so few last these mean take house who old way large no first too now off would in this course present order home public school back own little about he develop of do over help day house stand present another by few come that down last or use say take would each even govern play around back under some line think she even when from do real problem between long as there school do as mean to all on other good may from might call world thing life turn of he look last problem after get show want need thing old other during be again develop come from consider the now number say life interest to system only group world same state school one problem between for turn run at very against eye must go both still all a as so after play eye little be those should out after which these both much house become both school this he real and may mean time by real number other as feel at end ask plan come turn by all head increase he present increase use stand after see order lead than system here ask in of look point little too without each for both but right we come world much own set we right off long those stand go both but under now must real general then before with much those at no of we only back these person plan from run new as own take early just increase only look open follow get that on system the mean plan man over it possible if most late line would first without real hand say turn point small set at in system however to be home show new again come under because about show face child know person large program how over could thing from out world while nation stand part run have look what many system order some one program you great could write day do he any also where child late face eye run still again on by as call high the must by late little mean never another seem to leave because for day against public long number word about after much need open change also'.split(' ');
const wordsCount = words.length;
const gameTime = 30 * 1000;
window.timer = null;
window.gameStart = null;
window.pauseTime = 0;

function addClass(el,name) {
  el.className += ' '+name;
}
function removeClass(el,name) {
  el.className = el.className.replace(name,'');
}

function randomWord() {
  const randomIndex = Math.ceil(Math.random() * wordsCount);
  return words[randomIndex - 1];
}

function formatWord(word) {
  return `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;
}

// for the new GAME  ----------------------------------------------------------------------------------------------- 
function newGame() {
  document.getElementById('words').innerHTML = '';
  for (let i = 0; i < 200; i++) {
    document.getElementById('words').innerHTML += formatWord(randomWord());
  }
  addClass(document.querySelector('.word'), 'current');
  addClass(document.querySelector('.letter'), 'current');
  document.getElementById('info').innerHTML = (gameTime / 1000) + '';
  window.timer = null;
}

// WPM function  -----------------------------------------------------------------------------------------------
function getWpm() {
  const words = [...document.querySelectorAll('.word')];
  const lastTypedWord = document.querySelector('.word.current');
  const lastTypedWordIndex = words.indexOf(lastTypedWord) + 1;
  const typedWords = words.slice(0, lastTypedWordIndex);
  const correctWords = typedWords.filter(word => {
    const letters = [...word.children];
    const incorrectLetters = letters.filter(letter => letter.className.includes('incorrect'));
    const correctLetters = letters.filter(letter => letter.className.includes('correct'));
    return incorrectLetters.length === 0 && correctLetters.length === letters.length;
  });
  return correctWords.length / gameTime * 60000;
}
// GAMEOver function  -----------------------------------------------------------------------------------------------
function gameOver() {
  clearInterval(window.timer);
  addClass(document.getElementById('game'), 'over');

  const wpm = getWpm().toFixed(2);
  const accuracy = getAccuracy().toFixed(2);

  // Get previous session data
  const lastWpm = localStorage.getItem('lastWpm');
  const lastAccuracy = localStorage.getItem('lastAccuracy');

  // Shift the previous session to the "second last" session
  localStorage.setItem('secondLastWpm', lastWpm || 'N/A');
  localStorage.setItem('secondLastAccuracy', lastAccuracy || 'N/A');

  // Store the current session as the last session
  localStorage.setItem('lastWpm', wpm);
  localStorage.setItem('lastAccuracy', accuracy);

  document.getElementById('info').innerHTML = `WPM: ${wpm} <span class="accuracy">Accuracy: ${accuracy}%</span>`;
}

// accuracy function  -----------------------------------------------------------------------------------------------
function getAccuracy() {
  const words = [...document.querySelectorAll('.word')];
  const typedWords = words.filter(word => {
      const letters = [...word.children];
      const typedLetters = letters.filter(letter => letter.className.includes('correct') || letter.className.includes('incorrect'));
      return typedLetters.length > 0;
  });

  const totalTypedLetters = typedWords.reduce((acc, word) => acc + [...word.children].length, 0);
  const correctLetters = [...document.querySelectorAll('.letter.correct')].length;

  return (correctLetters / totalTypedLetters) * 100;
}

// TYPING paragraph  -----------------------------------------------------------------------------------------------
document.getElementById('game').addEventListener('keyup', ev => {
  const key = ev.key;
  const currentWord = document.querySelector('.word.current');
  const currentLetter = document.querySelector('.letter.current');
  const expected = currentLetter?.innerHTML || ' ';
  const isLetter = key.length === 1 && key !== ' ';
  const isSpace = key === ' ';
  const isBackspace = key === 'Backspace';
  const isFirstLetter = currentLetter === currentWord.firstChild;

  if (document.querySelector('#game.over')) {
    return;
  }

  console.log({key,expected});

  if (!window.timer && isLetter) {
    window.timer = setInterval(() => {
      if (!window.gameStart) {
        window.gameStart = (new Date()).getTime();
      }
      const currentTime = (new Date()).getTime();
      const msPassed = currentTime - window.gameStart;
      const sPassed = Math.round(msPassed / 1000);
      const sLeft = Math.round((gameTime / 1000) - sPassed);
      if (sLeft <= 0) {
        gameOver();
        return;
      }
      document.getElementById('info').innerHTML = sLeft + '';
    }, 1000);
  }

  if (isLetter) {
    if (currentLetter) {
      addClass(currentLetter, key === expected ? 'correct' : 'incorrect');
      removeClass(currentLetter, 'current');
      if (currentLetter.nextSibling) {
        addClass(currentLetter.nextSibling, 'current');
      }
    } else {
      const incorrectLetter = document.createElement('span');
      incorrectLetter.innerHTML = key;
      incorrectLetter.className = 'letter incorrect extra';
      currentWord.appendChild(incorrectLetter);
    }
  }

  if (isSpace) {
    if (expected !== ' ') {
      const lettersToInvalidate = [...document.querySelectorAll('.word.current .letter:not(.correct)')];
      lettersToInvalidate.forEach(letter => {
        addClass(letter, 'incorrect');
      });
    }
    removeClass(currentWord, 'current');
    addClass(currentWord.nextSibling, 'current');
    if (currentLetter) {
      removeClass(currentLetter, 'current');
    }
    addClass(currentWord.nextSibling.firstChild, 'current');
  }

  if (isBackspace) {
    if (currentLetter && isFirstLetter) {
      // make prev word current, last letter current
      removeClass(currentWord, 'current');
      addClass(currentWord.previousSibling, 'current');
      removeClass(currentLetter, 'current');
      addClass(currentWord.previousSibling.lastChild, 'current');
      removeClass(currentWord.previousSibling.lastChild, 'incorrect');
      removeClass(currentWord.previousSibling.lastChild, 'correct');
    }
    if (currentLetter && !isFirstLetter) {
      // move back one letter, invalidate letter
      removeClass(currentLetter, 'current');
      addClass(currentLetter.previousSibling, 'current');
      removeClass(currentLetter.previousSibling, 'incorrect');
      removeClass(currentLetter.previousSibling, 'correct');
    }
    if (!currentLetter) {
      addClass(currentWord.lastChild, 'current');
      removeClass(currentWord.lastChild, 'incorrect');
      removeClass(currentWord.lastChild, 'correct');
    }
  }

  // move lines / words
  const wordTop = currentWord.getBoundingClientRect().top;
  const gameBox = document.getElementById('game').getBoundingClientRect().top;
  if (wordTop > gameBox + 70) { // 70 is an offset to control scrolling sensitivity
      document.getElementById('game').scrollBy(0, wordTop - gameBox - 70);
  }
  

  // move cursor
  const nextLetter = document.querySelector('.letter.current');
  const nextWord = document.querySelector('.word.current');
  const cursor = document.getElementById('cursor');
  cursor.style.top = (nextLetter || nextWord).getBoundingClientRect().top + 2 + 'px';
  cursor.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px';
});

// difficulty level for words-----------------------------------------------------------------------------------------------
const easyWords = 'cat dog sun fun run hop bat red blue green yellow jump rural urban'.split(' ');
const mediumWords = 'train house table river plane bridge laptop monitor keyboard chair lamp colonel'.split(' ');
const hardWords = 'transformation hypothetical acknowledgment constitution unprecedented nonplussed phenomenon onomatopoeia'.split(' ');

function randomWord() {
  const difficulty = document.querySelector('#difficulty-options button.selected')?.getAttribute('data-difficulty') || 'easy';
  let wordList = [];

  switch (difficulty) {
      case 'easy':
          wordList = easyWords;
          break;
      case 'medium':
          wordList = mediumWords;
          break;
      case 'hard':
          wordList = hardWords;
          break;
  }

  const randomIndex = Math.floor(Math.random() * wordList.length);
  return wordList[randomIndex];
}

// -----------------------------------------------------------------------------------------------------------------------------

 
// difficulty level-----------------------------------------------------------------------------------------------------------------------------
document.getElementById('toggleDifficultyBtn').addEventListener('click', () => {
  const options = document.getElementById('difficulty-options');
  options.style.display = options.style.display === 'block' ? 'none' : 'block';
});

document.querySelectorAll('#difficulty-options button').forEach(option => {
  option.addEventListener('click', () => {
      const difficulty = option.getAttribute('data-difficulty');
      alert(`Selected difficulty: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`);
      document.getElementById('difficulty-options').style.display = 'none';
  });
});
document.querySelectorAll('#difficulty-options button').forEach(option => {
  option.addEventListener('click', () => {
      // Remove 'selected' class from all buttons
      document.querySelectorAll('#difficulty-options button').forEach(btn => btn.classList.remove('selected'));

      // Add 'selected' class to the clicked button
      option.classList.add('selected');

      const difficulty = option.getAttribute('data-difficulty');
      document.getElementById('toggleDifficultyBtn').textContent = `Difficulty: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`;
      
      // Hide the options
      document.getElementById('difficulty-options').style.display = 'none';
      
      newGame();
  });
});
// -----------------------------------------------------------------------------------------------------------------------------

document.getElementById('newGameBtn').addEventListener('click', () => {
  location.reload();
  document.getElementById('game').focus(); 
});

newGame();

