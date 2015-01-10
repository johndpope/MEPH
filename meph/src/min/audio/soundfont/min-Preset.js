MEPH.define("MEPH.audio.soundfont.Preset",{requires:["MEPH.audio.soundfont.chunks.data.PresetRecord","MEPH.audio.soundfont.chunks.data.GeneratorRecord","MEPH.audio.soundfont.PresetZone","MEPH.audio.soundfont.chunks.data.operators.Operator","MEPH.audio.soundfont.chunks.data.InstrumentsSubchunk","MEPH.audio.soundfont.chunks.data.GeneratorsSubchunk","MEPH.audio.soundfont.chunks.data.operators.RangeOperator"],extend:"MEPH.audio.soundfont.ZoneContainer",statics:{},initialize:function(a){this.callParent("Preset",a,PresetZone)},getBank:function(){return(this.record).bank},getPresetID:function(){return(this.record).preset},getInstrumentZone:function(b,c){var a=this.getPresetZone(b,c);return a.getInstrumentZone(b,c)},getPresetZone:function(a,b){return this.getZone(a,b)},toXML:function(){return"preset override"},buildZone:function(d,b){var a=this.callParent(d,b);var c=d.getInstrumentID();if(c==-1){this._globalZone=a}else{a.instrument=b[c];this._zones.push(a)}return a}});