describe("MEPH/audio/graph/AudioGraph.spec.js", 'MEPH.audio.graph.AudioGraph', function () {

    beforeEach(function () {
        jasmine.addMatchers(MEPH.customMatchers);
    });

    it("can create a AudioGraph", function () {
        //Arrange

        //Assert
        var input = new MEPH.audio.graph.AudioGraph();

        expect(input).toBeTruthy();

    });

    it('can render a AudioGraph', function (done) {
        MEPH.render('MEPH.audio.graph.AudioGraph', 'audiograph').then(function (r) {
            var results = r.res;
            var app = r.app;

            var dom,
                AudioGraph = results.first().classInstance;
            ///Assert
            dom = AudioGraph.getDomTemplate()[0]
            expect(dom).toBeTruthy();
            if (app) {
                app.removeSpace();
            }
        }).catch(function (error) {
            expect(error || new Error('did not render as expected')).caught();
        }).then(function () {
            done();
        });
    });

    it('can add a convolver AudioGraph', function (done) {
        MEPH.render('MEPH.audio.graph.AudioGraph', 'audiograph').then(function (r) {
            var results = r.res;
            var app = r.app;

            var dom,
                AudioGraph = results.first().classInstance;
            ///Assert
            dom = AudioGraph.getDomTemplate()[0];
            
            AudioGraph.addConvolver();
            expect(dom).toBeTruthy();
          
            return new Promise(function (r) {
                setTimeout(function () {
                    var d = AudioGraph.graph;
                    if (app) {
                        app.removeSpace();
                    }
                    r();
                }, 5000)
            });
        }).catch(function (error) {
            expect(error || new Error('did not render as expected')).caught();
        }).then(function () {
            done();
        });
    });
});