MEPH.define('MEPH.query.QueryableWorker', {
    properties: {
        $worker: null,
        $promise: null
    },
    initialize: function () {
        var me = this;
        me.$worker = new Worker(MEPH.frameWorkPathSource);
        var src = 'console.log("executing framework");' +
            'var t=  mephFrameWork(\'MEPH\', "' + MEPH.frameWorkPath + '",null, self);' +
            'debugger;      t.framework.ready().then(function(){  MEPH.Log("ready");' +
            'MEPH.setPath("' + MEPH.frameWorkPath + '","MEPH");' +
            'postMessage({ "success": true });});'
        //me.$worker.postMessage('');
        me.$promise = Promise.resolve().then(function () {
            return me.post({
                func: 'start',
                src: src,
                framework: 'MEPH'
            }).then(function () {
                MEPH.Log('started meph');
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
            MEPH.Log(message);
            me.$worker.postMessage(message)
            return promise;
        });
    },
    execute: function (code) {
        var me = this;
        return me.post({
            work: code.toString(),
            func: 'exec'
        });
    },
    load: function (script) {
        var me = this;
        return me.post({
            func: 'load',
            script: script,
            framework: 'MEPH'
        }).then(function (result) {
            me.loaded = true;
            MEPH.Log('loaded')
            return result;
        });

    }
});