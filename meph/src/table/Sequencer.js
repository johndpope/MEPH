/**
 * @class MEPH.table.SpreadSheet
 * @extends MEPH.control.Control
 * A infinitely scrolling Scrollbar.
 **/
MEPH.define('MEPH.table.Sequencer', {
    alias: 'sequencer',
    templates: false,
    extend: 'MEPH.table.SpreadSheet',
    requires: ['MEPH.util.Observable'],
    properties: {
        source: null,
        timescale: 1,
        /**
         * @property {Function} time
         * This function will take a item from the source, and return the time.
         **/
        time: null,
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
                }
                me.onSourceUpdated();
            }
        })
    },
    onSourceUpdated: function () {
        var me = this;
        me.updateCells();
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
        me.updateCells();
    },
    getMainContentInstructions: function (visibleCellData) {
        var me = this;
        if (visibleCellData)
            if (typeof (me.time) === 'function' &&
                typeof (me.length) === 'function' &&
                typeof (me.lane) === 'function') {
                var result = [];
                if (me.source) {
                    me.source.where(function (x) {
                        var time = me.time(x);
                        var length = me.length(x);
                        var calctime = me.getScaled(time);
                        if (visibleCellData.column <= calctime && calctime < visibleCellData.visibleColumns + visibleCellData.column
                            && visibleCellData.row <= calctime && calctime < visibleCellData.visibleRows + visibleCellData.row) {
                            return true;
                        }
                        return false;
                    }).foreach(function (x) {
                        result = result.concat(me.getInstructionsFor(x));
                    });
                }
                return result;
            }
    },
    /**
     * Gets the scaled value.
     * @param {Number} value
     * @return {Number}
     **/
    getScaled: function (value) {
        var me = this;
        return value / me.timescale;
    },
    /**
     * Gets instructions for a sequence item.
     * @param {Object} sequenceItem
     *
     */
    getInstructionsFor: function (sequenceItem) {
        var me = this;
        var lane = me.lane(sequenceItem);
        var time = me.time(sequenceItem);
        var length = me.length(sequenceItem);
        var calctime = me.getScaled(time);
        var column = Math.floor(calctime);
        var pos = me.getCellPosition({ row: lane, column: column });
        var columnWidth = me.getColumnWidth(column);
        var xoffset = (calctime - column) * columnWidth;
        var width = me.getScaled(length) * columnWidth;
        var height = me.getRowHeight(lane);
        return [{
            shape: MEPH.util.Renderer.shapes.rectangle,
            x: pos.x + xoffset,
            y: pos.y,
            width: width,
            height: height
        }];
    }
});