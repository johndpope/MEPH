MEPH.define("MEPH.file.Dropbox",{alias:"dropbox",templates:true,extend:"MEPH.control.Control",requires:[],properties:{hoverCls:"",dragovercssclass:"hover",cls:"",baseCls:"dropbox",dragoutcssclass:"",files:null},initialize:function(){var a=this;a.callParent.apply(a,arguments);a.addTransferables();a.defineDependentProperties()},fileDrop:function(){var a=arguments;var b=MEPH.util.Array.convert(a).last();var c=this;c.getDomTemplate().first().dispatchEvent(MEPH.createEvent("filesdropped",{files:b.domEvent.dataTransfer.files}))},addTransferables:function(){var b=this,a=MEPH.Array(["componentCls","files"]);a.foreach(function(c){b.addTransferableAttribute(c,{object:b,path:c})})},defineDependentProperties:function(){var a=this;a.combineClsIntoDepenendProperty("dropboxCls",["componentCls","hoverCls","cls","baseCls"])}});