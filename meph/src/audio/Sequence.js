/**
 * @class MEPH.audio.Sequence
 * Defines a base class for an audio sequence.
 **/
MEPH.define('MEPH.audio.Sequence', {
    properties: {
        parts: null,
        containsSequences: false
    },
    initialize: function () {
        var me = this;
        me.parts = [];
    },
    add: function (source, timeOffset) {
        var me = this, args = MEPH.Array(arguments);

        if (me.parts.length === 0) {
            me.containsSequences = args.first() instanceof MEPH.audio.Sequence;
        }
        if ((me.containsSequences && source instanceof MEPH.audio.Sequence) ||
            (!me.containsSequences && source instanceof MEPH.audio.Audio)) {
            me.parts.push({ source: source, relativeTimeOffset: timeOffset || 0 });
        }
    },
    get: function () {
        var me = this;
        return me.parts.select();
    },
    duration: function () {
        var me = this;
        return me.parts.maximum(function (x) {
            if (x.containsSequences)
                return x.source.duration() + x.relativeTimeOffset;
            else
                return x.source.duration + x.relativeTimeOffset;
        })
    },
    /**
     * Ges the schedule audio parts to begin playing from the start to the start +length time.
     * @param {Number} start
     * @param {Number} length
     * @return {Object}
     **/
    getScheduledAudio: function (start, length) {
        var me = this;
        if (me.containsSequences) {
            return me.parts.where(function (sequence) {
                return sequence.relativeTimeOffset >= start && sequence.relativeTimeOffset <= start + length;
            }).concatFluent(function (sequence) {
                return sequence.source.getScheduledAudio(start - sequence.relativeTimeOffset, length);
            });;
        }
        else {
            return me.parts.where(function (x) {
                return x.relativeTimeOffset >= start && x.relativeTimeOffset <= start + length;
            })
        }
    }
});