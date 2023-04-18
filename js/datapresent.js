// Apply JSON to remember the indexList
let indexList = [];
let datasetList = [];
let showenPlots = [0,1,3,4,5,8];
let showInHeatmap = ['biology','covid_tweets','planet_features_osm_id','fb','books','wiki_revid','osm_cellids'];
let sortOr = [true,true,true,true,true,true]

// data[] store all test data 
//0: LIPP , 1: BTree , 2: HOT , 3: ALEX , 4: Wormhole , 5: Artunsync , 6: XIndex , 7: FineIndex , 8: massTree , 9: PGM
let data = [];
data[0] = []; //store mt
data[1] = []; //store st

let memory = [];
memory[0] = []; //alex
memory[1] = []; //lipp
memory[2] = []; //pgm
memory[3] = []; //art
memory[4] = []; //btree
memory[5] = []; //hot

let lat = [];
lat[0] = [];//art
lat[1] = [];//hot
lat[2] = [];//btree
lat[3] = [];//wormhole
lat[4] = [];//masstree
lat[5] = [];//alex
lat[6] = [];//lipp
lat[7] = [];//xindex
lat[8] = [];//finedex
lat[9] = [];//pgm

let readradio = [1,0.8,0.5,0.2,0];

let heatmap=[]

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

//when click "Learned Indexes"
function selectLE(){
    for(let i in new Array(indexList.length).fill(1)){
        if(indexList[i].type=="Learn"){
            indexList[i].present="true";
        }
        else{
            indexList[i].present="false";
        }
    }
    if(document.getElementById("showOptions").innerText=='Hide Option'){
        for(let i in new Array(indexList.length).fill(1)){
            document.getElementById(i+"").remove();
            appen(i);
        }
    }
}

