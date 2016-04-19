/**
 * @Author Joscha Rohmann <joscha@kanaye.net>
 * @License MIT
 * A msgpack file adapter for LokiJS using msgpack-lite. 
 */

/* dependencies */
var fs = require('fs');
var msgpack = require('msgpack-lite');

/** 
* constructor for the apapter
* @param {string} filename the filename/path of the file to store the database
*/
function lokiMsgpackAdapter (filename) {
    this.filename = filename;
}
/* using reference as we're seializing in msgpack not json */
lokiMsgpackAdapter.prototype.mode = 'reference';

/**
* saves / exports the database
* @param {string} dbname Will be used as the filename if constructors filename argument is not provided.
* @param {object} dbref Reference to the Loki instance.
* @param {function} fn Callback function.
*/
lokiMsgpackAdapter.prototype.exportDatabase = function (dbname, dbref, fn) {
    var binary;

    try {
        binary = msgpack.encode(dbref);
    } catch (e) {
        return fn(e);
    }

    fs.writeFile(this.filename || dbname, binary, fn);
};
/**
 * Loads the database from an msgpack file.
 * @param  {string}   dbname Will be used as the filename if the constructors filename argument is not provided.
 * @param  {Function} fn     [description]
 */
lokiMsgpackAdapter.prototype.loadDatabase = function (dbname, fn) {
    var binary;
    try {
    	binary = fs.readFileSync(this.filename || dbname);
    } catch(e) {
    	return fn(e);
    }

    try {
    	fn( msgpack.decode(binary));
    } catch(e) {
    	fn(e);
    }
};

module.exports = lokiMsgpackAdapter;