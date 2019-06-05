//Define the order in which to examine/expand possible moves
//(This affects alpha-beta pruning performance)
// let move_expand_order=[0,1,2,3,4,5,6,7,8]; //Naive (linear) ordering
// let move_expand_order=[4,0,1,2,3,5,6,7,8]; //Better ordering? 
let move_expand_order=[4, 0, 8, 2, 6, 3, 1, 7, 5] //The best order
// let move_expand_order= [3,5,1,7,8,2,0,6,4] //The worse order

// let move_expand_order=[3,8,7,]
//Yes, this should give you better result, but why? Because the center move could give the larger number 
//options for the next move 

/////////////////////////////////////////////////////////////////////////////

function tictactoe_minimax(board,cpu_player,cur_player) { 
  /***********************************************************
  * board: game state, an array representing a tic-tac-toe board
  * The positions correspond as follows
  * 0|1|2
  * -+-+-
  * 3|4|5 -> [ 0,1,2,3,4,5,6,7,8 ]
  * -+-+-
  * 6|7|8
  * For each board location, use the following:
  *  -1 if this space is blank
  *   0 if it is X
  *   1 if it is O
  *
  * cpu_player: Which piece is the computer designated to play
  * cur_player: Which piece is currently playing

  * So, to check if we are currently looking at the computer's
  * moves do: if(cur_player===cpu_player)
  *
  * Returns: Javascript object with 2 members:
  *   score: The best score that can be gotten from the provided game state
  *   move: The move (location on board) to get that score
  ***********************************************************/

  //BASE CASE
  if(is_terminal(board)) //Stop if game is over
    return {
	  move:null,
      score:utility(board,cpu_player) //How good was this result for us?
    }

  ++helper_expand_state_count; //DO NOT REMOVE

    var resultValue;
    var resultActions = [];
    var resultState = {
    	move: resultActions,
    	score: resultValue
    };
    if (cur_palyer != cpu_player){
    	resultState.score = Number.NEGATIVE_INFINITY //Maximizer's score, or alpha
	 	 //GENERATE SUCCESSORS
	  	for(let move of move_expand_order) { //For each possible move (i.e., action)

			if(board[move]!=-1) continue; //Checing valid action

			let new_board=board.slice(0); //Copy the old board configuration
			new_board[move]=cur_player; //Apply action
				    //Successor state: new_board
		    //RECURSION
		    // What will my opponent do if I make this move?
		    let succState = tictactoe_minimax(new_board,cpu_player,1-cur_player); 
		    /*Why do 1 - c???
			Ans: Switch player; 1 - 0 = 1 and 1 - 1 = 0;
			0 is X(means cur_palyer/cpr_player) and 1 is O(means cur_palyer/cpr_player)
		    */
		    if(succState.score > resultState.score){
		    	resultState.score = succState.score;
		    	resultState.move = succState.move; 
		    	/*???Do we actually need to store the action?*/
		    }
		}
    }else {
    	/* In here, cur_palyer == cpu_player, which means we are looking at cpu_player right now,
    		And, it is the minimizer's move
    	*/
    	resultState.score  = Number.POSITIVE_INFINITY
	 	 //GENERATE SUCCESSORS
	  	for(let move of move_expand_order) { //For each possible move (i.e., action)
			if(board[move]!=-1) continue; //Already taken, can't move here (i.e., successor not valid)
			//nove move is valid
			let new_board=board.slice(0); //Copy the old board configuration
			new_board[move]=cur_player; //Apply move
			/*Is this action belong cpu of cur?
			Ans: cpu, since we are looking at cpu, so should be opposite to the previous move*/
		    //RECURSION
		    // What will my opponent do if I make this move?
		    let succState=tictactoe_minimax(new_board,cpu_player,1-cur_player);
		    //Check if succesor has a better option
		    if(succState.score < resultState.score){
		    	resultState.score = succState.score;
		    	resultState.move = succState.move; 
		    	/*???Do we actually need to store the action?*/
		    }
		}
    }

    /***********************
    * TASK: Implement minimax here. (What do you do with results.move and results.score ?)
    * 
    * Hint: You will need a little code outside the loop as well, but the main work goes here.
    *
    * Hint: Should you find yourself in need of a very large number, try Infinity or -Infinity
    ***********************/
  

  //Return results gathered from all sucessors (moves).
  //Which was the "best" move?  
  return {
    resultState.move,
    resultState.score
  };
}
  // * 0|1|2
  // * -+-+-
  // * 3|4|5 -> [ 0,1,2,3,4,5,6,7,8 ]
  // * -+-+-
  // * 6|7|8
  // * For each board location, use the following:
  // *  -1 if this space is blank
  // *   0 if it is X
  // *   1 if it is O
  // *
  // * cpu_player: Which piece is the computer designated to play
  // * cur_player: Which piece is currently playing
  // *   0 if it is X
  // *   1 if it is O

