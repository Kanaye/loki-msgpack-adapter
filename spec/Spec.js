/* globals describe, expect, it, beforeAll */

// simple stub adapter for testing... 
function StubAdapter() {

}

StubAdapter.prototype = {
    loadDatabase: function(name, fn) {
        this.loadArgs = arguments;
        fn(this.saveArgs[1]);
    },
    saveDatabase: function(name, binary, fn) {
        this.saveArgs = arguments;
    },
    deleteDatabase: function(name, fn) {
        this.deleteArgs = arguments;
        fn();
    }
};

describe('loki message pack', function() {
    it('trys to load msgpack-lite and lokijs itself', function() {
    	// would throw an error if it couldn't find msgpack and/or lokijs
        expect(function() {
            require('../loki-msgpack-adapter.js');
        }).not.toThrow();
    });

    var LokiMessagePack = require('../loki-msgpack-adapter.js');
    var Loki = require('lokijs');
    it('uses lokis fs adapter if no adapter is specified', function() {
        var adapter = new LokiMessagePack();
        expect(adapter.adapter instanceof require('lokijs').persistenceAdapters.fs).toBe(true);
    });

    var testAdapter = new LokiMessagePack({ adapter: new StubAdapter() });

    it('uses the passed adapter', function() {
        expect(testAdapter.adapter instanceof StubAdapter).toBe(true);
    });

    var db = new Loki('Test.db', { adapter: testAdapter });
    var collection = db.addCollection('test');

    collection.insert([{ id: 0, test: 'The first one' }, {id: 1, test: 'the second'}]);

    describe('exportDatabase', function() {
    	var msgpack = require('msgpack-lite');

    	it('does not throw an error with a correct db', function () {
    		expect(db.saveDatabase.bind(db)).not.toThrow();	
    	});
    	
        it('passes the database name to the adapter', function () {
        	expect(testAdapter.adapter.saveArgs[0]).toBe('Test.db');
        });

        it('passes a correct messagepack binary', function () {
        	var decoded;

        	expect(function () {
        		decoded = msgpack.decode(testAdapter.adapter.saveArgs[1]);
        	}).not.toThrow();

        	expect(decoded).toBeTruthy();
        });
    });

    describe('loadDatabase', function() {
    	var db2;
    	beforeAll(function (done) {
    		db2 = new Loki('Test.db', {
    			adapter: testAdapter, 
    			autoloadCallback: function () { 
    				process.nextTick(done);
    			},
    			autoload: true
    		});
    	});
    	
    	it('passes the correct name to loadDatabase', function () {
    		expect(testAdapter.adapter.loadArgs[0]).toBe('Test.db');
    	});


    	it('loads a previously saved database', function () {
    		// hacky way too get equality with different constructor options...
    		db.options = null;
    		db2.options = null;
    		expect(db2.toJson()).toEqual(db.toJson());
    	});
    });

    it('calls delete on the passed adater', function () {
    	db.deleteDatabase();
    	expect(testAdapter.adapter.deleteArgs[0]).toBe('Test.db');
    });
});
