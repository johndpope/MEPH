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
        sequence.updateCells = function () {
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
        sequence.updateCells = function () {
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
        sequence.updateCells = function () {
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
        sequence.setActiveCell = function () { };;
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

    it('when the source changes the listeners will be removed from the items.', function (done) {
        var sequence = new Sequencer(),

            called = 0;

        sequence.updateCells = function () {
            called++;
        }
        sequence.setActiveCell = function () { };;

        var item = { prop: 'p' };
        MEPH.Observable.observable(item);
        var source1 = MEPH.Observable.observable([item]);
        sequence.source = source1;

        item.prop = '2';

        sequence.source = null;
        item.prop = '3';
        setTimeout(function (x) {
            expect(called).toBe(3);
            done();
        }, 1);
    });

    it('can get the item which the mouse is over', function () {
        var sequence = new Sequencer();
        sequence.time = function (x) { return 0; }
        sequence.length = function (x) { return 1; };
        sequence.lane = function (x) { return 0; };
        sequence.columnOffsets = [].interpolate(0, 10, function (x) { return 12; });
        sequence.rowOffsets = [].interpolate(0, 10, function (x) { return 12; });
        sequence.getCellPosition = function () {
            return { x: 0, y: 0 };
        }
        sequence.setActiveCell = function () { };;
        sequence.updateCells = function () { };
        var item = { prop: 'p' };
        MEPH.Observable.observable(item);
        var source1 = MEPH.Observable.observable([item]);
        sequence.source = source1;
        var type;
        var args;
        sequence.dispatchEvent = function (t, a) {
            type = t;
            args = a;
        }
        sequence.onMouseOverCell({}, {
            cells: [{ row: 0, column: 0 }],
            position: { x: 1, y: 1 }
        });

        expect(type).toBe('mouseoveritem');
        expect(args.items.contains(item)).toBeTruthy();
    });



    it('listens for a mouseovercell call.', function (done) {
        MEPH.render('MEPH.table.Sequencer', 'sequencer').then(function (r) {
            var results = r.res;
            var called, app = r.app;

            var dom,
                sequencer = results.first().classInstance;
            sequencer.updateCells = function () {
            };
            sequencer.setActiveCell = function () { };;
            sequencer.onMouseOverCell = function () {
                called = true
            }
            ///Assert
            sequencer.canvas.dispatchEvent(MEPH.createEvent('mouseovercell', {}))
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

    it('listens for a mouseovercell header call.', function (done) {
        MEPH.render('MEPH.table.Sequencer', 'sequencer').then(function (r) {
            var results = r.res;
            var called, app = r.app;

            var dom,
                sequencer = results.first().classInstance;
            sequencer.updateCells = function () {
            };
            sequencer.setActiveCell = function () { };;
            sequencer.onMouseOverCell = function () {
                called = true
            }
            ///Assert
            sequencer.topheader.dispatchEvent(MEPH.createEvent('mouseovercelltop', {}))
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


    it('listens for a mouseovercell header call.', function (done) {
        MEPH.render('MEPH.table.Sequencer', 'sequencer').then(function (r) {
            var results = r.res;
            var called, app = r.app;

            var dom,
                sequencer = results.first().classInstance;
            sequencer.updateCells = function () {
            };
            sequencer.setActiveCell = function () { };;
            sequencer.onMouseOverCell = function () {
                called = true
            }
            ///Assert
            sequencer.leftheader.dispatchEvent(MEPH.createEvent('mouseovercellleft', {}))
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

    it('to grab an item in the sequence, it must have a settime function', function () {
        var sequence = new Sequencer();

        sequence.updateCells = function () { }
        sequence.setActiveCell = function () { };;
        var item = { prop: 'p' };
        MEPH.Observable.observable(item);
        var source1 = MEPH.Observable.observable([item]);
        sequence.source = source1;

        var result = sequence.grab(item);

        expect(sequence.state).toBeFalsy();
        expect(result).toBeFalsy();
    });

    it('when grabbing an item the state is set to grabbing, and the grabbed item is set on the me.grabbeditem property', function () {
        var sequence = new Sequencer();
        sequence.setActiveCell = function () { };;
        sequence.settime = function () { }
        sequence.updateCells = function () { }
        var item = { prop: 'p' };
        MEPH.Observable.observable(item);
        var source1 = MEPH.Observable.observable([item]);
        sequence.source = source1;

        var result = sequence.grab(item);

        expect(sequence.grabbeditem === item).toBeTruthy();
        expect(sequence.state).toBeTruthy();
        expect(result).toBeTruthy();

    });

    it('when the state is grabbing, the grabrep will be moved, and follow the mouse but only in its lane on mousemovecell', function (done) {
        MEPH.render('MEPH.table.Sequencer', 'sequencer').then(function (r) {
            var results = r.res;
            var called, app = r.app;

            var dom,
                called,
                sequencer = results.first().classInstance;
            sequencer.updateCells = function () { };
            sequencer.time = function (x) { return 0; };
            sequencer.setttime = function () {
            };
            sequencer.setActiveCell = function () { };;
            sequencer.length = function (x) { return 1; };
            sequencer.lane = function (x) { return 0; };
            sequencer.columnOffsets = [].interpolate(0, 10, function (x) { return 12; });
            sequencer.rowOffsets = [].interpolate(0, 10, function (x) { return 12; });
            sequencer.getCellPosition = function () {
                return { x: 0, y: 0 };
            }
            sequencer.onMouseOverCell = function () { }
            ///Assert
            sequencer.state = MEPH.table.Sequencer.grabbing;
            sequencer.positionGrabRep = function () {
                called = true;
            }
            sequencer.canvas.dispatchEvent(MEPH.createEvent('mousemovecell', {
                cells: [{
                    row: 1,
                    column: 1
                }],
                position: {
                    x: 10,
                    y: 10
                }
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


    it('can set the grabreps position and size. ', function (done) {
        MEPH.render('MEPH.table.Sequencer', 'sequencer').then(function (r) {
            var results = r.res;
            var called, app = r.app;

            var dom,
                called,
                sequencer = results.first().classInstance;

            sequencer.positionGrabRep({ x: 1, y: 2, width: 10, height: 10 });

            expect(sequencer.grabrep.clientWidth == 10).toBeTruthy();
            expect(sequencer.grabrep.clientHeight == 10).toBeTruthy();
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