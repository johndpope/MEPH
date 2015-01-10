MEPH.define("MEPH.math.Vector",{alternateNames:"$Vector",requires:["MEPH.math.J3DIVector3"],statics:{Id:0,ZeroLength:Math.pow(1,-15),Create:function(a){if(a instanceof J3DIVector3){return new MEPH.math.Vector(a[0],a[1],a[2])}else{if(Array.isArray(a)){return new MEPH.math.Vector(a)}}return new MEPH.math.Vector(a.x,a.y,a.z)},ZeroVector:function(a){return new MEPH.math.Vector([].interpolate(0,a||4,function(){return 0}))},Slope:function(c,a){var b=a.subtract(c);return b.y/b.x},Line:function(c,b){var a=MEPH.math.Vector.Slope(c,b);return{p1:new MEPH.math.Vector(0,0),p2:new MEPH.math.Vector(1,a)}},lerp:function(b,c,a){return b+(c-b)*a},Lerp:function(c,b,a){return MEPH.math.Vector.Lerp2D(c,b,a)},Lerp2D:function(d,b,a){if(d.dimensions()===b.dimensions()){var c=new MEPH.math.Vector(d.vector.select(function(e,f){return MEPH.math.Vector.lerp(d.getIndex(f),b.getIndex(f),a)}));return c}throw new Error("Vectors must have the same dimensions")},Lerp3D:function(c,b,a){return Vector.Lerp2D(c,b,a)}},properties:{vector:null,$shortcuts:null,$defaultValue:0},initialize:function(a,e,d,b){if(b){this._id=Vector.Id++}var c=this;if(Array.isArray(a)){c.vector=a.select(function(f){return f})}else{if(arguments.length>0){c.vector=[a,e,d]}else{c.vector=[]}}c.defineVectorShortcuts()},defineVectorShortcuts:function(){var a=this;a.$shortcuts="xyzwefglmnopqrstuv";var b="abcd";a.$shortcuts.split("").foreach(function(d,c){if(a[d]===undefined){Object.defineProperty(a,d,{get:function(f,e){return a.vector[e]||a.$defaultValue}.bind(a,d,c),set:function(g,e,f){a.vector[e]=f}.bind(a,d,c)})}});b.split("").foreach(function(d,c){if(a[d]===undefined){Object.defineProperty(a,d,{get:function(f,e){return a.vector[e]||a.$defaultValue}.bind(a,d,c),set:function(g,e,f){a.vector[e]=f}.bind(a,d,c)})}})},ToDebug:function(){return"x : "+this._x+"y : "+this._y+"z : "+this._z},equals:function(a){return a.dimensions()===this.dimensions()&&this.vector.all(function(b,c){return b===a.getIndex(c)})},firstNonZeroIndex:function(){var a=this;return a.vector.indexWhere(function(b){return b}).first()},getIndex:function(a){var b=this;return b.vector[a]||0},equals3d:function(a){return this.equals(a)},get_id:function(){return this._id},copy:function(){return new MEPH.math.Vector(this.vector)},length:function(){return Math.sqrt(this.dot(this))},distance:function(b){var a=this.subtract(b);return a.length()},dot:function(a){return this.vector.sum(function(b,c){return b*a.getIndex(c)})},cross:function(d){var c=this,e=c.dimensions();if(d.dimensions()===e){var b=e;if(e===2){return new MEPH.math.Vector([this.getIndex(0)*d.getIndex(1)-this.getIndex(1)*d.getIndex(0)])}var a=[].interpolate(0,e,function(g){var j=c.getIndex((g+1)%e);b=(b-1);if(b<0){b=b+e}var k=d.getIndex(b);b=(b-1);if(b<0){b=b+e}var h=c.getIndex((g+2)%e);var l=d.getIndex(b);var f=(j*k)-(h*l);return f});return new MEPH.math.Vector(a)}else{throw new Error("MEPH.math.Vector: cross product requires same dimensions")}},unit:function(){return this.divide(this.length())},getVectorOfLength:function(a){return this.divide(this.length()/a)},unitEquals:function(){this.divideEquals(this.length());return this},add:function(a){return new MEPH.math.Vector(this.vector.select(function(b,c){return b+a.getIndex(c)}))},isZero:function(){var a=this;return a.length()<Vector.ZeroLength},subtract:function(a){return new MEPH.math.Vector(this.vector.select(function(b,c){return b-a.getIndex(c)}))},dimensions:function(){var a=this;return a.vector.length},mapdivide:function(a){return new MEPH.math.Vector(this._x/a._x,this._y/a._y)},mapmultiply:function(a){return new MEPH.math.Vector(this._x*a._x,this._y*a._y)},square:function(){return this._x*this._x+this._y*this._y},multiply:function(a){var b=this;return new MEPH.math.Vector([].interpolate(0,this.dimensions(),function(c){return b.getIndex(c)*a}))},multiplyEquals:function(a){this._x*=a;this._y*=a;return this},divide:function(a){var b=this;if(a==0){return new MEPH.math.Vector([].interpolate(0,this.dimensions(),function(c){return 0}))}return new MEPH.math.Vector([].interpolate(0,this.dimensions(),function(c){return b.getIndex(c)/a}))},divideEquals:function(a){this._x/=a;this._y/=a;return this},perp:function(){return new MEPH.math.Vector(-this._y,this._x)},perpendicular:function(a){return this.subtract(this.project(a))},project:function(b){var a=this.dot(b)/b.dot(b);return b.multiply(a)},reject:function(b){var a=this.project(b);return this.subtract(a)},toString:function(){return this._x+","+this._y},fromPoints:function(b,a){return new MEPH.math.Vector2D(a.x-b.x,a.y-b.y)},angleBetween:function(a){return Math.acos(this.dot(a)/(this.length()*a.length()))},rotate:function(e){var b=Math.cos(e);var a=Math.sin(e);var d=this.x*b-this.y*a;var c=this.x*a+this.y*b;return new MEPH.math.Vector(d,c)},random:function(){return new MEPH.math.Vector(2*(Math.random()-0.5),2*(Math.random()-0.5))}}).then(function(){$v2=MEPH.math.Vector;MEPH.math.Vector.Zero=new MEPH.math.Vector(0,0,0)});