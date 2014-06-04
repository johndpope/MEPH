Ext.data.JsonP.MEPH_mobile_application_menu_ApplicationMenu({"tagname":"class","name":"MEPH.mobile.application.menu.ApplicationMenu","autodetected":{},"files":[{"filename":"ApplicationMenu.js","href":"ApplicationMenu.html#MEPH-mobile-application-menu-ApplicationMenu"}],"members":[{"name":"close","tagname":"method","owner":"MEPH.mobile.application.menu.ApplicationMenu","id":"method-close","meta":{}},{"name":"getMenuItems","tagname":"method","owner":"MEPH.mobile.application.menu.ApplicationMenu","id":"method-getMenuItems","meta":{}},{"name":"getMenuProviders","tagname":"method","owner":"MEPH.mobile.application.menu.ApplicationMenu","id":"method-getMenuProviders","meta":{}},{"name":"getProviderByData","tagname":"method","owner":"MEPH.mobile.application.menu.ApplicationMenu","id":"method-getProviderByData","meta":{}},{"name":"isOpen","tagname":"method","owner":"MEPH.mobile.application.menu.ApplicationMenu","id":"method-isOpen","meta":{}},{"name":"loadMenu","tagname":"method","owner":"MEPH.mobile.application.menu.ApplicationMenu","id":"method-loadMenu","meta":{}},{"name":"menuItemClicked","tagname":"method","owner":"MEPH.mobile.application.menu.ApplicationMenu","id":"method-menuItemClicked","meta":{"private":true}},{"name":"open","tagname":"method","owner":"MEPH.mobile.application.menu.ApplicationMenu","id":"method-open","meta":{}},{"name":"openFlyoutMenu","tagname":"method","owner":"MEPH.mobile.application.menu.ApplicationMenu","id":"method-openFlyoutMenu","meta":{}},{"name":"retrieveAndApplyMenuSource","tagname":"method","owner":"MEPH.mobile.application.menu.ApplicationMenu","id":"method-retrieveAndApplyMenuSource","meta":{}},{"name":"setUpEventListeners","tagname":"method","owner":"MEPH.mobile.application.menu.ApplicationMenu","id":"method-setUpEventListeners","meta":{}},{"name":"updateCallBack","tagname":"method","owner":"MEPH.mobile.application.menu.ApplicationMenu","id":"method-updateCallBack","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-MEPH.mobile.application.menu.ApplicationMenu","component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/ApplicationMenu.html#MEPH-mobile-application-menu-ApplicationMenu' target='_blank'>ApplicationMenu.js</a></div></pre><div class='doc-contents'><p>String</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-close' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='MEPH.mobile.application.menu.ApplicationMenu'>MEPH.mobile.application.menu.ApplicationMenu</span><br/><a href='source/ApplicationMenu.html#MEPH-mobile-application-menu-ApplicationMenu-method-close' target='_blank' class='view-source'>view source</a></div><a href='#!/api/MEPH.mobile.application.menu.ApplicationMenu-method-close' class='name expandable'>close</a>( <span class='pre'></span> ) : <a href=\"#!/api/Promise\" rel=\"Promise\" class=\"docClass\">Promise</a><span class=\"signature\"></span></div><div class='description'><div class='short'>Opens the flyout menu. ...</div><div class='long'><p>Opens the flyout menu.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Promise\" rel=\"Promise\" class=\"docClass\">Promise</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getMenuItems' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='MEPH.mobile.application.menu.ApplicationMenu'>MEPH.mobile.application.menu.ApplicationMenu</span><br/><a href='source/ApplicationMenu.html#MEPH-mobile-application-menu-ApplicationMenu-method-getMenuItems' target='_blank' class='view-source'>view source</a></div><a href='#!/api/MEPH.mobile.application.menu.ApplicationMenu-method-getMenuItems' class='name expandable'>getMenuItems</a>( <span class='pre'>provider, data</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Gets the menu item associated with the data. ...</div><div class='long'><p>Gets the menu item associated with the data.\nIf data is null, the assumption is that it is requesting top level items.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>provider</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>data</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getMenuProviders' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='MEPH.mobile.application.menu.ApplicationMenu'>MEPH.mobile.application.menu.ApplicationMenu</span><br/><a href='source/ApplicationMenu.html#MEPH-mobile-application-menu-ApplicationMenu-method-getMenuProviders' target='_blank' class='view-source'>view source</a></div><a href='#!/api/MEPH.mobile.application.menu.ApplicationMenu-method-getMenuProviders' class='name expandable'>getMenuProviders</a>( <span class='pre'></span> ) : <a href=\"#!/api/Promise\" rel=\"Promise\" class=\"docClass\">Promise</a><span class=\"signature\"></span></div><div class='description'><div class='short'>Gets the menu providers ...</div><div class='long'><p>Gets the menu providers</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Promise\" rel=\"Promise\" class=\"docClass\">Promise</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getProviderByData' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='MEPH.mobile.application.menu.ApplicationMenu'>MEPH.mobile.application.menu.ApplicationMenu</span><br/><a href='source/ApplicationMenu.html#MEPH-mobile-application-menu-ApplicationMenu-method-getProviderByData' target='_blank' class='view-source'>view source</a></div><a href='#!/api/MEPH.mobile.application.menu.ApplicationMenu-method-getProviderByData' class='name expandable'>getProviderByData</a>( <span class='pre'>data</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Gets the provider which the data originates from. ...</div><div class='long'><p>Gets the provider which the data originates from.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>data</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-isOpen' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='MEPH.mobile.application.menu.ApplicationMenu'>MEPH.mobile.application.menu.ApplicationMenu</span><br/><a href='source/ApplicationMenu.html#MEPH-mobile-application-menu-ApplicationMenu-method-isOpen' target='_blank' class='view-source'>view source</a></div><a href='#!/api/MEPH.mobile.application.menu.ApplicationMenu-method-isOpen' class='name expandable'>isOpen</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Returns true if opened. ...</div><div class='long'><p>Returns true if opened.</p>\n</div></div></div><div id='method-loadMenu' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='MEPH.mobile.application.menu.ApplicationMenu'>MEPH.mobile.application.menu.ApplicationMenu</span><br/><a href='source/ApplicationMenu.html#MEPH-mobile-application-menu-ApplicationMenu-method-loadMenu' target='_blank' class='view-source'>view source</a></div><a href='#!/api/MEPH.mobile.application.menu.ApplicationMenu-method-loadMenu' class='name expandable'>loadMenu</a>( <span class='pre'></span> ) : <a href=\"#!/api/Promise\" rel=\"Promise\" class=\"docClass\">Promise</a><span class=\"signature\"></span></div><div class='description'><div class='short'>Loads the menu. ...</div><div class='long'><p>Loads the menu.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Promise\" rel=\"Promise\" class=\"docClass\">Promise</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-menuItemClicked' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='MEPH.mobile.application.menu.ApplicationMenu'>MEPH.mobile.application.menu.ApplicationMenu</span><br/><a href='source/ApplicationMenu.html#MEPH-mobile-application-menu-ApplicationMenu-method-menuItemClicked' target='_blank' class='view-source'>view source</a></div><a href='#!/api/MEPH.mobile.application.menu.ApplicationMenu-method-menuItemClicked' class='name expandable'>menuItemClicked</a>( <span class='pre'>a, b, c, d, e, f, evnt</span> ) : <a href=\"#!/api/Promise\" rel=\"Promise\" class=\"docClass\">Promise</a><span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Handles menu item clicked. ...</div><div class='long'><p>Handles menu item clicked.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>a</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>b</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>c</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>d</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>e</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>f</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>evnt</span> : Object<div class='sub-desc'></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Promise\" rel=\"Promise\" class=\"docClass\">Promise</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-open' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='MEPH.mobile.application.menu.ApplicationMenu'>MEPH.mobile.application.menu.ApplicationMenu</span><br/><a href='source/ApplicationMenu.html#MEPH-mobile-application-menu-ApplicationMenu-method-open' target='_blank' class='view-source'>view source</a></div><a href='#!/api/MEPH.mobile.application.menu.ApplicationMenu-method-open' class='name expandable'>open</a>( <span class='pre'></span> ) : <a href=\"#!/api/Promise\" rel=\"Promise\" class=\"docClass\">Promise</a><span class=\"signature\"></span></div><div class='description'><div class='short'>Opens the flyout menu. ...</div><div class='long'><p>Opens the flyout menu.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Promise\" rel=\"Promise\" class=\"docClass\">Promise</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-openFlyoutMenu' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='MEPH.mobile.application.menu.ApplicationMenu'>MEPH.mobile.application.menu.ApplicationMenu</span><br/><a href='source/ApplicationMenu.html#MEPH-mobile-application-menu-ApplicationMenu-method-openFlyoutMenu' target='_blank' class='view-source'>view source</a></div><a href='#!/api/MEPH.mobile.application.menu.ApplicationMenu-method-openFlyoutMenu' class='name expandable'>openFlyoutMenu</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Opens the flyout menu. ...</div><div class='long'><p>Opens the flyout menu.</p>\n</div></div></div><div id='method-retrieveAndApplyMenuSource' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='MEPH.mobile.application.menu.ApplicationMenu'>MEPH.mobile.application.menu.ApplicationMenu</span><br/><a href='source/ApplicationMenu.html#MEPH-mobile-application-menu-ApplicationMenu-method-retrieveAndApplyMenuSource' target='_blank' class='view-source'>view source</a></div><a href='#!/api/MEPH.mobile.application.menu.ApplicationMenu-method-retrieveAndApplyMenuSource' class='name expandable'>retrieveAndApplyMenuSource</a>( <span class='pre'>provider, data, getparentdata</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Applies the retrieve values from the provider to the menu source. ...</div><div class='long'><p>Applies the retrieve values from the provider to the menu source.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>provider</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>data</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>getparentdata</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-setUpEventListeners' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='MEPH.mobile.application.menu.ApplicationMenu'>MEPH.mobile.application.menu.ApplicationMenu</span><br/><a href='source/ApplicationMenu.html#MEPH-mobile-application-menu-ApplicationMenu-method-setUpEventListeners' target='_blank' class='view-source'>view source</a></div><a href='#!/api/MEPH.mobile.application.menu.ApplicationMenu-method-setUpEventListeners' class='name expandable'>setUpEventListeners</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Sets up event listeners. ...</div><div class='long'><p>Sets up event listeners.</p>\n</div></div></div><div id='method-updateCallBack' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='MEPH.mobile.application.menu.ApplicationMenu'>MEPH.mobile.application.menu.ApplicationMenu</span><br/><a href='source/ApplicationMenu.html#MEPH-mobile-application-menu-ApplicationMenu-method-updateCallBack' target='_blank' class='view-source'>view source</a></div><a href='#!/api/MEPH.mobile.application.menu.ApplicationMenu-method-updateCallBack' class='name expandable'>updateCallBack</a>( <span class='pre'>provider</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>When a provider updates its source, it call this function to update the current values for the menu source. ...</div><div class='long'><p>When a provider updates its source, it call this function to update the current values for the menu source.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>provider</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});