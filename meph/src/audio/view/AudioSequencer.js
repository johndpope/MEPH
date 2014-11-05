/**
 * @class MEPH.audio.view.AudioSequencer
 * @extends MEPH.table.Sequencer
 * Standard form for a input field.
 **/
MEPH.define('MEPH.audio.view.AudioSequencer', {
    alias: 'audiosequencer',
    templates: true,
    extend: 'MEPH.table.Sequencer',
    requires: [],
    properties: {
        sequence: null
    },
    initialize: function () {
        var me = this;
        me.super();

        me.on('altered', function (type, args) {
            if (args.property === 'sequence') {
                me.translateToSource(me.sequence);
            }
        });
        me.setupFunctions();
    },
    translateToSource: function (sequence) {
        var me = this;
        if (!me.source) {
            me.source = sequence.itemSequences();
        }
    },
    setupFunctions: function () {
        var me = this;
        me.time = {
            'function': function (item) {
                return me.sequence.getAbsoluteTime(item);
            }
        }

        me.lane = {
            'function': function (item) {
                return me.sequence.getParentIndexOf(item);
            }
        }
         
        me.settime = {
            'function': function (item, time) {
                me.sequence.setRelativeTime(item, time);
                return item;
            }
        }
        me.length = {
            'function': function (item) {
                return me.sequence.getDuration(item)
            }
        }

        me.rowheader = {
            'function': function (item) {
                var index = me.sequence.getParentIndexOf(item);

                return 'Row ' + index 
            }
        }
    }
});