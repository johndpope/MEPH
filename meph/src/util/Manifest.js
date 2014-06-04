﻿/**
 * @class MEPH.util.Manifest
 * Will build the list of resources necessary to run the site.
 *
 **/
MEPH.define('MEPH.util.Manifest', {
    requires: ['MEPH.mobile.services.MobileServices'],
    /**
     * Gets all the views in the application.
     **/
    getViews: function () {
        var me = this;
        return MEPH.MobileServices.get('viewProvider').then(function (viewProvider) {
            return viewProvider.getViews();
        });
    },
    /**
     * Loads all the view and dependencies.
     **/
    loadViews: function () {
        var me = this;
        return me.getViews().then(function (viewConfigs) {
            var promise = Promise.resolve();
            viewConfigs.foreach(function (x) {
                promise = promise.then(function () {
                    MEPH.create(x.view);
                }).catch(function (error) {
                    MEPH.Log(error);
                });;
            })
            return promise;
        }).then(function (x) {
            var classes = MEPH.getDefinedClasses(),
                templates = MEPH.getTemplates();
            return {
                classes: classes,
                templates: templates
            };
        });;
    }
});