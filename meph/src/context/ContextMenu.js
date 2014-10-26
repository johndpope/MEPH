/**
 * @class MEPH.context.ContextMenu
 * Context menu
 */
MEPH.define('MEPH.context.ContextMenu', {
    alias: 'contextmenu',
    requires: ['MEPH.util.Dom', 'MEPH.util.Observable', 'MEPH.util.Style'],
    templates: true,
    statics: {
    },
    properties: {
        opencls: 'opencls',
        standardcls: ''
    },
    extend: 'MEPH.control.Control',
    initialize: function () {
        var me = this;
        me.super();
        me.defineProperties();
    },
    defineProperties: function () {
        var me = this,
            contextmenucls = ['standardcls'];
        MEPH.util.Observable.defineDependentProperty('contextMenuCls', me, contextmenucls, function () {
            var result = [];
            contextmenucls.foreach(function (x) {
                result.push(me[x]);
            });
            if (me.isOpen) {
                result.push(me.opencls);
            }
            return result.join(' ');
        });
    },
    onOutsideClick: function (evnt) {
        var me = this;
        var source = Dom.getEventSource(evnt);
        if (!Dom.isDomDescendant(source, me.getFirstElement())) {
            if (me.isOpen) {
                me.close();
            }
        }
    },
    open: function () {
        var me = this;
        if (me.isOpen) {
            return;
        }
        var dom = me.getFirstElement();
        me.olddomparent = dom.parentNode;
        //dom.parentNode.removeChild(dom);
        var clone = dom.cloneNode(true);

        document.body.appendChild(clone);
        dom = clone;
        me.clone = clone;
        me.don('click', clone, function (s) {
            debugger
            var source = MEPH.util.Dom.getEventSource(s);
            while (source && !source.getAttribute('contextevt')) {
                source = source.parentNode;
            }
            var evt = source.getAttribute('contextevt');
            me.olddomparent.dispatchEvent(MEPH.createEvent(evt, {}));
            me.dun('contextmenu');
        }, 'contextmenu');

        dom.classList.add(me.opencls);
        me.isOpen = true;
        var position = MEPH.mouse.position;
        me.position = position;
        Style.setPosition(dom, me.position.x, me.position.y);
        Style.zIndex(dom, 10000);
    },
    close: function () {
        var me = this;
        var dom = me.getFirstElement();
        if (me.clone && me.clone.parentNode) {
            me.clone.parentNode.removeChild(me.clone);
        }
        me.olddomparent.appendChild(dom);
        dom.classList.remove(me.opencls);
        me.isOpen = false;
        Style.zIndex(dom, -10000);
    },
    onLoaded: function () {
        var me = this;
        me.super();
        me.standardcls = 'contextmenu';
        me.don('click', me.$window.document.body, me.onOutsideClick.bind(me));

    }
});