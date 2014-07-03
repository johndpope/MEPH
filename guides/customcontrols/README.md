# Custom Control

A guide about custom controls, which are the meat and potatoes of MEPH.



## Why should I care

Well, most developers would agree that modularization is key in the development of enterprise level software. Also, because everything in a MEPH application is a custom control, even the views are controls.


## My first control

This will be a unrealistically simple control just for a clear explanation of basic features available when creating a custom control. When we are finished we want the following to be able to write the following :

			<pageheader title="Page Title"  subtitle="Sub title" description="A description"></pageheader>

That will output this when rendered to the page :

			<h1>Page Title</h1>
			<h2>Sub title</h2>
			<h3>A description</h3>

Before continuing, a question that could be asked is why creating a custom control like this a good idea. Specifically, if a large application had the same pageheader at the top of every page, and it was decided that the description section should be an __h4__ instead of an __h3__. Then a developer would not have to go to every page to change the code, but only edit a single location to change all the locations with little to no diffifculty.

Ok, lets do this.

-  __Step 1__: Create the PageHeader.js and PageHeader.html files.

-  __Step 2__:  Define the PageHeader class.(PageHeader.js)

			MEPH.define('MEPH.pageheader.PageHeader', {
				alias: 'pageheader',
				templates: true,
				extends: 'MEPH.control.Control',
				properties : {
					title: '',
					subtitle: '',
					description: ''
				},
				intialize: function(){
					var me = this;
					me.addAutoBindProperty(['title','subtitle','description']);
					me.addTransferables(['title', 'subtitle', 'description']);
					me.callParent.apply(me, arguments);
				}
			});
-  __Step 3__: Define the PageHeader Template (PageHeader.html)

			<h1 data-bind='"innerHTML" : "c$.title"'></h1>
			<h2 data-bind='"innerHTML" : "c$.subtitle"'></h2>
			<h3 data-bind='"innerHTML" : "c$.description"'></h3>

That's it. 

### Details

You may have notice a few properties of the class configuration that haven't been explain, don't worry its about to happen.

				MEPH.define('MEPH.pageheader.PageHeader', {
					alias: 'pageheader',
					templates: true,
					...

-  __alias__ 

Alias tells MEPH that when it see a html object with the node name __pageheader__, that it is referencing the MEPH.pageheader.PageHeader. This also means that the alias must be unique throughout the system.

If alias was __candycrushercontrol__ , then 
		
				<candycrushercontrol></candycrushercontrol>

would be handled by MEPH, and would output whatever the template says.

-  __templates__

In the example __templates__ equals __true__, this is a convention of MEPH. That when the templates is set to true, the template is assumed to be located in a file in the same directory as the class with a __.html__ extension instead of the __.js__ extention. The templates property can be set in multiple ways like :

The most common and easiest.

				...
				templates: true
				...

This is the equivalent of the previous convention.

				...
				templates: 'MEPH.pageheader.PageHeader'
				...

or

				...
				templates : ['MEPH.pageheader.PageHeader']
				...

or

				...
				templates : ['MEPH.pageheader.PageHeader', 'MEPH.pageheader.ExtraPart']
				...

The last example shows a way of setting the template, and additional resources which can be utilized by the control.


In our example control we have attributes set on the pageheader node. The attributes set here are not automatically set to the properties of the control instance. It is required to add them to the list of transferable attributes.

				...
				me.addTransferables(['title', 'subtitle', 'description']);
				...

This will cause the properties title, subtitle and description to pass the attribute values set on the pageheader node to be set to the instance of the obbject.

__What if those values need to be bound a controller or model?__

That's what this does.

				...
				me.addAutoBindProperty(['title','subtitle','description']);
				...

If those properties should bind their values to a referrable instance then the __addAutoBindProperty__ function will do that.

That's all folks.