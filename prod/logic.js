
class Game {

  empty = Object.freeze('');
  images = {
    x: '<img class="image" src="./x.png" />',
    o: '<img class="image" src="./o.png" />'
  };

  board = [];
  tiles = null;

  human = { choice: null };
  computer = { choice: null };

  buttons = {
    x: null,
    o: null,
    restart: null
  };
  table = null;

  winners = [
    [ 0, 1, 2 ], [ 3, 4, 5 ], [ 6, 7, 8 ],
    [ 0, 3, 6 ], [ 1, 4, 7 ], [ 2, 5, 8 ],
    [ 0, 4, 8 ], [ 2, 4, 6 ]
  ];
  winnerWrapper = null;
  winner = null;

  constructor() {
    this.clearBoard();
    this.clearWinner();
  
    this.displayBoard();
    this.addEventListeners();
  }

  displayBoard = () => {
    this.tiles.forEach(tile => {
      const id = parseInt(tile.dataset.id, 10);
      tile.innerHTML = (this.board[id] === this.empty) ? '' : this.images[this.board[id]];
      // tile.innerText = this.board[id];
    });
  };

  clearBoard = () => {
    if (this.tiles === null) this.tiles = document.querySelectorAll('[data-id]');
    for (let id = 0, len = 9; id < len; id++) {
      this.board[id] = this.empty;
    }
  };

  clearWinner = () => {
    if (this.winnerWrapper === null) this.winnerWrapper = document.getElementById('winner-wrapper');
    if (this.winner === null) this.winner = document.getElementById('winner');
    this.winnerWrapper.classList.remove('display');
  };

  addEventListeners = () => {
    this.table = document.getElementById('gameTable');
    this.buttons.restart = document.getElementById('restart');
    this.buttons.x = document.getElementById('x');
    this.buttons.o = document.getElementById('o');
  
    this.table.addEventListener('click', this.handleTableClick);
    this.buttons.restart.addEventListener('click', this.handleRestart);
    this.buttons.x.addEventListener('click', this.handleButtonClick.bind(null, 'x'));
    this.buttons.o.addEventListener('click', this.handleButtonClick.bind(null, 'o'));
    this.winnerWrapper.addEventListener('click', this.handleWinnerWrapperClick);
  };

  handleButtonClick = (type) => {
    this.human.choice = type;
    this.computer.choice = (type === 'x') ? 'o' : 'x';

    if (type === 'x') {
      this.buttons.x.classList.add('player-choice');
      this.buttons.o.classList.remove('player-choice');
    } else {
      this.buttons.x.classList.remove('player-choice');
      this.buttons.o.classList.add('player-choice');
    }

    this.clearBoard();
    this.displayBoard();
  };

  handleTableClick = (event) => {
    const id = event.target.dataset.id;
    if (this.human.choice === null) return;
  
    if (this.board[id] === this.empty) {
      this.board[id] = this.human.choice;
  
      let emptySpaces = this.board.find(x => x === this.empty);
      if (emptySpaces !== undefined) {
        this.computerPlay();
      }
  
      this.displayBoard();
      const isWinner = this.checkAndHandleWinner('x');
      if (!isWinner) {
        this.checkForTie();
      }
    }
  };

  checkAndHandleWinner = (type) => {
    const wins = this.checkWinner(type);
    if (wins === true) {
      this.winner.innerText = type.toUpperCase();
      this.winnerWrapper.classList.add('display');
    }
    return wins;
  };

  checkForTie = () => {
    let tie = true;
    for (let id = 0, len = this.board.length; id < len; id++) {
      if (this.board[id] === this.empty) {
        tie = false;
        break;
      }
    }
    if (tie === true) {
      this.winner.innerText = 'TIE';
      this.winnerWrapper.classList.add('display');
    }
  };

  generatePosition = () => {
    let emptyIds = [];
    this.board.forEach((tile, id) => {
      if (tile === this.empty) emptyIds.push(id);
    });
    return emptyIds[Math.floor(Math.random() * emptyIds.length)];
  };

  computerPlay = () => {
    let id = this.generatePosition();
    this.board[id] = this.computer.choice;
  
    this.displayBoard();
    this.checkAndHandleWinner('o');
  };

  checkWinner = (tag) => {
    const combinations = this.winners.map((keys) => keys.map(key => this.board[key]));
    const winner = combinations.find(values => values.every(tile => tile === tag));
    return !!winner;
  };

  handleRestart = () => {
    this.clearBoard();
    this.displayBoard();
    this.clearWinner();
  };

  handleWinnerWrapperClick = () => {
    this.handleRestart();
  };

}

const game = new Game();
