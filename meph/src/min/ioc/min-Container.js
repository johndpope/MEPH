MEPH.define("MEPH.ioc.Container",{alternateNames:"MEPH.IOC",statics:{serviceDefinitions:[],register:function(a){MEPH.Array(MEPH.IOC.serviceDefinitions);return Promise.resolve().then(function(){return MEPH.IOC.hasService(a.name)}).then(function(b){changed=b;MEPH.IOC.serviceDefinitions.removeWhere(function(c){return c.name===a.name})}).then(function(){MEPH.IOC.serviceDefinitions.push(a)}).then(function(){if(changed){MEPH.publish(MEPH.Constants.serviceTypeChanged,a.name,a.type)}})},clearServices:function(){MEPH.IOC.serviceDefinitions.removeWhere(function(a){return true})},unregister:function(a){MEPH.IOC.serviceDefinitions.removeWhere(function(b){return b.name===a;s})},getServices:function(){return MEPH.Array(MEPH.IOC.serviceDefinitions)},hasService:function(a){MEPH.Array(MEPH.IOC.serviceDefinitions);return MEPH.IOC.serviceDefinitions.some(function(b){return b.name===a})}}});