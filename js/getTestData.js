let uploadedResult = [];

function getFile(){
    const Name = document.getElementById("UserName");
    const Docker = document.getElementById("dockerImage");
    const uploadFileEle = document.getElementById("fileInput");
    console.log(uploadFileEle.files[0]);
    var reader = new FileReader();
    reader.readAsText(uploadFileEle.files[0]);
    reader.onerror = function(){
        console.log(reader.error);
    }
    reader.onload = function(){
        savefile('../data/test.txt',reader.result);
    }
}


function savefile(path,input) {
    fetch(path, {
        method: 'PUT',
        body: input
    });
}

function appen(num){
    console.log(num);
}

window.onload=function(){
    fetch('../data/uploadedTestResult.txt')
    .then(res => res.text())
    .then(txt => {
        for (let i in new Array(uploadedResult.length).fill(1)) {
            // let t = document.getElementById(i + "");
            // if (t != null)
            //     t.remove();
        }
        uploadedResult = uploadedResult.concat(JSON.parse(txt));
        for (let i in new Array(uploadedResult.length).fill(1)) {
            let num = parseInt(i);
            appen(num);
        }
    });
};