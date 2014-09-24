/**
 * @class MEPH.field.FormField
 * @extends MEPH.control.Control
 * Standard form for a input field.
 **/
MEPH.define('MEPH.audio.view.Visualizer', {
    alias: 'visualizer',
    templates: true,
    extend: 'MEPH.control.Control',
    requires: [],
    properties: {
        /**
         * @property {String} cls
         * CSS class to apply for this node.
         */
        cls: '',

        baseCls: 'visualizer col-md-3',



        /**
         * @property {Array} source
         * An audio source.
         ***/
        source: null

    },
    initialize: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.addTransferables();
        me.defineDependentProperties();
    },
    /**
     * @private
     * Adds transferable properties.
     **/

    addTransferables: function () {
        var me = this, properties = MEPH.Array(['componentCls', 'source']);

        properties.foreach(function (prop) {
            me.addTransferableAttribute(prop, {
                object: me,
                path: prop
            });
        });

    },

    defineDependentProperties: function () {
        var me = this;
        me.combineClsIntoDepenendProperty('visualizerCls', ['componentCls', 'cls', 'baseCls']);
    },
});