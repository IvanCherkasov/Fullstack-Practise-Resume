import './index.styl'

export default class{
    static init(options){
        var resumeExperience = require('./index.pug');
        return resumeExperience(options);
    }
}