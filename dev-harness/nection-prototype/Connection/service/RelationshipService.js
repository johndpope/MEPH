MEPH.define('Connection.service.RelationshipService', {
    initialize: function () {
    },
    getRelationshiptypes: function () {
        var me = this;
        return Promise.resolve().then(function () {
            return [{ type: 'family', relation: 'brother', name: 'Brother' },
            { type: 'family', relation: 'mother', name: 'Mother' },
            { type: 'family', relation: 'sister', name: 'Sister' },
            { type: 'family', relation: 'father', name: 'Father' },
            { type: 'family', relation: 'cousin', name: 'Cousin' },
            { type: 'family', relation: 'uncle', name: 'Uncle' },
            { type: 'family', relation: 'aunt', name: 'Aunt' },
            { type: 'family', relation: 'spouse', name: 'Spouse' },
            { type: 'family', relation: 'grandfather', name: 'Grandfather' },
            { type: 'family', relation: 'grandmother', name: 'Grandmother' },
            { type: 'business', relation: 'manager', name: 'Manager' },
            { type: 'business', relation: 'employee', name: 'Employee' },
            { type: 'business', relation: 'customer', name: 'Customer' },
            { type: 'business', relation: 'servicerep', name: 'Service Rep' },
            { type: 'business', relation: 'advisor', name: 'Advisor' },
            { type: 'business', relation: 'superior', name: 'Superior' },
            { type: 'business', relation: 'partner', name: 'Partner' },
            { type: 'family', relation: 'stakeholder', name: 'Stakeholder' }]
        })
    }
});