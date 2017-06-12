
/*
 * board.js - Game logic for the board game
 */
let Board = function(size, startPlayer) {
    this.current_player = startPlayer;
    this.size = size;
    this.board = this.create_board(size);
    this.pieces = 0;
    this.game_end = false;
};

Board.EMPTY = 0;
Board.CROSS = 1;
Board.CIRCLE = 2;

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
  let cop = new Board(orig.size,orig.current_player);
  cop.game_end = orig.game_end;
  cop.pieces = orig.pieces;
  for (let i = 0; i < orig.size; i++) {
      for (let j = 0; j < orig.size; j++)
          cop.board[i][j] = orig.board[i][j];
  }
  return cop;
}
/*
 * Switches the current player
 */
Board.prototype.switch_player = function() {
  if (this.current_player == "X")
    this.current_player = "O";
  else {
    this.current_player = "X";
  }
};

Board.prototype.emptyCells = function() {
  let cells = [];
  for( let i = 0; i < this.size; ++i ) {
    for ( let j = 0; j < this.size; ++j ) {
      if ( this.board[i][j] == Board.EMPTY ) {
        cells.push([i,j]);
      }
    }
  }
  return cells;
}

Board.prototype.toValue = function (player) {
  if ( player == 'X' )
      return Board.CROSS;
  else if ( player == 'O' )
      return Board.CIRCLE;
  else
      return Board.EMPTY;
}
/*
 * Attempt to place a stone at (i,j). Returns false iff the move was illegal
 * if it was a terminal move it returns the reult
 */
Board.prototype.play = function(i, j) {
    if (this.board[i][j] !== Board.EMPTY)
        return false;
    else {
      this.board[i][j] = this.toValue(this.current_player);
      this.pieces++;
    }
    // isTerminal
    if ( this.won(i,j) ) {
		  this.game_end = true;
      if ( this.current_player == globals.game.player ) {
        return "player-won";
      } else {
        return "AI-won";
      }
    } else if ( this.pieces == this.size*this.size ) {
      this.game_end = true;
      return "drawn";
    }
    return true;
};

 function Equal(boardNumber, char) {
  if ( char === 'X' && boardNumber === Board.CROSS )
      return true;
  else if ( char === 'O' && boardNumber === Board.CIRCLE )
      return true;
  else
    return false;
}

/*
 * Goes though the direction and pushes every position of that line wich has the current_player
 */
Board.prototype.get_line = function ( x, y, direction, winner ) {
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
			i = 1;
			j = -1;
			break;
		}
	}
  let lastPlayer = (this.current_player == 'X')? 'O':'X';
	while ( x > -1 && y > -1 && x < this.size && y < this.size ) {
    if ( !Equal(this.board[x][y], this.current_player) )
			return false;
		S.push([x,y]);
		x = x + i;
		y = y + j;
	}
  return true, S;
}

/*
 * Checks if the current_player have won if the current_player won returns an array with the line
 * or else returs false.
 * Takes the player move as an argument to perform depth-first search like but only on linear directions.
 */
Board.prototype.won = function ( x, y ) {
	// Vertical
	let S = this.get_line(x, y, "vertical" );
  if ( S.length == this.size ) {
    this.game_end = true;
    return S;
	}
  // Horizontal
	S = this.get_line(x, y, "horizontal" );
	if ( S.length == this.size ) {
    this.game_end = true;
    return S;
	}
	// Diagonal top left to right
	S = this.get_line(x, y, "diagonal1" );
	if ( S.length == this.size ) {
    this.game_end = true;
    return S;
	}
	// Diagonal top right to left
	S = this.get_line(x, y, "diagonal2" );
	if ( S.length == this.size ) {
    this.game_end = true;
		return S;
	}
  return false;

}

Board.prototype.print = function () {
  this.size
  this.board
  let out = '';
  for ( let i = 0; i < this.size; ++i ) {
    for( let j = 0; j < this.size; ++j ) {
      out += this.board[i][j] + ' ';
    }
    out += '\n';
  }
  console.log(out);
}
