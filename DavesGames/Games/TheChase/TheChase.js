
let _InnerDiv;


function body_onload() {

    _InnerDiv = document.getElementById("InnerDiv");

}


function buildTable() {
    
    let table = document.createElement('table');
    let tr;
    let td;

    _InnerDiv.innerHTML = table;

    tr = document.createElement('tr');

    td = document.createElement('td');

    tr.appendChild(td);
   
    table.appendChild(tr);
    


}