# Extending Controls

A guide about extending custom controls.


## An Example

As a developer, you have received a request for new functionality, and you have decided to extend the __PageHeader__ control in order to complete the request. Specifically there was a request for the __PageHeader__ control to have information about the author added before the description, the date added before the subtitle, and version information added before the title.

Here is the implementation of the PageHeader control that will be used for this example.

MEPH.pageheader.PageHeader

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

MEPH.pageheader.PageHeader template

			<!-- "name":"beforetitle" -->
			<h1 data-bind='"innerHTML" : "c$.title"'></h1>
			<!-- "name":"beforesubtitle" -->
			<h2 data-bind='"innerHTML" : "c$.subtitle"'></h2>
			<!-- "name":"beforedescription" -->
			<h3 data-bind='"innerHTML" : "c$.description"'></h3>
			<!-- "name":"afterdescription" -->

This is how we would extend the PageHeader class to include this new functionality.


MEPH.pageheader.PageHeaderExtended

			MEPH.define('MEPH.pageheader.PageHeaderExtended', {
				alias:'pageheader_extended',
				templates: true,
				extends : 'MEPH.pageheader.PageHeader',
				properties : {
					author: null,
					date: null,
					version: null
				},
				initialize: function() {
					var me = this;
					me.addAutoBindProperty(['author','date','version']);
					me.addTransferables(['author','date','version']);
					me.callParent.apply(me, arguments);
				}
			});


MEPH.pageheader.PageHeaderExtended template

			<!-- "instruction": true, "name" : "author", "operation" : "inject" , "position" : "beforedescription", "before" : false -->
			<h2 data-bind='"innerHTML" : "c$.author"'></h2>
			<!-- "instruction": true, "name" : "author", "close": true -->

			<!-- "instruction": true, "name" : "date", "operation" : "inject" , "position" : "beforesubtitle", "before" : false -->
			<h2 data-bind='"innerHTML" : "c$.date"'></h2>
			<!-- "instruction": true, "name" : "date", "close": true -->

			<!-- "instruction": true, "name" : "version", "operation" : "inject" , "position" : "beforetitle", "before" : false -->
			<h2 data-bind='"innerHTML" : "c$.version"'></h2>
			<!-- "instruction": true, "name" : "version", "close": true -->


You may be thinking that that's, a lot of code. Don't worry will be break down the new bits into something easy to understand and replicate.


In the PageHeader template there are four html comments, these are apart of the template declaration and are used in the rendering of the extending control. 

			<!-- "name":"beforetitle" -->
			<h1 data-bind='"innerHTML" : "c$.title"'></h1>
			<!-- "name":"beforesubtitle" -->
			<h2 data-bind='"innerHTML" : "c$.subtitle"'></h2>
			<!-- "name":"beforedescription" -->
			<h3 data-bind='"innerHTML" : "c$.description"'></h3>
			<!-- "name":"afterdescription" -->

__A close look__

If you look carefully you will see that the comments specify some information which is useful to MEPH.

			<!-- "name":"beforetitle" -->

The previous comment specifies a location, which can be used by extending controls to place more html nodes. Like in the PageHeaderExtended template an instruction is defined which will place a new html __h2__ right after the beforetitle comment of the PageHeader.
			
			<!-- "instruction": true, "name" : "version", "operation" : "inject" , "position" : "beforetitle", "before" : false -->
			<h2 data-bind='"innerHTML" : "c$.version"'></h2>
			<!-- "instruction": true, "name" : "version", "close": true -->

It specifies that 
	
-	__"instruction": true__, it is an instruction to be used in the rendering of the template.
-	__"name" : "version"__, the instruction within the context is called "version".
-	__"operation" : "inject"__ , it will perform an inject operation. This means, it will take whatever is between its closing instruction and itself, and place it at the specified location.
-	__"position" : "beforetitle"__,  Specifies the location where the instruction will be executed.
-	__"before" : false__, Specifies if the operation will place it before the position or after.


All the other comments in this example follow the same pattern. So you see its not complicated at all.

If the PageHeader renders


			<h1 data-bind='"innerHTML" : "c$.title"'></h1>
			<h2 data-bind='"innerHTML" : "c$.subtitle"'></h2>
			<h3 data-bind='"innerHTML" : "c$.description"'></h3>

Then PageHeaderExtended renders


			<h2 data-bind='"innerHTML" : "c$.version"'></h2>
			<h1 data-bind='"innerHTML" : "c$.title"'></h1>
			<h2 data-bind='"innerHTML" : "c$.date"'></h2>
			<h2 data-bind='"innerHTML" : "c$.subtitle"'></h2>
			<h2 data-bind='"innerHTML" : "c$.author"'></h2>
			<h3 data-bind='"innerHTML" : "c$.description"'></h3>

In the real world, this probabaly doesn't make a lot of sense in respect to why a version would use a __h2__ tag.  As an example of how to extend controls effectively, this is fine.