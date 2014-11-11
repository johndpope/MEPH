/**
 * @class MEPH.audio.view.AudioSequencer
 * @extends MEPH.table.Sequencer
 * Standard form for a input field.
 **/
MEPH.define('MEPH.audio.view.AudioSequencer', {
    alias: 'audiosequencer',
    templates: true,
    scripts: ['MEPH.audio.view.sequencer.CanvasContextMenu',
        'MEPH.audio.view.sequencer.SequencerResourcesSelect',
        'MEPH.audio.view.sequencer.CanvasHeaderLeftMenu'],
    extend: 'MEPH.table.Sequencer',
    requires: ['MEPH.audio.Audio',
        'MEPH.audio.AudioResources',
        'MEPH.input.Text',
        'MEPH.audio.Sequence',
        'MEPH.util.Dom',
        'MEPH.util.Observable'],
    statics: {
        TrackResource: 'TrackResource',
        ContextMenu: 'ContextMenu',
        Play: 'Play'
    },
    injections: ['audioResources', 'scheduler'],
    properties: {
        defaultColumnWidth: 25,
        nearest: 4,
        sequence: null
    },
    initialize: function () {
        var me = this;

        me.setupFunctions();
        me.setupKeyCommands();

        me.super();
        if (!me.sequence) {
            me.sequence = new MEPH.audio.Sequence();
        }
        me.on('altered', function (type, args) {
            if (args.property === 'sequence') {
                me.translateToSource(me.sequence);
            }
        });
        me.setupHeaders();
    },
    onLoaded: function () {
        var me = this;
        me.super();
        me.setupHeaders();
        me.sequence.title = me.sequence.title || 'untitled';
        me.fire('altered', { property: 'sequence' })
    },
    /**
     * Save sequence.
     **/
    saveSequence: function () {
        var me = this;
        if (me.$inj && me.$inj.audioResources) {
            me.$inj.audioResources.addSequence(me.sequence);
        }
    },
    loadGrandPiano: function () {
        var me = this;
        if (!me.pianoloaded) {
            me.pianoloaded = true;
            return MEPH.requires('MEPH.audio.music.instrument.piano.GrandPiano').then(function (piano) {
                
                var grandpiano = new MEPH.audio.music.instrument.piano.GrandPiano();
                return grandpiano.ready().then(function () {
                    debugger
                    var sequence = grandpiano.createSequence();
                    if (me.$inj && me.$inj.audioResources) {
                        me.$inj.audioResources.addSequence(sequence);
                        me.openSequence(sequence.id);
                    }
                })
            })
        }
    },
    /**
     * New sequence.
     **/
    newSequence: function () {
        var me = this;
        me.sequence = new MEPH.audio.Sequence();
        me.update();
    },
    /**
     * Opens a sequence
     * @param {String} id
     **/
    openSequence: function (id) {
        var me = this;
        if (me.$inj && me.$inj.audioResources) {
            me.sequence = me.$inj.audioResources.getSequenceInstance(id) || me.sequence;

        }
    },
    setupHeaders: function () {
        var me = this, columns = 500, rows = 50;
        me.leftheadersource = [].interpolate(0, rows, function (x) {
            return MEPH.util.Observable.observable({
                lane: x,
                time: x,
                length: 1
            });
        });
        me.topheadersource = [].interpolate(0, columns, function (x) {
            return MEPH.Observable.observable({
                lane: 0,
                time: x,
                length: 1
            });
        });
        me.rowheaders = 1;
        me.columnheaders = 1;
        me.columns = columns;
        me.rows = rows;
    },
    setupKeyCommands: function () {
        var me = this;
        me.setContextMenuOpenKey('v');
        me.setTrackResourceOpenKey('t');
        me.setPlayButton('p');
    },
    translateToSource: function (sequence) {
        var me = this;
        if (!me.source) {
            me.source = sequence.itemSequences();
        }
        else {
            me.source.clear();
            me.source.push.apply(me.source, sequence.itemSequences());
        }
    },
    setupFunctions: function () {
        var me = this;
        me.time = {
            'function': function (item, offset) {
                if (item && (item.source instanceof MEPH.audio.Audio || item.source instanceof MEPH.audio.Sequence)) {
                    return me.sequence.getAbsoluteTime(item);
                }
                if (offset === 'left') {
                    return 0;
                }
                return item.time;
            }
        }

        me.lane = {
            'function': function (item, offset) {
                if (item && (item.source instanceof MEPH.audio.Audio || item.source instanceof MEPH.audio.Sequence))
                    return me.sequence.getParentIndexOf(item);

                return item.lane;

            }
        }

        me.settime = {
            'function': function (time, item) {
                if (item && (item.source instanceof MEPH.audio.Audio || item.source instanceof MEPH.audio.Sequence)) {
                    time = Math.round(time * me.nearest) / me.nearest;
                    me.sequence.setRelativeTime(item, time);
                    me.update();
                }
                return item;

            }
        }
        me.length = {
            'function': function (item) {
                if (item && (item.source instanceof MEPH.audio.Audio || item.source instanceof MEPH.audio.Sequence)) {
                    return me.sequence.getDuration(item)

                    return item.length;
                }
            }
        }

        me.rowheader = {
            'function': function (item) {

                var seq = me.sequence.items()[item.lane];
                return seq && seq.source ? (seq.source.title || '') : '';
            }
        }
        me.columnheader = {
            'function': function (item) {
                return item.time + " ";
            }
        }
    },
    openContextMenu: function (evt) {
        var me = this,
            form;

        var hovercells = me.hovercells;
        if (evt.currentTarget === me.leftheader) {
            var el = me.getTemplateEl('MEPH.audio.view.sequencer.CanvasHeaderLeftMenu');
            var select = el.querySelector('input');
            select.focus();
            var value;
            Dom.addSimpleDataEntryToElments(me, [{
                element: select,
                setFunc: function (val) {
                    value = val;
                }
            }], el, function () {
                if (value)
                    me.addTrackSequence(value)
            });
            Dom.centerElement(el);
        }
        else {
            me.addSequence(hovercells.first());

            //var el = me.getTemplateEl('MEPH.audio.view.sequencer.CanvasContextMenu');
            //me.$canvasContextMenuEl = el;
            //el.querySelector('[addsequence]').focus();
            //var elements = MEPH.Array(el.querySelectorAll('[addsequence]')).select(function (t) { return { setFunc: function () { }, element: t } });
            //Dom.addSimpleDataEntryToElments(me, elements, el);
            //me.don('click', elements.select(function (t) { return t.element; }), function () {
            //    me.addSequence(hovercells.first());
            //    me.canvas.focus();
            //}, 'button');
        }
    },
    openSavedSequence: function () {
        var me = this;
        return new Promise(function (resolve) {
            if (me.$inj.audioResources) {
                var el = me.getTemplateEl('MEPH.audio.view.sequencer.SequencerResourcesSelect');
                var select = el.querySelector('select');
                select.focus();
                var value;
                var sequences = me.$inj.audioResources.getSequences();


                var selectOptions = sequences.select(function (x, index) {
                    return {
                        title: x.title,
                        value: x.id
                    }
                });

                selectOptions.foreach(function (t) {
                    Dom.addOption(t.title, t.value, select);
                });

                Dom.addSimpleDataEntryToElments(me, [{
                    element: select,
                    setFunc: function (val) {
                        value = val;
                    }
                }], el, function () {
                    var val = sequences.first(function (x) { return x.id === value; })
                    me.openSequence(val.id);
                    resolve();
                });
            }
        })
    },
    selectTrackResource: function (evt) {
        var me = this;
        var hovercells = MEPH.clone(me.hovercells);
        if (me.$inj.audioResources && hovercells) {
            var el = me.getTemplateEl('MEPH.audio.view.sequencer.SequencerResourcesSelect');
            var select = el.querySelector('select');
            select.focus();
            var value;
            var graphs = me.$inj.audioResources.getGraphs();
            var sequences = me.$inj.audioResources.getSequences();


            var selectOptions = graphs.select(function (x, index) {
                return {
                    title: x.name,
                    value: x.id
                }
            });

            sequences.foreach(function (x) {
                selectOptions.push({
                    title: x.title,
                    value: x.id
                });
            });

            selectOptions.foreach(function (t) {
                Dom.addOption(t.title, t.value, select);
            });

            Dom.addSimpleDataEntryToElments(me, [{
                element: select,
                setFunc: function (val) {
                    value = val;
                }
            }], el, function () {
                var val = graphs.first(function (x) { return x.id === value; }) ||
                    sequences.first(function (x) { return x.id === value; })
                me.setTrackResource(hovercells.first().row, val)
            });
        }
    },
    /**
     * Sets the resources which the track will use, and will 
     * set the sources of the sequences.
     ***/
    setTrackResource: function (lane, graph) {
        var me = this, sequence = me.sequence.items()[lane];
        if (sequence) {
            sequence.source.setDefault(graph instanceof MEPH.audio.Sequence ? 'sequence' : 'graph', graph.id)
        }
    },
    /**
     * Set the resources source for each sequence in the row.
     * @param {Object/String} val
     * @param {Object} hovercells
     **/
    addTrackSequence: function (title) {
        var me = this;
        me.sequence.add(new MEPH.audio.Sequence({ title: title }));
        me.update();
    },
    /**
     * Adds a sequence/audio source to the row at the cell.
     **/
    addSequence: function (location) {
        var me = this,
            sequence,
            row = location.row,
            column = location.column;
        sequence = me.getSequenceItem(row);
        if (sequence) {
            sequence.source.add(null, column);
            me.translateToSource(me.sequence);
            me.update();
        }
    },
    /**
     * Get sequence item.
     * @param {Number} item
     * @param {Object}
     ***/
    getSequenceItem: function (item) {
        var me = this;

        return me.sequence.items()[item] || null;
    },
    setTrackResourceOpenKey: function (key) {
        var me = this;

        me.setCommand(key, MEPH.audio.view.AudioSequencer.TrackResource, me.selectTrackResource.bind(me));
    },
    setPlayButton: function (key) {
        var me = this;
        me.setCommand(key, MEPH.audio.view.AudioSequencer.Play, function () {

            if (me.$inj && me.$inj.scheduler) {
                if (!me.$inj.scheduler.playing) {
                    me.$inj.scheduler.sequence(me.sequence);
                    me.$inj.scheduler.play();
                }
                else {
                    me.$inj.scheduler.sequence(me.sequence);
                    me.$inj.scheduler.stop();
                }
            }
        });
    },
    setCommand: function (key, commandCode, func) {
        var me = this,
            command;


        me.commands = me.commands || [];
        command = me.commands.first(function (x) {
            return x.command === commandCode;
        });
        if (!command) {
            command = {
                command: commandCode,
                'function': func
            }
            me.commands.push(command);
        }
        command.key = key.toLowerCase();
    },
    setContextMenuOpenKey: function (key) {
        var me = this;
        me.setCommand(key, MEPH.audio.view.AudioSequencer.ContextMenu, me.openContextMenu.bind(me));
    }
});