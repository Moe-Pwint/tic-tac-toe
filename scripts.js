/*
GameBoard
- create and update the game board UI
*/
function GameBoard() {
  if (!new.target) {
    throw Error("Use new keyword!");
  }
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];

    for (let j = 0; j < columns; j++) {
      board[i].push(new Cell());
    }
  }

  const getBoard = () => board;

  const dropToken = (row, column, player) => {
    let chosenCell = board[row - 1][column - 1];
    if (!chosenCell.getValue() == 0) {
      return;
    }
    chosenCell.addToken(player);
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    return boardWithCellValues;
  };

  return { getBoard, dropToken, printBoard };
}

/*
Cell
- give cells values and update who is occupied in each cell
*/
function Cell() {
  if (!new.target) {
    throw Error("Use new keyword!");
  }
  let value = 0;

  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  return { addToken, getValue };
}

/*
GameController (control the game's turns and decide if a player wins)
- decide the active player
- store the players and their token name
- save playRound function
*/
function GameController(playerOne, playerTwo) {
  if (!new.target) {
    throw Error("Use new keyword!");
  }

  const board = new GameBoard();
  const assign = assignNames();
  playerOne = assign.p1Name();
  playerTwo = assign.p2Name();
  const players = [
    {
      name: playerOne,
      token: "O",
    },
    {
      name: playerTwo,
      token: "X",
    },
  ];

  let currentPlayer = players[0];

  const switchPlayer = () => {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
  };

  const getCurrentPlayer = () => currentPlayer;

  const printNewRound = () => {
    board.printBoard();
    const currentTurn = document.querySelector("#playerTurn");
    currentTurn.textContent = "";
    const p = document.createElement("p");
    p.textContent = `${getCurrentPlayer().name}'s turn.`;
    currentTurn.appendChild(p);
  };

  const displayWinner = (playerName) => {
    const popup = document.querySelector("#popup");
    popup.parentElement.style.display = "flex";
    const p = document.createElement("p");
    p.setAttribute("id", "popupMsg");
    if (playerName == "") {
      p.textContent = `It's a tie!`;
      popup.appendChild(p);
    } else {
      p.textContent = `${playerName} wins!`;
      popup.appendChild(p);
    }
  };

  const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  printNewRound();
  const playRound = (r, c) => {
    const currentP = getCurrentPlayer().name;
    const currentT = getCurrentPlayer().token;
    // console.log(`Dropping ${currentP}'s token into row${r} column${c}.`);
    board.dropToken(r, c, currentT);
    let gameEnd = false;

    const checkWinner = () => {
      const currentBoard = board.printBoard().flat();
      console.log(currentBoard);

      if (currentBoard.every((cell) => !cell == "")) {
        displayWinner("");
        gameEnd = true;
        return;
      }

      for (let i = 0; i < 8; i++) {
        let currentCom = [];
        for (let j of winCombinations[i]) {
          currentCom.push(currentBoard[j]);
        }
        if (currentCom.every((e) => e == currentT)) {
          displayWinner(currentP);
          gameEnd = true;
          return;
        }
        gameEnd = false;
      }
    };

    checkWinner();
    if (gameEnd == false) {
      switchPlayer();
      printNewRound();
    }
  };

  return {
    playRound,
    getCurrentPlayer,
    switchPlayer,
    printNewRound,
  };
}

//ScreenControl listens to the buttons and update the screen UI.
function ScreenControl() {
  if (!new.target) {
    throw Error("Use new keyword!");
  }

  const game = new GameController();
  const buttons = document.querySelectorAll(".btn-cell");

  const clickHandlerBoard = () => {
    buttons.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        const r = event.target.dataset.row;
        const c = event.target.dataset.column;

        event.target.disabled = true;
        event.target.setAttribute("class", game.getCurrentPlayer().token);
        event.target.textContent = game.getCurrentPlayer().token;
        game.playRound(r, c);
      });
    });
  };
  return { clickHandlerBoard };
}

function startGame() {
  const restartStorage = localStorage.getItem("restart");
  if (restartStorage) {
    //assigning names to game boxes UI at bottom.
    const pOneName = document.querySelector("#pOneName");
    const pTwoName = document.querySelector("#pTwoName");
    const p = document.createElement("p");
    const p2 = document.createElement("p");
    p.textContent = localStorage.getItem("player1");
    p2.textContent = localStorage.getItem("player2");
    pOneName.appendChild(p);
    pTwoName.appendChild(p2);

    const gameContainer = document.querySelector("#gameContainer");
    gameContainer.style.display = "contents";
    const screen = new ScreenControl();
    screen.clickHandlerBoard();
  } else {
    const playContainer = document.querySelector("#playContainer");
    playContainer.style.display = "flex";
    const playBtn = document.querySelector("#playBtn");
    playBtn.addEventListener("click", () => {
      setTimeout(() => {
        playContainer.style.display = "none";
        beginRound();
      }, "500");
    });
    const beginRound = () => {
      const setNameContainer = document.querySelector("#setNameContainer");
      setNameContainer.style.display = "flex";
      const player1Name = document.querySelector("#player1Name");
      player1Name.focus();
      const player2Name = document.querySelector("#player2Name");
      const startRound = document.querySelector("#startRound");

      startRound.addEventListener("click", () => {
        if (!player1Name.value == "" && !player2Name.value == "") {
          localStorage.setItem("player1", player1Name.value);
          localStorage.setItem("player2", player2Name.value);
          setNameContainer.style.display = "none";
          //assigning names to game boxes UI at bottom.
          const pOneName = document.querySelector("#pOneName");
          const pTwoName = document.querySelector("#pTwoName");
          const p = document.createElement("p");
          const p2 = document.createElement("p");
          p.textContent = player1Name.value;
          p2.textContent = player2Name.value;
          pOneName.appendChild(p);
          pTwoName.appendChild(p2);

          const gameContainer = document.querySelector("#gameContainer");
          gameContainer.style.display = "contents";
          const screen = new ScreenControl();
          screen.clickHandlerBoard();
        }
      });
    };
  }
}

function assignNames() {
  const p1Name = () => localStorage.getItem("player1");
  const p2Name = () => localStorage.getItem("player2");

  return { p1Name, p2Name };
}

function restartGame() {
  const restartBtn = document.querySelector("#restartBtn");
  restartBtn.addEventListener("click", () => {
    document.querySelector("#gameContainer").style.display = "none";
    localStorage.setItem("restart", "true");
    window.location.reload();
  });
}

function resetPlayers() {
  const resetBtn = document.querySelector("#resetBtn");
  resetBtn.addEventListener("click", () => {
    document.querySelector("#gameContainer").style.display = "none";
    localStorage.clear();
    window.location.reload();
  });
}

const resetGame = resetPlayers();
const beginGame = startGame();
const restarting = restartGame();