//when click "Traditional Indexes"
function selectTR(){
    for(let i in new Array(indexList.length).fill(1)){
        if(indexList[i].type=="Trad"){
            indexList[i].present="true";
        } 
        else{
            indexList[i].present="false";
        }
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
function newRow1(i,stand,dataset){
    let res = '<td>Plot<br><div id = "plot'+ i;
    if(showenPlots.includes(Number(i))){
        res = res + '"><button onClick="removePlot('+i+')">Remove</button></div></td>';
    }
    else{
        res = res + '"><button onClick="addPlot('+i+')">Add</button></div></td>';
    }

    res = res+'<td><a target="blank" href='+indexList[i].site+'>';
    if(indexList[i].type=='Learn'){
        res= res + '<b>'+indexList[i].name+'</b></a></td>';
    }
    else{
        res = res+ indexList[i].name+'</a></td>';
    }
    for(let radio in readradio){
        let tmp = 0;
        let num = 0;
        for(let j in new Array(data[stand][i].length).fill(1)){
            if(data[stand][i][j][5].indexOf(dataset)==-1){
                continue;
            }
            if(stand==0&&data[stand][index][j][9]!='24'){
                continue;
            }
            if(Math.abs(data[stand][i][j][0]-readradio[radio])<0.001){
                tmp+=parseInt(data[stand][i][j][7]);
                num+=1;
            }
        }
        if(num==0){
            res+='<td>NotTested</td>';
        }
        else
            res+='<td>'+parseInt(tmp/num)+'</td>';
    }
    return res;
}

function addPlot(i){
    let tt = document.getElementById("generateStandard").value;
    let t = (tt=="Single_thread"?1:0);
    let k = document.getElementById("dataset").value;
    var b = document.getElementById('latencyBody').querySelectorAll('tr');
    for(gg of b){
        if(gg.querySelectorAll('td')[1].innerText==indexList[i].name){
            if(gg.querySelectorAll('td')[2].innerText=='NotTested'){
                return;
            }
            else{
                break;
            }
        }
    }
    if(showenPlots.length>6){
        showenPlots.push(i);
        let g = showenPlots.shift();
        let p = document.getElementById("plot"+g);
        p.innerHTML='<button onClick="addPlot('+g+')">Add</button>';
        // $chart.data.datasets.shift();
    }
    else{
        showenPlots.push(i);
    }
    // var added = getLineData(i,t,k)
    // $chart.data.datasets.push(added);
    // $chart.update();
    draw();
    let zz = document.getElementById("plot"+i);
    zz.innerHTML='<button onClick="removePlot('+i+')">Remove</button>';
}

function removePlot(i){
    showenPlots.splice(showenPlots.indexOf(i),1);
    draw();
    let t = document.getElementById("plot"+i);
    t.innerHTML='<button onClick="addPlot('+i+')">Add</button>';
}

//generate leaderboard
function generate(){
    let tt = document.getElementById("generateStandard").value;
    let t = (tt=="Single_thread"?1:0);
    let k = document.getElementById("dataset").value;
    let g = document.getElementById("latencyBody");
    if(g!=null)
        g.remove();
    let tbody = document.createElement("tbody");
    tbody.setAttribute('style',"border:thin solid gray");
    tbody.id="latencyBody";
    for(let i in new Array(indexList.length).fill(1)){
        if(indexList[i].present=='true'){
            let newrow = document.createElement('tr');
            newrow.id = i;
            newrow.innerHTML=newRow1(i,t,k);
            tbody.appendChild(newrow);
        }
    }
    document.getElementById("latencyTable").appendChild(tbody);
    draw();
    drawCores();
    drawMem();
    drawLat();
}

//show the datasetList
function datasets(){
    let t = document.getElementById("dataset");
    let group = document.createElement("optgroup");
    group.setAttribute("label","---200M_uint64---");
    group.id = "datagroup";
    t.appendChild(group);
    for(let i in new Array(datasetList.length).fill(1)){
        let newdataset = document.createElement('option');
        newdataset.innerHTML=datasetList[i].name;
        group.appendChild(newdataset);
    }
    let group2 = document.createElement("optgroup");
    group2.setAttribute("label",'---Other Datasets---');
    group2.id = "datagroup";
    t.appendChild(group2);
}
//when somebody check to change what heatmap present
function adjustHeatmap(i){
    let z = document.getElementById(datasetList[i].name).checked;
    if(z){
        showInHeatmap[showInHeatmap.length]=datasetList[i].name;
    }
    else{
        var index = showInHeatmap.indexOf(datasetList[i].name);
        showInHeatmap.splice(index,1);
    }
}

//dataset List for heatmap
function datasetLi(){
    let t = document.getElementById("datasetlt");
    let gg = document.createElement('tr');
    for(let i in new Array(datasetList.length).fill(1)){
        let item = document.createElement('td');
        item.setAttribute("style",'{width:20%}');
        var element = '<input type="checkbox" onClick="adjustHeatmap('+i+')" style="height:15px;width:15px"><label></label>';
        item.innerHTML = element;
        item.querySelectorAll("input")[0].id = datasetList[i].name;
        if(showInHeatmap.includes(datasetList[i].name)){
            item.querySelectorAll("input")[0].setAttribute('checked','true');
        }
        let g = datasetList[i].name;
        if(g.length>15){g=g.slice(0,g.indexOf('_'));} 
        if(g=='osm'){g='history';}
        item.querySelectorAll("label")[0].setAttribute('for',datasetList[i].name); 
        item.querySelector("label").innerText =g;
        gg.appendChild(item);
        if(i%5==4){
            t.appendChild(gg);
            gg = document.createElement('tr');
        }
    }
    if(gg.innerHTML!=undefined)
        t.appendChild(gg); 
}

//reorder table
function reorder(col){
    var table = document.getElementsByTagName('tbody')[0];
    var tr = table.rows;
    var arr = [];
    for(var x=0;x<tr.length;x++){
        arr[x] = tr[x];
    }
    for(let i=0;i<arr.length;i++){
        for(let j = i+1;j<arr.length;j++){
            var first = arr[i].querySelectorAll('td')[col].innerText;
            var second = arr[j].querySelectorAll('td')[col].innerText;
            if(first == 'NotTested'){
                var tmp = arr[i];
                arr[i] = arr[j];
                arr[j] = tmp;
                continue;
            }
            if(second == 'NotTested') continue;
            if(Number(first)<Number(second)){
                var tmp = arr[i];
                arr[i] = arr[j];
                arr[j] = tmp;
            }
        }
    }
    
    if(sortOr[col-1]){
        for(var x=0;x<arr.length;x++){
            table.appendChild(arr[x]);
        }
        sortOr[col-1] = false;
    }
    else{
        var notTested = [];
        for(var x=arr.length-1;x>=0;x--){
            if(arr[x].querySelectorAll('td')[col].innerText=='NotTested'){
                notTested[notTested.length]=arr[x];
                continue;
            }
            table.appendChild(arr[x]);
        }
        for(var x=0;x<notTested.length;x++){
            table.appendChild(notTested[x]);
        }
        sortOr[col-1] = true;
    }
}

function getLineData(index,stand,dataset){
    // var res = [];
    // for(index of showenPlots){
        var ttt = {'label':indexList[index].name,'borderColor':indexList[index].heatmap,'data':[]};
        for(let radio in readradio){
            let tmp = 0;
            let num = 0;
            for(let j in new Array(data[stand][index].length).fill(1)){
                if(data[stand][index][j][5].indexOf(dataset)==-1){
                    continue;
                }
                if(stand==0&&data[stand][index][j][9]!='24'){
                    continue;
                }
                if(Math.abs(data[stand][index][j][0]-readradio[radio])<0.001){
                    tmp+=parseInt(data[stand][index][j][7]);
                    num+=1;
                }
            }
            var kg = (tmp/num)/1000000;
            ttt.data[ttt.data.length]=kg.toFixed(3);
        }
    return ttt
}



function draw(){ 
    var chart;
    document.getElementById('plotParent') && document.getElementById('plotParent').removeChild(document.getElementById('plots'));
    var ctx = document.createElement('canvas');
    ctx.id = 'plots';
    ctx.className = 'chart';
    document.getElementById('plotParent') && document.getElementById('plotParent').appendChild(ctx);
    let tt = document.getElementById("generateStandard").value;
    let t = (tt=="Single_thread"?1:0);
    let k = document.getElementById("dataset").value;
    let dataset = [];
    for(index of showenPlots){
        let tmp = getLineData(index, t , k);
        dataset[dataset.length]=tmp;
    }
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["0", "20%", "50%", "80%", "100%"],
            datasets: dataset,
        },
        options: {
            title: {
            display: true,
            text: "Throuput to Write-Ratio: "+tt
            },
            legend:{
                postion: 'right'
            },
            scales: {
                yAxes: [{
                  scaleLabel: {
                    display: true,
                    labelString: 'Throughput (Mbps)'
                  }
                }],
                xAxes: [{
                    scaleLabel: {
                      display: true,
                      labelString: 'Write_Ratio'
                    }
                  }]
              }
        }
    });
}

