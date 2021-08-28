
let dg_global = {};

function dg_begin() {

    dg_buildHTML();

    let thisLocation = window.location.href;
    let local = (thisLocation.substr(0, 5) == "file:") || (thisLocation.indexOf("localhost") > -1);

    if (local) {
        let title = document.getElementsByTagName("title")[0];
        title.innerText = "Slider Puzzle";
        let debug = true;
    }

    // "07020615100125220305230804200912181921142417131611"
    let parm = window.location.search.substring(1);
    if (parm.length > 0) dg_setGrid(parm);
    else {
        dg_setGrid('01020304050607080910111213141516171819202122232425');
        dg_shuffle();
    }

    dg_global.cache = "";
    dg_global.lastMoveLabel.innerHTML = "Last Move: --";
    dg_global.moveCountLabel.innerHTML = "Move Count: 0";
    dg_global.moveCount = 0;


}

function dg_runUserCode() {

    let userMove;

    if (dg_global.cache.length == 0) {
        let response = move(dg_global.gridString.innerText);
        dg_global.cache += response;
    }

    userMove = dg_global.cache.substr(0, 1);
    dg_global.cache = dg_global.cache.substr(1);

    if (userMove == undefined) userMove = "?";


    dg_global.moveCount++;
    dg_global.moveCountLabel.innerHTML = "Move Count: " + dg_global.moveCount;


    if ("LRUD".includes(userMove)) dg_swap1(userMove);
    else {
        clearInterval(dg_global.timer);
        dg_global.animButton.innerHTML = "animate()";
    }

    dg_global.lastMoveLabel.innerHTML = "Last Move: " + userMove;

}

function dg_shuffle() {

    /*
     * cell.row
     * cell.col
     * cell.actualVal  (where it is)
     * cell.targetVal  (where it should be)
     * cell.td  (the <td> where it is displayed)
     */

    for (let i = 0; i < 1000; i++) {
        let rnd1 = dg_randomNumber(1, 25);
        let rnd2 = dg_randomNumber(1, 25);
        let cell1 = dg_global.grid.find(c => c.actualVal == rnd1)
        let cell2 = dg_global.grid.find(c => c.actualVal == rnd2)
        dg_swap2(cell1, cell2)
    }

    dg_stringifyGrid();
}

function dg_randomNumber(min, max) {
    return Math.floor(Math.random() * max) + min;
}

function dg_swap1(direction) {

    /*
     * cell.row
     * cell.col
     * cell.actualVal  (where it is)
     * cell.targetVal  (where it should be)
     * cell.td  (the <td> where it is displayed)
     */

    // so, square 25 is the "blank" square lets grab it...
    let blankCell = dg_global.grid.find(c => c.actualVal == 25);
    let newRow = blankCell.row;
    let newCol = blankCell.col;
    if (direction == "L") newCol--;
    else if (direction == "R") newCol++;
    else if (direction == "U" || direction == "T") newRow--;
    else if (direction == "D" || direction == "B") newRow++;

    if (newRow > 0 && newRow < 6
        && newCol > 0 && newCol < 6) {
        let swapCell = dg_global.grid.find(c => c.row == newRow && c.col == newCol);
        dg_swap2(blankCell, swapCell);
        dg_stringifyGrid();
        let debug = 0;
    }

}

function dg_swap2(cell1, cell2) {

    /*
     * cell.row
     * cell.col
     * cell.actualVal  (where it is)
     * cell.targetVal  (where it should be)
     * cell.td  (the <td> where it is displayed)
     */

    let saveVal = cell1.actualVal;
    cell1.setVal(cell2.actualVal);
    cell2.setVal(saveVal);

    dg_colorize(cell1);
    dg_colorize(cell2);

    let debug = 0;

}

