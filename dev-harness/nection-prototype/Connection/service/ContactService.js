MEPH.define('Connection.service.ContactService', {
    initialize: function () {
    },
    getRelationShip: function () {
        var me = this;
        return Promise.resolve().then(function () {
            return {
                description: 'this would describe the relation ship'
            }
        })
    }
});