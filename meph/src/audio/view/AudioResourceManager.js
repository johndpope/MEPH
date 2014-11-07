/**
 * @class MEPH.audio.view.AudioResourceManager
 * @extends MEPH.table.Sequencer
 * Standard form for a input field.
 **/
MEPH.define('MEPH.audio.view.AudioResourceManager', {
    alias: 'audioresourcemanager',
    templates: true,
    scripts: [],
    extend: 'MEPH.control.Control',
    requires: ['MEPH.audio.Audio',
        'MEPH.audio.AudioResources',
        'MEPH.audio.Sequence', 'MEPH.util.Dom', 'MEPH.util.Observable'],
    statics: {
    },
    injections: ['audioResources'],
    properties: {
        audiobuffers: null
    },
    initialize: function () {
        var me = this;
        MEPH.subscribe(MEPH.audio.AudioResources.RESOURCE_MANAGER_UPDATE, me.onresourceUpdate.bind(me));
        me.super();
    },
    onInjectionsComplete: function () {
        var me = this;
        if (me.$inj.audioResources) {
            me.audiobuffers = me.$inj.audioResources.getResources();
        }
    },
    onresourceUpdate: function () {
        var me = this;
        if (me.$inj.audioResources) {
            me.audiobuffers = me.$inj.audioResources.getResources();
        }
    },
    viewAudioBuffer: function (audioBuffer) {
        var me = this;
    }
})