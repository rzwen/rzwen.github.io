let uploadedResult = [];

function getFile(){
    const Name = document.getElementById("UserName").value;
    const Docker = document.getElementById("dockerImage").value;
    const uploadFileEle = document.getElementById("textResult");
    const uploadFileEle2 = document.getElementById("indexfile");
    const date = new Date();
    const time =date.getFullYear()+'_'+(date.getMonth()+1)+'_'+date.getDate()+'_'+date.getHours()+'_'+date.getMinutes();
    const t = {
        "name":Name,
        "docker":Docker,
        "test":'./data/'+Name+'/'+time+'/'+uploadFileEle.files[0].name,
        "index":'./data/'+Name+'/'+time+'/'+uploadFileEle2.files[0].name,
        "time": time
    };
    uploadedResult[uploadedResult.length] = t ;
    console.log(t);
    var reader = new FileReader();
    reader.readAsText(uploadFileEle.files[0]);
    reader.onerror = function(){
       alert(reader.error);
    }
    reader.onload = function(){
        savefile('./data/'+Name+'/'+time+'/'+uploadFileEle.files[0].name,reader.result);
    }
    var reader2 = new FileReader();
    reader2.readAsText(uploadFileEle2.files[0]);
    reader2.onerror = function(){
        alert(reader.error);
     }
     reader2.onload = function(){
         savefile('./data/'+Name+'/'+time+'/'+uploadFileEle2.files[0].name,reader2.result);
     }
     savefile('./data/uploadedTestResult.txt',JSON.stringify(uploadedResult));
}


function savefile(path,input) {
    fetch(path, {
        method: 'PUT',
        body: input
    });
}

function LOgenerate(){
    let tbody = document.createElement("tbody");
    tbody.setAttribute('style',"border:thin solid gray");
    tbody.id="uploadIndex";
    const l = uploadedResult.length -1;
    for(let i in new Array(uploadedResult.length).fill(1)){
        let newrow = document.createElement('tr');
        newrow.id = "userUpload" + (l-i);
        const time = uploadedResult[l-i].time.split('_');
        const t = time[0]+'/'+time[1]+'/'+time[2];
        newrow.innerHTML='<td>' + uploadedResult[l-i].name + '</td>' + '<td>' + uploadedResult[l-i].docker + '</td>' + '<td><a href="' + uploadedResult[l-i].test + '" download>'+uploadedResult[l-i].test.split('/')[4] +'</a></td>' + '<td><a href="' + uploadedResult[l-i].index +'" download>'+ uploadedResult[l-i].index.split('/')[4] + '</a></td>' + '<td>' + t + '</td>';
        tbody.appendChild(newrow);
    }
    document.getElementById("upload").appendChild(tbody);
}

async function Myfunction(){
    fetch('./data/uploadedTestResult.txt')
    .then(res => res.text())
    .then(txt => {
        for (let i in new Array(uploadedResult.length).fill(1)) {
            // let t = document.getElementById(i + "");
            // if (t != null)
            //     t.remove();
        }
        uploadedResult = uploadedResult.concat(JSON.parse(txt));
        LOgenerate();
    });
};
