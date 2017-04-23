/*
 * object to contain all items accessable to all control functions
 */
var globals = {};
/*
  choose the player
*/
$(".choosePlayer").each(function() {
   var $this = $(this);
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

/*
 * click on cell (onclick div.cell) behavior and control
 * if an empty cell is clicked when the game is running and its the human player's trun
 * get the indecies of the clickd cell, craete the next game state, upadet the UI, and
 * advance the game to the new created state
 */

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
             //console.log("board in console:");next.board.print();
             ui.insertAt(indx, globals.game.player);

             next.advanceTurn();
             globals.game.currentState = next;
             globals.game.advanceState();

         }
     })
});

function replay() {
  window.location.reload();
}

function endGame() {
  $("#end").hide();
}
