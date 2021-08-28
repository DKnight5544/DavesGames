


let solveButton;
let inputs;
let lastSelectedGridCell;
const defaultPuzzle = "030200408000000006620051000097100000010030040000009170000480051300000000501007030";
const blankPuzzle = "000000000000000000000000000000000000000000000000000000000000000000000000000000000";

let frozen;


function begin() {

    solveButton = document.getElementById("solve_button");
    inputs = document.getElementsByClassName("inp");
    const tenKeyWrapper = document.getElementById("ten_key_wrapper");

    // prepare grid
    for (let i = 0; i < inputs.length; i++) {

        let inp = inputs[i];
        inp.style.color = "red";

        inp.onclick = function (sender) {

            if (!frozen) {

                if (lastSelectedGridCell) {

                    lastSelectedGridCell.style.border =
                        (lastSelectedGridCell.innerHTML === "&nbsp;")
                        ? "1px dashed lightblue" : "2px solid red";
                }

                lastSelectedGridCell = sender.target;
                lastSelectedGridCell.style.border = "2px solid red"
                tenKeyWrapper.style.display = "block";
                solveButton.style.display = "none";
            }

        }

    }

    //prepare ten key pad
    const tenKeyBtns = document.getElementsByClassName("ten_key_btn");
    for (let i = 0; i < tenKeyBtns.length; i++) {

        let btn = tenKeyBtns[i];
        btn.onclick = function (sender) {
            let html = sender.target.innerHTML;
            let selectedDigit = html.length > 1 ? "&nbsp;" : html;
            lastSelectedGridCell.innerHTML = selectedDigit;
            lastSelectedGridCell.style.border = (selectedDigit === "&nbsp;")
                ? "1px dashed lightblue" : "2px solid red";
            tenKeyWrapper.style.display = "none";
            solveButton.style.display = "block";
        }

    }
}

function button_click() {

    if (solveButton.innerHTML === "SOLVE") {
        frozen = true;
        let usrinp = getUserInput();
        let puzzle = usrinp != blankPuzzle ? usrinp : defaultPuzzle;
        let solution = transform(puzzle);
        displaySolution(puzzle, solution);
        solveButton.innerHTML = "NEW PUZZLE";
    }

    else {

        for (let i = 0; i < inputs.length; i++) {
            inp = inputs[i];
            inp.innerHTML = "&nbsp;"
            inp.style.color = "red";
            inp.style.border = "1px dashed lightblue";
            let debug = true;
        }

        solveButton.innerHTML = "SOLVE";
        frozen = false;
    }

}

function getUserInput() {

    let userInput = "";

    for (let i = 0; i < inputs.length; i++) {
        let val = inputs[i].innerHTML.replace("&nbsp;", "0");
        userInput += val
        let debug = true;
    }

    return userInput;

}


function displaySolution(puzzle, solution) {


    for (let i = 0; i < inputs.length; i++) {
        inp = inputs[i];
        inp.innerHTML = solution.substr(i, 1);
        inp.style.color = solution.substr(i, 1) === puzzle.substr(i, 1) ? "red" : "blue";
        inp.style.border = solution.substr(i, 1) === puzzle.substr(i, 1) ? "2px solid red" : "1px dashed lightblue";
        let debug = true;
    }

}
