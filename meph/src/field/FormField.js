﻿/**
 * @class MEPH.field.FormField
 * @extends MEPH.control.Control
 * Standard form for a input field.
 **/
MEPH.define('MEPH.field.FormField', {
    alias: 'formfield',
    templates: true,
    extend: 'MEPH.control.Control',
    requires: ['MEPH.util.Observable'],
    properties: {

        /**
         * @property {String} labelText
         * Label text.
         **/
        labelText: null,
        /**
         * @property {String/Array} labelClsBase
         * Base Css classes to apply to the label field.
         */
        labelClsBase: 'meph-label',
        /**
         * @property {String} cls
         * CSS class to apply for this node.
         */
        cls: null,
        /**
         * @property {String} baseComponentCls
         * CSS class to apply for this node.
         */
        baseComponentCls: null,
        /**
         * @property {String/Array} labelClsComponent
         * Base Css classes to apply to the label field.
         */
        labelClsComponent: null,
        /**
         * @property {String/Array} inputCls
         * Css classes to apply to the input field.
         */
        inputCls: null,
        inputCssClass: 'form-control',
        /**
         * Value of the input field
         */
        value: null,
        /**
         * Validation error associated with the field.
         */
        validationError: null,
        /**
         * @property {String} type
         * Type of field, like text, number, phonenumber, email, etc.
         */
        type: null,
        /**
         * @property {String} descriptionText
         * Description text applied to the span following the text.
         */
        descriptionText: null,
        /**
         * @property {String/Array} descriptionCls
         * Css classes applied to the description text.
         */
        descriptionCls: null,
        /**
         * @property {String/Array} defaultValidationErrorCls
         * Defatul css classes applied for validation.
         */
        defaultValidationErrorCls: 'meph-formfield-validation-error'
    },
    initialize: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.addAutoBindProperty('value', 'validationError');
        me.addTransferables();
        me.defineDependentProperties();
    },
    raiseEvent: function (event) {
        var me = this;
        var element = me.getFirstElement();
        element.dispatchEvent(MEPH.createEvent(event, { val: me.inputfield.value }));
    },
    /**
     * Gets the auto bind property paths.
     * @param {String} path
     * @param {String} property
     * @returns {String}
     */
    getAutoBindPropertyPath: function (property, autoProperty) {
        var me = this, autoPropSetup, value, pathArray,
            autoProperties = me.getAutoBindProperties();
        autoPropSetup = autoProperties.first(function (x) { return property === x.property && autoProperty === x.autoProperty; });

        if (autoPropSetup) {
            value = me.getInstanceTemplate().getAttribute(autoPropSetup.property);
            if (value) {
                pathArray = value.split('.');
                if (pathArray.length > 1) {
                    pathArray.splice(pathArray.length - 1, 0, MEPH.isValidatablePropertyKey);
                    return pathArray.join(MEPH.pathDelimiter);
                }
            }
        }
        return me.callParent.apply(path);
    },

    /**
     * @private
     * Adds transferable properties.
     **/

    addTransferables: function () {
        var me = this, properties = MEPH.Array(['inputCls',
                                                'descriptionText',
                                                'cls',
                                                'labelText',
                                                'descriptionCls',
                                                'baseComponentCls',
                                                'componentCls',
                                                'inputCssClass',
                                                'labelClsBase',
                                                'labelClsComponent']);

        properties.foreach(function (prop) {
            me.addTransferableAttribute(prop, {
                object: me,
                path: prop
            });
        });

    },
    defineDependentProperties: function () {
        var me = this;
        me.combineClsIntoDepenendProperty('formFieldCls', ['cls', 'inputCssClass', 'baseComponentCls', 'componentCls']);
        me.combineClsIntoDepenendProperty('labelCls', ['labelClsBase', 'labelClsComponent']);
        Observable.defineDependentProperty('validationCls', me, ['validationError'], me.validationErrorChange.bind(me));
    },
    /**
     * Validation changes the validationCls is recalulated.
     **/
    validationErrorChange: function () {
        var me = this;
        if (me.validationError) {
            return me.defaultValidationErrorCls;
        }
        return '';
    }
});