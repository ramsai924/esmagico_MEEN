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
        // document.querySelector(".topnav").style.background = "transparent"
        document.querySelector(".fa-bars").style.display = "block"
        document.querySelector(".fa-times").style.display = "none"
    }
}

//search bar
var searchBar = document.getElementById("search")
var foldersData = document.querySelectorAll("#folderNames")
var filesData = document.querySelectorAll("#filename")
var arrayToSearch = Array.from(foldersData).concat(Array.from(filesData))
// console.log(arrayToSearch)
searchBar.addEventListener("keyup",function(e){
    arrayToSearch.map((val) => {
        if (val.innerText.match(searchBar.value)){
            val.parentNode.parentNode.parentNode.style.display = "";
        }else{
            val.parentNode.parentNode.parentNode.style.display = "none";
        }
    })
})

$(".circleTwo").click(function () {
    $(".closeFolderAction").hide()
})

//folder details

document.getElementById("folders_section").addEventListener("click",function(e){
   
    if (e.target.className === "fa fa-ellipsis-v") {
        $(e.target.parentNode.parentNode.childNodes[7]).toggle()
    }
    if (e.target.className === "fa fa-times-circle circleOne"){
            $(".folder-extra-details").hide()
    }
    if (e.target.id === "moveFolderclick") {
        // console.log(e.target.parentNode.parentNode.parentNode.childNodes[9])
        $(e.target.parentNode.parentNode.parentNode.childNodes[9]).show()
    }
  
})

//check same folder
var foldername = document.querySelectorAll("#folderNames");
var folderSelection = document.querySelectorAll(".folderSelection")
var warning = document.querySelectorAll("#warning")

for(let i=0;i<folderSelection.length;i++){
    folderSelection[i].addEventListener("change", function (e) {
        console.log(folderSelection[i].value)
        if (foldername[i].innerText === folderSelection[i].value) {
            folderSelection[i].value = ""
            warning[i].style.display = "block"
        } else {
            warning[i].style.display = "none"
        }
    })
}


//file and folder selection

$("#optradio1").click(function(){
    $("#folder").show()
    $("#file").hide()
})
$("#optradio2").click(function () {
    $("#folder").hide()
    $("#file").show()
})

//home files close circle one
$(".HomefilecircleOne").click(function () {
    $(".Home-file-extra-details").hide()
})

//file section events
document.getElementById("homeFileSection").addEventListener('click', function (e) {
    console.log(e.target)
    if (e.target.className === "fa fa-ellipsis-v fileEllipsis") {
        $(e.target.parentNode.parentNode.childNodes[7]).toggle()
    }
    if (e.target.className === "fa fa-times-circle homefilecircleTwo") {
        $(".homecloseFileAction").hide()
    }
    if (e.target.id === "moveFileclick") {
        $(e.target.parentNode.parentNode.parentNode.childNodes[9]).show()
    }
})