MEPH.define("MEPH.audio.graph.node.PannerNode",{extend:"MEPH.audio.graph.node.Node",alias:"panner",templates:true,properties:{coneInnerAngleTitle:"",coneOuterAngleTitle:"",coneOuterGainTitle:"",refDistanceTitle:"",rolloffFactorTitle:"",panningModelTitle:"",distanceModelTypes:null,panningModelvalue:null,rolloffFactorvalue:null,refDistancevalue:null,coneOuterGainvalue:null,coneOuterAnglevalue:null,coneInnerAnglevalue:null},initialize:function(){var a=this;a.nodecontrols=a.nodecontrols||[];a.nodecontrols.push("bufferoutput");a.nodecontrols.push("bufferinput");a.nodecontrols.push("coneInnerAngle");a.nodecontrols.push("coneOuterAngle");a.nodecontrols.push("coneOuterGain");a.nodecontrols.push("refDistance");a.nodecontrols.push("maxDistance");a.nodecontrols.push("rolloffFactor");a.nodecontrols.push("panningModel");a.great();a.nodeInputs.push(a.createInput("buffer",MEPH.audio.graph.node.Node.AudioBuffer));a.nodeInputs.push(a.createInput("coneInnerAngle",MEPH.audio.graph.node.Node.Number));a.nodeInputs.push(a.createInput("coneOuterAngle",MEPH.audio.graph.node.Node.Number));a.nodeInputs.push(a.createInput("coneOuterGain",MEPH.audio.graph.node.Node.Number));a.nodeInputs.push(a.createInput("refDistance",MEPH.audio.graph.node.Node.Number));a.nodeInputs.push(a.createInput("maxDistance",MEPH.audio.graph.node.Node.Number));a.nodeInputs.push(a.createInput("rolloffFactor",MEPH.audio.graph.node.Node.Number));a.nodeInputs.push(a.createInput("panningModel",MEPH.audio.graph.node.Node.String,{values:["equalpower","HRTF"]}));a.distanceModelTypes=["linear","inverse","exponential"];a.nodeInputs.push(a.createInput("distanceModel",MEPH.audio.graph.node.Node.String,{values:a.distanceModelTypes.select()}));a.nodeOutputs.push(a.createOutput("buffer",MEPH.audio.graph.node.Node.AudioBuffer))},onLoaded:function(){var a=this;a.great();a.title="Panner";a.distanceModelTypes=a.distanceModelTypes.select();a.coneInnerAngleTitle="cone inner angle";a.coneOuterAngleTitle="cone outer angle";a.coneOuterGainTitle="cone outer gain";a.refDistanceTitle="ref distance";a.rolloffFactorTitle="rolloff factor";a.panningModelTitle="panning model"}});