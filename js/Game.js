let Game = function(autoPlayer, player) {
  this.ai = autoPlayer;
  // creates the state with an empty board
  this.currentState = new State(undefined, player);
  // Who starts playing
  this.currentState.turn = player;
  this.status = "running";

  // Avances to the new state
  this.advanceState = function () {
    let state = this.currentState;
    if (state.isTerminal()) {
      if (state.result === "player-won" ) {
        ui.switchViewTo("won");
      } else if (state.result === "AI-won" ) {
        ui.switchViewTo("lost");
      } else {
        ui.switchViewTo("draw");
      }
      this.status = "game-end";
      ui.switchViewTo("end");
    } else {
      if ( state.turn == player ) {
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
