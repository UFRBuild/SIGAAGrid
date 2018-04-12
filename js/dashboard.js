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

var compo_info = {};
var dias = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta","Sábado"];
var prof_table = ["Professor","Turma","Código"]
var h_col = {2: 0, 3: 1, 4: 2, 5: 3, 6: 4, 7: 5};
var h_row = {1: 0, 2: 1, 3: 2, 4: 3, 5: 4};
var conflito_h = {}
var horarios_th = {
  "mytable_manha": ["7h - 8h","8h - 9h","9h - 10h","10h - 11h", "11h - 12h"],
  "mytable_tarde": ["13h - 14h","14h - 15h","15h - 16h","16h - 17h", "17h - 18h"],
  "mytable_noite": ["19h - 20h","20h - 21h","21h - 22h","22h - 23h"],
}
var colors = ["verde","azul","laranja","red","lilas","vinho","blue","rosa","marrom","default","verde_claro"];


function setDOMInfo(info) {
    var progressbar  = document.getElementById('progressbar');
    progressbar.setAttribute("class","mdl-progress mdl-js-progress mdl-progress__indeterminate center-block");
    compo_info = info.rows;
    setTimeout(function(){
      if (compo_info != {}){
        var comtador  = document.getElementById('contador_cmp');
        comtador.setAttribute("data-badge",Object.keys(compo_info).length);
      }
      progressbar.setAttribute("class","mdl-progress mdl-js-progress center-block");
    }, 3000);
}

// Once the DOM is ready...
window.addEventListener('DOMContentLoaded', function () {
    // ...query for the active tab...
    //document.getElementById("interact").addEventListener('click', interact_BrowserTab);
    //document.getElementById("createtable").addEventListener('click', add_componentes);
    //document.getElementById("limpar_storage").addEventListener('click', limpar_storage_data);
    document.getElementById("contador_conflito").addEventListener('click', check_conflito);
    document.getElementById("aboutApp").addEventListener('click', aboutApp);
    // connect checkbox with function
    document.getElementById("check_manha").addEventListener('click', change_checkbox);
    document.getElementById("check_tarde").addEventListener('click', change_checkbox);
    document.getElementById("check_noite").addEventListener('click', change_checkbox);
    // load data from storage chrome extension
    chrome.storage.local.get(null,function (obj){
        if (obj != {}){
            if (obj["checkbox"]["manha"]){
              addTable("mytable_manha",5,6);
              document.getElementById('check_manha').parentElement.MaterialCheckbox.check();
            }
            if (obj["checkbox"]["tarde"]){
              document.getElementById('check_tarde').parentElement.MaterialCheckbox.check();
              addTable("mytable_tarde",5,6);
            }
            if (obj["checkbox"]["noite"]){
              document.getElementById("check_noite").parentElement.MaterialCheckbox.check();
              addTable("mytable_noite",4,6);
            }
            if (obj["data"] != {}){
              compo_info = obj["data"];
              add_componentes();
              change_contador(null);
              change_contador_conflito(null);
              createTableProf("teste",Object.keys(compo_info).length,3)
            }
        }

      });

});

function aboutApp(){
  var text = "O SIGAA Grid é um app capaz de gerenciar e otimizar o processo de matrícula do SIGAA ";
  text += "(Sistema de Gestão das Atividades Acadêmica ).\n";
  text += "\nAutor: Marcos Bomfim \nEmail: mh4root@gmail.com \n";
  text += "\nThanks to: Guilherme Araújo, Marcos Silva ( dicas front-end) \n";
  alert(text);
}


function limpar_storage_data(){
    change_contador(0);
    change_contador_conflito(0);
    chrome.storage.local.get(null,function (obj){
        if (obj["checkbox"] != {}){
            if (obj["checkbox"]["manha"]){
              tableIdToRemove = document.getElementById("mytable_manha");
              tableIdToRemove.parentNode.removeChild(tableIdToRemove);
              addTable("mytable_manha",5,6);
            }
            if (obj["checkbox"]["tarde"]){
              tableIdToRemove = document.getElementById("mytable_tarde");
              tableIdToRemove.parentNode.removeChild(tableIdToRemove);
              addTable("mytable_tarde",5,6);
            }
            if (obj["checkbox"]["noite"]){
              tableIdToRemove = document.getElementById("mytable_noite");
              tableIdToRemove.parentNode.removeChild(tableIdToRemove);
              addTable("mytable_noite",4,6);
            }
        }

      });
    chrome.storage.local.clear(function() {
      var error = chrome.runtime.lastError;
      if (error) {
          console.error(error);
      }
    });
    compo_info = {};
}

