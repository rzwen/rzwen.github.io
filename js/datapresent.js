// Apply JSON to remember the indexList
let indexList = [];
// indexList[0]={'name':'RMI','type':'RDON','present':'true','site':''};
// indexList[1]={'name':'RS','type':'RDON','present':'true','site':''};
// indexList[2]={'name':'PGM','type':'UPAB','present':'true','site':''};
// indexList[3]={'name':'ART','type':'UPAB','present':'true','site':''};
// indexList[4]={'name':'LIPP','type':'UPAB','present':'true','site':''};
// indexList[5]={'name':'BTree','type':'UPAB','present':'true','site':''};
// indexList[6]={'name':'IBTree','type':'UPAB','present':'true','site':''};
// indexList[7]={'name':'FAST','type':'RDON','present':'true','site':''};
// indexList[8]={'name':'ALEX','type':'UPAB','present':'true','site':''};
// indexList[9]={'name':'Wormhole','type':'UPAB','present':'true','site':''};
// indexList[10]={'name':'RBS','type':'RDON','present':'true','site':''};
// indexList[11]={'name':'RobinHash','type':'UPAB','present':'true','site':''};
// indexList[12]={'name':'BinarySearch','type':'UPAB','present':'true','site':''};
// indexList[13]={'name':'CHT','type':'UPAB','present':'true','site':''};
// indexList[14]={'name':'CuchooMap','type':'UPAB','present':'true','site':''};


function test(){
    alert("nothing");
}

function showList(){
    load();
    var hidden = document.getElementById("showOptions");
    hidden.setAttribute("onclick","hideOption()");
    hidden.innerText="Hide Option";
}

function hideOption(){
    for(let i in new Array(indexList.length).fill(1)){console.log(1);
        let t = document.getElementById(i+"").remove();
    }
    var hidden = document.getElementById("showOptions");
    hidden.setAttribute("onclick","showList()");
    hidden.innerText="Show Option";
}

function appen(i){
    var old = document.getElementById("indexList");
    let newitem = document.createElement("tr");
    let element = ' <div style="color: black; display: block;"><input type="checkbox" style="height:15px;width:15px"><label></label></div>';
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

function load(){
    fetch('./data/indexList.txt')
    .then(res => res.text())
    .then(txt => {
        for(let i in new Array(indexList.length).fill(1)){
            let t = document.getElementById(i+"").remove();
        }
        indexList=[];
        indexList=indexList.concat(JSON.parse(txt));
        for(let i in new Array(indexList.length).fill(1)){
            appen(i);
        }
    }); 
}