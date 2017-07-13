import './index.styl'

export default class{
    static init(options){
        var resumeProfile = require('./index.pug');
        return resumeProfile(options);
    }
}