MEPH.define("MEPH.audio.soundfont.SFObject",{requires:[],statics:{NON_SERIALIZABLE_TYPES:["ByteArray","SFByteArray"],errorReportingMethod:"error"},properties:{nonSerializedProperties:null,type:undefined,propertyNames:undefined},initialize:function(a){this.type=a;this.nonSerializedProperties=["type","nonSerializedProperties"];this.propertyNames=[]},getPropertyNames:function(){return this.propertyNames},toString:function(){return JSON.stringify(this)},toXML:function(){return this.toString()},includePropertyInSerialization:function(a){return this[a]!=null},getPropertyNames:function(c){var e=describeType(this);var b=e.variable;if(c){b.concat(classInfoaccessor.where(function(f){return(f.access!="writeonly")}))}var a=[];for(var d in b){}return a},raiseError:function(a){switch(SFObject.errorReportingMethod){case"trace":console(a);break;case"error":throw new Error(a);break}}});