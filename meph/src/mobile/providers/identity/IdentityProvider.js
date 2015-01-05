/**
 * @class MEPH.mobile.providers.identity.IdentityProvider
 * A base class for identity providers.
 */
MEPH.define('MEPH.mobile.providers.identity.IdentityProvider', {
    'statics': {
        maxWaitTime: 10000
    },
    properties: {
        isReady: false,
        $providerpromise: null,
        $response: null
    },
    initialize: function (args) {
        var me = this;
        me.args = args;
        me.$providerpromise = Promise.resolve();
    },
    contacts: function () {
        throw new Error('Not implemented.')
    },
    property: function () {
        throw new Error('Not implemented');
    },
    contact: function () {
        throw new Error('Not implemented');
    },
    online: function () {

        throw new Error('Not implemented');
    },
    login: function () {

        throw new Error('Not implemented');
    },
    $online: function () {

        throw new Error('Not implemented');
    },
    ready: function () {

        throw new Error('Not implemented');
    }
});