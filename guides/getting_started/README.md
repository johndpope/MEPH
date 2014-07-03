# Getting Started

A guide about getting started with U4M.

## Requirements

### Web Browsers

U4M supports all the major web browsers from Internet Explorer 10 to the latest Google Chrome.

*   Internet Explorer 10+
*   Firefox
*   Chrome

This tutuorial assumes that you are using the latest version of Google Chrome. If you don't already have teh latest version, please take a moment and install it, and familiarize yourself wi the [chrome developer tools](https://developer.chrome.com/devtools/index).

### Web Server
Although it is not considered an explicity requirement to use U4M, it is still highly recommended to develop your application at the root of your server, because of a dependency of [SignalR](http://signalr.net/).
- some
- bulleted
- list

## Application Structure

### Basic Structure
Definitely not required, but it is suggested best practice guideline for keeping your application well orgainized, extensiable and maintainable. The following is the recommended directory structure for a U4M application.

		- appname
			-app
				-namespace
					-module
						-presenter
							-modulepresenter.js
						-controller
							-modulecontroller.js
						-view
							-moduleview.js
							-moduleview.html
						-model
							-modulemodel.js
				-data
					-view.json
					-menu.json
				-resources
					-css
					-images
					-scss
					-...
				-app.js
				-index.html
					

- appname is a directory that contains all your application's source files
- app contains all your classes.
- module is the name of the module, and contains all its necessary parts.
- presenter is the folder which contains your presenter(s) associated with the model.
- controller ...
- view		...	
- model		...
- index.html is the entry point HTML document.
- app.js contains the application's logic.
- data is the folder which contains your menu and view json files, which are usually just for development.


### Meat and Potatoes
This is the 1,2,3 steps to creating your first U4M application.

1.  Create a index.html

		<!DOCTYPE html>
		<html xmlns="http://www.w3.org/1999/xhtml">
		<head>
			// This is here for backwards compatibility.
			<script src="../../u4m/polyfills/Promise.js"></script>
			<title>U4M App</title>
			<script src="../../u4m/src/u4m.js"></script>
			<script src="app.js"></script>
			<link href="../../u4m/resources/css/u4m-debug.css" rel="stylesheet" />
			<link href="resources/css/u4-mobile-example.css" rel="stylesheet" />
		</head>
		<body>
			<application>
			</application>
		</body>
		</html>
#### Required steps.

	- Add the required resources
		- u4m.js
		- app.js
		- u4m-debug.css / u4m.css
		- any more  resources you require.


-  Write the app.js
	- Set up the frame work.


		The 'U4M' defines the path from the global window object where the framework functions and properties will reside.
	
				var path = 'u4m/src';
				u4mFrameWork('U4M', path);


	- Setting up application paths.
		
		
		 The application will need to be able to find resources. To meet that requirement, setting up paths are an easy way to manage it application wide. Paths can be added or removed at any point in the lifecylce of application. The most of the time, all the paths should be defined before the application is started.
		 
				var rel = '/'
				var path = rel + 'u4m/src';
				var U4MControlsPath = rel +  'controlExamples';
				var ProvidersPath = rel +  'providerExamples';
				U4M.setPath(path, 'U4M');
				U4M.setPath(U4MControlsPath, 'U4MControls'); 
				U4M.getPath('U4MControls'); // returns /u4m/src/controlExamples
				
				U4M.setPath(ProvidersPath, 'Providers');
				U4M.getPath('Providers'); // returns /u4m/src/providerExamples

	- Creating your application
		 
				...
				U4M.ready().then(function () {
					//Set paths here.
					U4M.create('U4M.mobile.MobileApplication').then(function () {
						
						var app = U4M.MobileApp.mobileApplication({
						}).ready().then(function (x) {

						}).catch(function (error) {
							U4M.Log(error);
						});
					});
					U4M.loadScripts(['/signalr/hubs']);

				});


	The most interesting parts of the code above are:
			
				U4M.ready().then(function () { ...})
				
	When U4M has loaded all the required framework dependencies, it will execute the code with in the callback function.

				U4M.create('U4M.mobile.MobileApplication').then(function () { });

	U4M.mobile.MobileApplication is the default application class, which includes a basic structure for a mobile application, when the requirements are finished loading it will execute its callback function.


				  var app = U4M.MobileApp.mobileApplication({
							product: 'UNIT4',
							applicationName: 'Agresso Platform Mobile',
							applicationSelector: 'agreesmobileplatform',
							appPath: rel + mobileexample + '/MobileApplication.html?',
							homeView: {
								viewId: 'U4M001',
								'path': '/mobile/home'
							},
							ioc: {
								...
							}
						});

			Not including the ioc configuration, the example above is the basic application initialization process.

	- Putting it all together

	This does not include an explanation about the configuration of the IOC section, [but that can be found here](#!/guide/ioc). Also, there are guides about each of the ioc parts.

					var index = location.pathname.indexOf('dev-harness')
					var rel = location.pathname.substr(0, index);
					var path = rel + 'u4m/src';
					var mobileexample = 'dev-harness/u4-mobile-example/';
					var U4MControlsPath = rel + mobileexample + 'controlExamples';
					var ProvidersPath = rel + mobileexample + 'providerExamples';
					u4mFrameWork('U4M', path);
					U4M.ready().then(function () {
						U4M.setPath(path, 'U4M');
						U4M.setPath(U4MControlsPath, 'U4MControls');
						U4M.setPath(ProvidersPath, 'Providers');
						U4M.setPath(rel + mobileexample + 'data', 'dataviews');
						U4M.create('U4M.mobile.MobileApplication').then(function () {
							var app = U4M.MobileApp.mobileApplication({
								product: 'UNIT4',
								applicationName: 'Agresso Platform Mobile',
								applicationSelector: 'agreesmobileplatform',
								appPath: rel + mobileexample + '/MobileApplication.html?',
								homeView: {
									viewId: 'U4M001',
									'path': '/mobile/home'
								},
								ioc: {
									sessionManager: {
										...
									},
									viewProvider: {
										...
									},
									menuProvider: {
										...
									},
									applicationMenuProvider: {
										...
									},
									remoteUserProvider: {
										...
									},
									activityMenuProvider: {
										...
									},
									remotingController: {
										...
									},
									signalService: {
										...
									}
								}
							}).ready().then(function (x) {

							}).catch(function (error) {
								U4M.Log(error);
							});

						});
					});  
				
				