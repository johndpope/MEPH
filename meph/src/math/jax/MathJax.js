MEPH.define('MEPH.math.jax.MathJax', {
    statics: {
        ready: function () {
            MEPHJax.$promise = MEPHJax.$promise || Promise.resolve();
            MEPHJax.$promise = MEPHJax.$promise.then(function () {
                if (!MEPHJax.$loaded) {
                    var toresolve;
                    return MEPH.loadJSCssFile('http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML-full', '.js', function () {
                        MEPHJax.$loaded = true;
                        toresolve(MEPHJax.$loaded);
                    }).then(function () {
                        return new Promise(function (r, f) {
                            toresolve = r;
                        });
                    });
                }
                return MEPHJax.$loaded;
            });
            return MEPHJax.$promise;
        },
        load: function (script, dom) {
            var toresolve,
                tofail;
            var math;
            dom.setAttribute('id', "MathOutput");//dom.getAttribute('id') || MEPH.GUID());
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
            MathJax.Hub.queue.Push(function () {
                if (math) {
                    MathJax.Hub.Queue(["Text", math, script]);
                }
                else {

                    MathJax.Hub.queue.Push(function () {
                        debugger
                        math = MathJax.Hub.getAllJax("MathOutput")[0];
                        MathJax.Hub.queue.Push(["Text", math, "\\displaystyle{" + script + "}"]);
                    });


                }
                MathJax.Hub.Queue(function () {
                    toresolve(true);
                });
            });

            return MEPHJax.ready().then(function () {
                return new Promise(function (r, f) {
                    toresolve = r;
                    tofail = f;
                });
            });
        }
    },
}).then(function () {
    MEPH.namespace('MEPHJax');
    MEPHJax = MEPH.math.jax.MathJax;
    MEPHJax.$promise = MEPHJax.$promise || Promise.resolve();
});