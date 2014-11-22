/**
 * @class MEPH.audio.Sequence
 * Defines a base class for an audio sequence.
 **/
MEPH.define('MEPH.audio.Sequence', {
    requires: ['MEPH.mixins.Injections',
               'MEPH.audio.graph.AudioGraphReader'],
    mixins: {
        injections: 'MEPH.mixins.Injections'
    },
    statics: {
        defaultSequenceGraphRecipe: { "id": "dd4a9d27-72ab-4765-980f-5e0a125836a3", "connections": [{ "id": "eaa5fc3d-67d1-49d5-9707-a53795376630", "nodes": ["71161914-84c2-4c04-a65c-4a4e97b09bca", "25a909ca-8325-4ce3-956c-559469f79183"], "zones": ["97154268-061c-489c-b66d-38395b2174ea", "4a85414c-6d0f-432b-8ce6-5c2b335246c3"] }, { "id": "7ca18992-6261-4922-bd63-a740ebc7c75b", "nodes": ["25a909ca-8325-4ce3-956c-559469f79183", "e54f4467-fdb2-4735-9918-03bc43896791"], "zones": ["d4791ba3-203b-405e-95b0-71143bfc1039", "42b68e05-936b-486f-95cc-6166db24a703"] }], "nodes": [{ "id": "71161914-84c2-4c04-a65c-4a4e97b09bca", "position": { "x": 160, "y": 209, "z": 0 }, "data": { "id": "314992ca-4dfd-4233-a4f9-fe7ce604d15f", "type": "MEPH.audio.graph.node.InputNode", "nodeInputs": [{ "name": "bufferinput", "title": "bufferinput", "type": "AudioBuffer", "connector": null, "id": "4a85414c-6d0f-432b-8ce6-5c2b335246c3", "options": null, "output": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "Anything", "connector": null, "id": "97154268-061c-489c-b66d-38395b2174ea", "output": true, "isOutput": false }] } }, { "id": "e54f4467-fdb2-4735-9918-03bc43896791", "position": { "x": 1084, "y": 191, "z": 0 }, "data": { "id": "26f0b3e7-d58b-4cba-92cc-38eccaf31746", "type": "MEPH.audio.graph.node.OutputNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "Anything", "connector": null, "id": "42b68e05-936b-486f-95cc-6166db24a703", "options": null, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "bufferoutput", "title": "bufferoutput", "type": "AudioBuffer", "connector": null, "id": "d4791ba3-203b-405e-95b0-71143bfc1039", "output": true }] } }, { "id": "25a909ca-8325-4ce3-956c-559469f79183", "position": { "x": 671, "y": 142, "z": 0 }, "data": { "id": "7b27f017-0068-4383-93ed-252e493c600d", "type": "MEPH.audio.graph.node.GainNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "connector": null, "id": "4a85414c-6d0f-432b-8ce6-5c2b335246c3", "options": null, "output": false, "isOutput": false }, { "name": "gain", "title": "gain", "type": "Number", "connector": null, "id": "35e7b822-12c6-4bf2-ab36-5e665b317fca", "options": { "path": "gain.value" }, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "connector": null, "id": "d4791ba3-203b-405e-95b0-71143bfc1039", "output": true, "isOutput": false }] } }] },
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
        title: null,
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
        me.$defaultRefId = id;
    },
    setDefaultGraph: function (id) {
        var me = this;
        me.setDefault('graph', id);
    },
    getGraph: function (raw) {
        var me = this;
        if (raw)
            return me.$graph;
        me.$graph = me.$graph || MEPH.audio.graph.AudioGraphReader.cloneUnique(MEPH.audio.Sequence.defaultSequenceGraphRecipe);
        return me.$graph;
    },
    saveGraph: function (graph) {
        var me = this;
        me.$graph = graph;
    },
    getDefaultInstance: function () {
        var me = this,
            result = null;
        if (me.$inj.audioResources) {
            switch (me.$defaultType) {
                case 'graph':
                    result = me.$defaultRefId;//me.$inj.audioResources.getGraphInstance();
                    break;
                case 'sequence':
                    result = me.$inj.audioResources.getSequenceInstance(me.$defaultRefId)
                    break;
                default: throw new Error('unhandled case');
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
        if (item.absoluteTime !== undefined && item.absoluteTime) {
            return item.absoluteTime;
        }
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
        var unittime = (found || 0) + rel;
        item.absoluteTime = unittime;
        return unittime;
    },
    setRelativeTime: function (item, time) {
        var me = this;
        var parent = me.getParent(item);
        if (parent.source.isChild(item)) {
            item.relativeTimeOffset = Math.max(0, time);
            item.absoluteTime = undefined;
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
        var me = this,
            res;

        if (item.parentIndex !== undefined) {
            return item.parentIndex;
        }
        else {
            res = me.getParent(item);
            item.parent = res;
        }
        item.parentIndex = me.items().indexOf(res);
        return item.parentIndex;
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
        return me.items().any(function (x) {
            return x === item || (me.containsSequences ? x.source.hasDescendant(item) : false);
        });
    },
    containsRef: function (source) {
        var me = this;
        return me.items().any(function (x) {
            return x.source === source || (me.containsSequences ? x.source.containsRef(source) : false);
        });
    },
    /**
     * Removes the source from the sequence.
     * @param {Object} source
     * @return {Array}
     **/
    remove: function (source) {
        var me = this;

        return me.items().removeWhere(function (x) {
            return x === source;
        });
    },
    /**
     * Adds a source to the sequence.
     * @param  { Object} source
     * @param {Number} timeOffset
     * @param {Number} duration
     ***/
    add: function (source, timeOffset, duration) {
        var me = this,
            defaults,
            args = MEPH.Array(arguments);

        if (!source) {
            source = me.getDefaultInstance();
        }

        if (me.parts.length === 0) {
            me.containsSequences = source instanceof MEPH.audio.Sequence;
        }

        if (((me.containsSequences && source instanceof MEPH.audio.Sequence) ||
            (!me.containsSequences && source instanceof MEPH.audio.Audio) ||
            (!me.containsSequences && typeof source === 'string')) &&
            (typeof source === 'string' ||
             source instanceof MEPH.audio.Audio || (!me.containsRef(source) && !source.containsRef(me)))) {
            me.parts.push({
                source: source,
                relativeTimeOffset: timeOffset || 0,
                duration: duration
            });
            return source;
        }
        return false;
    },
    get: function () {
        var me = this;
        return me.parts.select();
    },
    duration: function (graphExtensions) {
        var me = this;
        graphExtensions = graphExtensions || [];
        return me.parts.maximum(function (x) {
            if (x.containsSequences) {
                var graphextension = me.getGraph(true) || null;
                if (graphextension) {
                    graphExtensions = graphExtensions.concat([graphextension]);
                }
                return x.source.duration(graphExtensions) + x.relativeTimeOffset;
            }
            else {
                if (typeof x.source === 'string') {
                    return x.duration; //me.$inj.audioResources.getGraphInstance(x.source, graphExtensions).duration();
                }
                return x.source.duration() + x.relativeTimeOffset;
            }
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
    getScheduledAudio: function (start, length, graphExtensions) {
        var me = this;
        graphExtensions = graphExtensions || [];
        if (me.containsSequences) {
            var graphextension = me.getGraph(true) || null;
            if (graphextension) {
                graphExtensions = graphExtensions.concat([graphextension]);
            }
            return me.parts.concatFluent(function (sequence) {
                return sequence.source.getScheduledAudio(sequence.relativeTimeOffset - start, length, graphExtensions);
            });;
        }
        else {
            return me.parts.where(function (x) {
                return x.relativeTimeOffset >= start && x.relativeTimeOffset <= (start + length);
            }).select(function (x) {
                if (typeof x.source === 'string') {
                    var clone = MEPH.clone(x);
                    clone.source = me.$inj.audioResources.getGraphInstance(x.source, graphExtensions);
                    return clone;
                }
                return x;
            });
        }
    },
    getAudios: function (graphExtensions) {
        var me = this;
        graphExtensions = graphExtensions || [];
        if (me.containsSequences) {
            var graphextension = me.getGraph(true) || null;
            if (graphextension) {
                graphExtensions = graphExtensions.concat([graphextension]);
            }
            return me.parts.concatFluent(function (sequence) {
                return sequence.source.getAudios(graphExtensions);
            });;
        }
        else {
            return me.parts.select().select(function (x) {
                if (typeof x.source === 'string') {
                    var clone = MEPH.clone(x);
                    clone.source = me.$inj.audioResources.getGraphInstance(x.source, graphExtensions);
                    return clone;
                }
                return x;
            });
        }
    },
    getAudioWithAbsoluteTime: function () {
        var me = this, audios = me.getAudios().foreach(function (t) {
            t.absoluteTime = me.getAbsoluteTime(t);
        })
        return audios;
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
            graph: me.getGraph(true),
            sequence: me.containsSequences
        }
    },
    /**
     * Translates an object into a sequence.
     ***/
    deserialize: function (obj, audioservice, sequences) {
        var me = this;
        sequences = sequences || [];
        me.id = obj.id;
        me.title = obj.title || me.title;
        me.$graph = obj.graph || null;
        if (obj.sequence) {
            obj.parts.foreach(function (part) {
                var newsequence = new MEPH.audio.Sequence();
                var res = me.add(newsequence, part.relativeTimeOffset);
                if (!sequences.some(function (x) { return x === part.sequence.id; })) {
                    sequences.push(newsequence.id);
                    newsequence.deserialize(part.sequence, audioservice, sequences);
                }
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