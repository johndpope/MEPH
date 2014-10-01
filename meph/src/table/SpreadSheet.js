/**
 * @class MEPH.table.SpreadSheet
 * @extends MEPH.control.Control
 * A infinitely scrolling SpreadSheet.
 **/
MEPH.define('MEPH.table.SpreadSheet', {
    alias: 'spreadsheet',
    templates: true,
    requires: ['MEPH.util.Renderer', 'MEPH.util.Style', 'MEPH.util.Dom', 'MEPH.scrollbar.Scrollbar'],
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
        gridlinecolor: "#d6ccf0",
        startColumn: 0,
        startRow: 0,
        cache: null
    },
    initialize: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.cache = {};
        me.renderer = new MEPH.util.Renderer();
        me.leftRenderer = new MEPH.util.Renderer();
        me.topRenderer = new MEPH.util.Renderer();
        me.columnOffsets = null;
        me.rowOffsets = null;

        me.on('altered', function (type, args) {
            var rowheaders = parseFloat(me.rowheaders);
            var cols = parseFloat(me.columns);
            var rows = parseFloat(me.rows);
            var colheaders = parseFloat(me.columnheaders);
            if (args.path === 'rowheaders' || args.property === "gridlinecolor" || args.path === 'columnheaders' || args.path === 'columns' || args.path === 'vertical' || args.path === 'rows') {
                if (!me.columnOffsets && rowheaders && cols) {
                    me.columnOffsets = [].interpolate(0, cols, function (x) {
                        return me.defaultColumnWidth;
                    });
                    me.columnHeaderOffsets = [].interpolate(0, colheaders, function (x) {
                        return me.defaultColumnWidth;
                    })
                }
                if (!me.rowOffsets && rows && colheaders) {

                    me.rowOffsets = [].interpolate(0, rows, function (x) {
                        return me.defaultRowHeight;
                    })
                    me.rowHeaderOffsets = [].interpolate(0, rowheaders, function (x) {
                        return me.defaultRowHeight;
                    })
                }
                me.render();

            }
        });
    },
    onLoaded: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.appendEvents();
    },
    appendEvents: function () {
        var me = this;
        window.addEventListener("resize", me.render.bind(me));
        me.canvas.addEventListener('click', function (evt) {
            var canvasPos = MEPH.util.Dom.getPosition(me.canvas);
            var pos = MEPH.util.Dom.getEventPositions(evt, me.canvas);
            var cells = me.calculateCells(pos, canvasPos);
            me.body.dispatchEvent(MEPH.createEvent('cellclicked', { cells: cells }));
        })
    },
    calculateCells: function (positions, relativePos) {
        var me = this;
        var cells = positions.select(function (pos) {
            return {
                row: me.getRelativeRow(pos.x - relativePos.x),
                column: me.getRelativeColum(pos.y - relativePos.y),
            }
        });
        return cells;
    },
    getRelativeRow: function (relativeX) {
        var me = this;
        var visi = me.visible(relativeX, me.startRow, me.rowOffsets, me.defaultRowHeight);

        return visi + me.startRow;
    },
    getRelativeColum: function (relativeY) {
        var me = this;
        var visi = me.visible(relativeY, me.startColumn, me.columnOffsets, me.defaultColumnHeight);

        return visi + me.startColumn;
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
                me.leftRenderer.setCanvas(me.leftheader);
                me.topRenderer.setCanvas(me.topheader);
            }
            me.renderer.clear();
            var canvasheight = me.body.clientHeight;
            var canvaswidth = me.body.clientWidth;
            var leftcanvasWidth = me.getLeftCanvasWidth();
            var topcanvasHeight = me.getTopCanvasHeight();
            canvasheight -= topcanvasHeight;
            canvaswidth -= leftcanvasWidth;

            Style.left(me.canvas, leftcanvasWidth);
            Style.top(me.canvas, topcanvasHeight);

            Style.width(me.canvas, canvaswidth);
            Style.height(me.canvas, canvasheight);

            Style.position(me.leftheader, 'absolute');
            Style.position(me.canvas, 'absolute');
            Style.position(me.topheader, 'absolute');

            Style.top(me.leftheader, topcanvasHeight);
            Style.width(me.leftheader, leftcanvasWidth);
            Style.height(me.leftheader, canvasheight);
            Style.left(me.leftheader, 0);

            Style.top(me.topheader, 0);
            Style.left(me.topheader, leftcanvasWidth);
            Style.width(me.topheader, canvaswidth);
            Style.height(me.topheader, topcanvasHeight);

            row = me.height;
            columns = me.width;
            columnheaders = me.columnheaders;
            rowheaders = me.rowheaders;
            me.drawGrid(canvasheight, canvaswidth);
            me.drawTopGrid(topcanvasHeight, canvaswidth);
            me.drawLeftGrid(canvasheight, leftcanvasWidth);
        });
    },
    getLeftCanvasWidth: function () {
        var me = this;
        me.cache.leftcanvaswidth = me.cache.leftcanvaswidth || me.columnHeaderOffsets.summation(function (i, total) {
            return total += i;
        });
        return me.cache.leftcanvaswidth;
    },
    getTopCanvasHeight: function () {
        var me = this;
        me.cache.topcanvasheight = me.cache.topcanvasheight || me.rowHeaderOffsets.summation(function (i, total) {
            return total += i;
        });
        return me.cache.topcanvasheight;
    },
    drawTopGrid: function (height, width) {
        var me = this;
        me.drawSubGrid(me.topheader, me.rowHeaderOffsets, me.columnOffsets, height, width, me.topRenderer);
    },
    drawLeftGrid: function (height, width) {
        var me = this;
        me.drawSubGrid(me.leftheader, me.rowOffsets, me.columnHeaderOffsets, height, width, me.leftRenderer);
    },
    drawGrid: function (height, width) {
        var me = this;
        me.drawSubGrid(me.canvas, me.rowOffsets, me.columnOffsets, height, width, me.renderer);
    },
    drawSubGrid: function (canvas, rowOffsets, columnOffsets, height, width, renderer) {
        var me = this;
        var row = 0;
        var rowDrawFunc = function (rowOffset) {
            var res = {
                shape: MEPH.util.Renderer.shapes.line,
                end: {
                    x: width,
                    y: row
                },
                start: {
                    x: 0,
                    y: row
                },
                strokeStyle: me.gridlinecolor
            }
            row += rowOffset;
            return res;
        };
        var col = 0;
        var colDrawFunc = function (columnOffset) {

            var res = {
                shape: MEPH.util.Renderer.shapes.line,
                end: {
                    x: col,
                    y: height
                },
                start: {
                    x: col,
                    y: 0
                },
                strokeStyle: me.gridlinecolor
            };
            col += columnOffset;
            return res;
        };
        var visRows = me.visibleRows(height, me.startRow)
        var drawInstructions = rowOffsets.subset(me.startRow, me.startRow + visRows + 1).select(rowDrawFunc);

        if (rowOffsets.length < me.startRow + visRows) {
            drawInstructions = drawInstructions.concat([].interpolate(0, me.startRow + visRows - rowOffsets.length, rowDrawFunc));
        }

        var visCols = me.visibleColumns(width, me.startColumn)
        drawInstructions = drawInstructions.concat(columnOffsets.subset(me.startColumn, me.startColumn + visCols + 1).select(colDrawFunc));

        if (columnOffsets.length < me.startColumn + visCols) {
            drawInstructions = drawInstructions.concat([].interpolate(0, me.startColumn + visCols - columnOffsets.length, colDrawFunc));
        }

        Style.height(canvas, height)
        Style.width(canvas, width);
        renderer.draw(drawInstructions);
    },
    visibleColumns: function (width, start) {
        var me = this;
        return me.visible(width, start, me.columnOffsets, me.defaultColumnWidth);
    },
    visibleRows: function (height, start) {
        var me = this;
        return me.visible(height, start, me.rowOffsets, me.defaultRowHeight);
    },
    visible: function (width, start, offsets, defaultWidth) {
        var me = this;
        var columns = 0;
        var total = 0;
        var res = offsets.subset(start).first(function (x) {
            if (total < width) {
                columns++;
                total += x;
                return false;
            }
            return true;
        });

        if (total < width) {
            columns += Math.ceil((width - total) / defaultWidth);
        }

        return columns + 1;
    }
});