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
        'MEPH.input.Text',
        'MEPH.audio.Sequence',
        'MEPH.util.Dom',
        'MEPH.util.Observable'],
    statics: {
    },
    injections: ['audioResources'],
    properties: {
        audiobuffers: null,
        audiobuffer: null
    },
    initialize: function () {
        var me = this;

        me.super();
    },
    onLoaded: function () {
        var me = this;
        me.super();
        MEPH.subscribe(MEPH.audio.AudioResources.RESOURCE_MANAGER_UPDATE, me.onInjectionsComplete.bind(me));
        MEPH.subscribe('select_audio_buffer_resourcemanager', function (type, args) {
            me.audiobuffer = args.buffer;
        })
    },
    onInjectionsComplete: function () {
        var me = this;

        if (me.$inj.audioResources) {
            me.audiobuffers = me.$inj.audioResources.getResources();
        }
    },
    viewAudioBuffer: function (audioBuffer) {
        var me = this;
        MEPH.publish('select_audio_buffer_resourcemanager', { buffer: audioBuffer });
    }
})