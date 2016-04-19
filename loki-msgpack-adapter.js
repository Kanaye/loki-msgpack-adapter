/**
 * @Author Joscha Rohmann <joscha@kanaye.net>
 * @License MIT
 * A "proxy" persistence adapter for LokiJS using msgpack-lite for messagepack encoding.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['msgpack-lite', 'lokijs'], factory);
    } else if (typeof exports == 'object') {
        module.exports = factory(require('msgpack-lite'), require('lokijs'));
    } else {
        root.lokiMsgpackAdapter = factory(root.msgpack, root.loki);
    }
})(this, function(msgpack, loki) {
    if (!msgpack || !loki) {
        throw new Error('You have to include lokijs and msgpack-lite for this adapter to work');
    }

    /**
     * constructor for the apapter
     * @param {object} options  Options object for (currently) adapter compatibility.
     */
    function lokiMsgpackAdapter (options) {
      this.options = options || {};
      // use user provided adapter otherwise default to the Loki built in fs adapter 
      this.adapter = this.options.adapter || new loki.persistenceAdapters.fs();

      if (this.adapter.mode === 'reference') {
          throw new Error('Loki Msgpack Adapter does not work with adapters in reference-mode');
      }
    }

    /* using reference as we're serializing to msgpack not json */
    lokiMsgpackAdapter.prototype.mode = 'reference';

    /**
     * saves / exports the database
     * @param {string} dbname Will be used as the filename if constructors filename argument is not provided.
     * @param {object} dbref Reference to the Loki instance.
     * @param {Function} fn Callback function.
     */
    lokiMsgpackAdapter.prototype.exportDatabase = function(dbname, dbref, fn) {
        var binary;

        try {
            binary = msgpack.encode(dbref);
        } catch (e) {
            return fn(e);
        }
        this.adapter.saveDatabase(dbname, binary, fn);
    };

    lokiMsgpackAdapter.prototype.deleteDatabase = function () {
      this.adapter.deleteDatabase.apply(this.adapter, arguments);
    };

    /**
     * Loads the database from an msgpack file.
     * @param  {string}   dbname Will be used as the filename if the constructors filename argument is not provided.
     * @param  {Function} fn     The callback function.
     */
    lokiMsgpackAdapter.prototype.loadDatabase = function(dbname, fn) {
        this.adapter.loadDatabase(dbname, function(err, binary) {
            if (err) {
                return fn(err, null);
            }

            try {
                fn(null, msgpack.decode(binary));
            } catch (err) {
                fn(err, null);
            }
        });
    };

    return lokiMsgpackAdapter;
});
