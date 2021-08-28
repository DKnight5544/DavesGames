/*------------------------------------------------------------------------
 * 
 * Coder's Email: <Required For Contest>
 * Inviter's Email: 
 * 
 * if(inviter == "") inviter = "dave@daves.games";
 *  
 * In: A string representing the currrent status of the board.
 *     
 * 
 * Out: A single character: L, R, U, D or ?.
 *      Move the blank cell (L)eft, (R)ight, (U)p or (D)own,
 *      Swapping places with the cell that is there.
 *      ? or blank = Stumped or Finished.
 *      
 * Description: 
 * This demo code solves the puzzle for Square #1, and includes a
 * function to parse the board into an in memory object. 
 * 
 * Any illegal moves returned are basically ignored but your move 
 * count will suffer.
 * 
 * IMPORTANT:
 * Any attempt to access global variables not created by your
 * code or the DOM will disqualify your code from participating in
 * any contest.
 * 
 *-----------------------------------------------------------------------------*/

function move(board) {

    // if the 1 is already in place we should just exit.
    if (board.substr(0, 2) == '01') return "?";

    grid = getGrid(board);

    return solveCellOne(grid);

}

function getGrid(board) {

    /*
     * cell.row
     * cell.col
     * cell.actualVal  (where it is)
     * cell.targetVal  (where it should be)
     */


    let grid = [];
    let actualIndex = 0;
    let targetVal = 1;

    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
            let cell = {};
            cell.row = r + 1;
            cell.col = c + 1;
            cell.actualVal = parseInt(board.substr(actualIndex, 2));
            cell.targetVal = targetVal++
            actualIndex += 2;
            grid.push(cell);
        }
    }


    return grid;
}

function solveCellOne(grid) {

    let blankCell = grid.find(c => c.actualVal == 25);
    let cellOne = grid.find(c => c.actualVal == 1);

    //Cell one is in place, bail out.
    if (cellOne.col == 1 && cellOne.row == 1) return "?";

    //move blankCell into position (1, 1)
    if (blankCell.col > 1) return "L";
    if (blankCell.row > 1) return "U";

    //special cases only 1 move is needed
    if (cellOne.col == 1 && cellOne.row == 2) return "D";
    if (cellOne.col == 2 && cellOne.row == 1) return "R";

    //How many ups, downs, rights and lefts do we need? 
    let r = cellOne.row == 1 ? 1 : cellOne.row - 1;
    let c = cellOne.col == 1 ? 1 : cellOne.col - 1;

    let response = "";
    response += "DDDD".substr(0, r);
    response += "RRRR".substr(0, c);
    response += "UUUU".substr(0, r);
    response += "LLLL".substr(0, c);

    return response;

}