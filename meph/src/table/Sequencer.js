/**
 * @class MEPH.table.SpreadSheet
 * @extends MEPH.control.Control
 * A infinitely scrolling Scrollbar.
 **/
MEPH.define('MEPH.table.Sequencer', {
    alias: 'sequencer',
    templates: true,
    extend: 'MEPH.table.SpreadSheet',
    requires: ['MEPH.util.Observable', 'MEPH.util.Style'],
    statics: {
        grabbing: 'grabbing'
    },
    properties: {
        grabkeycode: 'G',
        source: null,
        radius: 2,
        topheadersource: null,
        leftheadersource: null,
        /**
         * @property {Object} grabbeditem
         * The item grabbed.
         **/
        grabbeditem: null,
        timescale: 1,
        /**
         * @property {Function} time
         * This function will take a item from the source, and return the time.
         **/
        time: null,
        /**
         * @property {Function} time
         * This function will take a number and item as an input, and set the time on the item.
         **/
        settime: null,

        /**
         * @property {Function} lane
         * This function will take a item from the source, and return the lane.
         **/
        lane: null,
        /**
         * @property {Function} length
         * This function will take a item from the source, and return the length.
         **/
        length: null
    },
    initialize: function () {
        var me = this;
        me.callParent.apply(me, arguments);

        me.on('altered', function (type, args) {
            if (args.property === 'source') {

                if (args.old) {
                    args.old.un(null, me);
                    if (Array.isArray(args.old)) {
                        args.old.foreach(function (x) {
                            if (MEPH.util.Observable.isObservable(x))
                                x.un(null, me);
                        })
                    }
                }
                me.onSourceUpdated();
            }
        })
    },
    onLoaded: function () {
        var me = this;
        me.super();
        window.addEventListener('keypress', function (evt) {
            me.onKeyPress(evt);
        });
        me.canvas.addEventListener('mouseovercell', function (evt) {
            me.onMouseOverCell(me.canvas, evt);
        });
        me.canvas.addEventListener('mousemovecell', function (evt) {
            me.onMouseMoveCell(me.canvas, evt);
        });

        me.canvas.addEventListener('mouseoveritem', function (evt) {
            me.onMouseOverItem(evt);
        });

        me.topheader.addEventListener('mouseovercelltop', function (evt) {
            me.onMouseOverCell(me.topheader, evt, 'top')
        });
        me.leftheader.addEventListener('mouseovercellleft', function (evt) {
            me.onMouseOverCell(me.topheader, evt, 'left')
        });
    },
    onSourceUpdated: function () {
        var me = this;
        me.update();
        if (me.source && MEPH.util.Observable.isObservable(me.source)) {
            me.source.on('changed', me.sourceItemChanged.bind(me), me);
            me.source.foreach(function (item) {
                if (MEPH.util.Observable.isObservable(item)) {
                    item.on('changed', me.sourceItemChanged.bind(me), me);
                }
            });
        }
    },
    sourceItemChanged: function (type, args) {
        var me = this;
        me.update();
    },
    getMainContentInstructions: function (visibleCellData) {
        var me = this;
        var result = me.getItemsInCellSpace(visibleCellData).concatFluent(function (x) {
            return (me.getInstructionsFor(x));
        });
        return result;
    },
    getItemsInCellSpace: function (cellData) {
        var me = this;
        return me.getItemInSpace(cellData, me.source);
    },
    getItemsInTopSpace: function (cellData) {
        var me = this;
        return me.getItemInSpace(cellData, me.topheadersource);
    },
    getItemsInLeftSpace: function (cellData) {
        var me = this;
        return me.getItemInSpace(cellData, me.leftheadersource);
    },
    getItemInSpace: function (cellData, source) {
        var result = [],
            time, lane, endtime,
            length,
            calctime,
            me = this;

        if (cellData) {
            if (me.time && me.length && me.lane && typeof (me.time.function) === 'function' &&
                   typeof (me.length.function) === 'function' &&
                   typeof (me.lane.function) === 'function') {
                if (source) {
                    source.where(function (x) {
                        time = me.time.function(x);
                        length = me.length.function(x);
                        lane = me.lane.function(x);
                        calctime = me.getScaled(time);
                        endtime = calctime + me.getScaled(length);
                        if ((cellData.column <= calctime && calctime < cellData.visibleColumns + cellData.column
                            && cellData.row <= lane && lane < cellData.visibleRows + cellData.row)||
                            (cellData.column <= endtime && endtime < cellData.visibleColumns + cellData.column
                            && cellData.row <= lane && lane < cellData.visibleRows + cellData.row)) {
                            return true;
                        }
                        return false;
                    }).foreach(function (x) {
                        result.push(x);
                    });
                }
            }
        }
        return result;
    },
    /**
     * Gets the scaled value.
     * @param {Number} value
     * @return {Number}
     **/
    getScaled: function (value) {
        var me = this;
        return value / me.timescale;
    }, /**
     * Gets the unscaled value.
     * @param {Number} value
     * @return {Number}
     **/
    unscaleValue: function (value) {
        var me = this;
        return value * me.timescale;
    },

    /**
     * Gets instructions for a sequence item.
     * @param {Object} sequenceItem
     *
     */
    getInstructionsFor: function (sequenceItem) {
        var me = this,
            metrics;
        metrics = me.getItemMetrics(sequenceItem);
        metrics.shape = MEPH.util.Renderer.shapes.rectangle;
        metrics.radius = me.radius;
        return [metrics];
    },
    getItemMetrics: function (sequenceItem) {
        var me = this;
        var lane = me.lane.function(sequenceItem);
        var time = me.time.function(sequenceItem);
        var length = me.length.function(sequenceItem);
        var calctime = me.getScaled(time);
        var column = Math.floor(calctime);
        var pos = me.getCellPosition({ row: lane, column: column });
        var columnWidth = me.getColumnWidth(column);
        var xoffset = (calctime - column) * columnWidth;
        var width = me.getScaled(length) * columnWidth;
        var height = me.getRowHeight(lane);
        return {
            x: pos.x + xoffset,
            y: pos.y,
            width: width,
            height: height
        };
    },
    onMouseOverCell: function (canvas, evt, header) {
        var metrics, func,
            me = this;
        var cell = evt.cells.first();

        var items;
        switch (header) {
            case 'left':
                func = me.getItemsInLeftSpace.bind(me);
                break;
            case 'top':
                func = me.getItemsInTopSpace.bind(me);
                break;
            default:
                func = me.getItemsInCellSpace.bind(me);
                break;
        }
        items = func({
            row: cell.row,
            column: cell.column,
            visibleRows: 1,
            visibleColumns: 1
        });
        items = items.where(function (x) {
            metrics = me.getItemMetrics(x);
            return (evt.position.x >= metrics.x && evt.position.x <= metrics.x + metrics.width &&
                evt.position.y >= metrics.y && evt.position.y <= metrics.y + metrics.height)
        });
        me.dispatchEvent('mouseoveritem', {
            items: items, header: header
        }, canvas)
    },
    onMouseMoveCell: function (canvas, evt) {

        var me = this;
        if (me.state === MEPH.table.Sequencer.grabbing) {
            var lane = me.lane.function(me.grabbeditem);
            var y = Math.min(parseFloat(canvas.clientHeight), Math.max(0, me.getCellRowPx({ row: lane })));
            var x = evt.position.x;
            var metrics = me.getItemMetrics(me.grabbeditem);
            me.lastgrabposition = { x: x, y: y };
            me.positionGrabRep({ x: x, y: y, width: metrics.width, height: metrics.height });
        }
    },
    dispatchEvent: function (evnt, args, canvas) {
        var me = this;
        canvas.dispatchEvent(MEPH.createEvent(evnt, args));
    },
    onMouseOverItem: function (evnt) {
        var me = this;
        switch (evnt.header) {
            case 'left':
            case 'top':
                break;
            default:
                me.lastitem = evnt.items.first() || me.lastitem;
                break;
        }
    },
    /**
     *Grabs an item from a sequence, and sets the state to grabbing.
     * @param {Object} item
     */
    grab: function (item) {
        var me = this;
        if (me.settime && typeof (me.settime.function) === 'function' && !me.state) {
            me.state = MEPH.table.Sequencer.grabbing;
            me.grabbeditem = item;
            return true;
        }
        else return false;
    },
    ungrab: function (item) {
        var me = this;
        if (me.grabbeditem === item && me.state === MEPH.table.Sequencer.grabbing) {
            me.grabbeditem = null;
            var position = MEPH.util.Dom.getRelativePosition(me.grabrep, me.canvas);
            var col = me.getRelativeColum(position.x);
            var colpos = me.getCellColumnPosition({ column: col });
            var extrac = (me.lastgrabposition.x - colpos) / me.getColumnWidth(col);
            var time = col + extrac - 1;
            time = Math.max(0, time);
            var unscaledtime = me.unscaleValue(time);
            me.settime.function(unscaledtime, item);
            me.state = null;
        }
    },
    onKeyPress: function (evt) {
        var me = this,
            key = MEPH.util.Dom.getCharCode(evt);

        if (String.fromCharCode(key).toLowerCase() === me.grabkeycode.toLowerCase()) {
            if (me.lastitem) {
                if (me.state === null) {
                    me.grab(me.lastitem);
                }
                else if (me.state === MEPH.table.Sequencer.grabbing) {
                    me.ungrab(me.grabbeditem);
                }
            }
        }
    },
    positionGrabRep: function (options) {
        var me = this;
        Style.height(me.grabrep, options.height);
        Style.width(me.grabrep, options.width);
        Style.left(me.grabrep, options.x);;
        Style.top(me.grabrep, options.y);
    }
});