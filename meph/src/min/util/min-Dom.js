Promise.resolve().then(function(){var d=null;var c=null;var b=null;var a=null;function e(f){console.log((performance.now()/1000).toFixed(3)+": "+f)}if(MEPH.workerthread){return}if(navigator.mozGetUserMedia){a="firefox";MEPH.browser="firefox";window.RTCPeerConnection=mozRTCPeerConnection;window.RTCSessionDescription=mozRTCSessionDescription;window.RTCIceCandidate=mozRTCIceCandidate;navigator.getUserMedia=navigator.mozGetUserMedia;window.attachMediaStream=function(f,g){console.log("Attaching media stream");f.mozSrcObject=g;f.play()};window.reattachMediaStream=function(g,f){console.log("Reattaching media stream");g.mozSrcObject=f.mozSrcObject;g.play()};MediaStream.prototype.getVideoTracks=function(){return[]};MediaStream.prototype.getAudioTracks=function(){return[]}}else{if(navigator.webkitGetUserMedia){a="chrome";MEPH.browser="chrome";window.RTCPeerConnection=webkitRTCPeerConnection;navigator.getUserMedia=navigator.webkitGetUserMedia;window.attachMediaStream=function(f,g){f.src=window.URL.createObjectURL(g)};window.reattachMediaStream=function(g,f){g.src=f.src};if(!webkitMediaStream.prototype.getVideoTracks){webkitMediaStream.prototype.getVideoTracks=function(){return this.videoTracks};webkitMediaStream.prototype.getAudioTracks=function(){return this.audioTracks}}if(!webkitRTCPeerConnection.prototype.getLocalStreams){webkitRTCPeerConnection.prototype.getLocalStreams=function(){return this.localStreams};webkitRTCPeerConnection.prototype.getRemoteStreams=function(){return this.remoteStreams}}}else{console.log("Browser does not appear to be WebRTC-capable")}}}).then(function(){return MEPH.define("MEPH.util.Dom",{requires:["MEPH.util.Style"],statics:{commentType:8,textType:3,elementType:1,usermedia:null,insertBefore:function(a,b){a.parentNode.insertBefore(b,a.nextSibling)},insertAfter:function(a,b){a.parentNode.insertBefore(b,a.nextSibling)},removeFromDom:function(a){if(a.parentNode){a.parentNode.removeChild(a)}},getUserMedia:function(d){var c,b,a=new Promise(function(f,e){c=f;b=e});d=d||{audio:true,video:true};if(MEPH.util.Dom.usermedia){c(MEPH.util.Dom.usermedia)}else{navigator.getUserMedia=(navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia);if(navigator.getUserMedia){navigator.getUserMedia(d,function(e){MEPH.util.Dom.usermedia=e;c(e)},function(e){b(e)})}else{b(new Error("Browser does not support user media"))}}return a},supportsUserMedia:function(){navigator.getUserMedia=(navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia);return navigator.getUserMedia&&true},isDomDescendant:function(b,c){var a;a=b.compareDocumentPosition(c)&Node.DOCUMENT_POSITION_CONTAINS;return a},getComments:function(c){var a=[],b,d=MEPH.util.Dom;if(Array.isArray(c)){return MEPH.Array(c).concatFluentReverse(function(e){return d.getComments(e)})}if(!c){return a}if(MEPH.util.Dom.isComment(c)){a.push(c)}for(b=0;b<c.childNodes.length;b++){a=a.concat(d.getComments(c.childNodes[b]))}return a},isComment:function(a){var b=MEPH.util.Dom;return a.nodeType===b.commentType},isElement:function(a){var b=MEPH.util.Dom;return a.nodeType===b.elementType},getWindowSize:function(){return{width:window.innerWidth,height:window.innerHeight}},setSize:function(c,b,a){c.style.height=parseFloat(b.height||0)+"px";c.style.width=parseFloat(b.width||0)+"px";if(a){c.height=parseFloat(b.height);c.width=parseFloat(b.width)}},tryParse:function(a){var c=MEPH.util.Dom;if(c.isComment(a)){try{return c.tryParseAttributeJson(a.data)}catch(b){return false}}return false},getCharCode:function(b){var a=(typeof b.which=="number")?b.which:b.keyCode;return a},getEventSource:function(a){return a.target||a.srcElement},getPosition:function(a){var c=0;var b=0;while(a){c+=(a.offsetLeft-a.scrollLeft+a.clientLeft);b+=(a.offsetTop-a.scrollTop+a.clientTop);a=a.offsetParent}return{x:c,y:b}},getRelativeSvgPosition:function(d,e,b){var a=e.getBoundingClientRect();var c=d.getBoundingClientRect();if(b==="center"){var f={x:(c.left+c.right)/2-a.left,y:(c.bottom+c.top)/2-a.top};return f}var f={x:c.left-a.left,y:c.top-a.top};return f},getRelativePosition:function(a,b){var d=0;var c=0;while(a&&a!==b){d+=(a.offsetLeft-a.scrollLeft+a.clientLeft);c+=(a.offsetTop-a.scrollTop+a.clientTop);a=a.offsetParent}return{x:d,y:c}},getEventPositions:function(b,c){var a=[];if(b.changedTouches){var d=MEPH.util.Dom.getPosition(c);for(i=b.changedTouches.length;i--;){touch=b.changedTouches[i];a.push({x:touch.pageX-d.x,y:touch.pageY-d.y,identifier:touch.identifier})}}else{a.push({x:b.offsetX||b.pageX,y:b.offsetY||b.pageY})}return a},getScreenPosition:function(a){var b=a.getBoundingClientRect();return b},createCenteredElement:function(b){var c={top:document.body.clientHeight/2,left:document.body.clientWidth/2};var a=document.createElement(b||"div");Style.position(a,"absolute");Style.zIndex(a,100000);Style.top(a,c.top);Style.left(a,c.left);document.body.appendChild(a);return a},centerElement:function(a){var b=a.getBoundingClientRect();var c={top:document.body.clientHeight/2-(b.height/2),left:document.body.clientWidth/2-(b.width/2)};Style.top(a,c.top);Style.left(a,c.left)},createInputElementOverSvg:function(a,c,b){var d=MEPH.util.Dom.getScreenPosition(a);b=b||document.createElement(c||"input");if(b.classList&&b.classList.add){b.classList.add("dataentry");b.classList.add("form-control")}Style.width(b,d.width);Style.height(b,d.height);Style.position(b,"absolute");Style.zIndex(b,100000);Style.top(b,d.top);Style.left(b,d.left);document.body.appendChild(b);return b},createInputElementOverSvgWithDisplay:function(c){var b=MEPH.util.Dom.createInputElementOverSvg(c);var d=Dom.getScreenPosition(c);var a=MEPH.util.Dom.createInputElementOverSvg(c);Style.left(a,d.left+d.width);Style.width(a,80);return{input:b,value:a}},addOption:function(a,d,b){var c=document.createElement("option");c.text=a;c.value=d;b.add(c)},clearSelect:function(a){while(a.length){a.remove(0)}},createSimpleSelectData:function(f,d,b,e,a){var c=MEPH.util.Dom.createInputElementOverSvg(d,"select");a.unshift("");(a||[]).select(function(g){return g}).foreach(function(g){var h=document.createElement("option");if(typeof g==="object"){h.text=g.title;h.value=g.value}else{h.text=g;h.value=g}c.add(h)});f.don("blur",c,function(g){b(c.value);setTimeout(function(){if(c!==document.activeElement){if(c.parentNode){c.parentNode.removeChild(c)}f.dun(c)}},400)},c)},createSimpleDataEntry:function(g,e,d,a,f){var c=Dom.createInputElementOverSvgWithDisplay(e);var b=c.input;b.type=d||"range";b.classList.add("dataentry");b.max=g.maxvalue||10;b.classList.add("form-control");c.value.classList.add("form-control");b.min=g.minvalue||0;g.don("blur",[c.value,b],function(h){a(b.value);setTimeout(function(){if(b!==document.activeElement&&c.value!==document.activeElement){if(b.parentNode){b.parentNode.removeChild(b)}if(c.value.parentNode){c.value.parentNode.removeChild(c.value)}g.dun(b)}},400)},b);g.don("change",b,function(h){a(b.value);c.value.value=b.value},b);g.don("change",c.value,function(h){a(c.value.value);b.value=c.value.value},b);if(f!==undefined&&f!==null){b.value=f;c.value.value=f}return b},addSimpleDataEntryToElments:function(c,d,b,a){var e=function(f,g){f.foreach(function(h){h.setFunc(h.element.value)});setTimeout(function(){if(g||!MEPH.util.Dom.isDomDescendant(document.activeElement,b)){if(b.parentNode){b.parentNode.removeChild(b)}c.dun(f);if(a){a()}}},40)}.bind(c,d);c.don("blur",d.select(function(f){return f.element}),e,d);d.foreach(function(g){var f=g.element;c.don("change",f,function(h){g.setFunc(f.value)},f)});return e},getScreenEventPositions:function(b,c){var a=[];if(b.changedTouches){var d=c?MEPH.util.Dom.getPosition(c):{x:0,y:0};for(i=b.changedTouches.length;i--;){touch=b.changedTouches[i];a.push({x:touch.pageX-d.x,y:touch.pageY-d.y,identifier:touch.identifier})}}else{a.push({x:b.screenX||b.pageX,y:b.screenY||b.pageY})}return a},tryParseAttributeJson:function(b){try{return JSON.parse("{"+b+"}")}catch(a){return false}}}})});