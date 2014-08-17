/**
 * @class MEPH.query.QueryableWorker
 **/
MEPH.define('MEPH.query.QueryableWorker', {
    properties: {
        $worker: null,
        $promise: null
    },
    initialize: function () {
        var me = this;
        me.$worker = new Worker(MEPH.frameWorkPathSource);
        var src = '' +
            'var t=  mephFrameWork(\'MEPH\', "' + MEPH.frameWorkPath + '",null, self);' +
            'debugger;      t.framework.ready().then(function(){ ' +
            'MEPH.setPath("' + MEPH.frameWorkPath + '","MEPH");' +
            'postMessage({ "success": true });});'
        //me.$worker.postMessage('');
        me.$promise = Promise.resolve().then(function () {
            return me.post({
                func: 'start',
                src: src,
                framework: 'MEPH'
            }).then(function () {
            })
        });
    },
    ready: function () {
        var me = this;
        return me.$promise.then(function () { return me; });
    },
    post: function (message) {
        var me = this,
            toresolve,
            tofail,
            promise = new Promise(function (r, f) {
                toresolve = r;
                tofail = f;
            });
        return Promise.resolve().then(function () {

            var handler = function (oEvent) {
                me.$worker.removeEventListener(handler);
                toresolve(oEvent.data);
            };
            me.$worker.addEventListener("message", handler, false);
            me.$worker.postMessage(message)
            return promise;
        });
    },
    postSync: function (message, callback) {
        var me = this;

        var handler = function (oEvent) {
            me.$worker.removeEventListener(handler);
            callback(oEvent.data);
        };
        me.$worker.addEventListener("message", handler, false);
        me.$worker.postMessage(message)
    },
    executeSync: function (code, args, callback) {
        me.postSync({
            work: code.toString(),
            args: args,
            func: 'exec'
        }, callback);
    },
    /**
     * Executes an arbitrary piece of code, with the arguments passed in an array.
     * @param {Function} code,
     * @param {Array} args
     */
    execute: function (code, args) {
        var me = this;
        me.$promise = me.$promise.then(function () {
            return me.post({
                work: code.toString(),
                args: args,
                func: 'exec'
            });
        });
        return me.$promise;
    },
    load: function (script) {
        var me = this;
        me.$promise = me.$promise.then(function () {
            return me.post({
                func: 'load',
                script: script,
                framework: 'MEPH'
            }).then(function (result) {
                me.loaded = true;
                return result;
            });
        });
        return me.$promise;

    }
});