/**
 * @class MEPH.table.SpreadSheet
 * @extends MEPH.control.Control
 * A infinitely scrolling SpreadSheet.
 **/
MEPH.define('MEPH.table.SpreadSheet', {
    alias: 'spreadsheet',
    templates: true,
    requires: ['MEPH.util.Renderer', 'MEPH.util.Style'],
    extend: 'MEPH.control.Control',
    properties: {
        width: 0,
        height: 0,
        vertical: false,
        animFrame: null,
        columnOffsets: null,
        rowOffsets: null,
        columnheaders: 0,
        rowheaders: 0,
        columns: null,
        rows: null,
        defaultRowHeight: 25,
        defaultColumnWidth: 80,
        defaultHeaderColumnHeight: 25,
        defaultHeaderColumnWidth: 70,
        gridLineColor: '#121212',
        startColumn: 0,
        startRow: 0,
        cache: null
    },
    initialize: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.cache = {};
        me.renderer = new MEPH.util.Renderer();
        me.columnOffsets = null;
        me.rowOffsets = null;
        window.addEventListener("resize", me.render.bind(me));

        me.on('altered', function (type, args) {
            var rowheaders = parseFloat(me.rowheaders);
            var cols = parseFloat(me.columns);
            var rows = parseFloat(me.rows);
            var colheaders = parseFloat(me.columnheaders);
            if (args.path === 'rowheaders' || args.path === 'columnheaders' || args.path === 'columns' || args.path === 'vertical' || args.path === 'rows') {
                if (!me.columnOffsets && rowheaders && cols) {
                    me.columnOffsets = [].interpolate(0, cols + rowheaders, function (x) {
                        return (x ) * me.defaultColumnWidth;
                    });
                }
                if (!me.rowOffsets && rows && colheaders) {

                    me.rowOffsets = [].interpolate(0, rows + colheaders, function (x) {
                        return (x ) * me.defaultRowHeight;
                    })
                }
                me.render();

            }
        });
    },
    render: function () {
        var me = this;
        if (!me.rowOffsets || !me.columnOffsets)
            return;
        if (me.animFrame !== null) {
            cancelAnimationFrame(me.animFrame);
        }
        me.animFrame = requestAnimationFrame(function () {
            var rows, columns, headers;
            if (!me.rendered) {
                me.renderer.setCanvas(me.canvas);
            }
            me.renderer.clear();
            var canvasheight = me.body.clientHeight;
            var canvaswidth = me.body.clientWidth;
            row = me.height;
            columns = me.width;
            columnheaders = me.columnheaders;
            rowheaders = me.rowheaders;
            me.drawGrid(canvasheight, canvaswidth);
        });
    },
    drawGrid: function (height, width) {
        var me = this;
        var rowDrawFunc = function (rowOffset) {
            return {
                shape: MEPH.util.Renderer.shapes.line,
                end: {
                    x: width,
                    y: rowOffset
                },
                start: {
                    x: 0,
                    y: rowOffset
                },
                strokeStyle: me.gridLineColor
            }
        };
        var colDrawFunc = function (columnOffset) {
            return {
                shape: MEPH.util.Renderer.shapes.line,
                end: {
                    x: columnOffset,
                    y: height
                },
                start: {
                    x: columnOffset,
                    y: 0
                },
                strokeStyle: me.gridLineColor
            }
        };
        var visRows = me.visibleRows(height, me.startRow)
        var drawInstructions = me.rowOffsets.subset(me.startRow, me.startRow + visRows).select(rowDrawFunc);

        if (me.rowOffsets.length < me.startRow + visRows) {
            drawInstructions = drawInstructions.concat([].interpolate(0, me.startRow + visRows - me.rowOffsets.length, rowDrawFunc));
        }

        var visCols = me.visibleColumns( width, me.startColumn)
        drawInstructions = drawInstructions.concat(me.columnOffsets.subset(me.startColumn, me.startColumn + visCols).select(colDrawFunc));

        if (me.columnOffsets.length < me.startColumn + visCols) {
            drawInstructions = drawInstructions.concat([].interpolate(0, me.startColumn + visCols - me.columnOffsets.length, colDrawFunc));
        }

        Style.height(me.canvas, height)
        Style.width(me.canvas, width);
        me.renderer.draw(drawInstructions);
    },
    visibleColumns: function (width, start) {
        var me = this;
        return me.visible(width, start, me.columnOffsets, me.defaultColumnWidth);
    },
    visibleRows: function (width, start) {
        var me = this;
        return me.visible(width, start, me.rowOffsets, me.defaultRowHeight);
    },
    visible: function (width, start, offsets, defaultWidth) {
        var me = this;
        var columns = 0;
        var res = offsets.subset(start).first(function (x) {

            if (x - offsets[start] < width) {
                columns++;
                return false;
            }
            return true;
        });
        var total = offsets[columns] - offsets[start];
        if (total < width) {
            columns += Math.ceil((width - total) / defaultWidth);
        }

        return columns +1;
    }
});