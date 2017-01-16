const boardSize = 3;
var player = "O";

let State = function(old) {
    this.turn = "";
    this.moveCount = 0;
    this.result = "playing";
    this.board = new Board(boardSize);

    if(typeof old !== "undefined") {
      // if the state is constructed using a copy of another state
      let len = old.board.size;
      this.board = new Board(len);
      this.board.copyBoard(old.board);

      this.oMovesCount = old.oMovesCount;
      this.result = old.result;
      this.turn = old.turn;
    }

    this.advanceTurn = function() {
        this.turn = this.turn === "X" ? "O" : "X";
    }

    /* list the empy cells */
    this.emptyCells = function() {
      return this.board.emptyCells();
    }

    this.isTerminal = function() {
      return this.board.game_end;
    }
}
