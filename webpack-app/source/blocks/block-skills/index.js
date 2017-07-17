import './index.styl'

document.addEventListener("DOMContentLoaded", readySkills);

function readySkills(){
    var bars = document.getElementsByClassName('skill-progress');
    Array.from(bars).forEach(function(bar){
        var value = bar.getAttribute('value');
        var lis = bar.children[0].children;
        for (var i = 0; i < lis.length; i++){
            if (i == value){
                lis[i - 1].className = 'active';
                break;
            }
        }
    });
}