﻿/**
 * @class MEPH.audio.view.AudioSequencer
 * @extends MEPH.table.Sequencer
 * Standard form for a input field.
 **/
MEPH.define('MEPH.audio.view.AudioSequencer', {
    alias: 'audiosequencer',
    templates: true,
    scripts: ['MEPH.audio.view.sequencer.CanvasContextMenu',
                'MEPH.audio.view.sequencer.CanvasHeaderLeftMenu'],
    extend: 'MEPH.table.Sequencer',
    requires: ['MEPH.audio.Audio',
        'MEPH.audio.AudioResources',
        'MEPH.audio.Sequence', 'MEPH.util.Dom', 'MEPH.util.Observable'],
    statics: {
        ContextMenu: 'ContextMenu'
    },
    injections: ['audioResources'],
    properties: {
        defaultColumnWidth: 25,
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
            'function': function (item, time) {
                if (item && (item.source instanceof MEPH.audio.Audio || item.source instanceof MEPH.audio.Sequence)) {
                    me.sequence.setRelativeTime(item, time);
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
            })
        }
        else {
            var el = me.getTemplateEl('MEPH.audio.view.sequencer.CanvasContextMenu');
            me.$canvasContextMenuEl = el;
            el.querySelector('[addsequence]').focus();
            var elements = MEPH.Array(el.querySelectorAll('[addsequence]')).select(function (t) { return { setFunc: function () { }, element: t } });
            Dom.addSimpleDataEntryToElments(me, elements, el);
            me.don('click', elements.select(function (t) { return t.element; }), function () {
                me.addSequence(hovercells);
                me.canvas.focus();
            }, 'button');
        }
        Dom.centerElement(el);
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
    addSequence: function (hovercells) {

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