MEPH.define("MEPH.graph.SVGGraph",{extend:"MEPH.graph.Graph",initialize:function(){var a=this;a.great();a.on("nodeadded",function(d,c,b){b.added.foreach(function(e){e.$data.setupActiveZones(a.$viewport,e);e.$data.graph=e.$data.graph||a})})},load:function(a,d){var c=this;a=JSON.parse(a);c.clear();var b=c.$viewport.getGCanvas();return Promise.all(a.nodes.select(function(e){return d.renderControl(e.data.type,b,d).then(function(g){var f=g.first();node=new MEPH.graph.Node();node.setId(e.id);node.appendData(f.classInstance);f.classInstance.nodeInputs.clear();f.classInstance.nodeOutputs.clear();e.data.nodeInputs.foreach(function(h){f.classInstance.nodeInputs.push(h)});e.data.nodeOutputs.foreach(function(h){f.classInstance.nodeOutputs.push(h)});d.addNode(node);node.setPosition(e.position.x,e.position.y,e.position.z);f.classInstance.applyNodeInputsAndOutputs();return node})})).then(function(e){c.$loadedGraph=a;var f=a.connections.select(function(g){var h=new MEPH.graph.Connection();h.setId(g.id);e.where(function(i){return g.nodes.contains(function(j){return j==i.getId()})}).foreach(function(i){h.addNodes(i)});h.getNodes().foreach(function(i){i.getZones().where(function(j){return g.zones.contains(j.getOptions().id)}).foreach(function(j){h.addZone(j)})});c.addConnection(h)})})}});