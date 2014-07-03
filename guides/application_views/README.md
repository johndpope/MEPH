# Views and the JSON Objects

A guide about setting up views.


## JSON is what?

If you don't know, you are probably in the wrong place, but try [here](http://en.wikipedia.org/wiki/JSON).


## What do I need to know?

This guide is in no way required, but if you work in a company that uses this style of menu system it maybe useful. The [MobileViewProvider](#!/MEPH.mobile.providers.viewprovider.MobileViewProvider) is used to retrieve view configurations which are used for showing a view instance. Within the config property of the configuration these properties are used to retrieve the views which can be expected to be loaded at any given time during the life of the application.

					viewProvider: {
							static: true,
							type: 'MEPH.mobile.providers.viewprovider.MobileViewProvider',
							config: {
								viewsResource: {
									uri: 'Views.json',
									path: 'dataviews',
									preload: false
								},
								root: 'views'
							}
						},


The view provider will retrieve the views from a source, and each view will have a format similar to the following. This configuration is used to create an Activity instance. You maybe asking what does this all mean. 


-  viewId: Is the identifier of the views configuration
-  view: The fully qualifiedd name off the view class.
-  controller: The fully qualified name of the controller class, which will be referenced to from the view. It will also be bound to the view instance.
-  model: The fully qualified name of the model class, just like the controller, it will be referenced to from the view, and will be bound to the view instance.
-  etc: There are no defined limits to what can be added, as long as they are added to the framework definition.

	-  current default options
			
		+  view(required)
		+  controller
		+  model
		+  presenter
		+  viewmodel



				{
					'viewId': '4UHP001',
					'view': 'Controls.remoteview.view.RemoteView',
					'controller': 'Controls.remoteview.controller.RemoteViewController',
					'model': 'Controls.remoteview.model.RemoteViewModel'
				},
				....
### Conclusion

Regaardless of how the view configurations are retrieved, when a view configuration is requested the result must be passed in the format describe above.