import './index.styl'

export default class{
    static init(options){
        var resumeEducation = require('./index.pug');
        return resumeEducation(options);
    }
}