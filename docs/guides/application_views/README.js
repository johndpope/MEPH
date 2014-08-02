Ext.data.JsonP.application_views({"guide":"<h1 id='application_views-section-views-and-the-json-objects'>Views and the JSON Objects</h1>\n<div class='toc'>\n<p><strong>Contents</strong></p>\n<ol>\n<li><a href='#!/guide/application_views-section-json-is-what%3F'>JSON is what?</a></li>\n<li><a href='#!/guide/application_views-section-what-do-i-need-to-know%3F'>What do I need to know?</a></li>\n</ol>\n</div>\n\n<p>A guide about setting up views.</p>\n\n<h2 id='application_views-section-json-is-what%3F'>JSON is what?</h2>\n\n<p>If you don't know, you are probably in the wrong place, but try <a href=\"http://en.wikipedia.org/wiki/JSON\">here</a>.</p>\n\n<h2 id='application_views-section-what-do-i-need-to-know%3F'>What do I need to know?</h2>\n\n<p>This guide is in no way required, but if you work in a company that uses this style of menu system it maybe useful. The <a href=\"#!/MEPH.mobile.providers.viewprovider.MobileViewProvider\">MobileViewProvider</a> is used to retrieve view configurations which are used for showing a view instance. Within the config property of the configuration these properties are used to retrieve the views which can be expected to be loaded at any given time during the life of the application.</p>\n\n<pre><code>                viewProvider: {\n                        static: true,\n                        type: 'MEPH.mobile.providers.viewprovider.MobileViewProvider',\n                        config: {\n                            viewsResource: {\n                                uri: 'Views.json',\n                                path: 'dataviews',\n                                preload: false\n                            },\n                            root: 'views'\n                        }\n                    },\n</code></pre>\n\n<p>The view provider will retrieve the views from a source, and each view will have a format similar to the following. This configuration is used to create an Activity instance. You maybe asking what does this all mean.</p>\n\n<ul>\n<li>viewId: Is the identifier of the views configuration</li>\n<li>view: The fully qualifiedd name off the view class.</li>\n<li>controller: The fully qualified name of the controller class, which will be referenced to from the view. It will also be bound to the view instance.</li>\n<li>model: The fully qualified name of the model class, just like the controller, it will be referenced to from the view, and will be bound to the view instance.</li>\n<li><p>etc: There are no defined limits to what can be added, as long as they are added to the framework definition.</p>\n\n<ul>\n<li><p>current default options</p>\n\n<ul>\n<li>view(required)</li>\n<li>controller</li>\n<li>model</li>\n<li>presenter</li>\n<li><p>viewmodel</p>\n\n<pre><code> {\n     'viewId': '4UHP001',\n     'view': 'Controls.remoteview.view.RemoteView',\n     'controller': 'Controls.remoteview.controller.RemoteViewController',\n     'model': 'Controls.remoteview.model.RemoteViewModel'\n },\n ....\n</code></pre>\n\n<h3>Conclusion</h3></li>\n</ul>\n</li>\n</ul>\n</li>\n</ul>\n\n\n<p>Regaardless of how the view configurations are retrieved, when a view configuration is requested the result must be passed in the format describe above.</p>\n","title":"Quick start on views."});