describe("MEPH/context/ContextMenu.spec.js", 'MEPH.context.ContextMenu', function () {

    beforeEach(function () {
        jasmine.addMatchers(MEPH.customMatchers);
    });

    it("a context menu class is defined.", function () {
        //Arrange
        var menu = new MEPH.context.ContextMenu();

        expect(menu).toBeTruthy();
        //Assert
    });

    it('can be rendered', function (done) {
        MEPH.render('MEPH.context.ContextMenu', 'contextmenu').then(function (r) {
            var results = r.res;
            var app = r.app;

            var dom,
                AudioGraph = results.first().classInstance;
            ///Assert
            dom = AudioGraph.getDomTemplate()[0];
            expect(dom).toBeTruthy();
            if (app) {
                app.removeSpace();
            }

        }).catch(function (error) {
            expect(error || new Error('did not render as expected')).caught();
        }).then(function () {
            done();
        });
    })
    it('can be opened ', function (done) {
        MEPH.render('MEPH.context.ContextMenu', 'contextmenu').then(function (r) {
            var results = r.res;
            var app = r.app;

            var dom,
                contextmenu = results.first().classInstance;
            ///Assert
            dom = contextmenu.getFirstElement();
            expect(dom).toBeTruthy();
            contextmenu.open();

            expect(dom.classList.contains(contextmenu.opencls));
            if (app) {
                app.removeSpace();
            }

        }).catch(function (error) {
            expect(error || new Error('did not render as expected')).caught();
        }).then(function () {
            done();
        });
    });
    it('can be closed ', function (done) {
        MEPH.render('MEPH.context.ContextMenu', 'contextmenu').then(function (r) {
            var results = r.res;
            var app = r.app;

            var dom,
                contextmenu = results.first().classInstance;
            ///Assert
            dom = contextmenu.getFirstElement();
            expect(dom).toBeTruthy();
            contextmenu.open();

            expect(dom.classList.contains(contextmenu.opencls)).toBeTruthy();

            contextmenu.close();
            expect(!dom.classList.contains(contextmenu.opencls)).toBeTruthy();

            if (app) {
                app.removeSpace();
            }

        }).catch(function (error) {
            expect(error || new Error('did not render as expected')).caught();
        }).then(function () {
            done();
        });
    });
    it('when opened the context menus parent is the pages body', function (done) {
        MEPH.render('MEPH.context.ContextMenu', 'contextmenu').then(function (r) {
            var results = r.res;
            var app = r.app;

            var dom,
                contextmenu = results.first().classInstance;
            ///Assert
            dom = contextmenu.getFirstElement();
            expect(dom).toBeTruthy();
            contextmenu.open();

            expect(dom.classList.contains(contextmenu.opencls)).toBeTruthy();

            expect(document.body === dom.parentNode).toBeTruthy();

            if (app) {
                app.removeSpace();
            }

        }).catch(function (error) {
            expect(error || new Error('did not render as expected')).caught();
        }).then(function () {
            done();
        });
    });
    it('when closed the context menus parent is not the body', function (done) {
        MEPH.render('MEPH.context.ContextMenu', 'contextmenu').then(function (r) {
            var results = r.res;
            var app = r.app;

            var dom,
                contextmenu = results.first().classInstance;
            ///Assert
            dom = contextmenu.getFirstElement();
            expect(dom).toBeTruthy();
            contextmenu.open();

            expect(dom.classList.contains(contextmenu.opencls)).toBeTruthy();

            expect(document.body === dom.parentNode).toBeTruthy();

            contextmenu.close();
            expect(document.body !== dom.parentNode).toBeTruthy();
            if (app) {
                app.removeSpace();
            }

        }).catch(function (error) {
            expect(error || new Error('did not render as expected')).caught();
        }).then(function () {
            done();
        });
    });

    it('when a click occurs outside of the context menu it will close if opened.', function (done) {
        MEPH.render('MEPH.context.ContextMenu', 'contextmenu').then(function (r) {
            var results = r.res;
            var app = r.app;

            var dom,
                contextmenu = results.first().classInstance;
            ///Assert
            dom = contextmenu.getFirstElement();
            expect(dom).toBeTruthy();

            contextmenu.open();

            expect(dom.classList.contains(contextmenu.opencls)).toBeTruthy();

            expect(document.body === dom.parentNode).toBeTruthy();

            document.body.dispatchEvent(MEPH.createEvent('click', { target: document.body }));

            expect(document.body !== dom.parentNode).toBeTruthy();
            if (app) {
                app.removeSpace();
            }

        }).catch(function (error) {
            expect(error || new Error('did not render as expected')).caught();
        }).then(function () {
            done();
        });
    });

    it('when opened the menu will be position to the mouse.', function (done) {
        MEPH.render('MEPH.context.ContextMenu', 'contextmenu').then(function (r) {
            var results = r.res;
            var app = r.app;

            var dom,
                contextmenu = results.first().classInstance;
            ///Assert
            dom = contextmenu.getFirstElement();
            expect(dom).toBeTruthy();

            contextmenu.open();
            expect(contextmenu.position).toBeTruthy();
            if (app) {
                app.removeSpace();
            }

        }).catch(function (error) {
            expect(error || new Error('did not render as expected')).caught();
        }).then(function () {
            done();
        });
    });

    it('when an item is clicked a context menu event is raised in the old parent.', function (done) {
        MEPH.render('MEPH.context.ContextMenu', 'contextmenu').then(function (r) {
            var results = r.res;
            var app = r.app;

            var dom,
                contextmenu = results.first().classInstance;
            ///Assert
            dom = contextmenu.getFirstElement();
            var div = document.createElement('div');
            div.setAttribute('contextevt', 'divclick');
            dom.appendChild(div);
            expect(dom).toBeTruthy();

            contextmenu.open();

            var called;
            contextmenu.olddomparent.addEventListener('divclick', function () {
                called = true;
            });
            div.dispatchEvent(MEPH.createEvent('click', {
                srcElement: div
            }));

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

});