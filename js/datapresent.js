// Apply JSON to remember the indexList
let indexList = [];
let showenPlots = [0,1,3,4,5,8];
let showenMaps = [0,1,3,4,5,8];

//when click "Show Option"
function showList(){
    for(let i in new Array(indexList.length).fill(1)){
        appen(i);
    }
    var hidden = document.getElementById("showOptions");
    hidden.setAttribute("onclick","hideOption()");
    hidden.innerText="Hide Option";
}

//when click "Hide Option"
function hideOption(){
    for(let i in new Array(indexList.length).fill(1)){
        document.getElementById(i+"").remove();
    }
    var hidden = document.getElementById("showOptions");
    hidden.setAttribute("onclick","showList()");
    hidden.innerText="Show Option";
}

//when click "All Indexes"
function selectAll(){
    for(let i in new Array(indexList.length).fill(1)){
        indexList[i].present="true";
    }
    if(document.getElementById("showOptions").innerText=='Hide Option'){
        for(let i in new Array(indexList.length).fill(1)){
            document.getElementById(i+"").remove();
            appen(i);
        }
    } 
}

//when click "Updable Index"
function selectUPAB(){
    for(let i in new Array(indexList.length).fill(1)){
        if(indexList[i].type=="UPAB")
            indexList[i].present="true";
        else
            indexList[i].present="false";
    }
    if(document.getElementById("showOptions").innerText=='Hide Option'){
        for(let i in new Array(indexList.length).fill(1)){
            document.getElementById(i+"").remove();
            appen(i);
        }
    }
}

//when click "Read Only"
function selectRDON(){
    for(let i in new Array(indexList.length).fill(1)){
        if(indexList[i].type=="RDON")
            indexList[i].present="true";
        else
            indexList[i].present="false";
    }
    if(document.getElementById("showOptions").innerText=='Hide Option'){
        for(let i in new Array(indexList.length).fill(1)){
            document.getElementById(i+"").remove();
            appen(i);
        }
    }
}

function check(i){
    if(indexList[i].present=="true"){
        indexList[i].present="false";
    }
    else{
        indexList[i].present="true";
    }
}

//append choice to table
function appen(i){
    var old = document.getElementById("indexList");
    let newitem = document.createElement("tr");
    let element = ' <div style="color: black; display: block;"><input type="checkbox" style="height:15px;width:15px" onclick="check('+i+')"><label></label></div>';
    newitem.id=i+'';
    newitem.innerHTML = element;
    newitem.querySelectorAll("input")[0].id = indexList[i].name; 
    if(indexList[i].present=='true'){
        newitem.querySelectorAll("input")[0].setAttribute('checked','true');
    }
    newitem.querySelectorAll("label")[0].setAttribute('for',indexList[i].name); 
    newitem.querySelector("label").innerText = indexList[i].name;
    old.appendChild(newitem);
    document.querySelector("form").reset();
}

function save(){
    fetch('./data/indexList.txt', {
        method: 'PUT',
        body: JSON.stringify(indexList)
        });
}

// function load(){
//     fetch('./data/indexList.txt')
//     .then(res => res.text())
//     .then(txt => {
//         if(indexList.length==0)
//             indexList=indexList.concat(JSON.parse(txt));
//         for(let i in new Array(indexList.length).fill(1)){
//             appen(i);
//         }
//     }); 
// }

//generate one line of the leaderboard
function newRow1(i,t,k){
    let res = '<td>Plot<br><div id = "plot'+ i;
    if(showenPlots.includes(Number(i))){
        res = res + '"><button onClick="removePlot('+i+')">Remove</button></div></td>';
    }
    else{
        res = res + '"><button onClick="addPlot('+i+')">Add</button></div></td>';
    }
    res = res+'<td><a href='+indexList[i].site+'>'+indexList[i].name+'</a></td>';
    return res;
}

function addPlot(i){
    if(showenPlots.length>6){
        showenPlots.push(i);
        let g = showenPlots.shift();
        let p = document.getElementById("plot"+g);
        p.innerHTML='<button onClick="addPlot('+g+')">Add</button>'
    }
    else{
        showenPlots.push(i);
    }
    let t = document.getElementById("plot"+i);
    t.innerHTML='<button onClick="removePlot('+i+')">Remove</button>';
}

function removePlot(i){
    showenPlots.splice(showenPlots.indexOf(i),1);
    let t = document.getElementById("plot"+i);
    t.innerHTML='<button onClick="addPlot('+i+')">Add</button>';
}

//generate leaderboard
function generate(){
    let t = document.getElementById("generateStandard").value;
    let k = document.getElementById("dataset").value;
    let g = document.getElementById("latencyBody");
    if(g!=null)
        g.remove();
    let tbody = document.createElement("tbody");
    tbody.id="latencyBody";
    for(let i in new Array(indexList.length).fill(1)){
        if(indexList[i].present=='true'){
            let newrow = document.createElement('tr');
            newrow.innerHTML=newRow1(i,t,k);
            tbody.appendChild(newrow);
        }
    }
    document.getElementById("latencyTable").appendChild(tbody);
}

//draw plots
// function draw(){
//     let plot = document.getElementById();
// }

// when load the page, read indexList from file, then generate table and plots 
window.onload=function(){
    fetch('./data/indexList.txt')
    .then(res => res.text())
    .then(txt => {
        indexList=indexList.concat(JSON.parse(txt));
        generate();
        // draw();
    }
    );
}