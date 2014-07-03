# Class System

A guide about the MEPH class system.

 
## What's in a class

The following is an example of a basic class in MEPH. It describes a class called __Class__. __Class__ is located in the __./control/Class.js__ file. 
 
			MEPH.define('System.control.Class', {
				extend : 'System.control.base.Control'
				requires: ['System.util.Requirement'],
				properties : {
					/**
					 * @property {Object} a property
					 */
					property: null,
					$anotherproperty: null
				},
				mixins: [...] / { ... },
				initialize: function(){
					//called in the constructor.
				}
			});
-  System.control.Class: what is this?
			
	The __System__ part of the fully qualified class name is used to describe its relative location, and should match the path set in the Application setup.

			...
			var SystemPath = '/system';
			u4mFrameWork('MEPH', path);
			MEPH.ready().then(function () {
			...
				MEPH.setPath(SystemPath, 'System');
			...

After System comes the __control__ which describes the relative path from the System to the Class.js file.

-  __extend: 'System.control.base.Control'__

	In this case, the System.control.Class extends from a base class called System.control.base.Control.

			MEPH.define('System.control.Class', {
				extend : 'System.control.base.Control'
				...

-  __requires: ['System.util.Requirement']__

	Requires defines the classes which this control relies.

-  __properties : { ... __

	Is the set of properties which will be applied to the instances of the System.control.Class. __Special note__, properties which start with a __$__ will not be considered observable when the MEPH.util.Observable mixin is applied.

-  __mixins: {...}/[...]__

If you don't know what a mixin is [an explanation can be found here](#!/guide/mixins).

			 mixins: {
				observable: 'MEPH.mixins.Observable',
				referrerable: 'MEPH.mixins.Referrerable'
			 },

