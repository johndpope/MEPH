MEPH.define("MEPH.math.Util",{statics:{cachedPrimes:null,polar:function(a,b){return{radius:Math.sqrt(Math.pow(a,2)+Math.pow(b,2)),theta:Math.atan2(b,a)}},rectangular:function(b,a){return{x:a*Math.cos(b),y:a*Math.sin(b)}},sinc:function(a,b){return[].interpolate(0,b,function(d){var c=Math.sin(b*a[d]/2)/Math.sin(a[d]/2);if(isNaN(c)){return b}return c})},sec:function(a){return 1/Math.cos(a)},csc:function(a){return 1/Math.sin(a)},cot:function(a){return 1/Math.tan(a)},sinh:function(a){return(Math.exp(a)-Math.exp(-a))/2},cosh:function(a){return(Math.exp(a)+Math.exp(-a))/2},tanh:function(a){return(Math.exp(2*a)-1)/(Math.exp(2*a)+1)},sech:function(a){return 1/MEPH.math.Util.cosh(a)},coth:function(a){return 1/MEPH.math.Util.tanh(a)},csch:function(a){return 1/MEPH.math.Util.sinh(a)},factorial:function(b){var a=1;[].interpolate(1,b+1,function(c){a=a*c});return a},primes:function(d){MEPH.math.Util.cachedPrimes=MEPH.math.Util.cachedPrimes||[2,3];var a=MEPH.math.Util.cachedPrimes;var c=MEPH.math.Util.cachedPrimes.last();if(c>=d){return MEPH.math.Util.cachedPrimes.where(function(e){return d>=e})}for(var b=c+2;b<=(d);b=b+2){if(a.all(function(e){return b%e!==0})){a.push(b)}}return a},factor:function(f){var e=MEPH.math.Util,a=[1];var d=e.primes(f);var b=f;while(!d.contains(function(g){return g===b})&&b%1==0){var c=d.first(function(g){return b%g===0});a.push(c);b/=c}a.push(b);return a},getBhLobe:function(a,d){var g=d||512;var c=a.select(function(f){return f*Math.PI*2/g});var e=Math.PI*2/g;var h=[].interpolate(0,a.length,function(){return 0});var b=[0.35875,0.48829,0.14128,0.01168];[].interpolate(0,b.length,function(f){var j=MEPH.math.Util.sinc(c.select(function(k){return k-e*f}),g);var i=MEPH.math.Util.sinc(c.select(function(k){return k+e*f}),g);h=h.select(function(l,k){return l+(b[f]/2)*(j[k]+i[k])})});h=h.select(function(f){return f/g/b[0]});return h},window:{Triangle:function(e,d,b){var a=b+e;var c=1-Math.abs(((d-((b-1)/2))/(a/2)));return c},Triang:function(f,e){var b=true;if(e<1){return[]}if(e===1){return[1]}var d=e%2;if(!b&&!d){e+=1}var c=[].interpolate(1,Math.floor((e+1)/2)+1,function(g){return g});var a;if(e%2===0){a=c.select(function(g){return((g*2)-1)/e});a=a.select().concat(a.select().reverse())}else{a=c.select(function(g){return(2*g)/(e+1)});a=a.select().concat(a.select().reverse())}return a},Rect:function(c,b){var a=Math.abs(c/b);if(a>0.5){return 0}else{if(a===0.5){return 0.5}else{if(a<0.5){return 1}}}},Rectangle:function(b,a){return 1},Welch:function(b,a){return 1-Math.pow(((b-((a-1)/2))/((a+1)/2)),2)},Hann:function(d,c,f,e){return d-(c*Math.cos((2*Math.PI*f)/(e-1)))},Hamming:function(b,a){return MEPH.math.Util.window.Hann(0.54,0.46,b,a)},Blackman:function(e,d){var c=0.42;var b=0.5;var a=0.08;return c-(b*Math.cos((2*Math.PI*e)/(d-1)))+(a*Math.cos((4*Math.PI*e)/(d-1)))},BlackmanHarris:function(f,d){var c=0.35875;var b=0.48829;var a=0.14128;var e=0.01168;return c-(b*Math.cos((2*Math.PI*f)/(d-1)))+(a*Math.cos((4*Math.PI*f)/(d-1)))+(e*Math.cos((6*Math.PI*f)/(d-1)))}}}}).then(function(a){if(!Math.sec){Math.sec=MEPH.math.Util.sec}if(!Math.csc){Math.csc=MEPH.math.Util.csc}if(!Math.cot){Math.cot=MEPH.math.Util.cot}if(!Math.sinh){Math.sinh=MEPH.math.Util.sinh}if(!Math.cosh){Math.cosh=MEPH.math.Util.cosh}if(!Math.sech){Math.sech=MEPH.math.Util.sech}if(!Math.csch){Math.csch=MEPH.math.Util.csch}if(!Math.coth){Math.coth=MEPH.math.Util.coth}if(!Math.tanh){Math.tanh=MEPH.math.Util.tanh}});