// Apply JSON to remember the indexList
let indexList = [];
let datasetList = [];
let showenPlots = [0,1,3,4,5,8];
let showenMaps = [0,1,3,4,5,8];
let showInHeatmap = ['biology','covid_tweets','planet_features_osm_id','fb','books','wiki_revid'];

// data[] store all test data 
//0: LIPP , 1: BTree , 2: HOT , 3: ALEX , 4: Wormhole , 5: Artunsync , 6: XIndex , 7: FineIndex , 8: massTree , 9: PGM
let data = [];
data[0] = []; //store mt
data[1] = []; //store st
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
        indexList[i].heatmap="true";
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
            indexList[i].heatmap="true";
        }
        else{
            indexList[i].present="false";
            indexList[i].heatmap="false";
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
            indexList[i].heatmap="true";
        } 
        else{
            indexList[i].present="false";
            indexList[i].heatmap="false";
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
        indexList[i].heatmap="false";
    }
    else{
        indexList[i].present="true";
        indexList[i].heatmap="true";
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
        res= res + '<b>'+indexList[i].name+'<b></a></td>';
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

//generate leaderboard and heatmap(not done yet)
function generate(){
    let tt = document.getElementById("generateStandard").value;
    let t = (tt=="Single_thread"?1:0);
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
    draw();
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

//dataset List for heatmap
function datasetLi(){
    let t = document.getElementById("datasetlt");
    let gg = document.createElement('tr');
    for(let i in new Array(datasetList.length).fill(1)){
        let item = document.createElement('td');
        item.setAttribute("style",'{width:20%}');
        var element = '<input type="checkbox" style="height:15px;width:15px"><label></label>';
        item.innerHTML = element;
        item.querySelectorAll("input")[0].id = datasetList[i].name;
        if(showInHeatmap.includes(datasetList[i].name)){
            item.querySelectorAll("input")[0].setAttribute('checked','true');
        }
        let g = datasetList[i].name;
        if(g.length>15){g=g.slice(0,g.indexOf('_'));} 
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

//draw plots tut from: https://blog.csdn.net/kitty_ELF/article/details/115750534
function draw(){ 
    const marginTop = 25;
    const marginLeft = 40;
    const marginBottom = 30;
    const canvas = document.getElementById("plots");
    canvas.width = 1000;
    canvas.height = 600;
    const context = canvas.getContext("2d");
    context.strokeStyle = "rgb(255,0,0)";
    context.lineWidth = 0.3;
    context.scale(1, -1);
    context.translate(marginLeft, -canvas.height + marginBottom);
// 模拟数据
const data = pointsData = [{
    x: "08:00",
    y: "153"
},{
    x: "09:00",
    y: "500"
},{
    x: "10:00",
    y: "12"
},{
    x: "11:00",
    y: "352"
},{
    x: "12:00",
    y: "223"
},{
    x: "01:00pm",
    y: "402"
},{
    x: "02:00pm",
    y: "412"
},{
    x: "03:00pm",
    y: "522"
},{
    x: "04:00pm",
    y: "85"
}]
// x轴刻度之间的单位宽度
    const widthOfOne = (canvas.width - marginLeft*2)/(pointsData.length-1);
// y轴刻度之间的单位高度
    const heightOfOne = (canvas.height - marginBottom - marginTop)/6;
// 保存坐标原点
    context.save();
// 绘制x轴和与x轴平行的刻度线
    for(let i = 0; i < 7; i++){
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(canvas.width-marginLeft*2, 0);
        context.closePath();
        context.stroke();
        context.translate(0, heightOfOne);
    }
    context.restore();

// 保存坐标原点，后面的操作都需要
    context.save();
// 绘制x轴下面的小刻度线
    for(let i = 0; i < data.length; i++){
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(0, canvas.height- marginBottom - marginTop);
        context.closePath();
        context.stroke();
        context.translate(widthOfOne, 0);
    }
    context.restore();
    context.save();
//绘制X轴上的信息,因为是镜像，直接绘制文字就是倒置的，所以要再一次镜像处理还原文字
    context.scale(1,-1);
    context.font = "7pt Calibri";
    for(let i = 0; i < data.length; i++){
        context.stroke();
        if(i==0){
            context.translate(0,15);
        }else{
            context.translate(widthOfOne,0);
        }
        const textWidth = context.measureText(data[i].x);
        // 保持字体中点显示在刻度的下面
        context.fillText(data[i].x,-textWidth.width/2,0);
    }
    context.restore();

//绘制Y轴刻度上的信息
    context.save()
    context.scale(1, -1);
    context.translate(-20, 0);
    context.font = "7pt Calibri";
    for(let i = 0; i < 7; i++){
        context.stroke();
        context.fillText((100*i).toString(), 0, 0);
        context.translate(0, -heightOfOne);
    }
    context.restore()

// 每个点的x轴，y轴像素位置
    const Point = {
        createNew: function(x,y){
            const point = {};
            point.x = x;
            point.y = y;
            return point;
        }
    }

// 单位像素高度 坐标系实际像素高度/y轴范围
    const unitHeight = 3/8; 
    const points = new Array(data.length);
    for(let i = 0; i < points.length; i++){
        points[i] = Point.createNew(0+widthOfOne*i, data[i].y*unitHeight);
    }

// 绘制折线
    context.save();
    context.beginPath();
    for(let i = 0; i < points.length; i++){
        context.lineTo(points[i].x, points[i].y);
    }
    context.strokeStyle="rgb(93,111,194)"
    context.lineWidth=1
    context.shadowBlur = 5;
    context.stroke();
    context.closePath();
    context.restore();

// 绘制折点
    context.save();
    for (let i = 0; i < points.length; i++) {
        context.beginPath();
        context.arc(points[i].x,points[i].y,3, 0, Math.PI * 2, true);
        context.closePath();
        context.fillStyle = 'rgb(49,131,186)';
        context.shadowBlur = 5;
        context.shadowColor = 'rgb(49,131,186)';
        context.fill()
    }
    context.restore();

// 在每个折点上显示数值
    context.save();
    context.scale(1,-1);
    context.font = "7pt Calibri";
    context.fillStyle = "rgb(93,111,194)";
    for(let i = 0; i < points.length; i++){
        context.stroke();
        const textWidth = context.measureText(data[i].y);
        context.fillText(data[i].y, -textWidth.width/2+points[i].x, -points[i].y-10);
    }
    context.restore();
}

// when load the page, read indexList from file, then generate table and plots 
window.onload=function(){
    fetch('./data/datasetList.txt')
    .then(res=>res.text())
    .then(txt=> {
        datasetList=datasetList.concat(JSON.parse(txt));
        datasets();
    });
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
        generate();
        datasetLi();
        console.log(THREE);
    });
    
}