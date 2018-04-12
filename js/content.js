// MIT License
//
// Copyright (c) 2018 Marcos Nesster
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.



var data = {};
var domInfo = { // dict with all row table
  rows: data
};
//
chrome.runtime.sendMessage({
  // request id tab load
  from:    'content',
  subject: 'showPageAction'
});

chrome.runtime.sendMessage({
  // send change icon background
    action: 'updateIcon',
    value: false,
    compo_length : ""
});

chrome.runtime.onMessage.addListener(function (msg, sender, response) {
  // add listener for send data to popup
  if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
    response(domInfo);
  }
});

row_OnClick("lista-turmas") //lista-turmas id table SIGAA
function row_OnClick(tblId) {
    console.log("hooking all row the table list");
    try { // add hook in all row tr and td
        var rows = document.getElementById(tblId).rows;
        for (i = 0; i < rows.length; i++) {
            var _row = rows[i];
            _row.onclick = null;
            _row.onclick = function () {
                return function () {selectRow(this);};
            }(_row);
        }
    }
        catch (err) { }
}


function count_compomentes(){
  chrome.runtime.sendMessage({
      action: 'updateIcon',
      value: false,
      compo_length : Object.keys(data).length
  });
}


function delete_select_row(data, temp){
     // delete row when checkbox is unchecked
     console.log("deteling the row...");
     var check = 0;
     for (key in data){
        if (data[key] != null){
          for (item in data[key]){
            if (item  != "horario" && data[key][item].includes(temp[item])){
              check++; // count same data for delete
            }
          }
          if (check > 1){
            // check if horario pratico is added under Teorica
            if (data[key]["pratica"] != null){
              console.log("deteling horario componente pratica...");
              for (key_horario in data){ // search in all data
                if (contains.call(data[key_horario]["horario"]),data[key]["horario"]){
                    data[key_horario]["horario"] = rmSpaceHorario(data[key_horario]["horario"],true);
                }
              }
            }
            delete data[key];
            return key;
          }
        }
     }
}

function rmSpaceHorario(horarios,remove){
    // remove all space in string horarios
    var output = split_horario(horarios);
    var str = "";
    if (!remove){
      for (var i=0;i< output.length;i++){
        output[i] = output[i].replace(/\s+/g,'')
        str += output[i] + " ";
      }
    }
    else{
      for (var i=0;i< output.length-1;i++){
        output[i] = output[i].replace(/\s+/g,'')
        str += output[i] + " ";
      }
    }
    return str;
}

function split_horario(horario){
  // split horario by space
    var output = horario.split(" ");
    return output;
}

function contains(needle) {
    // check if contain in array
    var findNaN = needle !== needle;
    var indexOf;

    if(!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    }
    return indexOf.call(this, needle) > -1;
};


function selectRow(row) {
   // select row and save data to send for popup
   count_compomentes();
   console.log("checking status checkbox row...");
   console.log(row)
   if (row.cells[0].firstChild.checked){
       var componente = prompt("Qual código do Componente ?", "Componente Curricular");
        if (componente != null) {
          if (!(componente in data)){
            for (var y = 0; y < row.cells.length; y++) {
              row.cells[y].style.backgroundColor = "#46B6AC";
            }
            console.log("add componente teorica...");
            data[componente] = {'professor': row.cells[2].textContent, 'horario':
            row.cells[6].textContent, 'turma': row.cells[1].textContent};
          }
          else{
            var resp = confirm("Componente Pratico ?");
            if (resp){
              console.log("add componente pratica...");
              for (var y = 0; y < row.cells.length; y++) {
                row.cells[y].style.backgroundColor = "#46B6AC";
              }
              data[componente]["horario"] = rmSpaceHorario(data[componente]["horario"],false);
              if (!contains.call(row.cells[6].textContent,data[componente]["horario"])){
                data[componente]["horario"] += row.cells[6].textContent;
              }
              data[componente+" P"] = {'professor': row.cells[2].textContent, 'horario':
              row.cells[6].textContent, 'turma': row.cells[1].textContent, 'pratica':"true"};
            }
            else{
              console.log("compomente has been added...");
              alert("Esse componente á foi adicionada!");
              row.cells[0].firstChild.checked = false;
            }
          }
        }
    }
   else{
       for (var y = 0; y < row.cells.length; y++) {
          row.cells[y].style.background = "none";
       }
       var temp = {'professor': row.cells[2].textContent, 'horario':
       row.cells[6].textContent, 'turma': row.cells[1].textContent};

       delete_select_row(data, temp);
   }
   // send signal for active icon
   count_compomentes();

}
