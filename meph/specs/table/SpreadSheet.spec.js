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
});