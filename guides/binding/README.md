# Binding, not Bondage

A guide abount binding in MEPH.


## Binding is what?
[Wikipedia](http://en.wikipedia.org/wiki/Data_binding) describes data binding as a "process that establishes a connection between the application UI(User Interface) and business logic. ...". In MEPH this is also the case. 

## MEPH Binding
In MEPH, a view can have an associated presenter, controller, model, viewmodel or whatever in any combination that the mind can imagine. To support the single responsibility portion of the [SOLID](http://en.wikipedia.org/wiki/SOLID_(object-oriented_design)) principles, MEPH has a particularly unique way of establishing data-binding.

### Example 1

The simplest situation which can exist is a view which has no presenter/controller/model/etc associated with the instance, and also has no controls within itself. 

-  Definitaion of the view in the views.json description.

			{
				view : 'App.view.View'
			}


-  Definition of App.view.View

		MEPH.define('App.view.View', {
			alias: 'app_view_view',
			templates: true,
			extend: 'MEPH.mobile.activity.container.Container',
			properties: {
				name: null
			},
			afterLoaded: function() {
				var me= this;
				me.name = 'MEPH Framework';
			}
		})

-  Template for App.view.View

		<div>
			<span data-bind='"innerHTML": "c$.name"'></span>
		</div>

That's it. Did you miss it? Here is the breakdown of the pertinent information. In the span there is a __data-bind__ attribute which contains a __special string__. The __'"innerHTML": "c$.name"'__ is the binding configuration. In laymen's terms the __innerHTML__ property of the span will be bound to the context's/control's __name__ property. The current context/control is the  __c$__.

When ever the name property's value changes, the span's __innerHTML__ property will be updated to the new value.

		<div>
			<span data-bind='"innerHTML": "c$.name"'></span>
		</div>

__What about input field's__
Let's say that the App.view.View was a bit more complex like:

		<div>
			<span data-bind='"innerHTML": "c$.name"'></span>
			<input data-bind='"value": "c$.inputfield.value"'
					u4mid="inputfield"
					data-events='"change" : "c$.inputfield.value | c$.value"' />
		</div>
The span tag hasn't changed at all, but there is new input field tag with more attributes attached.

__An explanation about each of the input's attributes__

-  __u4mid__: This is the id which the App.view.View will provide direct access the input field. 
-  __data-bind__: Just like the span tag, the value property of the input will be set to the value property of the current control's/context's inputfield's value. As mentioned, the c$ in this case is the App.view.View instance. It has a property called inputfield, which is the input field with the attribute __u4mid="inputfield"__.
-  __data-events__: This describes the event which will trigger the inputfield of c$ to transfer its value to the App.view.View instance's value property.

The attribute-property combination, __data-events='"change" : "c$.inputfield.value | c$.value"'__, has a piece of syntax which hasn't been fully explained yet. That is the pipe, __|__.

#### The Pipe

The pipe is a powerful tool in MEPH. It allows developers to call multiple procedures and set multiple properties in all available contexts with ease. In the previous example __"c$.inputfield.value | c$.value"__, the inputfield's value will be set on the context's value property automatically.

That's nice, but can it do more. __Yes!__.

			<span data-bind='"innerHTML": "c$.field.value | c$.name | c$.property1 | c$.function1 "'></span>
__Explanation__

When the context's field's value property changes, its value will be set on the context's name property, which will in turn set the context's property1 property which will finally call the context's function1 function and the result of that function will be set on the span's innerHTML property.


There has been a lot of explanation about the context/c$, and that works great when creating a control, but what about binding to a view, presenter, viewmodel, controller, etc.

## Views, Presenters, Controllers oh my

This section is about how to bind to combinations of views, presenters, controllers, and etc.

### Example 2

At this point, App.view.View will take on a new definition and there will be a few new classes added to the mix. One of the [SOLID](http://en.wikipedia.org/wiki/SOLID_(object-oriented_design)) principles, single responsibility principle specifically. Wikipedia states, "
a class should have only a single responsibility (i.e. only one potential change in the software's specification should be able to affect the specification of the class)". This gives rise to the need of a controller and a model to separate functionally different areas.


-  Definitaion of the view in the views.json description.

			{
				view : 'App.view.View',
				controller: 'App.controller.Controller',
				model: 'App.model.Model'
			}


-  Definition of App.view.View

		MEPH.define('App.view.View', {
			alias: 'app_view_view',
			templates: true,
			extend: 'MEPH.mobile.activity.container.Container',
			properties: {
				name: null
			},
			afterLoaded: function() {
				var me= this;
				me.name = 'MEPH Framework';
			}
		});

-  Template for App.view.View

		<div>
			<span data-bind='"innerHTML": "m$.name"'></span>
			<input data-bind='"value": "m$.value"'
					u4mid="namefield"
					data-events='"change" : " m$.value"' />
			<input data-bind='"value": "m$.address"'
					u4mid="addressfield"
					data-events='"change" : " m$.address"' />
			<button data-events='"click": "ct$.save"'></button>
		</div>

-  Definition of App.controller.Controller

		MEPH.define('App.controller.Controller', {
			requires: ['MEPH.controller.Controller'],
			extend: 'MEPH.controller.Controller',
			properties: {
				name: null
			},
			save: function() {
				var me= this; 
				me.serviceCaller.call(me.model,....);
			}
		});

-  Definition of App.model.Model

		MEPH.define('App.model.Model', {
			requires: ['MEPH.model.Model'],
			extends: ['MEPH.model.Model'],
			properties: {
				name: null,
				value: null,
				address: null
			},
			initialize: function () {
				var me = this;
				me.callParent.apply(me, arguments);
			}
		});

With a model, controller and view defined the power of meph binding is now visible for all to see. 

To reference models, controllers and etc, MEPH has built in short cuts :

-  __m$__, __model__ model, References the model associated with the view
-  __v$__, __view__ view, References the view
-  __vm$__, __viewmodel__ viewmodel, References the view model
-  __p$__, __presenter__ presenter, References the presenter
-  __ct$__, __controller__ controller, References the controller
-  __c$__, __control__ control, Reference the control

In __example 2__ ,

-  __m$.name__  references the model instance property name.
-  __m$.value__ references the model instance property value.
-  __m$.address__ references the model instance property address.
-  __ct$.save__ references the controller instance function save.

When the model's name property changes the innerHTML property of the span will be set to the name property's value. The same pattern applies to the value and adress property of the model. When the value of the namefield input is changed the model's value property will be set, and when the addressfield is changed, its value will be set to the model's address property. Finally when the button is clicked the controller's save function is executed.

		<div>
			<span data-bind='"innerHTML": "m$.name"'></span>
			<input data-bind='"value": "m$.value"'
					u4mid="namefield"
					data-events='"change" : " m$.value"' />
			<input data-bind='"value": "m$.address"'
					u4mid="addressfield"
					data-events='"change" : " m$.address"' />
			<button data-events='"click": "ct$.save"'></button>
		</div>


Here is a practical example of __data-events__ in use. This tag will initiate a binding sequence when the described, in this case __click__, event occurrs. In the case of: 

		<button data-events='"click": "ct$.save"'></button>

The __data-events__ tag states that when the button is clicked, the controller will execute its save function.

