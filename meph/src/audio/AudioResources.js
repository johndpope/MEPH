/**
 * @class MEPH.audio.AudioResources
 * Audio resources are tracked from this service.
 **/
MEPH.define('MEPH.audio.AudioResources', {
    properties: {
        resources: null
    },
    initialize: function () {
        var me = this;
        me.resources = [];
        MEPH.subscribe(MEPH.audio.Audio.CHANGED_BUFFER_SOURCE, me.onResourcesChanged.bind(me))
    },
    onResourcesChanged: function (type, options, resources) {
        var me = this, newresources;
        newresources = resources.where(function (x) {
            return !me.resources.some(function (t) {
                return t === x;
            });
        });
        me.resources.push.apply(me.resources, newresources);
    },
    getResources: function () {
        var me = this;
        return me.resources.select();
    }
})