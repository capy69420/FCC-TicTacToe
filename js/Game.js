var Game = function(autoPlayer, player) {
  this.ai = autoPlayer;
  // creates the state with an empty board
  this.currentState = new State(undefined, player);
  // Who starts playing
  this.currentState.turn = player;
  this.status = "running";

  // Avances to the new state
  this.advanceState = function () {
    //console.log(_state.isTerminal());
    let _state = this.currentState;
    console.log("state result:",_state);
    if (_state.isTerminal()) {
      if (_state.result === "player-won" ) {
        ui.switchViewTo("won");
      } else if (_state.result === "AI-won" ) {
        ui.switchViewTo("lost");
      } else {
        ui.switchViewTo("drawn");
      }
      this.status = "game-end";
      ui.switchViewTo("end");
    } else {
      if ( _state.turn == player ) {
        ui.switchViewTo("human");
      } else {
        ui.switchViewTo("robot");
        //notify the AI player its turn has come up
        this.ai.notify();
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
            return 10 - _state.moveCount;
        }
        else if(_state.result === "player-won") {
            return -10 + _state.moveCount;
        }
        else {
            return 0;
        }
  }
}