function getLineDataCores(index,Ratio,dataset){
    var ttt = {'label':indexList[index].name,'borderColor':indexList[index].heatmap,'data':[]};
    var cores = ['2','4','8','16','24'];
    for(radio of cores){
        let tmp = 0;
        let num = 0;
        for(let j in new Array(data[0][index].length).fill(1)){
            if(data[0][index][j][5].indexOf(dataset)==-1){
                continue;
            }
            if(Math.abs(data[0][index][j][0]-Ratio)<0.001 && data[0][index][j][9]==radio){
                
                tmp+=parseInt(data[0][index][j][7]);
                num+=1;
            }
        }
        var kg = (tmp/num)/1000000
        ttt.data[ttt.data.length]=kg.toFixed(3);
    }
    return ttt;
}


function drawCores(){ 
    var chart;
    document.getElementById('cores') && document.getElementById('cores').removeChild(document.getElementById('coresPlots'));
    var ctx = document.createElement('canvas');
    ctx.id = 'coresPlots';
    ctx.className = 'chart';
    document.getElementById('cores') && document.getElementById('cores').appendChild(ctx);
    let tt = document.getElementById("ReadRatio").value;
    let t = (tt=="Read Only"?1:tt=="Write Only"?0:0.5);
    let k = document.getElementById("dataset1").value;
    let dataset = [];
    for(index =0;index<9;index++){
        let tmp = getLineDataCores(index, t , k);
        dataset[dataset.length]=tmp;
    }
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["2", "4", "8", "16", "24"],
            datasets: dataset,
        },
        options: {
            title: {
            display: true,
            text: "Throuput in Dataset: "+k
            },
            legend:{
                postion: 'right'
            },
            scales: {
                yAxes: [{
                  scaleLabel: {
                    display: true,
                    labelString: tt+' Throughput (Mbps)'
                  }
                }],
                xAxes: [{
                    scaleLabel: {
                      display: true,
                      labelString: 'Cores'
                    }
                  }]
              }
        }
    });
}

function getLineDataMem(dataset){
    var ttt = [];
    for(let index =0;index<6; index++){
        let tmp = 0;
        let num = 0;
        for(let j in new Array(memory[index].length).fill(1)){
            if(memory[index][j][0].indexOf(dataset)==-1){
                continue;
            }
            tmp +=parseInt(memory[index][j][2]);
            num+=1;
        }
        
        var kk =(tmp/num)/1000000000;
        ttt[ttt.length] = kk.toFixed(3);
    }
    return ttt;
}

