/**
* @class MEPH.mobile.activity.ActivityController
* Manages activities within the application.
*/
MEPH.define('MEPH.mobile.activity.ActivityController', {
    requires: ['MEPH.Constants',
               'MEPH.mobile.services.MobileServices',
               'MEPH.mobile.mixins.Activity'],
    statics: {
        viewProvider: 'viewProvider'
    },
    properties: {
        activities: null,
        activityHolder: null,
        currentActivity: null,
        tokens: null,
        openActivityOnStop: true,
        $appPath: null,
        activityControllerPromise: null
    },
    initialize: function () {
        var me = this;
        me.activityControllerPromise = Promise.resolve();
        me.tokens = [];
        me.activities = [];
        me.tokens.push(MEPH.subscribe(MEPH.Constants.startView, me.onStartView.bind(me)));
        me.tokens.push(MEPH.subscribe(MEPH.Constants.showView, me.onShowView.bind(me)));
        me.listenToStatePop();
        //window.history.pushState({ activityId: null, initial: true }, '', '');
    },
    setAppPath: function (appPath) {
        var me = this;
        me.$appPath = appPath;
    },
    getAppPath: function () {
        var me = this;
        return me.$appPath || '';
    },
    /**
     * @private
     */
    listenToStatePop: function () {
        var me = this;
        MEPH.Events(me);
        me.don('popstate', window, me.onPopState.bind(me));
    },
    /**
     * @private
     */
    onPopState: function (evnt) {
        var me = this,
            state = evnt.state,
            activity;
        if (state) {
            activity = me.getActivity(state.activityId);
            if (activity) {
                return me.showActivity(activity);
            }
        }
        return Promise.resolve();
    },
    /**
     * @private
     * Pushes the activity state to the window for navigation.
     * @param {Window} window
     * @param {Object} state
     * @param {String} pageName
     * @param {String} pagePath
     **/
    pushState: function (window, state, pageName, pagePath) {
        window.history.pushState((state), pageName, pagePath);
    },
    /**
     * @private
     * Gets the path.
     * @param {Object} viewConfig
     * @returns {String}
     **/
    getPath: function (viewConfig) {
        if (viewConfig) {
            if (viewConfig.path) {
                return viewConfig.path;
            }
        }
        return null;
    },
    getActivityName: function (viewConfig, activity) {
        return '';
    },
    /**
     * Sets the application.
     * @param {MEPH.application.Application} application
     **/
    setApplication: function (application) {
        var me = this;
        me.application = application;
        me.application.on('controladded', me.onControlAdded.bind(me));
    },
    /**
     * Handles the addition of a control.
     **/
    onControlAdded: function (type, control) {
        var me = this;
        if (control && control.isActivity) {
            me.addActivity(control);
        }
    },
    /**
     * Gets  the application.
     * @returns {MEPH.application.Application}
     **/
    getApplication: function () {
        var me = this;
        return me.application;
    },
    /**
     * Sets the activities holder.
     * @param {Object} el
     **/
    setActivityHolder: function (el) {
        var me = this;
        me.activityHolder = el;
    },
    /**
     * Gets the activity holder.
     **/
    getActivityHolder: function () {
        var me = this;
        return me.activityHolder;
    },
    /**
     * Starts view.
     */
    onStartView: function (type, options) {
        var me = this;
        me.activityControllerPromise = me.activityControllerPromise.then(function () {
            return me.startActivity(options).catch(function () {
                MEPH.Log.apply(MEPH, arguments);
            });
        });
    },
    onShowView: function (type, options) {
        var me = this;
        me.activityControllerPromise = me.activityControllerPromise.then(function () {
            return me.showActivity(options.activity);
        });
    },
    /**
     * Starts an activity
     * @param {Object} activityConfig
     * @param {Object} activityConfig.viewId
     **/
    startActivity: function (activityConfig) {
        var me = this, currentActivity = me.getCurrentActivity();

        return Promise.resolve().then(function () {
            if (currentActivity) {
                return currentActivity.initHide()
            }
        }).then(function () {
            me.setCurrentActivity(null);
            return me.createActivity(activityConfig).then(function (array) {
                var result = array.first();
                result.classInstance.setActivityArguments(activityConfig);
                me.addActivity(result.classInstance, activityConfig.parentActivity || null);
                if (me.openActivityOnStop) {
                    return me.showActivity(result.classInstance).then(function () {
                        return result;
                    });
                }
                return result;
            }).then(function (result) {
                var activity = result.classInstance,
                    combinedPath = '',
                    path = me.getPath(activityConfig);
                if (path !== null) {
                    combinedPath = MEPH.Array(me.getAppPath().split('/').concat(path.split('/'))).where(function (x) {
                        return x;
                    }).join('/');
                    me.pushState(me.$window, { activityId: activity.getActivityId() }, me.getActivityName(activityConfig, activity), '/' + combinedPath);
                }
                MEPH.publish(MEPH.Constants.ActivityStarted, { activity: activity });
                return result;
            }).catch(function (error) {
                MEPH.Log(error);
            });;
        })
    },
    /**
     * Creates an activity from the configuration.
     * @param {Object} activityConfig.
     * @returns {Promise}
     */
    createActivity: function (activityConfig) {
        var me = this,
            ac = MEPH.mobile.activity.ActivityController,
            promise = Promise.resolve();
        promise = promise.then(function () {
            return MEPH.MobileServices.get(ac.viewProvider).then(function (viewProvider) {
                return viewProvider.getView(activityConfig);
            });
        }).then(function (viewConfig) {
            var patterns;
            if (viewConfig) {
                patterns = MEPH.Array(MEPH.patternTypes).where(function (pt) {
                    if (viewConfig) {
                        return viewConfig.hasOwnProperty(pt);
                    }
                    return null;
                }).select(function (key) {
                    return viewConfig[key];
                });
            }
            else {
                throw 'no view config passed';
            }
            patterns = patterns || [];
            
            return MEPH.requires.apply(MEPH, patterns).then(function () {
                if (viewConfig) {
                    var info = MEPH.getDefinedClassInformation(viewConfig.view);
                    viewConfig.alias = info.alias;
                    viewConfig.patterns = patterns;
                    return viewConfig;
                }
                return null;
            })
        }).then(function (viewConfig) {
            var datareferences,
                application = me.getApplication(),
                dom = activityConfig.positionDom || me.getActivityHolder(),
                activityDom = document.createElement(viewConfig.alias),
                keys = MEPH.Array(MEPH.patternTypes).where(function (pt) {
                    return viewConfig.hasOwnProperty(pt);
                })
            datareferences = keys.where(function (x) { return x !== 'view'; })
                .select(function (pattern) {
                    return '"' + pattern + '" : ' + ' "' + viewConfig[pattern] + '" ';
                }).join(',');

            activityDom.setAttribute(MEPH.dataObjectReferenceAttribute, datareferences);

            return application.loadViewObject([{
                node: activityDom,
                alias: viewConfig.alias,
                view: true
            }], dom);
        });
        return promise;
    },
    /**
     * Get the complete ancestor chain of an activity.
     * @param {MEPH.mobile.mixins.Activity} activity
     **/
    getAncestorActivities: function (activity) {
        var me = this,
            activity,
            result = [];
        activityStructure = me.getActivities().first(function (x) {
            return x.activity === activity;
        });
        if (activityStructure && activityStructure.parent) {
            result.push(activityStructure.parent);
            result = result.concat(me.getAncestorActivities(activityStructure.parent));
        }
        else if (!activityStructure) {
            throw 'no activity found : ActivityController';
        }
        return MEPH.Array(result);
    },
    /**
     * Show an activity.
     * @param {MEPH.mobile.mixins.Activity} activity
     **/
    showActivity: function (activity) {
        if (typeof (activity) === 'string') {
            activity = this.getActivity(activity);
        }
        var me = this,
            promise = Promise.resolve(),
            currentActivity = me.getCurrentActivity();
        if (!activity) {
            return promise;
        }
        if (activity === currentActivity) {
            return promise;
        }
        if (currentActivity) {
            promise = promise.then(function () {
                return currentActivity.initHide({ activityToBeShown: activity });
            });
        }

        promise = promise.then(function () {
            return activity.initShow();
        }).then(function (result) {
            if (result.success) {
                me.setCurrentActivity(activity);
            }
            return result;
        });

        return promise;
    },
    /**
     * Closes the activity
     * @param {MEPH.mobile.mixins.Activity} activity
     **/
    closeActivity: function (activity) {
        var me = this,
            promise = Promise.resolve(),
            currentActivity = me.getCurrentActivity();

        promise = promise.then(function () {
            return activity.initClose();
        }).then(function (result) {
            if (result.success) {
                if (activity === currentActivity) {
                    me.setCurrentActivity(null);
                }
            }
            return result;
        });

        return promise;
    },
    /**
     * Open an activity
     * @param {MEPH.mobile.mixins.Activity} activity
     **/
    openActivity: function (activity) {
        var me = this,
          promise = Promise.resolve(),
          currentActivity = me.getCurrentActivity();
        if (currentActivity) {
            promise = promise.then(function () {
                return currentActivity.initHide({ activityToBeShown: activity });
            });
        }
        promise = promise.then(function () {
            return activity.initOpen();
        }).then(function (result) {
            if (result.success) {
                me.setCurrentActivity(activity);
            }
            return result;
        });

        return promise;
    },
    /**
     * Gets the current activity.
     **/
    getCurrentActivity: function () {
        var me = this;
        return me.currentActivity;
    },
    /**
     * Sets the current activity.
     * @param {MEPH.mobile.mixins.Activity} activity
     */
    setCurrentActivity: function (activity) {
        var me = this;
        me.currentActivity = activity;
    },
    /**
     * Adds an activity.
     * @param {MEPH.mobile.mixins.Activity} activity
     */
    addActivity: function (activity, parentActivity) {
        var me = this,
            parentExists = me.getActivities().first(function (x) { return x.activity === parentActivity; });
        if (activity.isActivity() && !me.activities.some(function (x) {
            return x.activity.getActivityId() === activity.getActivityId();
        })) {
            me.activities.push({
                activity: activity,
                parent: parentActivity ? parentActivity : null
            });
        }
    },
    /**
     * Sets the activity parent.
     **/
    setActivityParent: function (activity, parentActivity) {
        var me = this, first;
        first = me.getActivities().first(function (x) {
            return x.activity === activity;
        });

        if (first) {
            first.parent = parentActivity;
        }
    },
    /**
     * Gets the activity by id.
     * @param {String} id
     * @return {MEPH.mobile.mixins.Activity}
     */
    getActivity: function (id) {
        var me = this, info;
        info = me.getActivities().first(function (x) { return x.activity.getActivityId() === id; });
        if (info) {
            return info.activity;
        }
        return null;
    },
    /**
     * Gets the activities.
     * @returns {Array}
     **/
    getActivities: function () {
        var me = this;
        return me.activities;
    }
});