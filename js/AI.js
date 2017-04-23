/*
 * Constructs an action that the ai player could make
 * @param pos [Number]: the cell position the ai would make its action in
 * made that action
 */
var AIAction = function(pos) {
    let player = globals.game.player;

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
        var next = new State(state);

        //put the letter on the board
        next.board.board[this.movePosition[0]][this.movePosition[0]] = state.turn;

        if(state.turn === player)
            next.oMovesCount++;

        next.advanceTurn();

        return next;
    }
};

/*
 * public static function that defines a rule for sorting AIActions in ascending manner
 * @param firstAction [AIAction] : the first action in a pairwise sort
 * @param secondAction [AIAction]: the second action in a pairwise sort
 * @return [Number]: -1, 1, or 0
 */
AIAction.ASCENDING = function(firstAction, secondAction) {
    if(firstAction.minMax < secondAction.minMax)
        return -1; //indicates that firstAction goes before secondAction
    else if(firstAction.minMax > secondAction.minMax)
        return 1; //indicates that secondAction goes before firstAction
    else
        return 0; //indicates a tie
}

/*
 * public static function that defines a rule for sorting AIActions in descending manner
 * @param firstAction [AIAction] : the first action in a pairwise sort
 * @param secondAction [AIAction]: the second action in a pairwise sort
 * @return [Number]: -1, 1, or 0
 */
AIAction.DESCENDING = function(firstAction, secondAction) {
    if(firstAction.minMax > secondAction.minMax)
        return -1; //indicates that firstAction goes before secondAction
    else if(firstAction.minMax < secondAction.minMax)
        return 1; //indicates that secondAction goes before firstAction
    else
        return 0; //indicates a tie
}

// AI always plays the best move
var AI = function(position) {
  this.movePosition = position;
  this.minMax = 0;

/*
* Applies the move in position to the state to return the next state
*/
  this.applyTo = function(state) {
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

AI.prototype.minMaxValue = function (state) {
  let player = globals.game.player;

  if( state.isTerminal() )  {
    return Game.score(state);
  } else {
    let stateScore;
    if (state.turn == player )
      stateScore = -1000;
    else
      stateScore = 1000;

    let aviablePositions = state.emptyCells();
    //console.log(aviablePositions);
    let aviableNextStates = aviablePositions.map(function(pos) {
      let action = new AI(pos);
      let nextState = action.applyTo(state);
      return nextState;
    });

    aviableNextStates.forEach(function(nextState) {
      let action = new AI(nextState);
      //console.log(action);
      let nextScore = action.minMaxValue(nextState);
      if ( state.turn == player ) {
        if ( nextScore > stateScore )
          stateScore = nextScore;
        else {
        if ( nextScore < stateScore )
          stateScore = nextScore;
        }
    }
    });
    return stateScore;
  }
}
AI.prototype.takeSimpleMove = function() {
  let next = new State(globals.game.currentState);
  globals.game.currentState = next;
  let aviablePositions = next.emptyCells();
  console.log(aviablePositions);
  let chosenAction = aviablePositions[0];

  // play and display it on the board
  let result = globals.game.currentState.board.play(chosenAction[0],chosenAction[1]);
  globals.game.currentState.result = result;
  ui.insertAt(chosenAction, globals.game.currentState.turn);
  globals.game.currentState.advanceTurn();
  globals.game.advanceState();
}
AI.prototype.takeMasterMove = function (turn) {
  let player = globals.game.player;
  let aviable = globals.game.currentState.emptyCells();
  let aviableActions = aviable.map(function(pos){
    let action = new AI(pos);
    let next = action.applyTo(globals.game.currentState);
    action.minMax = action.minMaxValue(next);
    return action;
  });

  // sort the action list by score
  if ( turn == player )
    aviableActions.sort(AI.DESCENDING);
  else {
    aviableActions.sort(AI.ASCENDING);
  }

  let chosenAction = aviableActions[0];
  let next = chosenAction.applyTo(globals.game.currentState);

  // display it on the board
  ui.insertAt(chosenAction.movePosition, turn);
  globals.game.advanceState(next);
}

AI.prototype.notify = function() {
  //this.takeMasterMove(globals.game.currentState.turn);
  this.takeSimpleMove();
}
