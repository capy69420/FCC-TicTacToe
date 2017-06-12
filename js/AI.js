/*
 * Constructs an action that the ai player could make
 * @param pos [Number,Number]: the position the ai would make its action in
 * made that action
 */
let AIAction = function(pos) {
    // public : the position on the board that the action would put the letter on
    this.movePosition = pos;

    //public : the minimax value of the state that the action leads to when applied
    this.minMax = 0;

    /*
     * public : applies the action to a state to get the next state
     * @param state [State]: the state to apply the action to
     * @return [State]: the next state
     */
    this.applyTo = function(state) {
        let next = new State(state);

        //put the letter on the board and change turn
        next.play(this.movePosition[0],this.movePosition[1]);
        next.advanceTurn();
        return next;
    }
};

// AI always plays the best move
let AI = function(position) {
  this.movePosition = position;
  this.minMax = 0;

/*
* Applies the move in position to the state to return the next state
*/
  AI.prototype.applyTo = function(state) {
    let player = globals.game.player;
    let next = new State(state);
    next.board.board[position[0]][position[1]] = state.turn;

    if( state.turn !== player ) {
      next.moveCount++;
    }
    next.advanceTurn();
    return next;
  }

}

function minMaxValue( node, maximizingAI ) {
  if( node.isTerminal()  )  {
    return { score:node.score() };
  } else {
    let aviablePositions = node.emptyCells();
    let moves = [];
    let aviableNextStates = aviablePositions.map(function(pos) {
      let action = new AIAction(pos);
      let nextState = action.applyTo(node);
      let score;
      if (maximizingAI) {
        scoreValue = minMaxValue(nextState, false).score;
      } else {
        scoreValue = minMaxValue(nextState, true).score;
      }
      moves.push({position: pos, score: scoreValue});
      return nextState;
    });
    let bestMove = {};
    if (maximizingAI) {
      // maximize AI score
      bestScore = -1000;
      for( let i = 0; i < moves.length; ++i ) {
        if ( moves[i].score > bestScore ) {
          bestMove = moves[i];
          bestScore = moves[i].score;
        }
      }
      return bestMove;
    } else {
      // players turn to minimize AI score
      bestScore = 1000;
      for( let i = 0; i < moves.length; ++i ) {
        if ( moves[i].score < bestScore ) {
          bestMove = moves[i];
          bestScore = moves[i].score;
        }
      }
      return bestMove;
    }
  }
}

AI.prototype.takeSimpleMove = function() {
  let aviablePositions = globals.game.currentState.emptyCells();
  let chosenAction = aviablePositions[0];

  // play and display it on the board
  globals.game.currentState.play(chosenAction[0],chosenAction[1]);
  ui.insertAt(chosenAction, globals.game.currentState.turn);
  globals.game.currentState.advanceTurn();
  globals.game.advanceState();
}

AI.prototype.takeMasterMove = function (turn) {
  let player = globals.game.player;
  let aviablePos = globals.game.currentState.emptyCells();
  let bestMove = minMaxValue(globals.game.currentState,true);
  let chosenAction = new AIAction(bestMove.position);
  let nextState = chosenAction.applyTo(globals.game.currentState);

  // display it on the board
  ui.insertAt(chosenAction.movePosition, turn);
  globals.game.currentState = nextState;
  globals.game.advanceState();
}

AI.prototype.notify = function() {
  this.takeMasterMove(globals.game.currentState.turn);
  //this.takeSimpleMove();
}
