/**
 * @class MEPH.control.Control
 * Defines a base class for all controls and views.
 **/
MEPH.define('MEPH.audio.graph.node.controls.InputCollection', {
    alias: 'inputcollection',
    templates: true,
    scripts: ['MEPH.audio.graph.node.controls.InputCollectionForm'],
    requires: ['MEPH.util.Dom', 'MEPH.util.SVG'],
    extend: 'MEPH.audio.graph.node.controls.AudioControl',
    properties: {
        collection: null
    },
    initialize: function () {
        var me = this;
        me.super();

        me.$parameterTypes = [{ name: 'Audio Buffer', value: MEPH.audio.graph.node.Node.AudioBuffer },
        { name: 'Boolean', value: MEPH.audio.graph.node.Node.Boolean },
        { name: 'Number', value: MEPH.audio.graph.node.Node.Number },
        { name: 'String', value: MEPH.audio.graph.node.Node.String },
        { name: 'Array', value: MEPH.audio.graph.node.Node.Float32Array }];
        me.on('altered', function (type, args) {
            if (args.path === 'collection') {
                me.collection.un(me);
                me.collection.on('changed', me.updateControlList.bind(me), me)
            }
        });
        me.renderer = new MEPH.util.SVG();
    },
    enterValue: function () {
        //var me = this;
        var me = this;
        me.createForm();
    },
    onLoaded: function(){
        var me = this;
        me.super();
        
        me.getFirstElement().dispatchEvent(MEPH.createEvent('height', { height: me.controlheight }));
    },
    updateControlList: function () {
        var me = this;
        if (me.svgs) {
            me.svgs.foreach(function (t) {
                me.renderer.remove(t);
            })
        }
        me.renderer.setCanvas(me.collectiongroup);
        var step = 15;
        var last = -step;
        me.svgs = me.collection.select(function (x) {
            last += step;
            return {
                text: x.name + ' : ' + x.type,
                shape: MEPH.util.SVG.shapes.text,
                dy: last,
                fill: '#ffffff',
                x: 0
            }
        })
        me.renderer.draw(me.svgs);
        me.controlheight = last + 24;
        me.getFirstElement().dispatchEvent(MEPH.createEvent('height', { height: me.controlheight }));
    },
    addField: function (field) {

        var me = this;
        if (me.collection && me.collection.all(function (x) { return x.name !== field.name; })) {
            me.collection.push(field);
            return true;
        }
        return false

    },
    createForm: function () {
        var me = this;

        var form = MEPH.getTemplate('MEPH.audio.graph.node.controls.InputCollectionForm');
        var element = MEPH.util.Dom.createInputElementOverSvg(me.getFirstElement(), 'div');
        element.innerHTML = form.template;
        var select = element.querySelector('select');
        select.setAttribute('placeholder', 'type')
        me.$parameterTypes.foreach(function (t) {
            MEPH.util.Dom.addOption(t.name, t.value, select);
        });
        Style.width(element, 300)
        var input = element.querySelector('input');
        input.setAttribute('placeholder', 'name');

        var saveBtn = element.querySelector('[save]');
        var cancelBtn = element.querySelector('[cancel]');

        cancelBtn.addEventListener('click', function () {
            document.body.focus();
        });

        saveBtn.addEventListener('click', function () {
            if (name && type) {
                if (me.addField({ name: name, title: name, type: type, output: false, id: MEPH.GUID() }))
                    document.body.focus();
            }
        })
        var name;
        var type;
        var elements = [{
            setFunc: function (v) {
                name = v;
            },
            element: input
        }, {
            setFunc: function (v) {
                type = v;
            },
            element: select
        }, {
            setFunc: function (v) {
            },
            element: saveBtn
        }, {
            setFunc: function (v) {
            },
            element: cancelBtn
        }];

        MEPH.util.Dom.addSimpleDataEntryToElments(me, elements, element);

    }
})