import './index.styl'

export default class{
    static init(options){

        function set(bars, activeClass){
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
        }

        var resumeSkills = require('./index.pug');
        var div = document.createElement('div');
        div.innerHTML = resumeSkills(options);
        set(div.getElementsByClassName('skill-progress'), 'active');
        return div.innerHTML;
    }
}