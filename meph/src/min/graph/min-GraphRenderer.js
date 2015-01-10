MEPH.define("MEPH.graph.GraphRenderer",{requires:["MEPH.util.Observable"],properties:{connectionCanvasZIndex:2,maxSelectionDistance:30,nodeCanvasZIndex:3},initialize:function(){var a=this;a.$canvases=MEPH.util.Observable.observable([]);a.$selectedConnections=[];a.animationComplete=true},setViewPort:function(a){var b=this;b.$viewport=a;a.setRenderer(b);b.$viewport.on("moved",b.onViewPortChange.bind(b));b.$viewport.on("change",b.onViewPortChange.bind(b));b.$viewport.on("viewportconnectionflow",b.onViewPortConnectionFlow.bind(b));b.$viewport.on("viewportconnectionflowclear",b.onViewPortConnectionFlow.bind(b));b.$viewport.on("mousemove",b.onMouseMoveOverViewPort.bind(b))},use:function(c){var b=this;switch(c){case"viewport":var a=b.getViewPort();b.setCanvasBag(a.getCanvasBag());break;default:throw"use somethin with a canvas."}},setCanvasBag:function(b){var a=this;a.$canvasBag=b;a.$canvasBag.addEventListener("resize",a.onCanvasBagResize.bind(a))},getCanvasBag:function(){var a=this;return a.$canvasBag||null},onCanvasBagResize:function(){me.resizeCanvases()},resizeCanvases:function(){},setGraph:function(b){var a=this;a.$graph=b},getGraph:function(b){var a=this;return a.$graph},onViewPortChange:function(){var a=this;a.requestAnimationFrame()},requestAnimationFrame:function(){var a=this;if(a.requestedAnimation!==undefined){cancelAnimationFrame(a.requestedAnimation)}a.requestedAnimation=requestAnimationFrame(function(){a.render();a.requestedAnimation=undefined});return Promise.resolve()},setNodeRenderer:function(b){var a=this;a.$nodeRenderer=b},getNodeRenderer:function(){var a=this;return a.$nodeRenderer},setConnectionRenderer:function(b){var a=this;a.$connectionRenderer=b},getConnectionRenderer:function(){var a=this;return a.$connectionRenderer},getConnections:function(){var a=this;return a.getGraph().getConnections()},getNodes:function(){var a=this;return a.getGraph().getNodes()},generateCanvas:function(e,d){var c=this,b=document.createElement("canvas");var a=c.getViewPort().getCanvasSize();e=e||c.getCanvasBag();e.appendChild(b);b.height=a.height;b.width=a.width;b.style.position="absolute";b.style.zIndex=d?c.connectionCanvasZIndex:c.nodeCanvasZIndex;c.$canvases.push(b);return b},getCanvases:function(){var a=this;if(a.$canvases.length===0){a.generateCanvas()}return a.$canvases},render:function(){var b=this,a=b.getCanvases();b.clearCanvases();b.getNodes().where(function(c){return !c.isHidden()}).foreach(function(c){b.renderNode(c)});if(b.getConnectionRenderer()){b.getConnections().foreach(function(c){b.renderConnection(c)})}b.renderConnectionFlow()},clear:function(){var a=this;a.getNodes().removeWhere(function(){return true});a.getConnections().removeWhere(function(){return true})},onMouseMoveOverViewPort:function(a){var c=this;c.clearCanvas(c.getViewPortEffects());var b=c.getRelPosition(a);c.renderViewPortEffects(c.getViewPortEffects(),b)},getRelPosition:function(b){var c=this,a=c.getViewPort();var d=a.getXY(b);var e=a.maskDomPosition();return{x:d.x-e.x,y:d.y-e.y}},onViewPortConnectionFlow:function(a){var b=this;b.clearCanvas(b.getFlowCanvas());b.renderConnectionFlow(a)},renderConnectionFlow:function(){var d=this,c=d.getCanvases();var a=d.getViewPort();if(a.connectionFlow&&a.connectionFlow.state===MEPH.graph.GraphViewPort.start_connection){var e=d.getConnectionRenderer();var b=d.getFlowCanvas();if(b){e.render(b,[{start:a.getMousePosition(),end:a.connectionFlow.zone.getPosition(),zone:a.connectionFlow.zone,viewport:a}])}}},renderViewPortEffects:function(c,a){var d=this,e=d.getConnectionRenderer();if(e){var b=d.getGraph().getConnections().minSelect(function(f){return f.distanceFrom(a)});if(b){Style.zIndex(c,d.connectionCanvasZIndex);if(b.distanceFrom(a)<d.maxSelectionDistance){e.renderConnection(b,c,d.getViewPort().getPosition(),d.getClosetConnectionOptions(b))}}d.getSelectedConnections().foreach(function(f){e.renderConnection(f,c,d.getViewPort().getPosition(),d.getSelectedConnectionsOptions(f))})}},getSelectedConnections:function(){var a=this;return a.getViewPort().getSelectedConnections()},getSelectedConnectionsOptions:function(a){return{lineWidth:2,strokeStyle:"red"}},getClosetConnectionOptions:function(){return{lineWidth:4,strokeStyle:"orange"}},getFlowCanvas:function(){var a=this;return a.getNthCanvas(3,a.connectionCanvasZIndex)},getViewPortEffects:function(){var a=this;return a.getNthCanvas(4,a.connectionCanvasZIndex)},getNthCanvas:function(e,a){var d=this,c=d.getCanvases();var b=c.nth(e);if(!b){d.generateCanvas(null,true);b=c.nth(e);if(b){b.style.zIndex=a}}return b},renderConnection:function(a){var e=this,f=e.getConnectionRenderer(),d=e.getCanvases();var b=d.first();var c=d.second();if(!c){e.generateCanvas(null,true);c=d.second();c.style.zIndex=e.connectionCanvasZIndex}if(f){Style.zIndex(c,e.connectionCanvasZIndex);f.renderConnection(a,c,e.getViewPort().getPosition())}},renderNode:function(d){var c=this,e=c.getNodeRenderer(),f=c.getConnectionRenderer(),b=c.getCanvases();var a=b.first();e.renderNode(d,a,c.getViewPort().getPosition())},clearCanvas:function(a){var b;if(a){b=a.getContext("2d");b.clearRect(0,0,a.width,a.height)}},clearCanvases:function(){var a=this;a.getCanvases().foreach(function(b){a.clearCanvas(b)})},getViewPort:function(){var a=this;return a.$viewport}});