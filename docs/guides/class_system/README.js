Ext.data.JsonP.class_system({"guide":"<h1 id='class_system-section-class-system'>Class System</h1>\n\n<p>A guide about the MEPH class system.</p>\n\n<h2 id='class_system-section-what%27s-in-a-class'>What's in a class</h2>\n\n<p>The following is an example of a basic class in MEPH. It describes a class called <strong>Class</strong>. <strong>Class</strong> is located in the <strong>./control/Class.js</strong> file.</p>\n\n<pre><code>        <a href=\"#!/api/MEPH-method-define\" rel=\"MEPH-method-define\" class=\"docClass\">MEPH.define</a>('System.control.Class', {\n            extend : 'System.control.base.Control'\n            requires: ['System.util.Requirement'],\n            properties : {\n                /**\n                 * @property {Object} a property\n                 */\n                property: null,\n                $anotherproperty: null\n            },\n            mixins: [...] / { ... },\n            initialize: function(){\n                //called in the constructor.\n            }\n        });\n</code></pre>\n\n<ul>\n<li><p>System.control.Class: what is this?</p>\n\n<p> The <strong>System</strong> part of the fully qualified class name is used to describe its relative location, and should match the path set in the Application setup.</p>\n\n<pre><code>     ...\n     var SystemPath = '/system';\n     u4mFrameWork('MEPH', path);\n     MEPH.ready().then(function () {\n     ...\n         <a href=\"#!/api/MEPH-method-setPath\" rel=\"MEPH-method-setPath\" class=\"docClass\">MEPH.setPath</a>(SystemPath, 'System');\n     ...\n</code></pre></li>\n</ul>\n\n\n<p>After System comes the <strong>control</strong> which describes the relative path from the System to the Class.js file.</p>\n\n<ul>\n<li><p><strong>extend: 'System.control.base.Control'</strong></p>\n\n<p> In this case, the System.control.Class extends from a base class called System.control.base.Control.</p>\n\n<pre><code>     <a href=\"#!/api/MEPH-method-define\" rel=\"MEPH-method-define\" class=\"docClass\">MEPH.define</a>('System.control.Class', {\n         extend : 'System.control.base.Control'\n         ...\n</code></pre></li>\n<li><p><strong>requires: ['System.util.Requirement']</strong></p>\n\n<p> Requires defines the classes which this control relies.</p></li>\n<li><p><strong>properties : { ... </strong></p>\n\n<p> Is the set of properties which will be applied to the instances of the System.control.Class. <strong>Special note</strong>, properties which start with a <strong>$</strong> will not be considered observable when the MEPH.util.Observable mixin is applied.</p></li>\n<li><p><strong>mixins: {...}/[...]</strong></p></li>\n</ul>\n\n\n<p>If you don't know what a mixin is <a href=\"#!/guide/mixins\">an explanation can be found here</a>.</p>\n\n<pre><code>         mixins: {\n            observable: 'MEPH.mixins.Observable',\n            referrerable: 'MEPH.mixins.Referrerable'\n         },\n</code></pre>\n","title":"MEPH Class System"});