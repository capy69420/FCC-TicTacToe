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
    console.log(player);
    if(typeof player !== "undefined") {
        var aiPlayer = new AI();
        globals.game = new Game(aiPlayer);

        globals.game.player = player;

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
     var $this = $(this);
     $this.click(function() {
       console.log(globals.game.status);
         if(globals.game.status === "running" && globals.game.currentState.turn === globals.game.player && !$this.hasClass('occupied')) {
             var indx = parseInt($this.data("indx"));

             var next = new State(globals.game.currentState);
             next.board[indx] = globals.game.player;

             ui.insertAt(indx, globals.game.player);

             next.advanceTurn();

             globals.game.advanceTo(next);

         }
     })
});