function drawMem(){
    var chart;
    document.getElementById('memory') && document.getElementById('memory').removeChild(document.getElementById('memoryPlots'));
    var ctx = document.createElement('canvas');
    ctx.id = 'memoryPlots';
    ctx.className = 'chart';
    document.getElementById('memory') && document.getElementById('memory').appendChild(ctx);
    let tt = document.getElementById("dataset2").value;
    let labell = ["ALEX", "LIPP","PGM","Artunsync", "BTree", "HOT"];
    let data = {
        labels: labell,
        datasets: [{
          data: getLineDataMem(tt),
          backgroundColor: [
            'rgba(0,0,255,0.6)',
            'rgba(255,0,0,0.6)',
            'rgba(125,0,255,0.6)',
            'rgba(255,0,255,0.6)',
            'rgba(0,255,0,0.6)',
            'rgba(255,255,0,0.6)'
          ],
          borderColor: [
            'rgb(0,0,255)',
            'rgb(255,0,0)',
            'rgb(125,0,255)',
            'rgb(255,0,255)',
            'rgb(0,255,0)',
            'rgb(255,255,0)'
          ],
          borderWidth: 0.7
        }]
      };
    chart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            title: {
            display: true,
            text: tt
            },
            legend:{
               display: false,
            },
            scales: {
                yAxes: [{
                  scaleLabel: {
                    display: true,
                    labelString: 'Size (GB)',
                  },
                  ticks: {
                    beginAtZero:true
                }
                }],
                xAxes: [{
                    scaleLabel: {
                      display: true,
                      labelString: 'Indexes'
                    }
                  }]
              }
        }
    });
}

function getLineDataLat(op,ds,lr,co){
    var ttt = [];
    var stand = op=='lookup'?1:0;
    var cores = '1';
    if(co!='single core'){
        cores = '24';
    } 
    var latt = ['50%','90%','99%','99.9%','99.99%'];
    var ii = latt.indexOf(lr) + 4;
    for(let index =0;index<9; index++){
        let tmp = 0;
        let num = 0;
        for(let j in new Array(lat[index].length).fill(1)){
            if(lat[index][j][0]!=stand){
                continue;
            }
            
            if(!lat[index][j][1].includes(ds)){
                continue;
            }
            if(lat[index][j][3]!=cores){
                continue;
            }console.log(lat[index][j][3]);
            
            tmp +=parseInt(lat[index][j][ii]);
            num+=1;
        }
        var kk =parseInt(tmp/num);
        ttt[ttt.length] = kk;
    }
    if(co=='single core'){
        index = 9;
        let tmp = 0;
        let num = 0;
        for(let j in new Array(lat[index].length).fill(1)){
            
            if(lat[index][j][0]!=stand){
                continue;
            }
            if(!lat[index][j][1].includes(ds)){
                continue;
            }
            if(lat[index][j][3]!=cores){
                continue;
            }
            tmp +=parseInt(lat[index][j][ii]);
            num+=1;
        }
        var kk =parseInt(tmp/num);
        ttt[ttt.length] = kk;
    }
    return ttt;
}

function drawLat(){
    var chart;
    document.getElementById('lat') && document.getElementById('lat').removeChild(document.getElementById('latPlots'));
    var ctx = document.createElement('canvas');
    ctx.id = 'latPlots';
    ctx.className = 'chart';
    document.getElementById('lat') && document.getElementById('lat').appendChild(ctx);
    let op = document.getElementById("insert/lookup").value;
    let ds = document.getElementById("dataset3").value;
    let lr = document.getElementById("latencyRate").value;
    let co = document.getElementById("corrr").value;
    let label = ["Artunsync", "HOT","BTree","Wormhole", "massTree", "ALEX","LIPP","XIndex","Finedex"];
    let back = ['rgba(255,0,255,0.5)','rgba(255,255,0,0.5)','rgba(0,255,0,0.5)','rgba(0,255,255,0.5)','rgba(171,171,0,0.5)',
        'rgba(0,0,255,0.5)','rgba(255,0,0,0.5)','rgba(225,171,0,0.5)','rgba(102,102,0,0.5)'];
    let bold = ['rgb(255,0,255)','rgb(255,255,0)','rgb(0,255,0)','rgb(0,255,255)','rgb(171,171,0)',
    'rgb(0,0,255)','rgb(255,0,0)','rgb(225,171,0)','rgb(102,102,0)'];
    if(co=='single core'){
        label[9] = "PGM";
        back[9] = 'rgba(125,0,255,0.5)';
        bold[9] = 'rgb(125,0,255)';
    }
    let data = {
        labels: label,
        datasets: [{
          data: getLineDataLat(op,ds,lr,co),
          backgroundColor: back,
          borderColor: bold,
          borderWidth: 0.7
        }]
      };
    chart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            title: {
            display: true,
            text: ds
            },
            legend:{
               display: false,
            },
            scales: {
                yAxes: [{
                  scaleLabel: {
                    display: true,
                    labelString: lr+ ' (ns)',
                  },
                  ticks: {
                    beginAtZero:true
                }
                }],
                xAxes: [{
                    scaleLabel: {
                      display: true,
                      labelString: 'Tail latency of '+op + ' operation ('+co+')'
                    }
                  }]
              }
        }
    });
}

