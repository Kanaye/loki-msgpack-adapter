# loki-msgpack-adapter
A simple [lokijs](https://github.com/techfort/lokijs) "proxy" adapter using [msgpack-lite](https://github.com/kawanet/msgpack-lite) to serialize the database.

## Usage
``npm i --save loki-msgpack-adapter``
```javascript
// Should work with all normal (not reference) mode persistenceAdapters
var myAdapter = new myPersistenceAdapter(/*...*/);
// if you don't pass an adapter we will try to use lokijs fs adapter
var proxy = new lokiMsgpackAdapter({adapter: myAdapter});

var db = new loki('test.db', {adapter: proxy /* ... */});
/* use your db as normal */
// ...
db.saveDatabase();
// Your adapter saved the db in the messagepack format
```
In browser just drop in [lokijs](https://github.com/techfort/lokijs) and [msgpack-lite](https://github.com/kawanet/msgpack-lite) and your are ready to go.

In node  loki-msgpack will require the dependencies itself.

If you are using something like browserify or webpack all should work fine :).
## Having questions ? Found a bug ? Need a feature ?
Just open an issue here or even better a pull request.

I'd love to see contibution. 

## Thanks to
- @[techfort](https://github.com/techfort) and all lokijs contributors for building and maintaining lokijs
- @[kawanet](https://github.com/kawanet) and all msgpack-lite contributors for building and maintaining msgpack-lite. 

These are awesome projects.
