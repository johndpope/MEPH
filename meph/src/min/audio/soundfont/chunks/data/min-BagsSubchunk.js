MEPH.define("MEPH.audio.soundfont.chunks.data.BagsSubchunk",{requires:["MEPH.audio.soundfont.utils.SFByteArray","MEPH.audio.soundfont.chunks.data.BagRecord"],extend:"MEPH.audio.soundfont.chunks.Subchunk",statics:{RECORD_SIZE:4},initialize:function(a,b){this.callParent("Bags",a,b,BagsSubchunk.RECORD_SIZE)},getBag:function(a){return this.getRecord(a)},getBags:function(){return this.records},createRecord:function(b){var a=new BagRecord();a.generatorIndex=b.readWord();a.modulatorIndex=b.readWord();return a}});