// get the color of points in heatmap
function getColor(Learn,Traditional){
    var res;
    if(Learn<Traditional){
        
        var radi = (Traditional-Learn)/Traditional;
        var g = 2*(1-radi)* 255;
        var tmp = g.toString(16);
        tmp = tmp.split('.')[0]
        if(tmp.length<2)tmp='0'+tmp;
        res = '0xff'+tmp+'00';
        res = Number(res);
    }
    else{
        var radi = (Learn-Traditional)/Learn;
        var g = 2*(1-radi)*255;
        var tmp = g.toString(16);
        tmp = tmp.split('.')[0]
        if(tmp.length<2)tmp='0'+tmp;
        res = '0x00'+tmp+'ff';
        res = Number(res);
    }
    return res;
}

// generate Heat Map
function generateHeatMap(){
    var ele = document.getElementById('tt');
    ele.innerHTML='';
    w = window.innerWidth*0.53;
    h = window.innerHeight*0.8;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, w/h, 0.1 , 100000);
    this.mesh = new THREE.Object3D();
    // var axesHelper = new THREE.AxesHelper(12); this.mesh.add(axesHelper);
    var gridXZ = new THREE.GridHelper(8, 8, 0x7BB7A4, 0x7BB7A4); gridXZ.position.set(4,0,4); this.mesh.add(gridXZ);
    var gridXY = new THREE.GridHelper(6, 6, 0x7BB7A4, 0x7BB7A4); gridXY.position.set(3,3,0); gridXY.rotation.x = Math.PI/2.0; this.mesh.add(gridXY);
    var gridXY1 = new THREE.GridHelper(2, 2, 0x7BB7A4, 0x7BB7A4); gridXY1.position.set(7,1,0); gridXY1.rotation.x = Math.PI/2.0; this.mesh.add(gridXY1); 
    var gridXY2 = new THREE.GridHelper(2, 2, 0x7BB7A4, 0x7BB7A4); gridXY2.position.set(7,3,0); gridXY2.rotation.x = Math.PI/2.0; this.mesh.add(gridXY2); 
    var gridXY3 = new THREE.GridHelper(2, 2, 0x7BB7A4, 0x7BB7A4); gridXY3.position.set(7,5,0); gridXY3.rotation.x = Math.PI/2.0; this.mesh.add(gridXY3); 
    var gridYZ = new THREE.GridHelper(6, 6, 0x7BB7A4, 0x7BB7A4); gridYZ.position.set(8,3,3); gridYZ.rotation.z = Math.PI/2; this.mesh.add(gridYZ);
    var gridYZ1 = new THREE.GridHelper(2, 2, 0x7BB7A4, 0x7BB7A4); gridYZ1.position.set(8,1,7); gridYZ1.rotation.z = Math.PI/2; this.mesh.add(gridYZ1);
    var gridYZ2 = new THREE.GridHelper(2, 2, 0x7BB7A4, 0x7BB7A4); gridYZ2.position.set(8,3,7); gridYZ2.rotation.z = Math.PI/2; this.mesh.add(gridYZ2);
    var gridYZ3 = new THREE.GridHelper(2, 2, 0x7BB7A4, 0x7BB7A4); gridYZ3.position.set(8,5,7); gridYZ3.rotation.z = Math.PI/2; this.mesh.add(gridYZ3);
    
    var winner = []
    for(dataset of datasetList){
        if(showInHeatmap.includes(dataset.name)){
            local = Number(dataset.local);
            global = Number(dataset.global);
            winner[winner.length] = [dataset.name,[local,global],[]];
            for(radio of readradio){
                maxTr = ['',0];//[indexName,AvgThroughput]
                maxLe = ['',0];
                for(index in new Array(data[1].length).fill(1)){
                    totalTh = 0;
                    count = 0;
                    for(item of data[1][index]){
                        if(item[0]!=radio){
                            continue;
                        }
                        if(item[5].indexOf(dataset.name)==-1){
                            continue;
                        }
                        totalTh += Number(item[7]);
                        count += 1;
                    }
                    totalTh = totalTh/count;
                    if(indexList[index].type=='Trad'){
                        if(totalTh>Number(maxTr[1])){
                            maxTr[0]=indexList[index].name;
                            maxTr[1]=totalTh;
                        }
                    } 
                    else{
                        if(totalTh>Number(maxLe[1])){
                            maxLe[0]=indexList[index].name;
                            maxLe[1]=totalTh;
                        }
                    }
                }

                var final = maxLe[1]>maxTr[1]?maxLe[0]:maxTr[0] ; 
                // Add point to mesh here
                var color = getColor(maxLe[1],maxTr[1]);
                var geometry;
                switch(final){
                    case 'ALEX':
                        geometry =new THREE.BoxGeometry( 0.3, 0.3, 0.3 );
                        break;
                    case 'LIPP':
                        geometry =new THREE.SphereGeometry(0.2);
                        break;
                    case 'PGM':
                        geometry =new THREE.OctahedronGeometry(0.26);
                        break;
                    case 'Artunsync':
                        geometry =new THREE.TetrahedronGeometry(0.26,0);
                        break;
                    default:
                        geometry =new THREE.CylinderGeometry( 0.15, 0.15, 0.3,100 );
                        console.log("others");
                }
                
                var material = new THREE.MeshLambertMaterial( { color: color } );
                meshpoint = new THREE.Mesh( geometry, material );
                var y = 0;
                switch(radio){
                    case 0:
                        y = 5;break;
                    case 0.2:
                        y = 4;break;
                    case 0.5:
                        y = 3;break;
                    case 0.8:
                        y = 2;break;
                    case 1:
                        y = 1;break;
                }
                meshpoint.position.set(global/1000,y,local/200000);
                this.mesh.add(meshpoint);
                
                winner[winner.length-1][2][readradio.indexOf(radio)] = [final,color];
            }
            // var fontMaterial = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
            // var datasetname = new THREE.TextGeometry(dataset.name,{font: font,size: 0.3,height: 0.01,})
            // var dsname = new THREE.Mesh(datasetname,fontMaterial); dsname.position.set(global/1000,10.5,local/200000); dsname.rotation.z=Math.PI/2;this.mesh.add(dsname);
        }
        else{continue;}
    }

    //Add text
    var loader = new THREE.FontLoader();

    loader.load( '../js/3-js/helvetiker_regular.typeface.json', function ( font ) {
        var fontMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
        var easy = new THREE.TextGeometry( 'Easy', {font: font,size: 0.4,height: 0.01,} );
        var fontModelE = new THREE.Mesh(easy,fontMaterial); fontModelE.position.set(-3,0,0); fontModelE.rotation.x=-Math.PI/2;this.mesh.add(fontModelE);
        var Difficult = new THREE.TextGeometry( 'Difficult', {font: font,size: 0.4,height: 0.01,} );
        var fontModelD = new THREE.Mesh(Difficult,fontMaterial); fontModelD.position.set(7.5,0,9); fontModelD.rotation.x=-Math.PI/2;this.mesh.add(fontModelD);
        var local = new THREE.TextGeometry( '1e4      Local hardness H (err bounds=32)', {font: font,size: 0.25,height: 0.01} );
        var fontModelL = new THREE.Mesh(local,fontMaterial); fontModelL.position.set(-1,0,1); fontModelL.rotation.x=-Math.PI/2;fontModelL.rotation.z=-Math.PI/2;this.mesh.add(fontModelL);
        var global = new THREE.TextGeometry( '1e2        Global hardness H (err bounds=4096)', {font: font,size: 0.25,height: 0.01} );
        var fontModelG = new THREE.Mesh(global,fontMaterial); fontModelG.position.set(0,0,9); fontModelG.rotation.x=-Math.PI/2;this.mesh.add(fontModelG);
        var radio = new THREE.TextGeometry( 'write ratio', {font: font,size: 0.4,height: 0.01} );
        var fontModelR = new THREE.Mesh(radio,fontMaterial); fontModelR.position.set(-1.5,3,0); fontModelR.rotation.z=Math.PI/2;this.mesh.add(fontModelR);
        for(i=1;i<8;i++){
            var t1 = new THREE.TextGeometry( String(i*20), {font: font,size: 0.3,height: 0.01,} );
            var fontModel1 = new THREE.Mesh(t1,fontMaterial); fontModel1.position.set(-0.4,0,i-0.2); fontModel1.rotation.x=-Math.PI/2; fontModel1.rotation.z=-Math.PI/2;this.mesh.add(fontModel1);
            var t2 = new THREE.TextGeometry( String(i*10), {font: font,size: 0.3,height: 0.01,} );
            var fontModel2 = new THREE.Mesh(t2,fontMaterial); fontModel2.position.set(i-0.2,0,8.4); fontModel2.rotation.x=-Math.PI/2;this.mesh.add(fontModel2);
        }
        for(i=1;i<=5;i++){
            var t1 = new THREE.TextGeometry( String(readradio[5-i]*100)+'%', {font: font,size: 0.3,height: 0.01,} );
            var fontModel1 = new THREE.Mesh(t1,fontMaterial); fontModel1.position.set(-1,i-0.2,0); this.mesh.add(fontModel1);
        }
        var fontMaterial1 = new THREE.MeshLambertMaterial({color: 0xFFC300});
        for(i of winner){
            var name = i[0].length<15?i[0]:i[0].split('_')[0];
            if(name=='osm') name = 'history';
            var datasetname = new THREE.TextGeometry(name,{font: font,size: 0.3,height: 0.01,});
            var dsname = new THREE.Mesh(datasetname,fontMaterial1); dsname.position.set(i[1][1]/1000+0.1,5.5,i[1][0]/200000); dsname.rotation.z=Math.PI/2;this.mesh.add(dsname);
            for(let j in new Array(5).fill(1)){
                if(i[2][j][0]=='LIPP'||i[2][j][0]=='ALEX'||i[2][j][0]=='PGM'||i[2][j][0]=='Artunsync') continue;
                var fontMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
                var indexmark = new THREE.TextGeometry(i[2][j][0],{font: font,size: 0.15,height: 0.0001,});
                switch(readradio[j]){
                    case 0:
                        y = 5;break;
                    case 0.2:
                        y = 4;break;
                    case 0.5:
                        y = 3; break;
                    case 0.8:
                        y = 2;break;
                    case 1:
                        y = 1;break;
                }
                var ixname = new THREE.Mesh(indexmark,fontMaterial); ixname.position.set(i[1][1]/1000+0.2,y-0.07,i[1][0]/200000); this.mesh.add(ixname);
            }
        }
        const light = new THREE.AmbientLight();
        scene.add(light);
        scene.add(this.mesh);
        const renderer = new THREE.WebGLRenderer({background:0x000000});
        renderer.setSize(w,h);
        function render() {
            renderer.render(scene,camera);
          }
          render();
        var controls = new THREE.OrbitControls(camera,renderer.domElement);
        controls.addEventListener('change', render);
        camera.position.set( -3, 7, 9 );
        controls.update();
        ele.appendChild(renderer.domElement);
    
    });
}

