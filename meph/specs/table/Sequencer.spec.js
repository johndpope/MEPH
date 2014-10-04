describe("MEPH/table/Sequencer.spec.js", 'MEPH.table.Sequencer', function () {
    var Sequencer = MEPH.table.Sequencer;

    beforeEach(function () {
        jasmine.addMatchers(MEPH.customMatchers);
    });

    it("can create a Sequencer", function () {
        //Arrange

        //Assert
        var input = new Sequencer();

        expect(input).toBeTruthy();

    });

    it('can render a Sequencer', function (done) {
        MEPH.render('MEPH.table.Sequencer', 'sequencer').then(function (r) {
            var results = r.res;
            var app = r.app;

            var dom,
                scrollingtable = results.first().classInstance;
            ///Assert
            dom = scrollingtable.getDomTemplate()[0]
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

    it('a sequencer requires data, that have certain properties, e.g. length, time, accessing them will be in the inheriting class', function () {
        var sequencer = new Sequencer();
        sequencer.time = function (x) {
            return x.time;
        }
        sequencer.length = function (x) {
            return x.length;
        }
        var called;
        sequencer.on('altered', function (type, args) {
            if (args.property === 'source') {
                called = true;
            }
        })
        sequencer.source = MEPH.Observable.observable([{ time: 0, length: 1 }]);
        expect(called).toBeTruthy();
    });

    it('when the source is altered the sequencer will update the screen', function () {
        var sequencer = new Sequencer();
        sequencer.time = function (x) {
            return x.time;
        }
        sequencer.length = function (x) {
            return x.length;
        }
        var called;
        sequencer.updateCells = function () {
            called = true;
        };
        sequencer.source = MEPH.Observable.observable([{ time: 0, length: 1 }]);
        expect(called).toBeTruthy();
    });

    it('the sequencer must have a time, length and lane function to get enough information for sequencing', function () {
        var sequence = new Sequencer();
        var result = sequence.getMainContentInstructions({});
        expect(result).toBeFalsy();
        sequence.time = function () { }
        sequence.length = function () { }
        sequence.lane = function () { }
        result = sequence.getMainContentInstructions({});
        expect(result).toBeTruthy();
    });


    it('when an update occurs, visilble cells and rows are passed as arguments, so the sequencer must return a list o instructions' +
        'to render the source based on the visiblle cells', function () {
            var sequence = new Sequencer();
            sequence.time = function (x) { return 1; }
            sequence.length = function (x) { return 1; }
            sequence.lane = function (x) { return 0; }
            result = sequence.getMainContentInstructions({});
            expect(result).toBeTruthy();

            expect(result.length === 0).toBeTruthy();
        });


    it('when an update occurs, visilble cells and rows are passed as arguments, so the sequencer must return a list o instructions' +
        'to render the source based on the visiblle cells, returns 1 instruction', function () {
            var sequence = new Sequencer();
            sequence.time = function (x) { return 0; }
            sequence.length = function (x) { return 1; };
            sequence.lane = function (x) { return 0; };
            sequence.columnOffsets = [].interpolate(0, 10, function (x) { return 12; });
            sequence.rowOffsets = [].interpolate(0, 10, function (x) { return 12; });
            sequence.getCellPosition = function () {
                return { x: 0, y: 0 };
            }
            sequence.source = [{}];
            result = sequence.getMainContentInstructions({
                visibleRows: 1,
                visibleColumns: 1,
                row: 0,
                column: 0
            });

            expect(result).toBeTruthy();
            expect(result.length === 1).toBeTruthy();
        });

    it('adding to the source will cause an update', function (done) {
        var sequence = new Sequencer(),
            called;
        sequence.source = MEPH.Observable.observable([]);
        sequence.getMainContentInstructions = function () {
            called = true;
        }

        sequence.source.push({});
        setTimeout(function (x) {
            expect(called).toBeTruthy();
            done();
        }, 10)
    });


    it('removing an item will cause an update', function (done) {
        var sequence = new Sequencer(),
            called;
        sequence.source = MEPH.Observable.observable([{}]);
        sequence.getMainContentInstructions = function () {
            called = true;
        }

        sequence.source.pop();

        setTimeout(function (x) {
            expect(called).toBeTruthy();
            done();
        }, 10)
    });


    it('replacing the source with a new source , will strip event references from the first.', function () {
        var sequence = new Sequencer(),
            called;
        var source1 = MEPH.Observable.observable([{}]);

        sequence.source = source1;
        sequence.source = null;
        sequence.getMainContentInstructions = function () {
            called = true;
        }

        expect(source1.hasOn(null, sequence)).toBeFalsy();

    });

    it('items in the source will be monitored for changes', function (done) {
        var sequence = new Sequencer(),

            called = 0;

        sequence.updateCells = function () {
            called++;
        }
        sequence.time = function (x) { return 0; }
        sequence.length = function (x) { return 1; };
        sequence.lane = function (x) { return 0; };
        sequence.columnOffsets = [].interpolate(0, 10, function (x) { return 12; });
        sequence.rowOffsets = [].interpolate(0, 10, function (x) { return 12; });
        sequence.getCellPosition = function () {
            return { x: 0, y: 0 };
        }
        var item = { prop: 'p' };
        MEPH.Observable.observable(item);
        var source1 = MEPH.Observable.observable([item]);
        sequence.source = source1;


        item.prop = '2';

        setTimeout(function (x) {
            expect(called).toBe(2);
            done();
        }, 130)

    });
});