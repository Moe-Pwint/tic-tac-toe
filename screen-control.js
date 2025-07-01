export { ScreenControl, startGame };

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
  const playContainer = document.querySelector("#playContainer");
  const playBtn = document.querySelector("#playBtn");
  playBtn.addEventListener("click", () => {
    setTimeout(() => {
      playContainer.style.display = "none";
      beginRound();
    }, "500");
  });
  const beginRound = () => {
    const setNameContainer = document.querySelector("#setNameContainer");
    const player1Name = document.querySelector("#player1Name");
    player1Name.focus();
    const player2Name = document.querySelector("#player2Name");
    const startRound = document.querySelector("#startRound");
    startRound.addEventListener("click", () => {
      if (!player1Name.value == "" && !player2Name.value == "") {
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
