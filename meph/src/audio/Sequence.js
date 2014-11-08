/**
 * @class MEPH.audio.Sequence
 * Defines a base class for an audio sequence.
 **/
MEPH.define('MEPH.audio.Sequence', {
    requires: ['MEPH.mixins.Injections'],
    mixins: {
        injections: 'MEPH.mixins.Injections'
    },
    statics: {
        /**
         * Translates a string into a sequence.
         ***/
        deserialize: function (str, audioservice) {
            var sequence = new MEPH.audio.Sequence();
            var obj = JSON.parse(str);
            sequence.deserialize(obj, audioservice);

            return sequence;
        }
    },
    injections: ['audioResources'],
    properties: {
        parts: null,
        title: 'Untitled',
        id: null,
        containsSequences: false
    },
    initialize: function (args) {
        var me = this;
        me.parts = [];
        me.mixins.injections.init.apply(me);
        me.id = MEPH.GUID();
        if (args) {
            if (args.title) {
                me.title = args.title;
            }
            if (args.id) {
                me.id = args.id;
            }
        }
    },
    setDefault: function (type, id) {
        var me = this;
        me.$defaultType = type;
        me.$defatulRefId = id;
    },
    getDefaultInstance: function () {
        var me = this,
            result = null;
        if (me.$inj.audioResources) {
            switch (me.$defaultType) {
                case 'graph':
                    result = me.$inj.audioResources.getGraphInstance(me.$defatulRefId);
                    break;
            }
        }
        return result;
    },
    /**
     * Returns the instance used by the sequence.
     ***/
    items: function () {
        var me = this;
        return me.parts;
    },
    itemSequences: function () {
        var me = this;
        return me.items().concatFluent(function (x) {
            return x.source.items();
        })
    },
    getAbsoluteTime: function (item) {
        var me = this;
        var found = me.items().first(function (x) { return x === item; });

        if (found) {
            return found.relativeTimeOffset;
        }
        var rel = 0;
        found = me.items().selectFirst(function (x) {
            if (me.containsSequences) {
                var res = x.source.getAbsoluteTime(item);
                if (res) {
                    rel = x.relativeTimeOffset;
                    return res;
                }
            }
            return false;
        });
        return (found || 0) + rel;

    },
    setRelativeTime: function (item, time) {
        var me = this;
        var parent = me.getParent(item);
        if (parent.source.isChild(item)) {
            item.relativeTimeOffset = Math.max(0, time);
        }
        else {
            parent.source.setRelativeTime(item, time - parent.relativeTimeOffset);
        }
    },
    /**
     * Gets the index of the item relative to the parent/ancestor.
     * @param {Object} item
     * @returns {Number}s
     **/
    getParentIndexOf: function (item) {
        var me = this;

        var res = me.getParent(item);

        return me.items().indexOf(res);
    },
    /**
     * Gets the parent/ ancestor
     **/
    getParent: function (item) {
        var me = this;
        var res = me.items().first(function (x) {
            return x === item || (me.containsSequences ? x.source.hasDescendant(item) : false);
        });
        return res;
    },
    isChild: function (item) {
        var me = this;
        return me.items().first(function (x) { return item === x; })
    },
    /**
     * Returns true, if it belongs to the sequence structure.
     * @param {Object} item
     * @returns {Boolean}
     ***/
    hasDescendant: function (item) {
        var me = this;
        return me.items().any(function (x) { return x === item || (me.containsSequences ? x.source.hasDescendant(item) : false); });
    },
    /**
     * Adds a source to the sequence.
     * @param  { Object} source
     * @param {Number} timeOffset
     ***/
    add: function (source, timeOffset) {
        var me = this,
            defaults,
            args = MEPH.Array(arguments);

        if (me.parts.length === 0) {
            me.containsSequences = args.first() instanceof MEPH.audio.Sequence;
        }
        if (!source) {
            source = me.getDefaultInstance();
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
    getDuration: function (item) {
        return item.source.duration();
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
    },
    toJSON: function () {
        var me = this,
            res;
        if (me.containsSequences) {
            if (me.parts)
                res = me.parts.select(function (sequence) {
                    return {
                        sequence: sequence.source.toJSON(),
                        relativeTimeOffset: sequence.relativeTimeOffset
                    }
                });

        }
        else {
            if (me.parts)
                res = me.parts.select(function (x) {
                    return {
                        audioId: x.id,
                        relativeTimeOffset: x.relativeTimeOffset
                    };
                })
        }
        return {
            parts: res,
            id: me.id,
            title: me.title,
            sequence: me.containsSequences
        }
    },
    /**
     * Translates an object into a sequence.
     ***/
    deserialize: function (obj, audioservice) {
        var me = this;
        me.title = obj.title || me.title;
        if (obj.sequence) {
            obj.parts.foreach(function (part) {
                var newsequence = new MEPH.audio.Sequence();
                me.add(newsequence, part.relativeTimeOffset);
                newsequence.deserialize(part.sequence, audioservice);
            });
        }
        else {
            obj.parts.foreach(function (part) {
                var audio = audioservice.get(part.audioId);
                me.add(audio, part.relativeTimeOffset);
            })
        }
    }
});