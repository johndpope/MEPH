MEPH.define("MEPH.audio.soundfont.chunks.data.operators.DecayModulationEnvelope",{requires:["MEPH.audio.soundfont.chunks.data.GeneratorsSubchunk"],extend:"MEPH.audio.soundfont.chunks.data.operators.ValueOperator",statics:{},initialize:function(a){if(a==undefined||a==null){a=-12000}this.callParent(Operator.DECAY_MOD_ENV,a)}});