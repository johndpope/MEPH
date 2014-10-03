/**
 * @class MEPH.table.SpreadSheet
 * @extends MEPH.control.Control
 * A infinitely scrolling Scrollbar.
 **/
MEPH.define('MEPH.scrollbar.Scrollbar', {
    alias: 'scrollbar',
    templates: true,
    requires: ['MEPH.util.Style', 'MEPH.util.Dom'],
    extend: 'MEPH.control.Control',
    properties: {
        dragging: 'dragging',
        horizontal: true,
        barheight: 20,
        handleheight: 16,
        handleoffset: 1,
        virtualsize: 0,
        scrollbarposition: 0,
        minhandlesize: 30
    },
    initialize: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.cache = {};

        me.on('altered', function (type, args) {
            if (args.path === 'virtualsize' || args.path === 'minhandlesize' || args.path === 'horizontal') {
                me.horizontal = me.horizontal === 'false' || !me.horizontal ? false : true;
                if (me.horizontal) {
                    Style.width(me.handle, Math.max(me.minhandlesize, me.bar.clientWidth * (me.bar.clientWidth / me.virtualsize)));
                }
                else {
                    Style.height(me.handle, Math.max(me.minhandlesize, me.bar.clientHeight / me.virtualsize));
                }
                me.stylebar();
            }
        });
    },
    onLoaded: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.appendEvents();
        me.stylebar();
    },
    stylebar: function () {
        var me = this;
        if (me.horizontal) {
            Style.clear(me.bar, 'width')
            Style.height(me.bar, me.barheight);
            Style.top(me.handle, me.handleoffset);
            Style.height(me.handle, me.handleheight);
        }
        else {
            Style.clear(me.bar, 'height')
            Style.width(me.bar, me.barheight);
            Style.left(me.handle, me.handleoffset);
            Style.width(me.handle, me.handleheight);
        }
    },
    appendEvents: function () {
        var me = this;
        me.handle.addEventListener('mousedown', function (e) {
            var position = MEPH.util.Dom.getScreenEventPositions(e).first();
            var handleoffset = MEPH.util.Dom.getEventPositions(e).first();
            me.state = me.dragging
            me.start_position = me.horizontal ? position.x : position.y;
            console.log(me.start_position)
            me.handlePos = me.getBarPosition();
            me.handleoffset = handleoffset;
        });

        document.body.addEventListener('mousemove', function (e) {
            if (me.state === me.dragging) {
                var position = MEPH.util.Dom.getScreenEventPositions(e).first();
                me.position = me.horizontal ? position.x : position.y;
                me.setBarPosition(me.position - me.start_position);
                me.scrollbarposition = me.getBarPosition() / (me.barSize() - me.handleSize());
                //var part1 = ((me.getBarPosition() + me.handleSize()) / me.barSize());
                //me.scrollbarposition = part1 - (me.handleSize() / me.barSize()) * ((1 - part1));
            }
        });

        document.body.addEventListener('mouseup', function (e) {
            me.state = null;
            me.start_position = null;
        });
    },
    handleSize: function () {
        var me = this;
        return parseFloat(me.horizontal ? me.handle.clientWidth : me.handle.clientHeight) || 0;
    },
    barSize: function () {
        var me = this;
        return parseFloat(me.horizontal ? me.bar.clientWidth : me.bar.clientHeight) || 0;
    },
    getBarPosition: function () {
        var me = this;
        if (me.horizontal) {
            return parseFloat(me.handle.offsetLeft) || 0;
        }
        return parseFloat(me.handle.offsetTop) || 0;
    },
    setBarPosition: function (pos) {
        var me = this;
        if (me.horizontal) {
            var width = me.bar.clientWidth - me.handle.clientWidth;
            Style.left(me.handle, Math.max(0, Math.min(width, me.handlePos + pos)));
        }
        else {
            var width = me.bar.clientHeight - me.handle.clientHeight;
            Style.top(me.handle, Math.max(0, Math.min(width, me.handlePos + pos)));
        }
    }
});