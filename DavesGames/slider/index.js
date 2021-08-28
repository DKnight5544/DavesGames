
let urls = [];
let container;
let banner;
let footer;
let moveCount;
let percentComplete;
let cells;
let cellArray = [];
let moves = 0;
let justShuffled = true;
let blankCell;
let devInputArray;
let cachedMoves = [];

function begin() {

    container = document.getElementById("container");
    moveCount = document.getElementById("moveCount");
    percentComplete = document.getElementById("percentComplete");
    banner = document.getElementById("banner");
    devInputArray = document.getElementById("devInputArray");
    
    cells = document.getElementsByClassName("inner-div");


    //fbclid=IwAR3kySffqR3FV2LFLtEzpe15kogA113v4dBgv3XnebEe92g427CymsdJB5Y
    let picName = window.location.search.substring(1);

    let idx = picName.indexOf("fbclid=");
    if (idx > -1) picName = picName.substr(0, idx);
    picName = picName.replace("&", "");
    if (picName === "") picName = "numbers3";

    loadConfigScript(picName);

}

function loadConfigScript(picName) {

    let scriptLoaded = false;

    let script = document.createElement('script');
    script.src = "customization/" + picName + ".js";
    script.onload = function () {
        scriptLoaded = true;
        loadPix(picName);
    }

    document.head.appendChild(script);

    // this block is in case there is no js config file for the selected pic.
    setTimeout(function () {
        if (!scriptLoaded) {

            let script2 = document.createElement('script');
            script2.src = "customization/configtemplate.js";
            script2.onload = function () {
                scriptLoaded = true;
                loadPix(picName);
            }

            document.head.appendChild(script2);
        }
    }, 500);

}

function loadPix(picName) {

    let rowOffset = 5, colOffset = 3, cellNum = 0;
    let url = "url('customization/" + picName + ".jpg')";

    for (let i = 0; i < cells.length; i++) {

        // cell numbers
        let cellDiv = document.createElement("div");
        cellDiv.className = "cell-num";
        cellDiv.style.top = rowOffset.toString() + "px";
        cellDiv.style.left = colOffset.toString() + "px";
        cellDiv.innerHTML = (++cellNum).toString();

        // cells
        let d = cells[i];
        let row = parseInt(d.id.substr(1, 2));
        let col = parseInt(d.id.substr(4, 2));
        d.cellDiv = cellDiv;
        d.parentNode.appendChild(cellDiv);
        d.row = row;
        d.col = col;
        d.orgTop = -(row * 100).toString() + "px";
        d.orgLeft = -(col * 100).toString() + "px";
        d.idx = i;
        d.style.backgroundImage = url;
        d.style.left = d.orgLeft;
        d.style.top = d.orgTop;

        d.onclick = function (e) {
            swap(this);
            updateStatus(false);
        }

        cellArray.push(d);

        //Stylings from config file
        d.parentNode.style.borderColor = puzzleBackgroundColor;
        cellDiv.style.backgroundColor = backgroundColorArray[i];
        cellDiv.style.color = colorArray[i];
        container.style.backgroundColor = puzzleBackgroundColor;
        container.style.borderColor = puzzleBackgroundColor;
        container.style.borderColor = puzzleBackgroundColor;
        
        try{ showDev }
        catch(e) {
            if(e.name == "ReferenceError") {
                window.showDev = false;
            }
        }
            
    

    }

    moves = 0;
    blankCell = cellArray.find(c => c.row == 4 && c.col == 4);
    updateStatus(true);
}

function swap(cell2) {

    //validate legal cell was clicked.
    if (Math.abs(blankCell.row - cell2.row) > 1 || Math.abs(blankCell.col - cell2.col) > 1) return false;
    if (Math.abs(blankCell.row - cell2.row) == 0 && Math.abs(blankCell.col - cell2.col) == 0) return false;
    if (blankCell.row != cell2.row && blankCell.col != cell2.col) return false;

    // Process click
    moves++;
    let top = blankCell.style.top;
    let left = blankCell.style.left;
    let cellNum = blankCell.cellDiv.innerHTML;
    let cellNumColor = blankCell.cellDiv.style.color;
    let cellNumBackgroundColor = blankCell.cellDiv.style.backgroundColor;

    blankCell.style.top = cell2.style.top;
    blankCell.style.left = cell2.style.left;
    blankCell.cellDiv.innerHTML = cell2.cellDiv.innerHTML;
    blankCell.cellDiv.style.color = cell2.cellDiv.style.color;
    blankCell.cellDiv.style.backgroundColor = cell2.cellDiv.style.backgroundColor;

    cell2.style.top = top;
    cell2.style.left = left;
    cell2.cellDiv.innerHTML = cellNum;
    cell2.cellDiv.style.color = cellNumColor;
    cell2.cellDiv.style.backgroundColor = cellNumBackgroundColor;

    blankCell = cell2;
    
    return true;

}

function percentSolved() {
    let correct = 0
    for (let i = 0; i < cells.length; i++) {
        let d = cells[i];
        if (d.style.top == d.orgTop && d.style.left == d.orgLeft) {
            correct++
        }
    }
    return correct;
}

function randomInt(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function shuffle() {

    let r = 0;
    let lastRandom = -5;
    moves = 0;

    let cell2 = undefined;

    for (let l = 0; l < 50; l++) {

        while (r === 0) {

            r = randomInt(1, 4);

            if (Math.abs(r - lastRandom) === 2) r = 0;

            if (r === 1 && blankCell.col === 0) r = 0;
            else if (r === 2 && blankCell.row === 0) r = 0;
            else if (r === 3 && blankCell.col === 4) r = 0;
            else if (r === 4 && blankCell.row === 4) r = 0;
        }

        if (r === 1) cell2 = cellArray.find(i => i.row === blankCell.row && i.col === blankCell.col - 1);
        if (r === 2) cell2 = cellArray.find(i => i.row === blankCell.row - 1 && i.col === blankCell.col);
        if (r === 3) cell2 = cellArray.find(i => i.row === blankCell.row && i.col === blankCell.col + 1);
        if (r === 4) cell2 = cellArray.find(i => i.row === blankCell.row + 1 && i.col === blankCell.col);

        swap(cell2);

        lastRandom = r;
        r = 0;
    }

    moves = 0;
    updateStatus(false);

}

function updateStatus(newPic) {

    let correctCount = percentSolved();

    cellArray.forEach(function (c) { c.style.opacity = 1 });

    blankCell.style.opacity = (correctCount == 25) ? 1 : 0;

    let span = banner.children[0];

    if (newPic) span.innerHTML = puzzleSolving;
    else span.innerHTML = (correctCount == 25) ? puzzleSolved : puzzleSolving;

    moveCount.innerHTML = moves.toString();
    percentComplete.innerHTML = Math.round(((correctCount / 25) * 100)).toString() + "%";
    
    //js Devs section
    
    let text = "let puzzle = ["
    cellArray.forEach(function(c){
      text += c.cellDiv.innerHTML + ", ";
      
    });
    
    text += "];" ;
    
}


let showNumbers = false;
function toggleShowNumbers(sender) {
    showNumbers = !showNumbers;
    if (showNumbers) {
        sender.innerHTML = "HIDE";
        cellArray.forEach(
            function (c) {
                if (true) {
                    c.cellDiv.style.opacity = ".7";
                }
            }
        )
    }
    else {
        sender.innerHTML = "SHOW";
        cellArray.forEach(
            function (c) {
                c.cellDiv.style.opacity = "0";
            }
        )
    }
}