function dg_colorize(cell) {
    /*
     * cell.row
     * cell.col
     * cell.actualVal  (where it is)
     * cell.targetVal  (where it should be)
     * cell.td  (the <td> where it is displayed)
     */
    if (cell.actualVal == 25) {
        cell.td.style.backgroundColor = "navy";
        cell.td.style.color = "navy";
    }
    else if (cell.actualVal == cell.targetVal) {
        cell.td.style.backgroundColor = "red";
        cell.td.style.color = "white";
    }
    else {
        cell.td.style = null;
    }

}

function dg_stringifyGrid() {

    let str = "";

    for (let c = 0; c < 25; c++) {
        let cell = dg_global.grid[c];
        str += ("00" + cell.actualVal).slice(-2);
    }

    dg_global.gridString.innerText = str;
}

function dg_setGrid(board) {

    /*
     * cell.row
     * cell.col
     * cell.actualVal  (where it is)
     * cell.targetVal  (where it should be)
     * cell.td  (the <td> where it is displayed)
     */


    let grid = [];
    let actualIndex = 0;

    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
            let cell = {};
            cell.row = r + 1;
            cell.col = c + 1;
            cell.actualVal = parseInt(board.substr(actualIndex, 2));
            actualIndex += 2;
            grid.push(cell);
        }
    }


    for (let i = 1; i <= 25; i++) {
        let cell = grid[i - 1];
        cell.targetVal = i;
        let id = "TD" + i.toString();
        cell.td = dg_global[id];
        cell.setVal = function (val) {
            cell.actualVal = val;
            cell.td.innerText = val.toString();
        }
        cell.setVal(cell.actualVal);
        dg_colorize(cell);
    }

    dg_global.grid = grid;

    dg_stringifyGrid();
}

