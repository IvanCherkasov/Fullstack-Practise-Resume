import './index.styl'

export default class {
    static init(options){
        var resumeContacts = require('./index.pug');
        return resumeContacts(options);
    }
}