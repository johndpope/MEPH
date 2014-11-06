/**
 * @class MEPH.audio.view.AudioSequencer
 * @extends MEPH.table.Sequencer
 * Standard form for a input field.
 **/
MEPH.define('MEPH.audio.view.AudioSequencer', {
    alias: 'audiosequencer',
    templates: true,
    scripts: ['MEPH.audio.view.sequencer.CanvasContextMenu'],
    extend: 'MEPH.table.Sequencer',
    requires: ['MEPH.audio.Audio',
        'MEPH.audio.Sequence', 'MEPH.util.Dom', 'MEPH.util.Observable'],
    statics: {
        ContextMenu: 'ContextMenu'
    },
    properties: {
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
    },
    onLoaded: function () {
        var me = this;
        me.super();
        me.setupHeaders();
    },
    setupHeaders: function () {
        var me = this, columns = 1000, rows = 100;
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
                if (item instanceof MEPH.audio.Audio || item instanceof MEPH.audio.Sequence) {
                    return me.sequence.getAbsoluteTime(item);
                }
                return item.time;
            }
        }

        me.lane = {
            'function': function (item) {
                if (item instanceof MEPH.audio.Audio || item instanceof MEPH.audio.Sequence)
                    return me.sequence.getParentIndexOf(item);

                return item.lane;

            }
        }

        me.settime = {
            'function': function (item, time) {
                if (item instanceof MEPH.audio.Audio || item instanceof MEPH.audio.Sequence) {
                    me.sequence.setRelativeTime(item, time);
                }
                return item;

            }
        }
        me.length = {
            'function': function (item) {
                if (item instanceof MEPH.audio.Audio || item instanceof MEPH.audio.Sequence) {
                    return me.sequence.getDuration(item)

                    return item.length;
                }
            }
        }

        me.rowheader = {
            'function': function (item) {
                var seq = me.sequence.items()[item.lane];
                return seq ? (seq.title || '') : '';
            }
        }
        me.columnheader = {
            'function': function (item) {
                return item.time + " ";
            }
        }
    },
    openContextMenu: function () {
        var me = this,
            form = MEPH.getTemplate('MEPH.audio.view.sequencer.CanvasContextMenu');
        var el = MEPH.util.Dom.createCenteredElement();
        el.innerHTML = form.template;
        me.$canvasContextMenuEl = el;
        el.querySelector('[addsequence]').focus();
        var elements = MEPH.Array(el.querySelectorAll('[addsequence]')).select(function (t) { return { setFunc: function () { }, element: t } });
        Dom.addSimpleDataEntryToElments(me, elements, el);
        var hovercells = me.hovercells;
        me.don('click', elements.select(function (t) { return t.element; }), function () {
            me.addSequence(hovercells);
            me.canvas.focus();
        }, 'button');
    },
    addSequence: function (hovercells) {
        debugger
    },
    setContextMenuOpenKey: function (key) {
        var me = this,
            command;
        me.commands = me.commands || [];
        command = me.commands.first(function (x) {
            return x.command = MEPH.audio.view.AudioSequencer.ContextMenu;
        });
        if (!command) {
            command = {
                command: MEPH.audio.view.AudioSequencer.ContextMenu,
                'function': me.openContextMenu.bind(me)
            }
            me.commands.push(command);
        }
        command.key = key.toLowerCase();

    }
});