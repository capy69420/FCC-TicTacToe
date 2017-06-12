const boardSize = 3;
/*
 * object to contain all items accessable to all control functions
 */
let globals = {};

function drawnBoard() {
  for ( let i = 0; i < boardSize; ++i ) {
    for ( let j = 0; j < boardSize; ++j ) {
      let div = document.createElement('div');
      div.className = "cell";
      div.setAttribute("data-indx-i",i);
      div.setAttribute("data-indx-j",j);
      document.getElementById("board").appendChild(div);
    }
  }
  // response on click
  $(".cell").each(function() {
      let $this = $(this);
      $this.click(function() {
          if( (globals.game!==undefined) && (globals.game.status === "playing") &&
          (globals.game.currentState.turn === globals.game.player) && !($this.hasClass('occupied')) ) {
              var indx_i = parseInt($this.data("indx-i"));
              var indx_j = parseInt($this.data("indx-j"));

              let next = new State(globals.game.currentState, globals.game.currentState.turn);
              var indx = [indx_i, indx_j];
              next.result = next.board.play(indx_i,indx_j);
              ui.insertAt(indx, globals.game.player);

              next.advanceTurn();
              globals.game.currentState = next;
              globals.game.advanceState();

          }
      })
 });
}
drawnBoard();
/*
  choose the player
*/
$(".choosePlayer").each(function() {
   let $this = $(this);
   $this.click(function() {
       $('.selected').toggleClass('not-selected');
       $('.selected').toggleClass('selected');
       $this.toggleClass('not-selected');
       $this.toggleClass('selected');


   });
});

/*
 * start game (onclick div.start) behavior and control
 * when start is clicked and a level is chosen, the game status changes to "running"
 * and UI view to swicthed to indicate that it's human's trun to play
 */
$(".start").click(function() {
    let player = $('.selected').attr("id");
    if(typeof player !== "undefined") {
        var aiPlayer = new AI();
        globals.game = new Game(aiPlayer, player);

        globals.game.player = player;
        aiPlayer.game = globals.game;
        globals.game.start();
    }
});

function playAgain() {
  window.location.reload();
}

function endGame() {
  $("#end").hide();
}
