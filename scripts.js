//HOW TO REPEAT FUNCTION WHEN THE CHOSEN CELL IS OCCUPIED?

/*
GameBoard
- create and update the game board UI
- you can drop tokens (first check if the selected cell is empty or not)
- you can get board
- you can print board
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
    }

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
        console.log(boardWithCellValues);
      };

      return {getBoard,dropToken,printBoard};

};



/*
Cell
- update if the cell is empty or occupied
- update who is occupied in each cell
- you can add token
- you can get value

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
* decide the active player
* store the players and their token name
- call current board
- you can play round (play round, switch current player, update new board)
* you can get active player

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

    const playRound = (r,c) => {
        console.log(`Dropping ${getCurrentPlayer.name}'s token into row${r} column${c}.`);
        board.dropToken(r, c, getCurrentPlayer().token);

        switchPlayer();
        printNewRound();
    };

    printNewRound();

    return {
        playRound,
        getCurrentPlayer
      };

}

const game = GameController();