function dg_buildHTML() {

    let mainContainerElement;

    let tableElement;
    let trElement;
    let tdElement;
    let spanElement;
    let btnElement;
    let divElement;

    mainContainerElement = document.createElement("div");
    mainContainerElement.className = "main_container";
    document.body.appendChild(mainContainerElement);

    // main grid
    tableElelement = document.createElement("table");
    tableElelement.className = "board";
    mainContainerElement.appendChild(tableElelement);

    trElement = document.createElement("tr");
    tableElelement.appendChild(trElement);

    trElement.appendChild(dg_getTdElement(1));
    trElement.appendChild(dg_getTdElement(2));
    trElement.appendChild(dg_getTdElement(3));
    trElement.appendChild(dg_getTdElement(4));
    trElement.appendChild(dg_getTdElement(5));

    trElement = document.createElement("tr");
    tableElelement.appendChild(trElement);

    trElement.appendChild(dg_getTdElement(6));
    trElement.appendChild(dg_getTdElement(7));
    trElement.appendChild(dg_getTdElement(8));
    trElement.appendChild(dg_getTdElement(9));
    trElement.appendChild(dg_getTdElement(10));

    trElement = document.createElement("tr");
    tableElelement.appendChild(trElement);

    trElement.appendChild(dg_getTdElement(11));
    trElement.appendChild(dg_getTdElement(12));
    trElement.appendChild(dg_getTdElement(13));
    trElement.appendChild(dg_getTdElement(14));
    trElement.appendChild(dg_getTdElement(15));

    trElement = document.createElement("tr");
    tableElelement.appendChild(trElement);

    trElement.appendChild(dg_getTdElement(16));
    trElement.appendChild(dg_getTdElement(17));
    trElement.appendChild(dg_getTdElement(18));
    trElement.appendChild(dg_getTdElement(19));
    trElement.appendChild(dg_getTdElement(20));

    trElement = document.createElement("tr");
    tableElelement.appendChild(trElement);

    trElement.appendChild(dg_getTdElement(21));
    trElement.appendChild(dg_getTdElement(22));
    trElement.appendChild(dg_getTdElement(23));
    trElement.appendChild(dg_getTdElement(24));
    trElement.appendChild(dg_getTdElement(25));

    // stats table
    tableElement = document.createElement("table");
    tableElement.className = "stats_table";
    mainContainerElement.appendChild(tableElement);

    trElement = document.createElement("tr");
    tableElement.appendChild(trElement);

    tdElement = document.createElement("td");
    tdElement.className = "stats_td";
    trElement.appendChild(tdElement);

    spanElement = document.createElement("span");
    spanElement.id = "MoveCountLabel";
    spanElement.innerHTML = "Move Count: 0";
    dg_global.moveCountLabel = spanElement;
    tdElement.appendChild(spanElement);

    tdElement = document.createElement("td");
    tdElement.className = "stats_td";
    trElement.appendChild(tdElement);

    spanElement = document.createElement("span");
    spanElement.id = "LastMoveLabel";
    spanElement.innerHTML = "Last Move: --";
    dg_global.lastMoveLabel = spanElement;
    tdElement.appendChild(spanElement);

    //grid string
    divElement = document.createElement("div");
    divElement.id = "gridString";
    dg_global.gridString = divElement;
    mainContainerElement.appendChild(divElement);

    // Move Button
    let moveButton;
    moveButton = document.createElement("button");
    moveButton.className = "board_btn board_btn_shuffle";
    moveButton.innerHTML = "move()";
    moveButton.onclick = function () {
        dg_runUserCode();
    }
    mainContainerElement.appendChild(moveButton);

    // animate Button
    let animButton;
    animButton = document.createElement("button");
    animButton.className = "board_btn board_btn_shuffle";
    animButton.innerHTML = "animate()";
    animButton.onclick = function () {
        if (animButton.innerHTML == "animate()") {
            animButton.innerHTML = "stopAnimation()";
            dg_global.timer = setInterval(dg_runUserCode, 200);
        }
        else {
            animButton.innerHTML = "animate()";
            clearInterval(dg_global.timer);
        }
    }
    dg_global.animButton = animButton;
    mainContainerElement.appendChild(animButton);

    // Scramble Button
    scrambleButton = document.createElement("button");
    scrambleButton.className = "board_btn board_btn_shuffle";
    scrambleButton.innerHTML = "scramble()";
    scrambleButton.onclick = function () {
        window.location.reload(true);
    }
    mainContainerElement.appendChild(scrambleButton);

    // select File Button
    let selectFileButton = document.createElement("button");
    selectFileButton.className = "board_btn board_btn_shuffle";
    selectFileButton.innerHTML = "selectFile()";
    selectFileButton.id = "selectFileButton";
    selectFileButton.onclick = function () {
        let fileInput = document.getElementById("fileInput");
        fileInput.click();
    }

    mainContainerElement.appendChild(selectFileButton);

    // Import File Input
    let fileInput = document.createElement("input");
    fileInput.style.display = "none";
    fileInput.type = "file";
    fileInput.id = "fileInput";

    fileInput.onchange = function () {
            reloadFile();
            let sfb = document.getElementById("selectFileButton");
            sfb.innerHTML = "reloadFile()";
            sfb.onclick = function () { reloadFile(); }
    }

    mainContainerElement.appendChild(fileInput);

}

function dg_getTdElement(innerText) {
    let id = "TD" + innerText;

    let tdElement = document.createElement("td");
    tdElement.id = id;
    tdElement.className = "board_td";
    tdElement.innerText = innerText;

    dg_global[id] = tdElement;

    return tdElement;

}

function reloadFile() {

    let myScript = document.getElementById("MoveScript");
    if (myScript) {
        document.head.removeChild(myScript);
    }

    const reader = new FileReader();
    reader.onload = function fileReadCompleted() {
        myScript = document.createElement("script");
        document.head.appendChild(myScript);
        myScript.id = "MoveScript";
        myScript.innerText = reader.result;
        dg_global.cache = "";
    };

    let fileInput = document.getElementById("fileInput");
    reader.readAsText(fileInput.files[0]);

}
