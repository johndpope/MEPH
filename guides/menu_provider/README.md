# Menu Provider

A guide about the menu provider.



## JSON is what?

If you don't know, you are probably in the wrong place, but try [here](http://en.wikipedia.org/wiki/JSON).


## What do I need to know?

This guide is in no way required, but if you work in a company that uses this style of menu system it maybe useful. The [MenuProvider](#!/U4M.mobile.providers.menuprovider.MenuProvider) is used to retrieve the menu configuration. 

					 menuProvider: {
						type: 'U4M.mobile.providers.menuprovider.MenuProvider',
						config: {
							viewsResource: {
								uri: '/Menu.json',
								path: 'dataviews',
								preload: false
							},
							root: 'menu'
						}
					}


The menu provider will retrieve the views from a source, and each view will have a format similar to the following. This configuration is used to create a menu structure which can be viewed by the end-user. 


-  viewId: Is the identifier of the views configuration
-  description: Is displayed as the text on the menu buttons.
-  At the time of this writing, the other properties are not currently used, but are reserved for future use.


				'menu': [{
							'description': 'Desktop',
							'children':[{
								'viewId':'testmenuitem',
								'description': 'Test menuItem',
								'accessId': 'U4UX100',
								'iconType': 'launch'
							}]
						}, {
							'description': 'Controls',
							'children':[{
								'viewId':'U4M004',
								'description': 'Icon Buttons',
								'accessId': 'U4UX100',
								'iconType': 'launch',
								'itemType': 'launch',
								'path': '/buttons/IconButton'
							},
				....
### Conclusion

Regaardless of how the menu configurations are retrieved, when a menu configuration is requested the result must be passed in the format describe above.