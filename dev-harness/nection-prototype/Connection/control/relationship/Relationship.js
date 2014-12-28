/**
 * @class MEPH.field.FormField
 * @extends MEPH.control.Control
 * Standard form for a input field.
 **/
MEPH.define('Connection.control.relationship.Relationship', {
    alias: 'relationship',
    templates: true,
    extend: 'MEPH.control.Control',
    requires: [],
    properties: {
        /**
          * Files of the input field
          */
        contact: null,

    }
})