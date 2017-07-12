import './index.styl'

function initSkills (bars, activeClass) {
    Array.from(bars).forEach(function(bar){
        var value = bar.getAttribute('value');
        var lis = bar.children[0].children;
        for (var i = 0; i < lis.length; i++){
            if (i == value){
                lis[i - 1].className = activeClass;
                break;
            }
        }
    });
};

initSkills(
    document.getElementsByClassName("skill-progress"),
    'active'
);