//get datasetList
function getDatasetList(){
    fetch('./data/datasetList.txt')
    .then(res=>res.text())
    .then(txt=> {
        datasetList=datasetList.concat(JSON.parse(txt));
    });
    return new Promise((resolve,reject)=>{
        setTimeout(function(){
            resolve()
        },100);
    })
}

//get indexes
function getIndexes(){
    fetch('./data/indexList.txt')
    .then(res => res.text())
    .then(txt => {
        indexList=indexList.concat(JSON.parse(txt));
        for(let i in new Array(indexList.length).fill(1)){
            data[0][i] = [];
            data[1][i] = [];
            //0: LIPP , 1: BTree , 2: HOT , 3: ALEX , 4: Wormhole , 5: Artunsync , 6: XIndex , 7: FineIndex , 8: massTree , 9: PGM
        }
    });
    return new Promise((resolve,reject)=>{
        setTimeout(function(){
            resolve()
        },100);
    })
}

//get multi thread testing
function getMtCSV(){
    fetch('./data/mt_new.csv')
    .then(res => res.text())
    .then(txt => {
        var lines = txt.split(/[(\r\n)\r\n]+/);
        for(let i in new Array(lines.length).fill(1)){
            if(i==0){
                continue;
            }
            var contains = lines[i].split(',');
            var newContain = [];
            newContain[0] = contains[1];
            newContain[1] = contains[2];
            newContain[2] = contains[3];
            newContain[3] = contains[4];
            newContain[4] = contains[5];
            newContain[5] = contains[6];
            newContain[6] = contains[7];
            newContain[7] = contains[8];
            newContain[8] = contains[22];
            newContain[9] = contains[11];
            switch(newContain[6]){
                case 'alexol':
                    data[0][3][data[0][3].length] = newContain;
                    break;
                case 'btreeolc':
                    data[0][1][data[0][1].length]=newContain;
                    break;
                case 'hotrowex':
                    data[0][2][data[0][2].length]=newContain;
                    break;
                case 'artolc':
                    data[0][5][data[0][5].length]=newContain;
                    break;
                case 'masstree':
                    data[0][8][data[0][8].length]=newContain;
                    break;
                case 'wormhole_u64':
                    data[0][4][data[0][4].length]=newContain;
                    break;
                case 'finedex':
                    data[0][7][data[0][7].length]=newContain;
                    break;
                case 'xindex':
                    data[0][6][data[0][6].length]=newContain;
                    break;
                case 'lippol':
                    data[0][0][data[0][0].length]=newContain;
            }
        }
    });
    return new Promise((resolve,reject)=>{
        setTimeout(function(){
            resolve()
        },100);
    })
}

