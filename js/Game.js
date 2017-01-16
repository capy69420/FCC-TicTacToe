var Game = function(autoPlayer) {
  // AI starts playing
  this.ai = autoPlayer;
  // creates the state with an empty board
  this.currentState = new State();
  // Who starts playing
  this.currentState.turn = this.player;
  this.status = "running";

  // Avances to the new state
  this.advanceState = function (_state) {
    if (_state.isTerminal()) {
      if (_state.result === "player-won" )
        ui.switchViewTo("won");
      else if (_state.result === "AI-won" ) {
        ui.switchViewTo("lost");
      } else {
        ui.switchViewTo("drawn");
      }
    } else {
      if ( this.currentState.turn === player ) {
        ui.switchViewTo("human");
      } else {
        ui.switchViewTo("robot");
        //notify the AI player its turn has come up
        this.ai.notify(computer);
      }
    }
  }

  // starts the game
  this.start = function() {
    if ( this.status = "beginning" ) {
      this.advanceState(this.currentState);
      this.status = "playing";
    }
  }

}

Game.score = function(_state) {
  if ( _state.result !== "playing" ) {
        if(_state.result === "AI-won"){
            return 10 - _state.oMovesCount;
        }
        else if(_state.result === "player-won") {
            return -10 + _state.oMovesCount;
        }
        else {
            return 0;
        }
  }
}
