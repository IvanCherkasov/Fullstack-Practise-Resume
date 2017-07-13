import './index.styl'

export default class {
    static init(options){
        var blockHeader = require('./index.pug');
        return blockHeader(options);
    }
}