//get single thread test result
function getStCSV(){
    fetch('./data/st_new.csv')
    .then(res => res.text())
    .then(txt => {
        var lines = txt.split(/[(\r\n)\r\n]+/);
        for(let i in new Array(lines.length).fill(1)){
            if(i==0){
                continue;
            }
            var contains = lines[i].split(',');
            var newContain = [];
            newContain[0] = contains[1];
            newContain[1] = contains[2];
            newContain[2] = contains[3];
            newContain[3] = contains[4];
            newContain[4] = contains[5];
            newContain[5] = contains[6];
            newContain[6] = contains[7];
            newContain[7] = contains[8];
            newContain[8] = contains[22];
            newContain[9] = contains[11];
            switch(newContain[6]){
                case 'alex':
                    data[1][3][data[1][3].length] = newContain;
                    break;
                case 'btree':
                    data[1][1][data[1][1].length]=newContain;
                    break;
                case 'hot':
                    data[1][2][data[1][2].length]=newContain;
                    break;
                case 'artunsync':
                    data[1][5][data[1][5].length]=newContain;
                    break;
                case 'masstree':
                    data[1][8][data[1][8].length]=newContain;
                    break;
                case 'wormhole_u64':
                    data[1][4][data[1][4].length]=newContain;
                    break;
                case 'finedex':
                    data[1][7][data[1][7].length]=newContain;
                    break;
                case 'xindex':
                    data[1][6][data[1][6].length]=newContain;
                    break;
                case 'lipp':
                    data[1][0][data[1][0].length]=newContain;
                    break;
                case 'pgm':
                    data[1][9][data[1][9].length]=newContain;
            }
        }
        datasets();
        generate();
        datasetLi();
        generateHeatMap();
    });
}

