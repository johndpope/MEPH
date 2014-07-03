# Mixed up with Mixins

A guide about mixins.


## What's a mixin
If you don't know what a mixin, [check here](http://en.wikipedia.org/wiki/Mixin).


## Mixins

In U4M, a mixin can be set two different ways, either has an array of string references to the mixin source, or as a literal object.

			...
			 mixins: {
				observable: 'U4M.mixins.Observable',
				referrerable: 'U4M.mixins.Referrerable'
			},
			...

			or

			mixins: ['U4M.mixins.Observable', 'U4M.mixins.Referrerable']

When using the first style, mixins are added to the instance object as properties of the instance. 

__For example:__

			...
			initialize: function(){
				var me= this;
				me.mixins.observable.init.apply(me, arguments);
				me.mixins.referrerable.init.apply(me, arguments);
			}

When the second style, an array, is used to describe the set of mixins, the functions of the mixin are applied to the instance of the class.