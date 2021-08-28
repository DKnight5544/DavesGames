
const g = {};

function begin() {

    g.mainDiv = document.getElementById("mainDiv");
    g.btnStart = document.getElementById("btnStart");
    g.spnTicks = document.getElementById("spnTicks");
    g.tableSize = 100;
    g.tdObj = {};
    g.tdArray = [];
    g.litList = [];
    g.trueColor = "orange";
    g.falseColor = "grey"
    g.tickValue = 250;
    g.tickChange = 25;
    g.ticks = 0;
    g.isTimerStarted = false;

    loadTable();

}

function loadTable() {

    let tbl = document.createElement("table");

    for (let r = 0; r < g.tableSize; r++) {
        let tr = document.createElement("tr");
        for (let c = 0; c < g.tableSize; c++) {
            let td = document.createElement("td");
            td.id = getId(r, c);
            td.row = r;
            td.col = c;
            td.isSelected = false;
            td.style.backgroundColor = g.falseColor;
            td.onclick = td_onclick;
            g.tdObj[td.id] = td;
            g.tdArray.push(td);
            tr.appendChild(td);
        }

        tbl.appendChild(tr);
    }
    g.mainDiv.appendChild(tbl);
}

function getId(r, c) {
    return "r" + r.toString() + "c" + c.toString();
}

function td_onclick() {
    td = this;
    td.isSelected = !td.isSelected;

    if (td.isSelected) {
        td.style.backgroundColor = g.trueColor;
        let cell = createCell(td.row, td.col);
        cell.isLit = true;
        cell.td = td;
        g.litList.push(cell);
    }
    else {
        td.style.backgroundColor = g.falseColor;
        g.litList = g.litList.filter(c => c.td != td);
    }

}

function createCell(r, c) {
    let cell = {};
    cell.row = r;
    cell.col = c;
    cell.spermCount = 0;
    if (r >= 0 && r < g.tableSize && c >= 0 && c < g.tableSize) {
        let id = getId(r, c);
        cell.td = g.tdObj[id];
    }
    return cell;
}

function tickButton_onclick() {
    tick();
}

function startButton_onclick() {
    g.isTimerStarted = !g.isTimerStarted;
    g.btnStart.innerHTML = g.isTimerStarted ? "Stop" : "Start";
    tickTimer();
}

function slowerButton_onclick() {
    g.tickValue += g.tickChange;
}

function fasterButton_onclick() {
    g.tickValue = (g.tickValue > 0) ? g.tickValue - g.tickChange : g.tickValue;
}

function resetButton_onclick() {
    g.tickValue = 250;
    g.ticks = 0;
    g.spnTicks.innerHTML = "Ticks = 0";
    g.isTimerStarted = false;
    g.btnStart.innerHTML = "Start";
    g.litList = [];
    g.tdArray.forEach(function (td) {
        td.isSelected = false;
        td.style.backgroundColor = g.falseColor;
    });
}


function tickTimer() {
    if (!g.isTimerStarted) return;
    tick();
    setTimeout(tickTimer, g.tickValue);
}


function tick() {
    g.spnTicks.innerHTML = "Ticks = " + ++g.ticks;

    //first, determine if the lit cells will live or die.
    g.litList.forEach(function (cell) {

        neighborList = g.litList.filter(c =>
            c != cell
            && Math.abs(c.row - cell.row) < 2
            && Math.abs(c.col - cell.col) < 2

        );

        let neighborCount = neighborList ? neighborList.length : 0;
        cell.isLit = neighborCount > 1 && neighborCount < 4;
    });

    //it takes 3 lit cells surrounding an empty cell to reproduce
    if (g.litList.length >= 3) {

        let newCells = [];
        let newCell;
        g.litList.forEach(function (cell) {
            for (let r = cell.row - 1; r <= cell.row + 1; r++) {
                for (let c = cell.col - 1; c <= cell.col + 1; c++) {
                    if (r != cell.row || c != cell.col) {
                        let isLit = g.litList.find(lit => lit.row === r && lit.col === c);
                        if (!isLit) {
                            newCell = newCells.find(nc => nc.row === r && nc.col === c);
                            if (!newCell) {
                                newCell = createCell(r, c);
                                newCell.isLit = true;
                                newCells.push(newCell);
                            }
                            newCell.spermCount++;
                        }
                    }
                }
            }
        });

        newCells.filter(nc => nc.spermCount === 3).forEach(function (nc) { g.litList.push(nc) });

    }

    g.litList.forEach(function (cell) {
        if (cell.td) {
            cell.td.style.backgroundColor = cell.isLit ? g.trueColor : g.falseColor;
        }
    });

    // Now purge any dead cells from the litList (keep the live ones)
    g.litList = g.litList.filter(c => c.isLit);

}