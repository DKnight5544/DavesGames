
let innerTableContainer;
let cells = [];
let timer = null;

let runner;

let chaserCount = 3;
let chasersLeft = chaserCount;
let chasers = [];

let obsticalCount = 3;
let obsticals = [];

let runnerColor = "blue";
let chaserColor = "skyblue";
let obsticalColor = "orange";
let boomColor = "red";
let transColor = "transparent";

let cellCount = 50;

let timerSetting = 300;

function Runner() {

    this.RowPosition;
    this.ColPosition;
    this.RowDirection;
    this.ColDirection;

    this.Reset = function () {

        this.RowPosition = Math.floor(Math.random() * 50);
        this.ColPosition = Math.floor(Math.random() * 50);
        this.RowDirection = 0;
        this.ColDirection = 0;

    }
}


function body_onload() {

    let td;

    innerTableContainer = document.getElementById("innerTableContainer");
    buildTable();


    document.onkeyup = function (e) {

        if (timer == null) timer = setInterval(pulse, timerSetting);

        switch (e.keyCode) {
            case 103:  // 7
            case 87:  // W
                runner.RowDirection = -1;
                runner.ColDirection = -1;
                break;
            case 104:  // 8
            case 69:  // E
                runner.RowDirection = -1;
                runner.ColDirection = -0;
                break;
            case 105: // 9
            case 82: // R
                runner.RowDirection = -1;
                runner.ColDirection = 1;
                break;
            case 100: // 4
            case 83: // S
                runner.RowDirection = 0;
                runner.ColDirection = -1;
                break;
            //case 101: // 5
            //case 68: // D
            //    runner.RowDirection = 0;
            //    runner.ColDirection = 0;
            //    break;
            case 102: // 6
            case 70: // F
                runner.RowDirection = 0;
                runner.ColDirection = 1;
                break;
            case 97: // 1
            case 88: // X
                runner.RowDirection = 1;
                runner.ColDirection = -1;
                break;
            case 98: // 2
            case 67: // C
                runner.RowDirection = 1;
                runner.ColDirection = 0;
                break;
            case 99: // 3
            case 86: // V
                runner.RowDirection = 1;
                runner.ColDirection = 1;
                break;
        }
    };

    runner = new Runner();
    runner.Reset();
    td = cells[runner.RowPosition][runner.ColPosition];
    td.style.backgroundColor = runnerColor;

    // Chasers
    for (let idx = 0; idx < chaserCount; idx++) {

        let chaser = new Runner();
        chasers[idx] = chaser;
        chaser.Reset();

        td = cells[chaser.RowPosition][chaser.ColPosition];

        while (td.style.backgroundColor != transColor) {
            chaser.Reset();
            td = cells[chaser.RowPosition][chaser.ColPosition];
        }

        td.style.backgroundColor = chaserColor;
    }

    // Obsticals
    for (let idx = 0; idx < obsticalCount; idx++) {

        let obstical = new Runner();
        obsticals[idx] = obstical;
        obstical.Reset();

        td = cells[obstical.RowPosition][obstical.ColPosition];

        while (td.style.backgroundColor != transColor) {
            obstical.Reset();
            td = cells[obstical.RowPosition][obstical.ColPosition];
        }

        td.style.backgroundColor = obsticalColor;

    }

    innerTableContainer.focus();
}


function buildTable() {

    let table = document.createElement('table');
    table.className = "Table";

    let tr;
    let td;

    for (let row = 0; row < cellCount; row++) {

        tr = document.createElement('tr');
        cells[row] = []

        for (let col = 0; col < cellCount; col++) {

            td = document.createElement('td');
            td.className = "Cell";
            td.style.backgroundColor = transColor;
            cells[row][col] = td;

            tr.appendChild(td);

        }

        table.appendChild(tr);
    }

    innerTableContainer.appendChild(table);

}


function pulse() {

    let td;

    td = cells[runner.RowPosition][runner.ColPosition];
    td.style.backgroundColor = transColor;

    runner.RowPosition += runner.RowDirection;
    runner.ColPosition += runner.ColDirection;

    //runner gets to wrap
    if (runner.RowPosition < 0) runner.RowPosition = 49;
    if (runner.RowPosition > 49) runner.RowPosition = 0;
    if (runner.ColPosition < 0) runner.ColPosition = 49;
    if (runner.ColPosition > 49) runner.ColPosition = 0;

    td = cells[runner.RowPosition][runner.ColPosition];
    td.style.backgroundColor = runnerColor;

    // Chasers
    for (let idx = 0; idx < chaserCount; idx++) {

        let chaser = chasers[idx];

        if (chaser != null) {

            td = cells[chaser.RowPosition][chaser.ColPosition];
            td.style.backgroundColor = transColor;

            if (chaser.RowPosition < runner.RowPosition) chaser.RowPosition += 1;
            else if (chaser.RowPosition > runner.RowPosition) chaser.RowPosition -= 1;
            if (chaser.ColPosition < runner.ColPosition) chaser.ColPosition += 1;
            else if (chaser.ColPosition > runner.ColPosition) chaser.ColPosition -= 1;

            if (chaser.RowPosition === runner.RowPosition &&
                chaser.ColPosition === runner.ColPosition) {

                td = cells[runner.RowPosition][runner.ColPosition];
                td.style.backgroundColor = boomColor;

                alert("GOTCHA -- Click OK to Play Again");
                playAgain();
                break;

            }


            td = cells[chaser.RowPosition][chaser.ColPosition];
            if (td.style.backgroundColor == transColor) {
                td.style.backgroundColor = chaserColor;
            }
            else {
                chaser = null;
                chasers[idx] = null;
                chasersLeft -= 1;

                if (chasersLeft === 0) {
                    alert("YOU GOT AWAY! Click OK to Play Again.")
                    playAgain();
                    break;
                }

            }

        }

    }

}


function playAgain() {

    clearInterval(timer);
    timer = null;
    let td;

    for (let row = 0; row < cellCount; row++) {
        for (let col = 0; col < cellCount; col++) {
            td = cells[row][col];
            td.style.backgroundColor = transColor;
        }
    }

    //runner
    runner.Reset();
    td = cells[runner.RowPosition][runner.ColPosition];
    td.style.backgroundColor = runnerColor;


    //chasers
    for (let idx = 0; idx < chaserCount; idx++) {

        if (chasers[idx] == null) chasers[idx] = new Runner();

        chaser = chasers[idx];
        chaser.Reset();

        td = cells[chaser.RowPosition][chaser.ColPosition];

        while (td.style.backgroundColor != transColor) {
            chaser.Reset();
            td = cells[chaser.RowPosition][chaser.ColPosition];
        }

        td.style.backgroundColor = chaserColor;
    }

    chasersLeft = chaserCount;

    //obsticals
    for (let idx = 0; idx < obsticalCount; idx++) {

        obstical = obsticals[idx];
        obstical.Reset();

        td = cells[obstical.RowPosition][obstical.ColPosition];

        while (td.style.backgroundColor != transColor) {
            obstical.Reset();
            td = cells[obstical.RowPosition][obstical.ColPosition];
        }

        td.style.backgroundColor = obsticalColor;
    }

}
