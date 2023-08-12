let openedCards = [];
let arr = [];
let time = 240;
let sec;
let openedTrue = [];

let game_field = document.getElementById('game-field');
let input = document.getElementById('input');
let btn = document.getElementById('btn');
let timer = document.getElementById('timer');

let game_is_running = true;

btn.textContent = 'Начать игру';
timer.textContent = time + 'sec';
input.type = 'number';
input.setAttribute('step', 2);
input.setAttribute('min', 2);
input.setAttribute('max', 8);

input.style.cssText = 'width:11%; border: 3px solid #000; border-radius: 10px; font-size: 40px;';
btn.style.cssText = 'font-size: 35px'
timer.style.cssText = 'width:15%; font-size: 45px; margin-left: -30px';

btn.addEventListener('click', function () {

  clearGame();
  arr = [];
  openedTrue = [];
  let count = input.value;

  if (2 < count < 8 && count % 2 || count == '') {
    count = 4;
    input.value = count;
  }

  let nums = (count * count) / 2;

  createNumbersArray(nums);
  shuffle(arr);
  createGame(count, arr);
  game_is_running = true;

  sec = setInterval(onTimer, 1000);

  function onTimer() {
    time--;
    timer.textContent = time + 'sec';
    if (time <= 0) {
      clearInterval(sec);
      game_is_running = false;
    }
  }

  btn.textContent = 'Сыграть ещё раз';

});

// Этап 1. Создайте функцию, генерирующую массив парных чисел. Пример массива, который должна возвратить функция: [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8].count - количество пар.

function createNumbersArray(nums) {

  for (; nums >= 1; nums--) {
    arr.push(nums);
    arr.push(nums);
  }

  return arr;
}

// Этап 2. Создайте функцию перемешивания массива.Функция принимает в аргументе исходный массив и возвращает перемешанный массив. arr - массив чисел

function shuffle(arr) {
  let j, temp;
  for (let i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
  return arr;
}

// Этап 3. Используйте две созданные функции для создания массива перемешанными номерами. На основе этого массива вы можете создать DOM-элементы карточек. У каждой карточки будет свой номер из массива произвольных чисел. Вы также можете создать для этого специальную функцию. count - количество пар.

function createGame(count, arr) {
  let arr_index = 0;

  for (let i = 0; i < count; i++) {
    let row = document.createElement('div');
    game_field.appendChild(row);
    row.classList.add('row', 'g-2');

    for (let j = 0; j < count; j++, arr_index++) {
      let card = new Card(row, arr[arr_index], function flip() {
        if (!game_is_running) {
          return;
        }
        //проверяем надо ли закрыть неугаданные
        if (openedCards.length == 2) {
          for (let o of openedCards) {
            o.open = false;
          }
          openedCards = [];
        }

        openedCards.push(this);
        card.open = true;

        // условие на проверку угаданности
        if (openedCards.length == 2) {
          if (openedCards[0].img.src == openedCards[1].img.src) {
            openedCards[0].success = true;
            openedCards[1].success = true;
            openedCards = [];
          }
        }

        if (openedTrue.length == count * count) {
          clearInterval(sec);
          timer.textContent = time + 'sec';
        }
      })
    }
  }
}

function clearGame() {
  document.getElementById('game-field').innerHTML = '';
  time = 240;
  clearInterval(sec);
}

class Card {
  constructor(container, cardNumber, flip) {
    this.container = container;
    this.cardNumber = cardNumber;
    this.flip = flip;
    this.createElement(container);
  }

  createElement() {
    let card = document.createElement('div');
    this.container.appendChild(card);
    card.classList.add('col', 'gy-3');
    this.img = document.createElement('img');
    this.imgBack = document.createElement('img');
    this.img.classList.add('rounded', 'img-fluid', 'd-none');
    this.imgBack.classList.add('rounded', 'img-fluid', 'imgBack');
    this.img.src = 'bg/' + this.cardNumber + '.jpg';
    this.imgBack.src = 'bg/0.jpg';
    this.imgBack.style.cssText = 'cursor: pointer;'
    card.appendChild(this.img);
    card.appendChild(this.imgBack);

    this.imgBack.addEventListener('click', () => {
      this.flip();
    });
  }

  set open(value) {
    if (value) {
      this.imgBack.classList.add('d-none');
      this.img.classList.remove('d-none');
    }
    else {
      this.imgBack.classList.remove('d-none');
      this.img.classList.add('d-none');
    }
  }
  get open() { }
  set success(value) {
    if(value){
      openedTrue.push(this);
    }
  }
  get success() { }
}
