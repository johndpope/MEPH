describe("MEPH/mobile/application/container/MobileApplicationContainer.spec.js", function () {

    beforeEach(function () {
        jasmine.addMatchers(MEPH.customMatchers);
    });

    it('can create a mobile application.', function (done) {
        //Arrange
        MEPH.create('MEPH.mobile.application.container.MobileApplicationContainer').then(function ($class) {
            var mobileapplication = new $class();

            expect(mobileapplication).theTruth('The mobile application was not created.');
            mobileapplication.destroy();

        }).catch(function (error) {
            expect(error).caught();
        }).then(function (x) {
            done();
        });;
    });

    it('a mobile application will resize itself when the page resizes ', function (done) {
        var dom = document.createElement('div');
        dom.innerHTML = '<mobileapplicationcontainer></mobileapplicationcontainer>'
        MEPH.requires('MEPH.application.Application', 'MEPH.mobile.application.container.MobileApplicationContainer').then(function () {

            var application = new MEPH.application.Application(), viewObjects;
            viewObjects = application.getViewObjects(dom);
            return application.loadViewObject(viewObjects).then(function (objects) {

                var node = objects.first().templateNode.first(),
                    toresolve,
                    tofail,
                    resized,
                    classInstance = objects.first().classInstance;
                classInstance.on(MEPH.mobile.application.container.MobileApplicationContainer.events.resize, function () {
                    resized = true;
                });

                classInstance.setDomTemplate([node]);
                node.dispatchEvent(MEPH.createEvent('resize', {}));
                var promise = new Promise(function (resolve, fail) {
                    toresolve = resolve;
                    tofail = fail;
                });

                setTimeout(function () {
                    try {
                        expect(resized).theTruth('the application didnt react correctly to a resize event');
                        classInstance.destroy();
                        toresolve();
                    }
                    catch (error) {
                        tofail(error);
                    }
                }, classInstance.$resizeBuffer * 2);

                return promise;
            })
        }).catch(function (error) {
            expect(error).caught();
        }).then(function (x) {
            done();
        });
    });
});