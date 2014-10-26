﻿/**
* @class MEPH.graph.Graph
* Creates a graph.
*/
MEPH.define('MEPH.graph.Graph', {
    //pgx.Graph = Class.extend("pgx.Graph", {
    requires: ['MEPH.util.Observable',
                'MEPH.graph.Node'],
    properties: {
    },
    on: function (evt, func) {
        var me = this;
        me.addListener(evt, func);
    },
    addNodes: function (nodes) {
        var me = this;
        return nodes.select(function (x) {
            return me.addNode(x);
        });
    },
    addConnection: function (connection) {
        var me = this;
        me.connections.push(connection);
    },
    getConnections: function () {
        var me = this;
        return me.connections;
    },
    getViewport: function () {
        var me = this;
        return me.$viewport;
    },
    removeConnections: function (connections) {
        var me = this;
        connections.foreach(function (x) {
            me.removeConnection(x);
        });
    },
    save: function () {
        var me = this;
        var result = {
            nodes: me.nodes.select(function (node) { return node.save(); }),
            connections: me.connections.select(function (connection) { return connection.save(); })
        };
        return result;
    },
    load: function (result) {
        var me = this;
        result = JSON.parse(JSON.stringify(result));
        var nodes = result.nodes.select(function (nodeinfo) {
            var node = new MEPH.graph.Node();
            node.setId(nodeinfo.id);
            node.setPosition(nodeinfo.position.x, nodeinfo.position.y, nodeinfo.position.z);
            node.appendData(nodeinfo.data);
            me.addNode(node);
            return node;
        });
        me.$loadedGraph = result;
        if (!me.addVewportListener && me.$viewport) {
            me.$viewport.on('newactivezone', function (options) {
                var id = options.id,
                    zone = options.zone;
                me.getConnections().where(function (conn) {
                    return me.$loadedGraph.connections.contains(function (x) {
                        return x.id === conn.getId();
                    });
                }).foreach(function (conn) {
                    var conninfo = me.$loadedGraph.connections.first(function (x) { return x.id === conn.getId() });
                    var zoneInfo = conninfo.zones.first(function (x) { return x === id });
                    if (zoneInfo) {
                        conn.addZone(zone);
                    }
                });
            });
            me.addedViewportListener = true
        }
        var connections = result.connections.select(function (connection) {
            var newconnection = new MEPH.graph.Connection();
            newconnection.setId(connection.id);
            nodes.where(function (x) {
                return connection.nodes.contains(function (y) { return y == x.getId(); })
            })
            .foreach(function (x) {
                newconnection.addNodes(x);
            });;
            newconnection.getNodes().foreach(function (x) {
                x.getZones().where(function (z) {
                    return connection.contains(z.getId());
                }).foreach(function (zones) {
                    newconnection.addZone(zones);
                });;
            });
            me.addConnection(newconnection)
        });
    },
    clearConnections: function () {
        var me = this,
            connections = me.getConnections().select(function (x) { return x; });
        me.removeConnections(connections);
    },
    removeConnection: function (connection) {
        var me = this;
        var result = me.connections.removeWhere(function (x) { return x === connection; });
        result.foreach(function (x) {
            if (x.removed) {
                x.removed();
            }
        });
        return result;
    },
    removeSelectedConnections: function () {
        var me = this;
        var connections = me.$viewport.removeSelectedConnections();
        connections.foreach(function (x) {
            me.removeConnection(x);
        })
    },
    addNode: function (node) {
        var me = this;
        node.on('click', me.onNodeClicked.bind(me, node));
        node.on('move', me.onNodeMove.bind(me, node));
        me.nodes.push(node);
        return node;
    },
    onNodeClicked: function (node) {
        var me = this;
        if (me.selectedNode !== node) {
            me.selectedNode = node;
            me.fire('nodeselected', node);
        }
    },
    onNodeMove: function (node) {
        var me = this;
        me.fire('change', {});
    },
    clear: function () {
        var me = this;
        me.removeConnections(me.getConnections().select(function (x) { return x; }));
        me.removeNodes(me.getNodes().select(function (x) { return x; }));
        me.$viewport.clear();
    },
    removeNodes: function (nodes) {
        var me = this;
        nodes.foreach(function (node) {
            me.removeNode(node);
        });
    },
    removeNode: function (node) {
        var me = this;
        var result = me.nodes.removeWhere(function (x) { return x === node; });
        result.foreach(function (x) {
            if (x.removed) {
                x.removed();
            }
        });
        return result;
    },
    getNodes: function () {
        var me = this;
        return me.nodes;
    },
    getNode: function (id) {
        var me = this;
        return me.nodes.first(function (x) { return x.getId() == id; });
    },
    initialize: function (options) {
        var me = this;
        MEPH.Events(me);
        me.nodes = MEPH.util.Observable.observable([])
            .on('beforepush', me.fire.bind(me, 'beforenodeadded'))
            .on('afterpush', me.fire.bind(me, 'afternodeadded'))
            .on('onpush', me.fire.bind(me, 'nodeadded'))
        .on('beforesplice', me.fire.bind(me, 'beforenoderemoved'))
        .on('aftersplice', me.fire.bind(me, 'afternoderemoved'))
        .on('onremove', me.fire.bind(me, 'noderemoved'))
        .on('onpush', me.fire.bind(me, 'change'))
        .on('onremove', me.fire.bind(me, 'change'));
        me.connections = MEPH.util.Observable.observable([])
            .on('beforepush', me.fire.bind(me, 'beforeconnectionadded'))
        .on('afterpush', me.fire.bind(me, 'afterconnectionadded'))
        .on('onpush', me.fire.bind(me, 'connectionadded'))
        .on('beforesplice', me.fire.bind(me, 'beforeconnectionremoved'))
        .on('aftersplice', me.fire.bind(me, 'afterconnectionremoved'))
        .on('onremove', me.fire.bind(me, 'connectionremoved'))
        .on('onpush', me.fire.bind(me, 'change'))
        .on('onremove', me.fire.bind(me, 'change'));
        me.on('connectionadded', function (type, anothertye, args) {
            var connection = args.added;
            connection[0].on('emptyconnection', function (type, conn) {
                me.removeConnection(conn);
            });
        });
    }
});