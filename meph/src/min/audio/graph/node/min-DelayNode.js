MEPH.define("MEPH.audio.graph.node.DelayNode",{extend:"MEPH.audio.graph.node.Node",alias:"delay",templates:true,properties:{delayTimeTitle:"",delayTimevalue:null},initialize:function(){var a=this;a.nodecontrols=a.nodecontrols||[];a.nodecontrols.push("bufferoutput");a.nodecontrols.push("bufferinput");a.nodecontrols.push("delayTime");a.great();a.nodeInputs.push(a.createInput("buffer",MEPH.audio.graph.node.Node.AudioBuffer));a.nodeInputs.push(a.createInput("delayTime",MEPH.audio.graph.node.Node.Number,{path:"delayTime.value"}));a.nodeOutputs.push(a.createOutput("buffer",MEPH.audio.graph.node.Node.AudioBuffer))},onLoaded:function(){var a=this;a.great();a.title="Delay";a.delayTimeTitle="delay"}});