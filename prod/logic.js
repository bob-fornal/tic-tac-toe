
const game = {
  empty: '',

  board: [],
  tiles: null,
  
  human: null,
  computer: null,

  xButton: null,
  oButton: null,
  table: null,
  restart: null,

  winners: [
    [ 0, 1, 2 ], [ 3, 4, 5 ], [ 6, 7, 8 ],
    [ 0, 3, 6 ], [ 1, 4, 7 ], [ 2, 5, 8 ],
    [ 0, 4, 8 ], [ 2, 4, 6 ]
  ],
  winnerWrapper: null,
  winner: null
};

game.clearBoard = () => {
  if (game.tiles === null) game.tiles = document.querySelectorAll('[data-id]');
  for (let id = 0, len = 9; id < len; id++) {
    game.board[id] = game.empty;
  }
};

game.clearWinner = () => {
  if (game.winnerWrapper === null) game.winnerWrapper = document.getElementById('winner-wrapper');
  if (game.winner === null) game.winner = document.getElementById('winner');
  game.winnerWrapper.classList.remove('display');
};

game.displayBoard = () => {
  game.tiles.forEach(tile => {
    const id = parseInt(tile.dataset.id, 10);
    tile.innerText = game.board[id];
  });
};

game.init = () => {
  game.clearBoard();
  game.clearWinner();
  game.setupPlayers();

  game.displayBoard();
  game.addEventListeners();
};

game.Players = (name, choice = null) => ({ name, choice });

game.setupPlayers = () => {
  game.human = game.Players('YOU', null);
  game.computer = game.Players('Computer', null);
};

game.addEventListeners = () => {
  game.table = document.getElementById('gameTable');
  game.restart = document.getElementById('restart');
  game.xButton = document.getElementById('x');
  game.oButton = document.getElementById('o');

  game.table.addEventListener('click', game.handleTableClick);
  game.restart.addEventListener('click', game.handleRestart);
  game.xButton.addEventListener('click', game.handleButtonClick.bind(null, 'x'));
  game.oButton.addEventListener('click', game.handleButtonClick.bind(null, 'o'));
  game.winnerWrapper.addEventListener('click', game.handleWinnerWrapperClick);
};

game.handleButtonClick = (type) => {
  game.human.choice = type;
  game.computer.choice = (type === 'x') ? 'o' : 'x';
  if (type === 'x') {
    game.xButton.classList.add('player-choice');
    game.oButton.classList.remove('player-choice');
  } else {
    game.xButton.classList.remove('player-choice');
    game.oButton.classList.add('player-choice');
  }
  game.clearBoard();
  game.displayBoard();
};

game.handleTableClick = (event) => {
  const id = event.target.dataset.id;
  if (game.human.choice === null) return;

  if (game.board[id] === game.empty) {
    game.board[id] = game.human.choice;

    let emptySpaces = game.board.find(x => x === game.empty);
    if (emptySpaces !== undefined) {
      game.computerPlay();
    }

    game.displayBoard();
    const xWins = game.checkWinner('x');
    if (xWins === true) {
      game.winner.innerText = 'X';
      game.winnerWrapper.classList.add('display');
    }
  }
};

game.generatePosition = () => {
  let emptyIds = [];
  game.board.forEach((tile, id) => {
    if (tile === game.empty) emptyIds.push(id);
  });
  return emptyIds[Math.floor(Math.random() * emptyIds.length)];
};

game.computerPlay = () => {
  let id = game.generatePosition();
  game.board[id] = game.computer.choice;

  game.displayBoard();
  const xWins = game.checkWinner('o');
  if (xWins === true) {
    game.winner.innerText = 'O';
    game.winnerWrapper.classList.add('display');
  }
};

game.checkWinner = (tag) => {
  const combinations = game.winners.map((keys) => keys.map(key => game.board[key]));
  const winner = combinations.find(values => values.every(tile => tile === tag));
  return !!winner;
};

game.handleRestart = () => {
  game.clearBoard();
  game.displayBoard();
  game.clearWinner();
};

game.handleWinnerWrapperClick = () => {
  game.handleRestart();
};