function change_contador(m){
    var com  = document.getElementById('contador_cmp');
    if (m == null){
      com.setAttribute("data-badge",Object.keys(compo_info).length);
    }else{
      com.setAttribute("data-badge",m);
    }
}

function change_contador_conflito(m){
    var com  = document.getElementById('contador_conflito');
    if (m == null){
      com.setAttribute("data-badge",Object.keys(conflito_h).length);
    }else{
      com.setAttribute("data-badge",m);
    }
}

function check_conflito(){

  var texto = "";
  if (conflito_h != {}){
    for (key in conflito_h) {
      texto += "Compomente : " + key + "\n";
      texto += "Professor : " + conflito_h[key]["professor"] + "\n";
      texto += "Turma : " + conflito_h[key]["turma"].replace(/[\n\r]+/g, '') + "\n";
      texto += "Horario : " + conflito_h[key]["horario"] + "\n";
    }
  }
  if (texto != ""){
    alert(texto);
  }
}

function random_number(max) {
    return Math.floor((Math.random() * max) + 1);
}

function change_checkbox(event){
    var checkbox = event.target;
    if(checkbox.id == "check_manha"){
      if (checkbox.checked){
        addTable("mytable_manha",5,6);
      }
      else {
        tableIdToRemove = document.getElementById("mytable_manha");
        tableIdToRemove.parentNode.removeChild(tableIdToRemove);
      }
    }
    else if(checkbox.id == "check_tarde"){
      if (checkbox.checked){
        addTable("mytable_tarde",5,6);
      }
      else {
        tableIdToRemove = document.getElementById("mytable_tarde");
        tableIdToRemove.parentNode.removeChild(tableIdToRemove);
      }
    }
    else {
      if (checkbox.checked){
        addTable("mytable_noite",4,6);
      }
      else {
        tableIdToRemove = document.getElementById("mytable_noite");
        tableIdToRemove.parentNode.removeChild(tableIdToRemove);
      }
    }
    save_storage_chrome();
}

function save_storage_chrome(){
      //Set some content from browser action
    var manha_status = document.getElementById("check_manha").checked;
    var tarde_status = document.getElementById("check_tarde").checked;
    var noite_status = document.getElementById("check_noite").checked;
    chrome.storage.local.set({"data": compo_info,
      "checkbox": {"manha": manha_status, "tarde": tarde_status, "noite": noite_status}},function (){
      console.log("Storage Succesful");
    });
}


function interact_BrowserTab() {
    chrome.tabs.query({
    active: true,
    currentWindow: true
    }, function (tabs) {
      // ...and send a request for the DOM info...
      chrome.tabs.sendMessage(
          tabs[0].id,
          {from: 'popup', subject: 'DOMInfo'},
          // ...also specifying a callback to be called
          //    from the receiving end (content script)
          setDOMInfo);
    });
};


function contains(needle) {
    var findNaN = needle !== needle;
    var indexOf;

    if(!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    }
    return indexOf.call(this, needle) > -1;
};


function create_tooltip(codigo,info){
    var div = document.createElement('div');
    div.setAttribute("class","mdl-tooltip");
    div.setAttribute("for",codigo+"_button");
    var text1 = document.createTextNode("Turma: " +info["turma"]);
    div.appendChild(text1);
    return div;
}


function get_horario(horario,index){
    var output = [];
    if (horario.indexOf("M") !=-1) {
        var sNumber = horario.split("M")[index].toString();
    }else if (horario.indexOf("T") !=-1) {
        var sNumber = horario.split("T")[index].toString();
    }else if (horario.indexOf("N") !=-1) {
        var sNumber = horario.split("N")[index].toString();
    }

    for (var i = 0, len = sNumber.length; i < len; i += 1) {
      output.push(+sNumber.charAt(i));
    }
    if (index == 0){
        for (var i=0;i< output.length;i++){
          output[i] = h_col[output[i]]+1;
        }
    }
    else if (index == 1){
      for (var i=0;i< output.length;i++){
        output[i] = h_row[output[i]];
      }
    }
    return output;
};


function split_horario(horario){
    var output = horario.split(" ");
    return output;
}

function add_componentes(){
    var colors_copy = colors;
    for (codigo in compo_info){
        var horarios = split_horario(compo_info[codigo]["horario"]);
        var index = random_number(10);
        while (!contains.call(colors_copy, colors_copy[index])){
            index = random_number(10);
        }
        for (var i=0;i< horarios.length;i++){
          add_table_compomente(horarios[i],codigo,colors_copy, index);
        }
        colors_copy.splice(index, 1);
    }
    if (compo_info != {}){
      save_storage_chrome();
    }
    if (conflito_h != {}){
      var conflito  = document.getElementById('contador_conflito');
      conflito.setAttribute("data-badge",Object.keys(conflito_h).length);
    }
}

