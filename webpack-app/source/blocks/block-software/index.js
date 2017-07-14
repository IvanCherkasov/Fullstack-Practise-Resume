import './index.styl'

export default class{
    static init(options){

        function set(bars){
            Array.from(bars).forEach(function(bar){
                var progress = bar.getAttribute('value');
                bar.style.width = progress + "%";
            });
        }

        var div = document.createElement('div');
        var resumeSoftware = require('./index.pug');
        div.innerHTML = resumeSoftware(options);
        set(div.getElementsByClassName('progress-bar'));
        return div.innerHTML;
    }
}