/**
 * @Author Joscha Rohmann <joscha@kanaye.net>
 * @License MIT
 * A "proxy" persistence adapter for LokiJS using msgpack-lite for messagepack encoding.
 */
(function (root, factory) {
        if (typeof define === 'function' && define.amd) {
                define(['msgpack-lite', 'lokijs'],factory);
        } else if (typeof exports == 'object') {
                module.exports = factory(require('msgpack-lite'), require('lokijs'));
        } else {
                root.lokiMsgpackAdapter = factory(root.msgpack, root.loki);
        }
})(this, function (msgpack, loki) {
        if (!msgpack || !loki) {
                throw new Error('You have to include lokijs and msgpack-lite for this adapter to work');
        }

        /**
        * constructor for the apapter
        * @param {string} filename the filename/path of the file to store the database
        * @param {object} options  Options object for (currently) adapter compatibility.
        */
        function lokiMsgpackAdapter (filename, options) {
              if (typeof filename == 'object') {
                  this.options = filename;
              } else {
                  this.options = options || {};
              }
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
              this.persistenceAdapter.saveDatabase(dbname, binary, fn);
        };

        /**
         * Loads the database from an msgpack file.
         * @param  {string}   dbname Will be used as the filename if the constructors filename argument is not provided.
         * @param  {Function} fn     [description]
         */
        lokiMsgpackAdapter.prototype.loadDatabase = function (dbname, fn) {
                this.persistenceAdapter.loadDatabase(dbname, function (err, binary) {
                        if (err) {
                                return fn(err, null);
                        }

                       try {
                               fn(null, msgpack.decde(binary));
                       } catch (err) {
                                fn(err, null);
                       }
                });
        };
        module.exports = lokiMsgpackAdapter;
});