/*
terminate1: [0,1,2] [0,3,6] [0,4,8]
000 0?? 0??
??? 0?? ?0?
??? 0?? ??0 
Terminate2: [3,4,5] [1,4,7]
??? ?0? 
000 ?0?
??? ?0? 
Terminate2: [6,7,8] [2,5,8] [2,4,6]
??? ??0 ??0
??? ??0 ?0?
000 ??0 0??
*/

function is_terminal(board) {
  ++helper_eval_state_count; //DO NOT REMOVE
  var result = false
  //Probably no need for the part of condition checking, but just for defensive programming concern
  if(board[4]!=-1 && (board[4]==0 || board[4]==1)){
  	if( (board[0]==board[4] && board[4] == board[8]) ||
  		(board[3]==board[4] && board[4] == board[5]) ||
  		(board[1]==board[4] && board[4] == board[7]) ||
  		(board[2]==board[4] && board[4] == board[6])){
  		result = true
  	}
  }
    if(board[0]!=-1 && (board[0]==0 || board[0] == 1)){
	  	if( (board[1]==board[0] && board[0] == board[2]) ||
	  		(board[3]==board[0] && board[0] == board[6])){
	  		result = true
	  	}
  }
    if(board[8]!=-1 && (board[8]==0 || board[8]==1)){
	  	if( (board[6]==board[8] && board[8] == board[7]) ||
	  		(board[2]==board[8] && board[8] == board[5])){
	  		result = true
	  	}
  }

  /*************************
  * TASK: Implement the terminal test
  * Return true if the game is finished (i.e, a draw or someone has won)
  * Return false if the game is incomplete
  *************************/

  return result;
}

function utility(board, player) {//should consider the player,separate from Max and Min
  if (!is_terminal(board)) {
    return null;
  }
  var tie = true;
  var winner = -1; //winner can only be 0 or 1, if winner ==-1, there is a draw
  //check the two conditions of same value in diagonals
  var check_same_diag1 = (board[0] == board[4] && board[4] == board[8] && board[4] != -1);
  var check_same_diag2 = (board[2] == board[4] && board[4] === board[6] && board[4] != -1);
  if (check_same_diag1 || check_same_diag2) {
    tie = false;
    if (board[4] == 0) {
      winner = 0;
    }
    else if (board[4] == 1) {
      winner = 1;
    }
  } else {
    for (var i = 0; i < 3; i++) {
      //check the values in the same row and the same column
      check_same_row = (board[3 * i + 0] == board[3 * i + 1] && board[3 * i + 1] == board[3 * i + 2] && board[3 * i + 0] != -1);
      check_same_col = (board[3 * 0 + i] == board[3 * 1 + i] && board[3 * 1 + i] == board[3 * 2 + i] && board[3 * 0 + i] != -1);

      if (check_same_row) {
        tie = false;
        if (board[3 * i + 0] == 0) {
          winner = 0;
        } else if (board[3 * i + 0] == 1) {
          winner = 1;
        }
        break;
      }
      if (check_same_col) {
        tie = false;
        if (board[3 * 0 + i] == 0) {
          winner = 0;
        } else if (board[3 * 0 + i] == 1) {
          winner = 1;
        }
        break;
      }
    }
  }

  var count_blank = 0;
  for (var i = 0; i < board.length; ++i) {
    if (board[i] == -1)
      count_blank++;
  }
  count = 9 - count_blank
  if (tie) {//there is no winner, meaning the result is tie
    return 0;
  }
  else if (winner == player) {//if the player is winner,return positive
    return 10 - count;
  } else {
    return -(10 - count);////if the player is not winner,return negative.
  }
  /***********************
  * TASK: Implement the utility function
  *
  * Return the utility score for a given board, with respect to the indicated player
  *
  * Give score of 0 if the board is a draw
  * Give a positive score for wins, negative for losses.
  * Give larger scores for winning quickly or losing slowly
  * For example:
  *   Give a large, positive score if the player had a fast win (i.e., 5 if it only took 5 moves to win)
  *   Give a small, positive score if the player had a slow win (i.e., 1 if it took all 9 moves to win)
  *   Give a small, negative score if the player had a slow loss (i.e., -1 if it took all 9 moves to lose)
  *   Give a large, negative score if the player had a fast loss (i.e., -5 if it only took 5 moves to lose)
  * (DO NOT simply hard code the above 4 values, other scores are possible. Calculate the score based on the above pattern.)
  * (You may return either 0 or null if the game isn't finished, but this function should never be called in that case anyways.)
  *
  * Hint: You can find the number of turns by counting the number of non-blank spaces
  *       (Or the number of turns remaining by counting blank spaces.)
  ***********************/
}

