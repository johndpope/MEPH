(function loadTests() {

    mephFrameWork('MEPH', '../src');

    MEPH.ready().then(function () {
        /**
         * Custom Matchers
         */

        MEPH.customMatchers = {
            caught: function (util, customEqualityTesters) {
                return {
                    compare: function (actual, expected) {
                        if (expected === 'undefined') {
                            expected = '';
                        }

                        var result = {};
                        result.pass = actual.stack ? false : true;
                        if (!result.pass) {
                            result.message = 'Caught an expection : \n ' + actual.stack;
                            console.log(actual.stack);
                        }
                        else {
                            result.message = '';
                        }
                        return result;
                    }
                }
            },
            theTruth: function (util, customEqualityTesters) {
                return {
                    compare: function (actual, reason) {
                        if (reason === undefined) {
                            reason = '';
                        }
                        var result = { message: '' };
                        result.pass = actual;
                        if (!result.pass) {
                            result.message = reason;
                        }
                        return result;
                    }
                };
            }
        };
    }).then(function () {
        MEPH.setPath('../src', 'MEPH');
        MEPH.setPath('../specs', 'MEPHTests');
        MEPH.setPath('../specs/data', 'dataviews');
        MEPH.namespace('MEPHTests');
        MEPH.setInterval = function () { }
        MEPHTests.loadTests = function () {
            function loadScriptFiles() {
                var promise,
                    i,
                    tests = [
                        'MEPH.spec.js',
                        'application/Application.spec.js',
                        'bind/Binder.spec.js',
                        'button/Button.spec.js',
                        'button/IconButton.spec.js',
                        'control/Control.spec.js',
                        'controller/Controller.spec.js',
                        'dom/ControlLoader.spec.js',
                        'dom/ControlReader.spec.js',
                        'field/FormField.spec.js',
                        'gpu/Context.spec.js',
                        'graph/ActiveZone.spec.js',
                        'graph/ConnectionHandler.spec.js',
                        'graph/Graph.spec.js',
                        'graph/GraphControl.spec.js',
                        'graph/GraphRenderer.spec.js',
                        'graph/GraphViewPort.spec.js',
                        'graph/renderer/BlenderNode.spec.js',
                        'graph/renderer/ConnectionRenderer.spec.js',
                        'graph/renderer/SquareBoxRenderer.spec.js',
                        'graph/Node.spec.js',
                        'graph/Connection.spec.js',
                        'input/Input.spec.js',
                        'ioc/Container.spec.js',
                        'pad/DrawingSurface.spec.js',
                        'list/List.spec.js',
                        'math/Hamilton.spec.js',
                        'math/Matrix.spec.js',
                        'math/Quaternion.spec.js',
                        'math/Vector.spec.js',
                        'mixins/Observable.spec.js',
                        'mobile/activity/ActivityController.spec.js',
                        'mobile/activity/container/Container.spec.js',
                        'mobile/application/container/MobileApplicationContainer.spec.js',
                        'mobile/application/controller/MobileApplicationController.spec.js',
                        'mobile/application/menu/ActivityMenuProvider.spec.js',
                        'mobile/application/menu/ApplicationMenu.spec.js',
                        'mobile/application/menu/ApplicationMenuProvider.spec.js',
                        'mobile/application/menuview/ApplicationMenuView.spec.js',
                        'mobile/application/menuview/ApplicationMenuCategories.spec.js',
                        'mobile/mixins/Activity.spec.js',
                        'mobile/Application.spec.js',
                        'mobile/providers/menuprovider/MenuProvider.spec.js',
                        'mobile/providers/viewprovider/ViewProvider.spec.js',
                        'mobile/services/MobileServices.spec.js',
                        'panel/flyout/FlyoutPanel.spec.js',
                        'panel/Panel.spec.js',
                        'qrcode/Qrcode.spec.js',
                        'remoting/RemotingController.spec.js',
                        'service/rtc/Connection.spec.js',
                        'service/ServiceCaller.spec.js',
                        'service/SignalRService.spec.js',
                        'session/SessionManager.spec.js',
                        'synchronization/SyncArray.spec.js',
                        'synchronization/SyncConflictNegotiator.spec.js',
                        'synchronization/SyncMembrane.spec.js',
                        'synchronization/SyncObject.spec.js',
                        'tree/Tree.spec.js',
                        'util/DataModel.spec.js',
                        'util/Dom.spec.js',
                        'util/Manifest.spec.js',
                        'util/Observable.spec.js',
                        'util/Queryable.spec.js',
                        'util/Renderer.spec.js',
                        'util/Validatable.spec.js',
                        'util/Template.spec.js',
                        'query/QueryableWorker.spec.js',
                        'webgl/Context.spec.js'
                    ];

                promise = Promise.resolve();
                for (i = 0 ; i < tests.length ; i++) {
                    promise = promise.then(function () {
                        return MEPH.Loader.loadScript(tests[this]);
                    }.bind(i));
                }
                promise.then(function () {
                    //jasmine.getEnv().execute();
                });
            }
            loadScriptFiles();

        };
        MEPHTests.loadTests();
    });
})();
