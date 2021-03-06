﻿/**
 * @class MEPH.mobile.providers.viewprovider.ViewProvider
 * Provides view definitions.
 **/
MEPH.define('MEPH.mobile.providers.viewprovider.ViewProvider', {
    properties: {
        configuration: null,
        viewlibrary: null
    },
    initialize: function (config) {
        var me = this;
        me.configuration = config;
    },
    /**
     * Gets the view.
     * @param {Object} view
     * @returns {Promise}
     */
    getView: function (view) {
        var me = this,
            promise;
        if (me.viewlibrary) {
            promise = Promise.resolve();
        }
        else {
            promise = me.load();
        }
        return promise.then(function () {
            return MEPH.Array(me.viewlibrary[me.libraryRoot] || me.viewlibrary.views).first(function (x) {
                return x.viewId === view.viewId;
            });
        });
    },
    /**
     * Gets all the view information.
     **/
    getViews: function () {
        var me = this,
           promise;
        if (me.viewlibrary) {
            promise = Promise.resolve();
        }
        else {
            promise = me.load();
        }
        return promise.then(function () {
            return MEPH.Array(me.viewlibrary[me.libraryRoot] || me.viewlibrary.views)
        })['catch'](function(e){
            MEPH.Log(e);
        });
    },
    /**
     * Loads the view configuration from the server.
     **/
    load: function (configuration) {
        var me = this,
            resource;

        configuration = configuration || me.configuration;

        if (configuration) {
            resource = configuration.viewsResource;
            return Promise.resolve().then(function () {
                var path = MEPH.getPath(resource.path);
                path = path[path.length - 1] === MEPH.folderPathSeparator ?
                path + resource.uri :
                path + MEPH.folderPathSeparator + resource.uri;

                return MEPH.ajaxJSON(path, {
                    requestHeaders: [{
                        header: 'Accept',
                        value: 'application/json'
                    }]
                }).then(function (response) {
                    var json = response.responseJSON;
                    me.viewlibrary = json;
                    me.libraryRoot = configuration.root;
                    return response;
                });
            });
        }
        else {
            return Promise.resolve().then(function () {
                throw 'no configuration in ViewProvider';
            });
        }
    }
});