function tictactoe_minimax_alphabeta(board, cpu_player, cur_player, alpha, beta) {
  //alpha 
  if (is_terminal(board)) //Stop if game is over
    return {
      move: null,
      score: utility(board, cpu_player) //How good was this result for us?
    }

  ++helper_expand_state_count; //DO NOT REMOVE

  var best_score, move_temp; // The highest score for cpu and lowest score for human
  // hi_score = -Infinity;
  // lo_score = Infinity;
  if (cur_player != cpu_player) {//Min's turn
    // lo_score = Infinity;
    best_score = Infinity;
    //GENERATE SUCCESSORS
    for (let move of move_expand_order) { //For each possible move (i.e., action)
      if (board[move] != -1) continue; //Already taken, can't move here (i.e., successor not valid)

      let new_board = board.slice(0); //Copy
      new_board[move] = cur_player; //Apply move
      //Successor state: new_board

      //RECURSION
      // What will my opponent do if I make this move?
      let results = tictactoe_minimax_alphabeta(new_board, cpu_player, 1 - cur_player, alpha, beta);
      // alpha = results.alpha;
      // beta = results.beta;
      if (results.score < best_score) {
        best_score = results.score;
        move_temp = move;
      }
      beta = Math.min(best_score, beta);
      if (beta < alpha) {
        return {
          move: move_temp,
          score: best_score
        }
      }
    }

  } else { //Max's turn
    // hi_score = -Infinity;
    //GENERATE SUCCESSORS
    best_score = -Infinity;
    for (let move of move_expand_order) { //For each possible move (i.e., action)
      if (board[move] != -1) continue; //Already taken, can't move here (i.e., successor not valid)

      let new_board = board.slice(0); //Copy
      new_board[move] = cur_player; //Apply move
      //Successor state: new_board

      //RECURSION
      // What will my opponent do if I make this move?
      let results = tictactoe_minimax_alphabeta(new_board, cpu_player, 1 - cur_player, alpha, beta);
      // alpha = results.alpha;
      // beta = results.beta;
      if (results.score > best_score) {
        best_score = results.score;
        move_temp = move;
      }
      alpha = Math.max(best_score, alpha);
      if (beta < alpha) {
        return {
          move: move_temp,
          score: best_score
        }
      }

      /***********************
      * TASK: Implement Alpha-Beta Pruning
      *
      * Once you are confident in your minimax implementation, copy it here
      * and add alpha-beta pruning. (What do you do with the new alpha and beta parameters/variables?)
      *
      * Hint: Make sure you update the recursive function call to call this function! Should change the recursive function
      ***********************/

    }
  }
  return {
    move: move_temp/* What do you return here? */,
    score: best_score/* And here? */
  };
}

function debug(board,human_player) {
  /***********************
  * This function is run whenever you click the "Run debug function" button.
  *
  * You may use this function to run any code you need for debugging.
  * The current "initial board" and "human player" settings are passed as arguments.
  *
  * (For the purposes of grading, this function will be ignored.)
  ***********************/
  helper_log_write("Testing board:");
  helper_log_board(board);
  
  let tm=is_terminal(board);
  helper_log_write("is_terminal() returns "+(tm?"true":"false"));

  let u=utility(board,human_player);
  helper_log_write("utility() returns "+u+" (w.r.t. human player selection)");
}