// when load the page, read indexList from file, then generate table and plots 

async function getlat(){
    fetch('./data/latency_new.csv')
    .then(res => res.text())
    .then(txt => {
        var lines = txt.split(/[(\r\n)\r\n]+/);
        for(let i in new Array(lines.length).fill(1)){
            if(i==0){
                continue;
            }
            var contains = lines[i].split(',');
            var newContain = [];
            newContain[0] = contains[1];
            newContain[1] = contains[6];
            newContain[2] = contains[7];
            newContain[3] = contains[11];
            newContain[4] = contains[13];
            newContain[5] = contains[14];
            newContain[6] = contains[15];
            newContain[7] = contains[16];
            newContain[8] = contains[17];
            switch(newContain[2]){
                case 'alex':
                    lat[5][lat[5].length] = newContain;
                    break;
                case 'alexol':
                    lat[5][lat[5].length] = newContain;
                    break;
                case 'btree':
                    lat[2][lat[2].length]=newContain;
                    break;
                case 'btreeolc':
                    lat[2][lat[2].length]=newContain;
                    break;
                case 'hot':
                    lat[1][lat[1].length]=newContain;
                    break;
                case 'hotrowex':
                    lat[1][lat[1].length]=newContain;
                    break;
                case 'artunsync':
                    lat[0][lat[0].length]=newContain;
                    break;
                case 'artolc':
                    lat[0][lat[0].length]=newContain;
                    break;
                case 'masstree':
                    lat[4][lat[4].length]=newContain;
                    break;
                case 'wormhole_u64':
                    lat[3][lat[3].length]=newContain;
                    break;
                case 'finedex':
                    lat[8][lat[8].length]=newContain;
                    break;
                case 'xindex':
                    lat[7][lat[7].length]=newContain;
                    break;
                case 'lipp':
                    lat[6][lat[6].length]=newContain;
                    break;
                case 'lippol':
                    lat[6][lat[6].length]=newContain;
                    break;    
                case 'pgm':
                    lat[9][lat[9].length]=newContain;
            }
        }
        
    });
}

async function getMemory(){
    fetch('./data/mem_new.csv')
    .then(res => res.text())
    .then(txt => {
        var lines = txt.split(/[(\r\n)\r\n]+/);
        for(let i in new Array(lines.length).fill(1)){
            if(i==0){
                continue;
            }
            var contains = lines[i].split(',');
            var newContain = [];
            newContain[0] = contains[6];
            newContain[1] = contains[7];
            newContain[2] = contains[10];
            newContain[3] = contains[22];
            switch(newContain[1]){
                case 'alex':
                    memory[0][memory[0].length] = newContain;
                    break;
                case 'btree':
                    memory[4][memory[4].length]=newContain;
                    break;
                case 'hot':
                    memory[5][memory[5].length]=newContain;
                    break;
                case 'artunsync':
                    memory[3][memory[3].length]=newContain;
                    break;
                case 'lipp':
                    memory[1][memory[1].length]=newContain;
                    break;
                case 'pgm':
                    memory[2][memory[2].length]=newContain;
            }
        }
    });
}

async function myFunction(){
    await getDatasetList();
    await getIndexes();
    await getMtCSV();
    await getMemory();
    await getlat();
    getStCSV();
    Myfunction();
}

window.onload= myFunction();