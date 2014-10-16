describe("MEPH/tween/TweenEditor.spec.js", 'MEPH.tween.TweenEditor', function () {
    beforeEach(function () {
        jasmine.addMatchers(MEPH.customMatchers);
    });

    it('can create a tween editor.', function (done) {
        MEPH.create('MEPH.tween.TweenEditor').then(function ($class) {
            var tree = new $class();
            expect(tree).theTruth('The tween editor can not be created');
        }).catch(function (error) {
            if (error) {
                expect(error).caught();
            }
        }).then(function () {
            done();
        });
    });


    it('can render a tween editor', function (done) {
        MEPH.render('MEPH.tween.TweenEditor', 'tweeneditor').then(function (r) {
            var results = r.res;
            var app = r.app;

            var dom,
                tweeneditor = results.first().classInstance;
            ///Assert
            dom = tweeneditor.getDomTemplate().first()
            expect(dom).toBeTruthy();
            if (app) {
                app.removeSpace();
            }
        }).catch(function (error) {
            expect(error || new Error('did not render as expected')).caught();
        }).then(function () {
            done();
        })
    });
    var TweenEditor = MEPH.tween.TweenEditor;
    it('can add tween points', function () {
        var editor = new TweenEditor();
        editor.source = [];
        editor.addPoint({ x: 0, y: 1 });
        expect(editor.source.length).toBeTruthy();
    });

    it('tween points have to have values for x between 0 and 1', function () {
        var editor = new TweenEditor();
        editor.source = [];
        editor.addPoint({ x: -20, y: 1 });
        expect(editor.source.length).toBeTruthy();
        expect(editor.source.first().x === 0).toBeTruthy();
    });

    it('tween points have to have values for x between 0 and 1', function () {
        var editor = new TweenEditor();
        editor.source = [];
        editor.addPoint({ x: 20, y: 1 });
        expect(editor.source.length).toBeTruthy();
        expect(editor.source.first().x === 1).toBeTruthy();
    });


    it('tween points have to have values for y between -1 and 1', function () {
        var editor = new TweenEditor();
        editor.source = [];
        editor.addPoint({ x: 0, y: -11 });
        expect(editor.source.length).toBeTruthy();
        expect(editor.source.first().y).toBe(-1);
    });

    it('tween points have to have values for y between 0 and 1', function () {
        var editor = new TweenEditor();
        editor.source = [];
        editor.addPoint({ x: 0, y: 11 });
        expect(editor.source.length).toBeTruthy();
        expect(editor.source.first().y).toBe(1);
    });

    it('redraws the stage on resize ', function (done) {
        MEPH.render('MEPH.tween.TweenEditor', 'tweeneditor').then(function (r) {
            var results = r.res;
            var app = r.app, called;

            var dom,
                tweeneditor = results.first().classInstance;
            tweeneditor.render = function () {
                called = true;
            }

            dom = tweeneditor.getDomTemplate().first()
            dom.dispatchEvent(MEPH.createEvent('resize', {}));
            expect(called).toBeTruthy();

            if (app) {
                app.removeSpace();
            }
        }).catch(function (error) {
            expect(error || new Error('did not render as expected')).caught();
        }).then(function () {
            done();
        })
    });

    it('redraws the stage on resize ', function (done) {
        MEPH.render('MEPH.tween.TweenEditor', 'tweeneditor').then(function (r) {
            var results = r.res;
            var app = r.app, called;

            var dom,
                tweeneditor = results.first().classInstance;

            tweeneditor.render();
            expect(tweeneditor.$structureElements).toBeTruthy();

            if (app) {
                app.removeSpace();
            }
        }).catch(function (error) {
            expect(error || new Error('did not render as expected')).caught();
        }).then(function () {
            done();
        })
    });

    it('when a point is added the page is re rendered ', function (done) {
        MEPH.render('MEPH.tween.TweenEditor', 'tweeneditor').then(function (r) {
            var results = r.res;
            var app = r.app, called;

            var dom,
                tweeneditor = results.first().classInstance;
            tweeneditor.render = function () {
                called = true;
            }

            tweeneditor.onAddPoint();
            expect(called).toBeTruthy();

            if (app) {
                app.removeSpace();
            }
        }).catch(function (error) {
            expect(error || new Error('did not render as expected')).caught();
        }).then(function () {
            done();
        })
    });

    it('when a point is added it is added to the current path, with a mark', function (done) {
        MEPH.render('MEPH.tween.TweenEditor', 'tweeneditor').then(function (r) {
            var results = r.res;
            var app = r.app, called;

            var dom,
                tweeneditor = results.first().classInstance;
            tweeneditor.render = function () {
                called = true;
            }
            tweeneditor.mark = 'A';
            tweeneditor.onAddPoint();
            expect(called).toBeTruthy();
            expect(tweeneditor.source.first().mark).toBe('A');

            if (app) {
                app.removeSpace();
            }
        }).catch(function (error) {
            expect(error || new Error('did not render as expected')).caught();
        }).then(function () {
            done();
        })
    });

    it('tween points can be rendered.', function (done) {
        MEPH.render('MEPH.tween.TweenEditor', 'tweeneditor').then(function (r) {
            var results = r.res;
            var app = r.app, called;

            var dom,
                tweeneditor = results.first().classInstance;

            tweeneditor.onAddPoint();
            tweeneditor.onAddPoint();
            expect(tweeneditor.$tweenpoints).toBeTruthy();

            if (app) {
                app.removeSpace();
            }
        }).catch(function (error) {
            expect(error || new Error('did not render as expected')).caught();
        }).then(function () {
            done();
        })
    });

    it('on mousedown on a tween point, a tweendown even will fire', function (done) {
        MEPH.render('MEPH.tween.TweenEditor', 'tweeneditor').then(function (r) {
            var results = r.res;
            var app = r.app, called;

            var dom,
                tweeneditor = results.first().classInstance;

            tweeneditor.onAddPoint();
            var circle = tweeneditor.$tweenpoints.first().shape;
            tweeneditor.getDomTemplate().first().addEventListener('tweendown', function () {
                called = true;
            })
            circle.dispatchEvent(MEPH.createEvent('mousedown', {}));

            expect(called).toBeTruthy();

            if (app) {
                app.removeSpace();
            }
        }).catch(function (error) {
            expect(error || new Error('did not render as expected')).caught();
        }).then(function () {
            done();
        });
    });

    it('on tweendown the state goes to dragging', function (done) {
        MEPH.render('MEPH.tween.TweenEditor', 'tweeneditor').then(function (r) {
            var results = r.res;
            var app = r.app, called;

            var dom,
                tweeneditor = results.first().classInstance;

            tweeneditor.onAddPoint();
            var circle = tweeneditor.$tweenpoints.first().shape;
            tweeneditor.getDomTemplate().first().addEventListener('tweendown', function () {
                called = true;
            })
            circle.dispatchEvent(MEPH.createEvent('tweendown', { tweenpoint: tweeneditor.$tweenpoints.first() }));

            expect(tweeneditor.state).toBe(MEPH.tween.TweenEditor.states.dragging);
            expect(tweeneditor.target).toBeTruthy();

            if (app) {
                app.removeSpace();
            }
        }).catch(function (error) {
            expect(error || new Error('did not render as expected')).caught();
        }).then(function () {
            done();
        });
    });

});