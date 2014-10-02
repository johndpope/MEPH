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
        gridlinecolor: "#d6ccf0",
        startColumn: 0,
        vbarposition: null,
        hbarposition: null,
        startRow: 0,
        verticalSize: 0,
        horizontalSize: 0,
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
            if (args.path === 'rowheaders' ||
                args.property === "gridlinecolor" ||
                args.path === 'columnheaders' ||
                args.path === 'columns' ||
                args.path === 'vertical' ||

                args.property === 'startColumn' ||
                args.property === 'startRow' ||
                args.property === 'vbarposition' ||
                args.path === 'rows') {

                if (args.property === 'vbarposition') {
                    me.setStartRow(me.vbarposition);
                }

                if (args.property === 'hbarposition') {
                    me.setStartColumn(me.hbarposition);
                }

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
            me.handleSingleCellCalculations(evt, 'cellclicked');
        });
        me.canvas.addEventListener('mousemove', function (evt) {
            me.handleSingleCellCalculations(evt, 'mousemovecell');
        });
        me.canvas.addEventListener('mousemovecell', function (evt) {
            me.handleMouseMoveCell(evt);
        })
    },
    handleMouseMoveCell: function (evt) {
        var me = this;
        var minCellLeft = evt.cells.minSelect(function (x) { return x.row; });
        var maxCellLeft = evt.cells.maxSelection(function (x) { return x.row; });

        var minCellTop = evt.cells.minSelect(function (x) { return x.column });
        var maxCellTop = evt.cells.maxSelection(function (x) { return x.column; });

        var minCellLeftPosition = me.getCellPosition(minCellLeft);
        var maxCellLeftPosition = me.getCellPosition({ row: maxCellLeft.row, column: maxCellLeft.column + 1 });

        var minCellTopPosition = me.getCellPosition(minCellTop);
        var maxCellTopPosition = me.getCellPosition({ row: maxCellTop.row + 1, column: maxCellTop.column });

        me.setActiveCell(minCellLeftPosition.x, maxCellLeftPosition.x, minCellTopPosition.y, maxCellTopPosition.y)
    },
    setActiveCell: function (x1, x2, y1, y2) {
        var me = this;
        if (arguments.length === 4) {
            me.activeArea = {
                x1: x1,
                x2: x2,
                y1: y1,
                y2: y2
            };

            Style.top(me.activearea, y1 + me.getColumnHeaderHeight());
            Style.left(me.activearea, x1 + me.getRowsHeaderWidth());
            Style.width(me.activearea, x2 - x1);
            Style.height(me.activearea, y2 - y1);
            me.activearea.classList.add('active')
        }
        else {
            me.activearea.classList.remove('active')
        }
    },
    handleSingleCellCalculations: function (evt, outevnt) {
        var me = this;
        var canvasPos = MEPH.util.Dom.getPosition(me.canvas);   
        var pos = MEPH.util.Dom.getEventPositions(evt, me.canvas);
        var cells = me.calculateCells(pos, { x: me.getRowsHeaderWidth(), y: me.getColumnHeaderHeight() });
        me.canvas.dispatchEvent(MEPH.createEvent(outevnt, {
            cells: cells
        }));
    },
    getCellPosition: function (cell) {
        var me = this;
        var t = 0;
        var u = 0;
        me.rowOffsets.subset(me.startRow, cell.row).first(function (x) {
            t += x;
        });
        me.columnOffsets.subset(me.startColumn, cell.column).first(function (x) {
            u += x;
        });

        return {
            x: u,
            y: t
        }
    },
    getColumnHeaderHeight: function () {
        var me = this;
        me.cache.columnHeaderHeight = me.cache.columnHeaderHeight || me.rowHeaderOffsets.summation(function (x, t) {
            return t += x;
        });
        return me.cache.columnHeaderHeight;
    },
    getRowsHeaderWidth: function () {
        var me = this;
        me.cache.rowHeaderWidth = me.cache.rowHeaderWidth || me.columnHeaderOffsets.summation(function (x, t) {
            return t += x; 
        });
        return me.cache.rowHeaderWidth;
    },
    calculateCells: function (positions, relativePos) {
        var me = this;
        var cells = positions.select(function (pos) {
            return {
                row: me.getRelativeRow(pos.y - relativePos.y),
                column: me.getRelativeColum(pos.x - relativePos.x),
            }
        });
        return cells;
    },
    setStartRow: function (percentage) {
        if (!isNaN(percentage)) {
            var me = this;
            me.startRow = me.setStart(percentage, me.rowOffsets, me.calculateVertical());
        }
    },
    setStart: function (percentage, offsets, vs) {
        if (!isNaN(percentage)) {
            var me = this;
            var voffset = vs * percentage;;
            var t = 0;
            var index = 0;
            offsets.first(function (x, i) {
                t += x;
                index = i;
                return t > voffset;
            });
            return index;
        }
    },
    setStartColumn: function (percentage) {
        if (!isNaN(percentage)) {
            var me = this;
            me.startColumn = me.setStart(percentage, me.columnOffsets, me.calculateHorizontal());
        }
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
    calculateVertical: function () {
        var me = this;
        me.verticalSize = me.verticalSize || me.rowOffsets.summation(function (x, t) { return t += x; });
        return me.verticalSize;
    },
    calculateHorizontal: function () {
        var me = this;
        me.horizontalSize = me.horizontalSize || me.columnOffsets.summation(function (x, t) { return t += x; });
        return me.horizontalSize;
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
            me.animFrame = null;
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
            me.calculateVertical();
            me.calculateHorizontal();

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
        me.drawSubGrid(me.topheader, me.rowHeaderOffsets, me.columnOffsets, height, width, me.topRenderer, 0, 0);
    },
    drawLeftGrid: function (height, width) {
        var me = this;
        me.drawSubGrid(me.leftheader, me.rowOffsets, me.columnHeaderOffsets, height, width, me.leftRenderer, 0, 0);
    },
    drawGrid: function (height, width) {
        var me = this;
        me.drawSubGrid(me.canvas, me.rowOffsets, me.columnOffsets, height, width, me.renderer, me.startRow, me.startColumn);
    },
    drawSubGrid: function (canvas, rowOffsets, columnOffsets, height, width, renderer, startRow, startColumn) {
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
        var visRows = me.visibleRows(height, startRow)
        var drawInstructions = rowOffsets.subset(startRow, startRow + visRows + 1).select(rowDrawFunc);

        if (rowOffsets.length < startRow + visRows) {
            drawInstructions = drawInstructions.concat([].interpolate(0, startRow + visRows - rowOffsets.length, rowDrawFunc));
        }

        var visCols = me.visibleColumns(width, startColumn)
        drawInstructions = drawInstructions.concat(columnOffsets.subset(startColumn, startColumn + visCols + 1).select(colDrawFunc));

        if (columnOffsets.length < startColumn + visCols) {
            drawInstructions = drawInstructions.concat([].interpolate(0, startColumn + visCols - columnOffsets.length, colDrawFunc));
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

        return columns;
    }
});