describe("MEPH/table/SpreadSheet.spec.js", 'MEPH.table.SpreadSheet', function () {
    var ScrollingTable = MEPH.table.ScrollingTable;

    beforeEach(function () {
        jasmine.addMatchers(MEPH.customMatchers);
    });

    it("can create a SpreadSheet", function () {
        //Arrange

        //Assert
        var input = new MEPH.table.SpreadSheet();

        expect(input).toBeTruthy();

    });

    it('can render a SpreadSheet', function (done) {
        MEPH.render('MEPH.table.SpreadSheet', 'scrollingtable').then(function (r) {
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

    it('can detect a click on a specific cell', function (done) {

        MEPH.render('MEPH.table.SpreadSheet', 'scrollingtable').then(function (r) {
            var results = r.res;
            var app = r.app;

            var dom,
                scrollingtable = results.first().classInstance;
            scrollingtable.rowheaders = "1";
            scrollingtable.columnheaders = "1";
            scrollingtable.columns = "26";
            scrollingtable.rows = "1000";
            var cells;
            scrollingtable.body.addEventListener('cellclicked', function (e) {
                cells = e.cells;
            })
            scrollingtable.canvas.dispatchEvent(MEPH.createEvent('click', { pageX: 10, pageY: 10 }));

            ///Assert
            return new Promise(function (r) {
                setTimeout(function () {
                    expect(cells).toBeTruthy();
                    if (app) {
                        app.removeSpace();
                    }
                    r();
                }, 150);
            })
        }).catch(function (error) {
            expect(error || new Error('did not render as expected')).caught();
        }).then(function () {
            done();
        });
    })
});