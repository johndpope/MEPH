describe("MEPH/audio/view/Visualizer.spec.js", 'MEPH.audio.view.Visualizer', function () {

    beforeEach(function () {
        jasmine.addMatchers(MEPH.customMatchers);
    });

    it("can create a visualizer", function () {
        //Arrange

        //Assert
        var input = new MEPH.audio.view.Visualizer();

        expect(input).toBeTruthy();

    });

    it('drop box has a depend property call dropboxCls, which will be computed on property change', function (done) {
        //Arrange

        MEPH.create('MEPH.audio.view.Visualizer').then(function ($class) {
            var dropbox = new $class();

            dropbox.componentCls = 'cssclass';

            //Assert
            expect(dropbox.visualizerCls.indexOf('cssclass') !== -1).theTruth('the class wasnt set correctly');
        }).catch(function (error) {
            expect(error).caught();
        }).then(function (x) {
            done();
        });
    });

    it('can render a visualizer', function (done) {
        MEPH.render('MEPH.audio.view.Visualizer', 'visualizer').then(function (r) {
            var results = r.res;
            var app = r.app;

            var dom,
                visualizer = results.first().classInstance;
            ///Assert
            dom = visualizer.getDomTemplate()[0]
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


    it('has a canvas', function (done) {
        MEPH.render('MEPH.audio.view.Visualizer', 'visualizer').then(function (r) {
            var results = r.res;
            var app = r.app;
            var dom,
                visualizer = results.first().classInstance;
            ///Assert
            expect(visualizer.canvas).toBeTruthy();
            if (app) {
                app.removeSpace();
            }
        }).catch(function (error) {
            expect(error || new Error('did not render as expected')).caught();
        }).then(function () {
            done();
        })
    });

});