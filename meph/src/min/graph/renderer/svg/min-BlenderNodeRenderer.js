MEPH.define("MEPH.graph.renderer.svg.BlenderNodeRenderer",{requires:["MEPH.util.SVG","MEPH.graph.ActiveZone"],properties:{rowHeight:26,colorBoxWidth:30,offsetFromLeft:10,labelFontSize:15,rowTopPadding:0,labelPaddingLeft:10,labelPaddingRight:20,colorBoxRadius:4,selectBoxOffset:-10,connectorOffsetTop:10,colorBoxHeight:20,connectorRadius:4,rowBottomPadding:0,offsetFromTop:34,headerHeight:30,headerWidth:198,titleWidth:85,nodeWidth:200,drawCanvas:true},initialize:function(b){var a=this;MEPH.Events(a);a.$graphviewport=b},renderNode:function(d,b,f){var c=this;var a=d.getPosition();var e=d.getTitle();c.renderer.setCanvas(b);c.draw({x:a.x+f.x,y:a.y+f.y,title:e,node:d,nodeInputs:d.getNodeInputs(),nodeOutputs:d.getNodeOutputs()})},getColorByType:function(a){var c,b=this;c=b.getColor(a.languageType);return c},getColor:function(b){var a=this;switch(b){case"array":return"CornflowerBlue";case"function":return"red";case"context":case"then":case"else":return"green";case"number":case"variable":case"bool":case"string":return"blue";case"operator":return"purple";default:return"yellow"}},requestZone:function(c,a){var b=this;if(!a.customonly){b.$graphviewport.requestZone(c,a)}},colorLabel:function(i,h,c,j){var f=this,a;a=f.getColorByType(c);var b=c.node;var k={text:c.title.substr(0,20),textAlign:c.textAlign,shape:"text",textBaseline:"top",font:f.labelFontSize+"px Verdana",fillStyle:"black",x:i+(j?-(f.colorBoxWidth+f.labelPaddingRight):f.colorBoxWidth+f.labelPaddingLeft),y:h};var g=i+(j?-(f.colorBoxWidth+f.labelPaddingLeft):0);var e=h;if(!(c.node&&c.node.$data&&c.node.$data.customonly)){var d=f.$graphviewport.requestZone(b,{id:c.id+"-title",type:MEPH.graph.ActiveZone.type.title,option:c,x:g+(j?-(f.colorBoxWidth+f.labelPaddingRight):f.colorBoxWidth+f.labelPaddingLeft),height:f.colorBoxHeight,width:f.titleWidth,y:e});f.$graphviewport.requestZone(b,{id:c.id+"-color",type:MEPH.graph.ActiveZone.type.color,option:c,x:g,height:f.colorBoxHeight,width:f.colorBoxWidth,y:e})}return[{x:g,y:e,shape:"rectangle",strokeStyle:null,fillStyle:a,radius:f.colorBoxRadius,height:f.colorBoxHeight,width:f.colorBoxWidth},k]},createOutOptions:function(d,f,b,e){var a=[],c=this;f.foreach(function(j,i){var k;j.node=d;j.textAlign="end";var g=e+c.connectorOffsetTop+(i*(c.rowHeight+c.rowTopPadding));var h=b+c.nodeWidth;a=a.concat(c.colorLabel(c.nodeWidth+b,e+(i*(c.rowHeight+c.rowTopPadding)),j,true));a.push({fillStyle:c.getColorByType(j),strokeStyle:"black",shape:MEPH.util.Renderer.shapes.circle,radius:c.connectorRadius,y:g,x:h});c.$graphviewport.requestZone(d,{id:j.id,option:j,type:MEPH.graph.ActiveZone.type.connector,radius:c.connectorRadius,width:c.connectorRadius*2,height:c.connectorRadius*2,x:h-c.connectorRadius,y:g-c.connectorRadius})});return a},createInOptions:function(d,f,b,e){var a=[],c=this;f.foreach(function(j,i){var k;j.textAlign="start";j.node=d;a=a.concat(c.colorLabel(b,e+(i*(c.rowHeight+c.rowTopPadding)),j));var g=e+c.connectorOffsetTop+(i*(c.rowHeight+c.rowTopPadding));var h=b+(-c.offsetFromLeft);a.push({fillStyle:c.getColorByType(j),strokeStyle:"black",shape:MEPH.util.Renderer.shapes.circle,radius:c.connectorRadius,y:g,x:h});c.$graphviewport.requestZone(d,{id:j.id,option:j,radius:c.connectorRadius,type:MEPH.graph.ActiveZone.type.connector,width:c.connectorRadius*2,height:c.connectorRadius*2,x:h-c.connectorRadius,y:g-c.connectorRadius})});return a},render:function(a){var b=this;if(a){var c=a.where(function(d){return !d[" blendersvgid"]});c.foreach(function(d){b.setBlenderSVGID(d);d.$data.setupActiveZones(b.$graphviewport,d)});a.foreach(function(e){var d=e.getPosition();var f=b.$graphviewport.getPosition();e.$data.sx=d.x+f.x;e.$data.sy=d.y+f.y})}},setBlenderSVGID:function(b){var a=this;b[" blendersvgid"]=MEPH.GUID()},draw:function(k){var e=this,i=e.options(k);var b=k.node;var h={text:k.title,shape:"text",font:"17px Verdana",fillStyle:"black",x:k.x+30||0,y:k.y+13||0};if(!e.rendered){var f=b.$data.customonly?[]:e.createInOptions(b,k.nodeInputs,k.x+e.offsetFromLeft,k.y+e.offsetFromTop+k.nodeOutputs.length*e.rowHeight);var c=b.$data.customonly?[]:e.createOutOptions(b,k.nodeOutputs,k.x,k.y+e.offsetFromTop);var g=k.x+1;var d=k.y+1;var a={shape:"rectangle",fillStyle:null,gradientFillStyle:{x0:k.x,y0:k.y,x1:k.x,y1:k.y+25,colorStops:[{stop:0,color:"#A5A5A5"},{stop:0.4,color:"#A5A5A5"},{stop:0.5,color:"#A5A5A5"},{stop:1,color:"#A5A5A5"}]},x:g||0,y:d||0,strokeStyle:"",lineWidth:0,width:e.headerWidth,height:e.headerHeight,radius:{upperLeft:10,upperRight:10,lowerLeft:0,lowerRight:0}};var j={shape:"rectangle",fillStyle:null,gradientFillStyle:{x0:k.x,y0:k.y,x1:k.x,y1:k.y+25,colorStops:[{stop:0,color:"#00A5A5"},{stop:0.4,color:"#A5A500"},{stop:0.5,color:"#A5A5A5"},{stop:1,color:"#A500A5"}]},x:(g+e.headerWidth+e.selectBoxOffset)||0,y:d||0,strokeStyle:"",lineWidth:0,width:e.selectBoxWidth||10,height:e.selectBoxHeight||10,radius:{upperLeft:2,upperRight:10,lowerLeft:0,lowerRight:2}};if(b.getId()&&!b.$data.customonly){e.$graphviewport.requestZone(b,{id:b.getId()+"-header",type:MEPH.graph.ActiveZone.type.header,radius:e.connectorRadius,width:e.headerWidth,height:e.headerHeight,x:g,y:d});e.$graphviewport.requestZone(b,{id:b.getId()+"-selectBox",type:MEPH.graph.ActiveZone.type.select,radius:e.connectorRadius,width:e.selectBoxWidth||10,height:e.selectBoxHeight||10,x:(g+e.headerWidth+e.selectBoxOffset)||0,y:d||0})}if(k.node.$data&&k.node.$data.template){e.$graphviewport.requestZone(b,{id:b.getId()+"-template",type:MEPH.graph.ActiveZone.type.custom,template:k.node.$data.template,x:g,y:d})}a=e.options(a,k)}if(e.drawCanvas){e.renderer.draw([i,a,j,h].concat(f).concat(c))}return true},options:function(b,a){var d=this;a=a||{shape:"rectangle",fillStyle:"#727272",x:8,y:8,strokeStyle:"#F15800",lineWidth:1,width:d.nodeWidth,height:d.offsetFromTop+(b.nodeInputs.length+b.nodeOutputs.length)*d.rowHeight,radius:10};for(var c in b){a[c]=b[c]}return a}});