MEPH.define("MEPH.math.FFT",{alternateNames:"FFT",requires:[],statics:{},butterfly2:function(f,g,u,w,c,p){var k=c.twiddle;for(var q=0;q<p;q++){var n=f[2*((g)+(u)*(q))],r=f[2*((g)+(u)*(q))+1];var a=f[2*((g)+(u)*(q+p))],e=f[2*((g)+(u)*(q+p))+1];var d=k[2*((0)+(w)*(q))],j=k[2*((0)+(w)*(q))+1];var l=a*d-e*j,s=a*j+e*d;var h=n+l,o=r+s;var v=n-l,b=r-s;f[2*((g)+(u)*(q))]=h,f[2*((g)+(u)*(q))+1]=o;f[2*((g)+(u)*(q+p))]=v,f[2*((g)+(u)*(q+p))+1]=b}},butterfly3:function(w,q,f,k,Q,H){var E=Q.twiddle;var N=H,M=2*H;var L=k,I=2*k;var P=E[2*((0)+(k)*(H))+1];for(var J=0;J<H;J++){var u=w[2*((q)+(f)*(J))],x=w[2*((q)+(f)*(J))+1];var o=w[2*((q)+(f)*(J+N))],r=w[2*((q)+(f)*(J+N))+1];var D=E[2*((0)+(L)*(J))],G=E[2*((0)+(L)*(J))+1];var z=o*D-r*G,B=o*G+r*D;var h=w[2*((q)+(f)*(J+M))],l=w[2*((q)+(f)*(J+M))+1];var A=E[2*((0)+(I)*(J))],C=E[2*((0)+(I)*(J))+1];var v=h*A-l*C,y=h*C+l*A;var p=z+v,s=B+y;var b=u+p,d=x+s;w[2*((q)+(f)*(J))]=b,w[2*((q)+(f)*(J))+1]=d;var j=u-p*0.5;var n=x-s*0.5;var c=(z-v)*P;var g=(B-y)*P;var O=j-g;var a=n+c;w[2*((q)+(f)*(J+N))]=O,w[2*((q)+(f)*(J+N))+1]=a;var F=j+g;var K=n-c;w[2*((q)+(f)*(J+M))]=F,w[2*((q)+(f)*(J+M))+1]=K}},butterfly4:function(A,u,g,n,aa,P){var L=aa.twiddle;var X=P,W=2*P,T=3*P;var V=n,R=2*n,Q=3*n;for(var S=0;S<P;S++){var y=A[2*((u)+(g)*(S))],C=A[2*((u)+(g)*(S))+1];var r=A[2*((u)+(g)*(S+X))],w=A[2*((u)+(g)*(S+X))+1];var K=L[2*((0)+(V)*(S))],O=L[2*((0)+(V)*(S))+1];var E=r*K-w*O,H=r*O+w*K;var k=A[2*((u)+(g)*(S+W))],o=A[2*((u)+(g)*(S+W))+1];var G=L[2*((0)+(R)*(S))],J=L[2*((0)+(R)*(S))+1];var z=k*G-o*J,D=k*J+o*G;var d=A[2*((u)+(g)*(S+T))],h=A[2*((u)+(g)*(S+T))+1];var B=L[2*((0)+(Q)*(S))],F=L[2*((0)+(Q)*(S))+1];var q=d*B-h*F,v=d*F+h*B;var s=y+z,x=C+D;var l=y-z,p=C-D;var e=E+q,j=H+v;var Z=E-q,c=H-v;var b=s+e,f=x+j;if(aa.inverse){var Y=l-c;var a=p+Z}else{var Y=l+c;var a=p-Z}var N=s-e,U=x-j;if(aa.inverse){var I=l+c;var M=p-Z}else{var I=l-c;var M=p+Z}A[2*((u)+(g)*(S))]=b,A[2*((u)+(g)*(S))+1]=f;A[2*((u)+(g)*(S+X))]=Y,A[2*((u)+(g)*(S+X))+1]=a;A[2*((u)+(g)*(S+W))]=N,A[2*((u)+(g)*(S+W))+1]=U;A[2*((u)+(g)*(S+T))]=I,A[2*((u)+(g)*(S+T))+1]=M}},butterfly:function(f,h,G,H,b,B,x){var o=b.twiddle,A=b.n,z=new Float64Array(2*x);for(var l=0;l<B;l++){for(var g=0,D=l;g<x;g++,D+=B){var e=f[2*((h)+(G)*(D))],r=f[2*((h)+(G)*(D))+1];z[2*(g)]=e,z[2*(g)+1]=r}for(var g=0,D=l;g<x;g++,D+=B){var C=0;var e=z[2*(0)],r=z[2*(0)+1];f[2*((h)+(G)*(D))]=e,f[2*((h)+(G)*(D))+1]=r;for(var w=1;w<x;w++){C=(C+H*D)%A;var v=f[2*((h)+(G)*(D))],F=f[2*((h)+(G)*(D))+1];var a=z[2*(w)],d=z[2*(w)+1];var c=o[2*(C)],j=o[2*(C)+1];var s=a*c-d*j,E=a*j+d*c;var i=v+s,y=F+E;f[2*((h)+(G)*(D))]=i,f[2*((h)+(G)*(D))+1]=y}}}},work:function(e,d,r,l,s,n,h,q,a){var c=q.shift();var g=q.shift();var o=this;if(g==1){for(var j=0;j<c*g;j++){var b=l[2*((s)+(n*h)*(j))],k=l[2*((s)+(n*h)*(j))+1];e[2*((d)+(r)*(j))]=b,e[2*((d)+(r)*(j))+1]=k}}else{for(var j=0;j<c;j++){o.work(e,d+r*j*g,r,l,s+j*n*h,n*c,h,q.slice(),a)}}switch(c){case 2:o.butterfly2(e,d,r,n,a,g);break;case 3:o.butterfly3(e,d,r,n,a,g);break;case 4:o.butterfly4(e,d,r,n,a,g);break;default:o.butterfly(e,d,r,n,a,g,c);break}},complex:function(d,e){if(arguments.length<2){throw new RangeError("You didn't pass enough arguments, passed `"+arguments.length+"'")}var d=~~d,e=!!e;if(d<1){throw new RangeError("n is outside range, should be positive integer, was `"+d+"'")}var a={n:d,inverse:e,factors:[],twiddle:new Float64Array(2*d),scratch:new Float64Array(2*d)};var j=a.twiddle,c=2*Math.PI/d;for(var f=0;f<d;f++){if(e){var g=c*f}else{var g=-c*f}j[2*(f)]=Math.cos(g);j[2*(f)+1]=Math.sin(g)}var b=4,h=Math.floor(Math.sqrt(d));while(d>1){while(d%b){switch(b){case 4:b=2;break;case 2:b=3;break;default:b+=2;break}if(b>h){b=d}}d/=b;a.factors.push(b);a.factors.push(d)}this.state=a},simple:function(b,a,c){this.process(b,0,1,a,0,1,c)},process:function(c,b,l,k,g,d,m){var l=~~l,d=~~d;var j=this;var h=m=="real"?m:"complex";if(l<1){throw new RangeError("outputStride is outside range, should be positive integer, was `"+l+"'")}if(d<1){throw new RangeError("inputStride is outside range, should be positive integer, was `"+d+"'")}if(h=="real"){for(var e=0;e<this.state.n;e++){var a=k[g+d*e];var f=0;this.state.scratch[2*(e)]=a,this.state.scratch[2*(e)+1]=f}j.work(c,b,l,this.state.scratch,0,1,1,this.state.factors.slice(),this.state)}else{if(k==c){j.work(this.state.scratch,0,1,k,g,1,d,this.state.factors.slice(),this.state);for(var e=0;e<this.state.n;e++){var a=this.state.scratch[2*(e)],f=this.state.scratch[2*(e)+1];c[2*((b)+(l)*(e))]=a,c[2*((b)+(l)*(e))+1]=f}}else{j.work(c,b,l,k,g,1,d,this.state.factors.slice(),this.state)}}}});