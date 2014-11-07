/**
 * @class MEPH.audio.AudioResources
 * Audio resources are tracked from this service.
 **/
MEPH.define('MEPH.audio.AudioResources', {
    statics: {
        RESOURCE_MANAGER_UPDATE: 'RESOURCE_MANAGER_UPDATE'
    },
    properties: {
        resources: null
    },
    initialize: function () {
        var me = this,
            Audio = MEPH.audio.Audio;

        me.resources = [];

        MEPH.subscribe(MEPH.audio.Audio.CHANGED_BUFFER_SOURCE, me.onResourcesChanged.bind(me));

        if (Audio.GetSourceBuffer()) {
            Audio.GetSourceBuffer().foreach(function (t) { me.resources.push(t); })
            MEPH.publish(MEPH.audio.AudioResources.RESOURCE_MANAGER_UPDATE, {});
        }
    },
    onResourcesChanged: function (type, options, resources) {
        var me = this, newresources;
        newresources = (resources || []).where(function (x) {
            return !me.resources.some(function (t) {
                return t === x;
            });
        });
        me.resources.push.apply(me.resources, newresources);
        MEPH.publish(MEPH.audio.AudioResources.RESOURCE_MANAGER_UPDATE, {});
    },
    getResources: function () {
        var me = this;
        return me.resources.select();
    }
})