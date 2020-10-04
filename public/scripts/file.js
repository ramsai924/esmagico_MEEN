//navbar
function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";

        document.querySelector(".topnav").style.background = "black"
        document.querySelector(".fa-times").style.display = "block"
        document.querySelector(".fa-bars").style.display = "none"
    } else {
        x.className = "topnav";
        document.querySelector(".fa-bars").style.display = "block"
        document.querySelector(".fa-times").style.display = "none"
    }
}
//
$("#optradio1").click(function () {
    $("#folder").show()
    $("#file").hide()
})
$("#optradio2").click(function () {
    $("#folder").hide()
    $("#file").show()
})

//search bar
var searchBar = document.getElementById("filesearch")
var filesData = document.querySelectorAll("#filename")
searchBar.addEventListener("keyup", function (e) {
    Array.from(filesData).map((val) => {
        
        if (val.innerText.match(searchBar.value)) {
            console.log(val.parentNode.parentNode.parentNode)
            val.parentNode.parentNode.parentNode.style.display = "";
        } else {
            val.parentNode.parentNode.parentNode.style.display = "none";
        }
    })
})

//move div section close event
$(".circleTwo").click(function () {
    $(".closeFolderAction").hide()
})

//more details event
document.getElementById("folderSection").addEventListener("click",function(e){
    if (e.target.className === "fa fa-ellipsis-v one"){
        $(e.target.parentNode.parentNode.childNodes[7]).toggle()
    }
    if (e.target.className === "fa fa-times-circle circleOne") {
        $(".folder-extra-details").hide()
    }
    if (e.target.id === "moveFolderclick") {
        $(e.target.parentNode.parentNode.parentNode.childNodes[9]).show()
    }
})

//warning event
var foldername = document.querySelectorAll("#folderNames");
var mainfolderName = document.getElementById("mainfolderName").innerText
var folderSelection = document.querySelectorAll(".folderSelection")
var warning = document.querySelectorAll("#warning")
var warning2 = document.querySelectorAll("#warning1")

for (let i = 0; i < folderSelection.length; i++) {
    folderSelection[i].addEventListener("change", function (e) {
        // console.log(folderSelection[i].value)
        if (foldername[i].innerText === folderSelection[i].value) {
            folderSelection[i].value = ""
            warning[i].style.display = "block"
        } else {
            warning[i].style.display = "none"
        }


    if (mainfolderName === folderSelection[i].value){
        folderSelection[i].value = ""
        warning2[i].style.display = "block"
        
    } else {
        warning2[i].style.display = "none"
    }
    })
}

//warning event for files
var fileselection = document.querySelectorAll(".fileSelection")
var filePath = document.querySelectorAll("#filePath")
var filewarning1 = document.querySelectorAll("#filewarning1")
for(let i=0;i<fileselection.length;i++){
    fileselection[i].addEventListener("change",() => {
        if (fileselection[i].value === filePath[i].innerText){
            fileselection[i].value = ""
            filewarning1[i].style.display = "block"
        }else{
            filewarning1[i].style.display = "none"
        }
    })
}

//file circle event close
$(".filecircleOne").click(function(){
    $(".file-extra-details").hide()
})


//file section events
document.getElementById("fileSection").addEventListener('click',function(e){
    console.log(e.target)
    if (e.target.className === "fa fa-ellipsis-v fileEllipsis"){
        $(e.target.parentNode.parentNode.childNodes[7]).toggle()
    }
    if (e.target.className === "fa fa-times-circle filecircleTwo"){
        $(".closeFolderAction").hide()
    }
    if (e.target.id === "moveFileclick") {
        $(e.target.parentNode.parentNode.parentNode.childNodes[9]).show()
    }
})