import './index.styl'

document.addEventListener("DOMContentLoaded", readySoftware);

function readySoftware(){
    var bars = document.getElementsByClassName('progress-bar');
    Array.from(bars).forEach(function(bar){
        var progress = bar.getAttribute('value');
        bar.style.width = progress + "%";
    });
}