MEPH.define("MEPH.util.Style",{alternateNames:"Style",statics:{translate:function(b,a,c){if(b.style.webkitTransform.toString()!=="translate("+(a)+"px, "+(c)+"px)"){b.style.webkitTransform="translate("+(a)+"px,"+(c)+"px)";b.style.transform="translate("+(a)+"px,"+(c)+"px)"}},setPosition:function(b,a,c){Style.left(b,a);Style.top(b,c)},height:function(b,a){b.style.height=parseFloat(a)+"px";b.height=parseFloat(a)},hide:function(a){if(a.style){a.style.display="none"}},show:function(a){if(a.style){a.style.display=""}},clear:function(a,b){a.style.removeProperty(b);a[b]=""},width:function(b,a){b.style.width=parseFloat(a)+"px";b.width=parseFloat(a)},top:function(b,a){b.style.top=parseFloat(a)+"px"},left:function(b,a){b.style.left=parseFloat(a)+"px"},right:function(b,a){b.style.right=parseFloat(a)+"px"},getOffset:function(b,c){var a=function(f){var d={x:f.offsetLeft,y:f.offsetTop};if(f.offsetParent){var e=a(f.offsetParent);d.x+=e.x;d.y+=e.y}return d};return a(b)},backgroundColor:function(b,a){b.style.backgroundColor=a},absolute:function(a){Style.position(a,"absolute")},position:function(b,a){b.style.position=a},zIndex:function(a,b){a.style.zIndex=b},cursor:function(b,a){b.style.cursor=a},windowSize:function(){var b=window,h=document,f=h.documentElement,c=h.getElementsByTagName("body")[0],a=b.innerWidth||f.clientWidth||c.clientWidth,i=b.innerHeight||f.clientHeight||c.clientHeight;return{width:a,height:i}},size:function(a){return{width:a.clientWidth,height:a.clientHeight}},circleCurve:function(g,e,f,d){var c=(Math.pow(g,2)-Math.pow((e-f),2));return Math.sqrt(Math.abs(c))+d},animate:function(b){var d=false,c=b.i;if(!b.pausing){for(var e in b.animProperties){for(var a in b.animProperties[e]){var f=b.animProperties[e][a];if(!Array.isArray(f)){f=[f]}f.foreach(function(h){if(c<h.frameEnd&&c>=h.frameStart){if(h.step){b.dom[e][a]=((c-h.frameStart)*h.step)+(h.postFix||"")}else{var g=(c-h.frameStart)/(h.frameEnd-h.frameStart);b.dom[e][a]=pgx.Vector.Lerp(h.start,h.stop,g)+(h.postFix||"")}}else{if(f.length===1){b.dom[e][a]=pgx.Vector.Lerp(h.start,h.stop,0)+(h.postFix||"")}}})}}if(b.direction){c=(c+1)%b.count}else{c=(c-1);if(c<0){c=b.count-1}}b.i=c;done=b.callback(c,b)}b.pausing=(b.pausing+1)%b.pause;if(!done){requestAnimationFrame(Style.animate.bind(null,b))}}}});