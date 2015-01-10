MEPH.define("MEPH.audio.view.Visualizer",{alias:"visualizer",templates:true,extend:"MEPH.control.Control",requires:["MEPH.input.Range","MEPH.util.Style","MEPH.util.Dom"],properties:{cls:"",baseCls:"visualizer col-md-3",height:200,calculatedBpm:"",width:300,maxsize:20000,magnification:1,timeScroll:0,vertical:0,delta:1,scrollMutiplier:1,scrollleft:0,maxlevel:null,source:null},initialize:function(){var a=this;a.callParent.apply(a,arguments);a.addTransferables();a.defineDependentProperties();a.on("altered",function(c,b){if(b.path==="source"||b.path==="vertical"||b.path==="scrollMutiplier"){a.updateWidth(b).then(a.setLeft.bind(a)).then(function(){a.sourceChanged(b)})}})},onMouseDown:function(){var a=this;a.targetStart=MEPH.util.Dom.getEventPositions(MEPH.Array(arguments).last().domEvent).first();Style.top(a.mousehover,0);Style.height(a.mousehover,a.height);Style.width(a.mousehover,0);if(a.mousehover){a.mousehover.classList.add("active")}},onMouseMove:function(){var a=this,b;if(a.targetStart){b=MEPH.util.Dom.getEventPositions(MEPH.Array(arguments).last().domEvent).first();if(b){a.targetWidth=b.x-a.targetStart.x;if(a.mousehover){if(a.targetWidth>0){Style.left(a.mousehover,a.targetStart.x);Style.width(a.mousehover,a.targetWidth)}else{Style.left(a.mousehover,a.targetStart.x+a.targetWidth);Style.width(a.mousehover,a.targetWidth*-1)}}}}},onMouseUp:function(){var a=this,b;if(a.targetStart){a.setSelectedRange(a.targetStart.x,a.targetWidth);a.targetStart=null}},setSelectedRange:function(e,b){var c=this,a=c.getBuffer(),d=c.width;if(a&&c.getAbsoluteMarkPosition){if(b<0){e=e+b;b=b*-1}c.selectedRange={};c.selectedRange.start=e;c.selectedRange.end=e+b}},sourceChanged:function(a){var b=this;b.draw(a.value)},calculateLeft:function(a){var c=this;var b=parseFloat(c.container.scrollWidth);var d=parseFloat(c.scrollleft)/100;return(b*d)},setLeft:function(){var a=this;var b=a.calculateLeft();a.container.scrollLeft=b},draw:function(){var b=this;if(b.frame){cancelAnimationFrame(b.frame)}b.frame=requestAnimationFrame(function(){if(!b.canvas){return}var f=b.height;var l=b.width;var o=b.canvas.getContext("2d");o.fillStyle="rgb(200, 200, 200)";o.fillRect(0,0,l,f);o.lineWidth=1;o.strokeStyle="rgb(0, 0, 0)";o.beginPath();var c=b.getDataToDraw(b.source,l);if(c&&c.max){var m=c;var h=b.maxlevel?parseFloat(b.maxlevel):c.max(function(i){return Math.abs(i)})||1;h=Math.abs(h*1.1);var d=c.length;var k=l*1/d;var j=0;for(var e=0;e<d;e++){var n=m[e]/(h||128);var g=(n*f/2)+(f/2)+parseFloat(b.vertical||0)/(h||128);if(e===0){o.moveTo(j,g)}else{o.lineTo(j,g)}j+=k}}o.lineTo(l,f/2);o.stroke();b.frame=null;a()});var a;return new Promise(function(c){a=c})},getBuffer:function(){var b=this,a,c=b.source;if(c&&c.buffer&&c.buffer.buffer){a=c.buffer.buffer.getChannelData(0)}if(a){return a}return null},getDataToDraw:function(f,h){var e=this,b=e.getBuffer();if(b){var g=b.length*e.timeScroll;var d=(b.length*e.magnification);var a=d+g;var c=d/h;return b.skipEveryFromTo(Math.round(c)||1,Math.round(g),Math.round(a),function(i){return i})}else{if(f&&Array.isArray(f)||f instanceof Float32Array){return f}}return[]},changeWidth:function(){var b=MEPH.util.Array.convert(arguments).last().domEvent;var a=this;var c=Math.max(-1,Math.min(1,(b.wheelDelta||-b.detail)));a.delta=c;a.width+=a.delta;a.draw()},updateWidth:function(){var a=this;if(parseFloat(a.scrollMutiplier)){a.width=(a.maxsize*parseFloat(a.scrollMutiplier)/100);return a.draw()}else{a.width=a.container.clientWidth}return Promise.resolve()},addTransferables:function(){var b=this,a=MEPH.Array(["componentCls","source","height","width","scrollMutiplier"]);a.foreach(function(c){b.addTransferableAttribute(c,{object:b,path:c})})},defineDependentProperties:function(){var a=this;a.combineClsIntoDepenendProperty("visualizerCls",["componentCls","cls","baseCls"])}});