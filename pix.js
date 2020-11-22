
let urls = [];
let preview;
let status;
let cells;
let cellArray = [];
let cell1;
let moves = 0;

function begin() {

    preview = document.getElementById("inner-preview");
    status = document.getElementById("status");
    cells = document.getElementsByClassName("inner-div");

    //One time only...
    for (let i = 0; i < cells.length; i++) {
        let d = cells[i];
        let row = parseInt(d.id.substr(1, 2));
        let col = parseInt(d.id.substr(4, 2));
        d.row = row;
        d.col = col;
        d.orgMarginTop = -(row * 100).toString() + "px";
        d.orgMarginLeft = -(col * 100).toString() + "px";

        d.onclick = function (e) {
            moves++;
            swap(this);
        }

        cellArray.push(d)
    }

    let imgName = window.location.search.substring(1);
    if (imgName === "") imgName = "numbers";
    reloadPix(imgName);

    shuffle();
}

function swap(cell2) {

    //validate legal cell was clicked.
    if (Math.abs(cell1.row - cell2.row) > 1 || Math.abs(cell1.col - cell2.col) > 1) return false;
    if (cell1.row != cell2.row && cell1.col != cell2.col) return false;

    let marginTop = cell1.style.marginTop;
    let marginLeft = cell1.style.marginLeft;
    let opacity = cell1.style.opacity;

    cell1.style.marginTop = cell2.style.marginTop;
    cell1.style.marginLeft = cell2.style.marginLeft;
    cell1.style.opacity = cell2.style.opacity;

    cell2.style.marginTop = marginTop;
    cell2.style.marginLeft = marginLeft;
    cell2.style.opacity = opacity;

    cell1 = cell2;

    updateStatus();
}

function isSolved() {
    for (let i = 0; i < cells.length; i++) {
        let d = cells[i];
        if (d.style.marginTop != d.orgMarginTop || d.style.marginLeft != d.orgMarginLeft) {
            return false;
        }
    }
    return true;
}

function shuffle() {

    let r = 0;
    let lastRandom = -5;

    let cell2 = undefined;

    for (let l = 0; l < 50; l++) {

        while (r === 0) {

            r = randomInt(1, 4);

            if (Math.abs(r - lastRandom) === 2) r = 0;

            if (r === 1 && cell1.col === 0) r = 0;
            else if (r === 2 && cell1.row === 0) r = 0;
            else if (r === 3 && cell1.col === 4) r = 0;
            else if (r === 4 && cell1.row === 4) r = 0;
        }

        if (r === 1) cell2 = cellArray.find(i => i.row === cell1.row && i.col === cell1.col - 1);
        if (r === 2) cell2 = cellArray.find(i => i.row === cell1.row - 1 && i.col === cell1.col);
        if (r === 3) cell2 = cellArray.find(i => i.row === cell1.row && i.col === cell1.col + 1);
        if (r === 4) cell2 = cellArray.find(i => i.row === cell1.row + 1 && i.col === cell1.col);

        swap(cell2);

        lastRandom = r;
        r = 0;
    }

}

function randomInt(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function reloadPix(url) {

    url = "url('https://www.daves.games/piximages/" + url + ".jpg')";

    for (let i = 0; i < cells.length; i++) {
        let d = cells[i];
        d.style.backgroundImage = url;
        d.style.marginLeft = d.orgMarginLeft;
        d.style.marginTop = d.orgMarginTop;
        d.style.opacity = 1;
    }

    let d = cellArray.find(c => c.row == 4 && c.col == 4);
    d.style.opacity = 0;
    cell1 = d;


    preview.style.backgroundImage = url;

    shuffle();

    moves = 0;

    updateStatus();
}

function updateStatus() {

    status.innerHTML = "Moves: " + moves.toString();

    if (isSolved()) {
        let d = cellArray.find(c => c.row == 4 && c.col == 4);
        d.style.opacity = 1;
        status.innerHTML += " Solved!!";
        status.style.color = "red";
    }
    else {
        status.style.color = "black";
    }


}
