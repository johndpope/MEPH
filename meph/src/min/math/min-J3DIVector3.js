MEPH.define("MEPH.math.J3DIVector3",{alternateNames:"J3DIVector3",initialize:function(a,c,b){this.load(a,c,b)},load:function(a,c,b){if(typeof a=="object"&&"length" in a){this[0]=a[0];this[1]=a[1];this[2]=a[2]}else{if(typeof a=="number"){this[0]=a;this[1]=c;this[2]=b}else{this[0]=0;this[1]=0;this[2]=0}}},getAsArray:function(){return[this[0],this[1],this[2]]},getAsFloat32Array:function(){return new Float32Array(this.getAsArray())},vectorLength:function(){return Math.sqrt(this[0]*this[0]+this[1]*this[1]+this[2]*this[2])},divide:function(a){this[0]/=a;this[1]/=a;this[2]/=a},cross:function(a){this[0]=this[1]*a[2]-this[2]*a[1];this[1]=-this[0]*a[2]+this[2]*a[0];this[2]=this[0]*a[1]-this[1]*a[0]},dot:function(a){return this[0]*a[0]+this[1]*a[1]+this[2]*a[2]},combine:function(a,c,b){this[0]=(c*this[0])+(b*a[0]);this[1]=(c*this[1])+(b*a[1]);this[2]=(c*this[2])+(b*a[2])},multVecMatrix:function(c){var a=this[0];var e=this[1];var d=this[2];this[0]=c.$matrix.m41+a*c.$matrix.m11+e*c.$matrix.m21+d*c.$matrix.m31;this[1]=c.$matrix.m42+a*c.$matrix.m12+e*c.$matrix.m22+d*c.$matrix.m32;this[2]=c.$matrix.m43+a*c.$matrix.m13+e*c.$matrix.m23+d*c.$matrix.m33;var b=c.$matrix.m44+a*c.$matrix.m14+e*c.$matrix.m24+d*c.$matrix.m34;if(b!=1&&b!=0){this[0]/=b;this[1]/=b;this[2]/=b}},toString:function(){return"["+this[0]+","+this[1]+","+this[2]+"]"}});