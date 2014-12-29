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
        me.tokens.push(MEPH.subscribe(MEPH.Constants.closeView, me.onCloseActivity.bind(me)));
        me.tokens.push(MEPH.subscribe(MEPH.Constants.OPEN_ACTIVITY, me.onOpenActivity.bind(me)));

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
        MEPH.Log('on pop state ');
        if (state) {

            activity = me.getActivity(state.activityId);
            me.activityControllerPromise = me.activityControllerPromise.then(function () {
                if (activity) {
                    MEPH.Log('showing an activity');
                    return me.showActivity(activity);
                }
                else {
                    MEPH.Log('start activity from path.');
                    return me.startActivityFromPath(state.path, false)
                }
            }).catch(function (e) {
                MEPH.Log(e);
            });
            return me.activityControllerPromise;
        }
        return Promise.resolve();
    },

    startActivityFromPath: function (querystring, replacestate) {
        var me = this;
        if (!querystring) {
            return Promise.resolve();
        }
        return MEPH.MobileServices.get(MEPH.mobile.activity.ActivityController.viewProvider).then(function (viewProvider) {
            if (viewProvider) {
                return viewProvider.getViews().then(function (views) {
                    var view = views.first(function (x) { return x.path === querystring; })
                    if (view) {
                        return me.startActivity(view).then(function (result) {
                            if (replacestate) {
                                var activity = result.classInstance;
                                me.pushState(me.$window, { activityId: activity.getActivityId(), path: activity.getPath() }, '', me.getCombinedPath(activity.getPath()))
                            }
                            return result;
                        });
                    }
                    return Promise.resolve();
                });
            }
        }).then(function () {

            MEPH.Log('activity started from path.');
        }).catch(function (e) {

            MEPH.Log('activity failed to start.');
            throw e;
        });;
    },
    replaceState: function (window, state, pageName, pagePath) {
        window.history.replaceState((state), pageName, pagePath);
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
        MEPH.Log('onstartview');
        me.activityControllerPromise = me.activityControllerPromise.then(function () {
            return me.startActivity(options).catch(function () {
                MEPH.Log.apply(MEPH, arguments);
            });
        }).catch(function (e) {
            MEPH.Log(e);
        }).then(function () {
            MEPH.Log('view started');
        });
    },
    onShowView: function (type, options) {
        var me = this;
        me.activityControllerPromise = me.activityControllerPromise.then(function () {
            return me.showActivity(options.activity).then(function (result) {
                if (options.activity.getActivityPath()) {
                    me.pushState(me.$window, {
                        activityId: options.activity.getActivityId(),
                        path: options.activity.getActivityPath()
                    }, '', me.getCombinedPath(options.activity.getActivityPath()));
                }
                return result;
            });;
        }).catch(function (e) {
            MEPH.Log(e);
        });
        return me.activityControllerPromise;
    },
    onCloseActivity: function (type, options) {
        var me = this;
        me.activityControllerPromise = me.activityControllerPromise.then(function () {
            return me.closeActivity(options.activity);
        }).catch(function (e) {
            MEPH.Log(e);
        }).then(function () {
            me.setCurrentActivity(null);
        });
    },
    getCombinedPath: function (path) {
        var me = this;
        try {
            return '/' + MEPH.Array(me.getAppPath().split('/').concat(path.split('/'))).where(function (x) {
                return x;
            }).join('/');
        } catch (error) {
            MEPH.Log(error);
            return '';
        }
    },
    onOpenActivity: function (type, option) {
        var me = this;
        return me.openOrCreateActivity(option, null)
    },
    openOrCreateActivity: function (activityConfig, querystring) {
        var me = this;
        me.activityControllerPromise = me.activityControllerPromise.then(function () {
            var res,
                activity = me.getActivity(activityConfig);
            var currentactivity = me.getCurrentActivity();
                
            if (activity) {
                activity.setActivityArguments(activityConfig);
                res = me.openActivity(activity).then(function (options) {
                    //var activity = options.classInstance;
                    me.pushState(me.$window, {
                        activityId: activity.getActivityId(),
                        path: activity.getActivityPath()
                    }, '', me.getCombinedPath(activity.getActivityPath()));
                    return activity;
                });
            }
            else {
                res = me.startActivity(activityConfig, querystring).then(function (options) {
                    var activity = options.classInstance;
                    //me.pushState(me.$window, {
                    //    activityId: activity.getActivityId(),
                    //    path: activity.getActivityPath()
                    //}, '', me.getCombinedPath(activity.getActivityPath()));
                    return activity;
                });
            }
            return res;
        })
    },
    /**
     * Starts an activity
     * @param {Object} activityConfig
     * @param {Object} activityConfig.viewId
     * @param {String} querystring
     **/
    startActivity: function (activityConfig, querystring) {
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
                    combinedPath = me.getCombinedPath(querystring || path);
                    activity.setPath(querystring || path);
                    me.pushState(me.$window, {
                        activityId: activity.getActivityId(),
                        path: querystring || path
                    }, me.getActivityName(activityConfig, activity), combinedPath);
                }

                if (result.classInstance.afterShow)
                    result.classInstance.afterShow();

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
            }], dom).then(function (res) {
                res.foreach(function (r) {
                    r.classInstance.$viewConfiguration = r.classInstance.$viewConfiguration || viewConfig;
                });
                return res;
            })
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
            if (activity.afterShow)
                activity.afterShow();
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
            if (MEPH.IsEventable(activity)) {
                activity.on('destroy', me.onActivityDestroy.bind(me, activity));
            }
            me.activities.push({
                activity: activity,
                parent: parentActivity ? parentActivity : null
            });
        }
    },
    onActivityDestroy: function (activity, type) {
        var me = this,
            removed;
        removed = me.removeActivity(activity);
        if (removed.length) {
            MEPH.publish(MEPH.Constants.ActivityDestroyed, {});
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
    removeActivity: function (activity) {
        var me = this;
        return me.activities.removeWhere(function (x) {
            return x.activity === activity;
        });
    },
    /**
     * Gets the activity by id.
     * @param {String} id
     * @return {MEPH.mobile.mixins.Activity}
     */
    getActivity: function (id) {
        var me = this, info;
        info = me.getActivities().first(function (x) {
            if (typeof id === 'object') {
                if (x.activity.$viewConfiguration.viewId !== id.viewId) {
                    return false;
                }
                return true;
            }
            return x.activity.getActivityId() === id;
        });
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