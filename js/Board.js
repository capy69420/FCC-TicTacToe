
/*
 * board.js - Game logic for the board game
 */
var Board = function(size) {
    this.current_player = Board.CROSS;
    this.size = size;
    this.board = this.create_board(size);
};

Board.EMPTY = 0;
Board.CROSS = 1;
Board.CIRCLE = 2;
Board.game_end = false;
Board.pieces = 0;
/*
 * Returns a size x size matrix with all entries initialized to Board.EMPTY
 */
Board.prototype.create_board = function(size) {
    var m = [];
    for (var i = 0; i < size; i++) {
        m[i] = [];
        for (var j = 0; j < size; j++)
            m[i][j] = Board.EMPTY;
    }
    return m;
}
/*
* Returns a copy of the board orig.
*/
Board.prototype.copyBoard = function(orig) {
  let cop = new Board(orig.size);
  for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++)
          cop[i][j] = orig[i][j];
  }
  cop.game_end = orig.game_end;
  cop.pieces = orig.pieces;
  return cop;
}
/*
 * Switches the current player
 */
Board.prototype.switch_player = function() {
    this.current_player =
        this.current_player == Board.CROSS ? Board.CIRCLE : Board.CROSS;
};

Board.prototype.emptyCells = function() {
  let cells = [];
  for( let i = 0; i < this.size; ++i ) {
    for ( let j = 0; j < this.size; ++j ) {
      if ( this[i][j] == Board.EMPTY ) {
        cells.push([i,j]);
      }
    }
  }
  return cells;
}

/*
 * Attempt to place a stone at (i,j). Returns false iff the move was illegal
 */
Board.prototype.play = function(i, j) {
    console.log("Played at " + i + ", " + j);

    if (this.board[i][j] != Board.EMPTY)
        return false;
    else {
      this.pieces++;
    }
    var player = this[i][j] = this.current_player;
    // isTerminal
    if ( this.won(i,j) ) {
		  console.log(this.current_player + " won");
      this.game_end = true;
    } else if ( this.pieces == this.size*this.size ) {
      console.log("drawn");
      this.game_end = true;
    }
    this.switch_player();
    return true;
};


/*
 * Goes though the direction and pushes every position of that line wich has the current_player
 */
Board.prototype.get_line = function ( x, y, direction ) {
	let S = [];
	let i, j;
	switch ( direction ) {
		case "vertical" : {
			x = 0;
			i = 1;
			j = 0;
		break;
		}
		case "horizontal" : {
			y = 0;
			i = 0;
			j = 1;
		break;
		}
		case "diagonal1" : {
			x = 0;
			y = 0;
			i = 1;
			j = 1;
		break;
		}
		case "diagonal2" : {
			x = 0;
			y = this.size-1;
			i = -1;
			j = -1;
			break;
		}
	}
	while ( x > -1 && y > -1 && x < this.size && y < this.size ) {
		if ( this.board[x][y] != this.current_player )
			return false;
		S.push([x,y]);
		x = x + i;
		y = y + j;
	}
	return S;
}

/*
 * Checks if the current_player have won if the current_player won or else returning false.
 * Takes the player move as an argument to perform depth-first search like but only on linear directions.
 */
Board.prototype.won = function ( x, y ) {
	// Vertical
	let S = this.get_line(x, y, "vertical" );
	if ( S.length == this.size ) {
    this.game_end = true;
    return S;
	} else
		return false;
	// Horizontal
	S = this.get_line(x, y, "horizontal" );
	if ( S.length == this.size ) {
    this.game_end = true;
    return S;
	} else
		return false;
	// Diagonal top left to right
	S = this.get_line(x, y, "diagonal1" );
	if ( S.length == this.size ) {
    this.game_end = true;
    return S;
	} else
		return false;
	// Diagonal top right to left
	S = this.get_line(x, y, "diagonal2" );
	if ( S.length == this.size ) {
    this.game_end = true;
		return S;
	} else
		return false;

}
