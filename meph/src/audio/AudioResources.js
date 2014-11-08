/**
 * @class MEPH.audio.AudioResources
 * Audio resources are tracked from this service.
 **/
MEPH.define('MEPH.audio.AudioResources', {
    requires: ['MEPH.audio.Constants'],
    statics: {
        RESOURCE_MANAGER_UPDATE: 'RESOURCE_MANAGER_UPDATE'
    },
    properties: {
        resources: null,
        graphs: null
    },
    initialize: function () {
        var me = this,
            Audio = MEPH.audio.Audio;

        me.resources = [];
        me.graphs = [];

        MEPH.subscribe(MEPH.audio.Audio.CHANGED_BUFFER_SOURCE, me.onResourcesChanged.bind(me));

        MEPH.subscribe(MEPH.audio.Constants.AUDIO_GRAPH_SAVED, me.onAudioGraphSaved.bind(me));

        if (Audio.GetSourceBuffer()) {
            Audio.GetSourceBuffer().foreach(function (t) { me.resources.push(t); })
            MEPH.publish(MEPH.audio.AudioResources.RESOURCE_MANAGER_UPDATE, {});
        }
    },
    onAudioGraphSaved: function (type, graph) {
        var me = this;
        me.graphs.push(graph);
        MEPH.publish(MEPH.audio.AudioResources.RESOURCE_MANAGER_UPDATE, {});
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
    getGraphs: function () {
        var me = this;
        return me.graphs.select();
    },
    getResources: function () {
        var me = this;
        return me.resources.select();
    }
})