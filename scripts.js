//Disable all buttons when winner found!
//Write logic for game ties
//Make players able to add names
//Add play again button
//Announce each person's turn


/*
GameBoard
- create and update the game board UI
*/
function GameBoard () {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i= 0; i < rows; i++) {
        board[i] = [];
        for (let j= 0; j < columns; j++) {
            board[i].push(Cell());
        }
    };

    const getBoard = ()=> board;

    const dropToken = (row,column,player) => {
        let chosenCell = board[row-1][column-1];
        if (!chosenCell.getValue() == 0) {
        return;
        }
        chosenCell.addToken(player);

    };

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        return boardWithCellValues;
      };

      return {getBoard,dropToken,printBoard};
};



/*
Cell
- give cells values and update who is occupied in each cell
*/
function Cell() {
    let value = 0;

    const addToken = (player) => {
        value = player;
      };

    const getValue = () => value;

    return {addToken,getValue};
}


/*
GameController (control the game's turns and decide if a player wins)
- decide the active player
- store the players and their token name
- save playRound function
*/
function GameController(playerOne = 'P1', playerTwo = 'P2') {

    const board = GameBoard();

    const players = [
        {
            name: playerOne,
            token: 'O',
        },
        {
            name: playerTwo,
            token: 'X',
        }
    ]

    let currentPlayer = players[0];

    const switchPlayer = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    };

    const getCurrentPlayer = () => currentPlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getCurrentPlayer().name}'s turn.`);
    };

    const displayWinner = (playerName) => {
        const popup = document.querySelector('#popup');
        popup.parentElement.style.display = "flex";
        const p = document.createElement('p');
        p.setAttribute('id','popupMsg');
        p.textContent = `${playerName} wins!`;
        popup.appendChild(p);
        console.log(`${playerName} wins!`);
    }

    const winCombinations = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ]

    printNewRound();

    const playRound = (r,c) => {
        const currentP = getCurrentPlayer().name;
        const currentT = getCurrentPlayer().token;
        console.log(`Dropping ${currentP}'s token into row${r} column${c}.`);
        board.dropToken(r, c, getCurrentPlayer().token);
        let winnerFound = false;

        const checkWinner = () => {
            const currentBoard = board.printBoard().flat();
            console.log(currentBoard);


            for (let i=0; i<8; i++){
                let currentCom = [];
                for (let j of winCombinations[i]) {
                    currentCom.push(currentBoard[j])
                }
                if (currentCom.every((e)=> e == currentT)) {
                    setTimeout(() => {displayWinner(currentP);},'1000')
                    winnerFound = true;
                    return;

                } winnerFound = false;
            }
        }

        checkWinner();
        switchPlayer();
    };

    return {
        playRound,
        getCurrentPlayer
      };
}

//const game = GameController();


/*

updateScreen()

Clear the DOM of the current board display by simply setting the .board div's text content to an empty string.
Get the most up-to-date board from the game controller.
Get the most up-to-date active player from the game controller.
Render the player's turn in the .turn div.
Render each grid square on the DOM
I make sure to give each cell a data-attribute of column and set that value to the index of the cell in its row, so that when we click them in the future, we already have access to what column that cell is in.
The cells are buttons, not divs. Why? In most cases, anything clickable should be a button or link. This enables those with accessability issues to still be able to use our site easily be tabbing and selecting with the keyboard.
The purpose of this method is to refresh our screen whenever a change happens in our game. It will be called whenever the user interacts with the game, like to play a round.
*/

function ScreenControl () {

    const game = GameController();
    const buttons = document.querySelectorAll(".btn-cell");

    const clickHandlerBoard = () => {

        buttons.forEach((btn) => {
            btn.addEventListener("click", (event) => {
            const r = event.target.dataset.row;
            const c = event.target.dataset.column;


            event.target.disabled = true;
            event.target.setAttribute("class",game.getCurrentPlayer().token)
            event.target.textContent = game.getCurrentPlayer().token;
            game.playRound(r,c);
          });
        })
    };

    //clickHandlerBoard();
    return {clickHandlerBoard};
}



function startGame () {

    const playContainer = document.querySelector('#playContainer');
    const playBtn = document.querySelector('#playBtn');
    playBtn.addEventListener('click',() => {
        setTimeout(()=>{
            playContainer.style.display = 'none';
            const screen = ScreenControl();
            screen.clickHandlerBoard();},'500');
        
    });
};

const beginGame = startGame();
