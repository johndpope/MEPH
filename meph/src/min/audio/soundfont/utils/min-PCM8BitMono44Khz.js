MEPH.define("MEPH.audio.soundfont.utils.PCM8BitMono44Khz",{requires:["MEPH.audio.soundfont.NoteSample"],extend:"MEPH.audio.soundfont.utils.PCMStrategy",statics:{},properties:{_signed:false},initialize:function(a,b){b=b||null;this.callParent(b,44100,1,8);this._signed=a||false},readFrameInSignal:function(d,b,c,a){d.position=b+a;c.l=c.r=d.readByte()/127},read32BitStereo44KHz:function(f,a,g,e,d){f.position=a+d;var c;var b;if(this._signed){for(b=0;b<e;++b){c=f.readByte()/127;g.writeFloat(c);g.writeFloat(c)}}else{for(b=0;b<e;++b){c=(f.readUnsignedByte()-127)/127;g.writeFloat(c);g.writeFloat(c)}}},write32BitStereo44KHz:function(d,e,a){var c;var b;if(this._signed){for(b=0;b<a;++b){c=(d.readFloat()+d.readFloat())*0.5;if(c>1){e.writeByte(127)}else{if(c<-1){e.writeByte(-127)}else{e.writeByte(c*127)}}}}else{for(b=0;b<a;++b){c=(d.readFloat()+d.readFloat())*0.5;if(c>1){e.writeByte(255)}else{if(c<-1){e.writeByte(0)}else{e.writeByte(c*127+127)}}}}}});