function add_table_compomente(horario,codigo_comp,colors,color_index){
    if (horario != ""){
      var rows;
      if (horario.indexOf("M") !=-1) {
        rows = document.getElementById('mytable_manha').rows;
      }else if (horario.indexOf("T") !=-1) {
        rows = document.getElementById('mytable_tarde').rows;
      }
      else if (horario.indexOf("N") !=-1) {
        rows = document.getElementById('mytable_noite').rows;
      }
      parte1 = get_horario(horario, 0);
      parte2 = get_horario(horario, 1);
      for (i = 0; i < rows.length; i++) {
          for (j = 0; j < rows[i].cells.length; j++) {
              if (contains.call(parte2, i) && (contains.call(parte1, j))){
                  var cell=rows[i].cells;
                  if (compo_info[codigo_comp]["pratica"] == null){
                    if (cell[j].id != ""){
                        if (!(cell[j].id in conflito_h)){
                          conflito_h[cell[j].id] = compo_info[cell[j].id];
                        }
                        if (!(codigo_comp in conflito_h)){
                          conflito_h[codigo_comp] = compo_info[codigo_comp];
                        }
                    }
                    cell[j].id = codigo_comp;

                    var btn = document.createElement('input');
                    btn.value = codigo_comp;
                    btn.type = "button";
                    btn.id = codigo_comp+"_button";
                    btn.className = "btn " + colors[color_index];
                    cell[j].appendChild(btn);
                    cell[j].appendChild(create_tooltip(codigo_comp,compo_info[codigo_comp]));
                }
              }
          }
      }
    }
}

function createTableProf(id, row , col,){
    var myTableDiv = document.getElementById("myDynamicTable_prof");
    var table = document.createElement('table');
    table.setAttribute("id",id);
    table.setAttribute("class", "mdl-data-table--selectable demo-list-control");


    var thead = document.createElement('thead');
    table.appendChild(thead);
    thead.appendChild(document.createElement("tr")).
    appendChild(document.createTextNode(""));
    for(var i=0;i<prof_table.length;i++){
        var ths = document.createElement("th");
        ths.setAttribute("class","mdl-data-table__cell--non-numeric mdl-card__supporting-text3")
        ths.innerHTML = prof_table[i];
        thead.appendChild(ths);
    }
    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);
    for (codigo in compo_info){
        var tr = document.createElement('TR');
        tableBody.appendChild(tr);
       var info = compo_info[codigo]

        var td1 = document.createElement('TD');
        var td2 = document.createElement('TD');
        var td3 = document.createElement('TD');
        td1.setAttribute("class", "mdl-data-table__cell--non-numeric mdl-card__supporting-text2");
        td2.setAttribute("class", "mdl-data-table__cell--non-numeric mdl-card__supporting-text2");
        td3.setAttribute("class", "mdl-data-table__cell--non-numeric mdl-card__supporting-text2");
        td1.appendChild(document.createTextNode(info["professor"]));
        td2.appendChild(document.createTextNode(info["turma"]));
        td3.appendChild(document.createTextNode(codigo));
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
    }
    myTableDiv.appendChild(table);
}



function addTable(id, row, col) {

    var myTableDiv = document.getElementById("myDynamicTable");
    var table = document.createElement('table');
    table.setAttribute("id",id);
    table.setAttribute("class", "mdl-data-table mdl-js-data-table  mdl-cell mdl-shadow--4dp");
    table.border='1';

    row_header = horarios_th[id];
    if (id  == "mytable_manha" || id ==  "mytable_noite"){
      var thead = document.createElement('thead');
      table.appendChild(thead);
      thead.appendChild(document.createElement("th")).
      appendChild(document.createTextNode(""));
      for(var i=0;i<dias.length;i++){
        var ths = document.createElement("th");
        ths.innerHTML = dias[i];
        thead.appendChild(ths);
      }
    }

    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);
    for (var i=0; i<row; i++){
        var tr = document.createElement('TR');
        tableBody.appendChild(tr);

        th = document.createElement('th');
        th.innerHTML = row_header[i];
        tr.appendChild(th);

        for (var j=0; j<col; j++){
          var td = document.createElement('TD');
          td.setAttribute("class", "mdl-data-table__cell--non-numeric");
          tr.appendChild(td);
        }
    }
    myTableDiv.appendChild(table);

}
