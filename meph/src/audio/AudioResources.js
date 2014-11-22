/**
 * @class MEPH.audio.AudioResources
 * Audio resources are tracked from this service.
 **/
MEPH.define('MEPH.audio.AudioResources', {
    requires: ['MEPH.audio.Constants',
                'MEPH.audio.graph.AudioGraphReader'],
    statics: {
        RESOURCE_MANAGER_UPDATE: 'RESOURCE_MANAGER_UPDATE'
    },
    properties: {
        sequences: null,
        resources: null,
        graphs: null
    },
    initialize: function () {
        var me = this,
            Audio = MEPH.audio.Audio;
        me.graphReader = new MEPH.audio.graph.AudioGraphReader();
        me.resources = [];
        me.graphs = [];
        me.sequences = [];

        MEPH.subscribe(MEPH.audio.Audio.CHANGED_BUFFER_SOURCE, me.onResourcesChanged.bind(me));

        MEPH.subscribe(MEPH.audio.Constants.AUDIO_GRAPH_SAVED, me.onAudioGraphSaved.bind(me));

        if (Audio.GetSourceBuffer()) {
            Audio.GetSourceBuffer().foreach(function (t) { me.resources.push(t); })
            MEPH.publish(MEPH.audio.AudioResources.RESOURCE_MANAGER_UPDATE, {});
        }
    },
    collectProject: function () {
        var me = this,
            audio = new MEPH.audio.Audio(),
            result = {};
        result.graphs = me.getGraphs();
        result.resources = me.resources.select(function (x) { return audio.serializeBuffer(x); });
        result.sequences = me.sequences.select(function (x) { return JSON.stringify(x.toJSON()); });
        return result;
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
    getGraphInstance: function (id, graphextension) {
        var me = this,
            graphRecipe = me.getGraphs().first(function (x) { return x.id === id; });

        if (graphRecipe) {
            me.graphReader.setGraph(MEPH.audio.graph.AudioGraphReader.cloneUnique(graphRecipe));
            graphextension.foreach(function (extension) {
                me.graphReader.connectGraph(extension);
            });
            try {
                return me.graphReader.createAudio();
            }
            catch (e) {
                MEPH.Log(e);
            }
        }

        return null;
    },
    getSequenceInstance: function (id) {
        var me = this;
        return me.sequences.first(function (x) { return x.id === id; })
    },
    addSequence: function (sequence) {
        var me = this;
        if (sequence.title)
            if (me.sequences.indexOf(sequence) === -1)
                me.sequences.push(sequence);
    },
    getSequences: function () {
        var me = this;
        return me.sequences.select();
    },
    getResources: function () {
        var me = this;
        return me.resources.select();
    },
    clearResources: function () {
        var me = this;
        me.resources.clear();
    }
})