MEPH.define('Connection.service.ContactService', {
    injections: ['identityProvider'],
    mixins: {
        injectable: 'MEPH.mixins.Injections'
    },
    initialize: function () {
        var me = this;
        me.$promise = Promise.resolve();
        me.mixins.injectable.init.apply(me);
    },
    getRelationShip: function () {
        var me = this;
        return Promise.resolve().then(function () {
            return {
                description: 'this would describe the relation ship',
                relationships: []
            }
        })
    },
    updateRelationship: function (contact, relations) {
    },
    me: function () {
        var me = this;
        return Promise.resolve().then(function () {
            return {
                name: 'TBA',
                dob: 'TBA',
                businesses: [{
                    title: 'tba',
                    web: 'tba.com',
                    city:'TBA',
                    address: 'TBA',
                    zip: 'TBA',
                    state: 'TBA',
                    county: 'TBA',
                    country: 'TBA',
                    phone1: 'TBA',
                    phone2: 'TBA',
                    cell: 'TBA',
                    email: 'TBA'
                }]
            }
        });
    }
});