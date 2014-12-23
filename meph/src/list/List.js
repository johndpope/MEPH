/**
 * @class MEPH.list.List
 * @extends MEPH.control.Control
 *  Example
 *   
 *               <list data-bind='"source": "ct$.listsource"'>
 *                   <template 
 *                       name="u4m_controls_examples_list">
 *                           <div class="meph-application-menu-categories-item-details" >
 *                               <span>Name</span>
 *                               <span data-bind='"innerHTML": "c$.data.name"'></span>
 *                           </div>
 *                   </template>
 *               </list>
 *   
 */
MEPH.define('MEPH.list.List', {
    extend: 'MEPH.control.Control',
    requires: ['MEPH.util.Dom'],
    templates: true,
    alias: 'list',
    properties: {
        templateNodeName: 'template',
        listTemplates: null,
        listspace: '[listspace]',
        namespacePrefix: 'MEPH.generated.template',
        boundSource: null,
        source: null,
        updateQueue: null,
        updatePromise: null,
        renderingInProgress: false
    },
    initialize: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.listTemplates = [];
        me.boundSource = [];
        me.updateQueue = [];
        me.templateSelectionFunctions = [];
        me.setupEventHandlers();
        me.updatePromise = Promise.resolve();
    },
    /**
     * @private
     * Sets up event handlers.
     **/
    setupEventHandlers: function () {
        var me = this;
        me.on('altered', function (type, options) {

            if (options.path === 'source') {
                me.removeListListeners(options.old);
                me.addListListeners(options.value);
                me.renderList();
            }
        }, me);
        //me.on('setinstancetemplate', me.handleInstanceTemplate.bind(me));
        me.$templatesCreated;
        me.templateCreationPromise = new Promise(function (resolve, fail) {
            me.$templatesCreated = resolve;
        });
    },
    addListListeners: function (obj) {
        var me = this;
        if (obj && Array.isArray(obj) && obj.on) {
            obj.on('changed', me.updateList.bind(me), me);
        }
    },
    /**
     * Remove list listeners.
     * @param {Object} obj
     **/
    removeListListeners: function (obj) {
        var me = this;
        if (obj && Array.isArray(obj) && obj.un) {
            obj.un(null, me);
        }
    },
    /**
     * @private
     * Handles the dom template.
     */
    handleDomTemplate: function () {
    },
    /**
     * @private
     * Item clicked handler
     **/
    itemClicked: function (value, dom, prop, eventType, instructions, obj, eventargs) {
        var me = this,
            result,
            target;

        target = eventargs.domEvent.srcElement || eventargs.domEvent.target;
        result = me.boundSource.first(function (info) {
            return me.getDomElements(info).first(function (node) {
                return node === target || MEPH.util.Dom.isDomDescendant(node, target) || MEPH.util.Dom.isDomDescendant(target, node);
            });
        });
        if (result) {
            me.getListSpace().dispatchEvent(MEPH.createEvent('itemclicked', {
                data: result.dataItem
            }));
        }
    },
    /**
     * @private
     * Handles the set of an instance template, and will scrape for templates.
     */
    handleInstanceTemplate: function () {
        var me = this,
            nodes,
            created = 0,
            promise = Promise.resolve(),
            template = me.getInstanceTemplate();
        MEPH.Array(me.listTemplates).removeWhere(function (x) { return x; })
        nodes = MEPH.Array(template.childNodes).where(function (x) {
            return x.nodeName.toLowerCase() === me.templateNodeName.toLowerCase();
        }).foreach(function (x) {
            created++;
            promise = promise.then(function () {
                return me.generateClassForTemplate(x);
            });
            me.listTemplates.push(x);
        });
        if (created) {
            promise = promise.then(function () { me.$templatesCreated(); });
        }
        return promise
    },
    /**
     * Gets the name space of the node.
     * @param {Object} node
     * @returns {String}
     **/
    getNameSpace: function (node) {
        var me = this,
            namespace,
            name = node.getAttribute('name'),
        namespace = me.namespacePrefix.split('.');
        namespace.push(name);
        return namespace;

    },
    /**
     * Generate clas for template.
     * @param {String} name
     * @returns {Promise}
     ***/
    generateClassForTemplate: function (node) {
        var me = this, template,
            name = node.getAttribute('name'),
            namespace,
            $class;

        namespace = me.getNameSpace(node);

        $class = MEPH.getDefinedClass(namespace.join('.'));
        template = MEPH.getTemplate(namespace.join('.'));
        if (!template) {
            template = {
                alias: name,
                classifiedName: namespace.join('.'),
                path: namespace.join('.'),
                template: node.innerHTML,
                type: MEPH.templateType
            };
            MEPH.addTemplateInformation(template);
        }
        if (!$class) {
            return MEPH.createClass(namespace.join('.'), MEPH.GUID(), 'MEPH.control.Control', true, {
                initialize: function () {
                    var template = this;
                    Object.defineProperty(template, 'list', {
                        get: function () {
                            return me;
                        },
                        set: function () {
                        }
                    });
                    template.callParent.apply(template, arguments);
                }
            });
        }
        return Promise.resolve().then(function () {
            return $class;
        });
    },
    /**
     * @private
     * Gets information associated with the data item.
     * @param {Object} dataItem
     **/
    getBoundSourceInfo: function (dataItem) {
        var me = this,
            foundItem = me.boundSource.first(function (x) { return x.dataItem === dataItem; });
        return foundItem;
    },
    getBoundSourceIndex: function (dataItem) {
        var me = this,
            source = me.getBoundSourceInfo(dataItem);
        return me.boundSource.indexOf(source);
    },
    /**
     * Gets previous bound source.
     * @param {Object} boundSource
     * @return {Object}
     **/
    getPreviousBoundSource: function (boundSource) {
        var me = this,
            previous,
            currentIndex;

        currentIndex = me.source.indexOf(boundSource.dataItem);
        if (currentIndex === -1 || currentIndex === 0) {
            return null;
        }
        previous = me.source[currentIndex - 1];

        return me.getBoundSourceInfo(previous);
    },
    /**
     * Updates the list.
     * @param {String} type
     * @param {Object} options
     * @param {Array} options.added
     * @param {Array} options.removed
     **/
    updateList: function (type, options) {
        var me = this,
            nextUpdate;

        //if (!me.renderinginprogress) {
        //    me.renderinginprogress = true;
        options.removed.foreach(function (removeDataItem) {
            var foundItem = me.boundSource.first(function (x) { return x.dataItem === removeDataItem; });
            if (foundItem) {
                me.updatePromise = me.updatePromise.then(function () {
                    return me.removeItem(foundItem).then(function (x) {
                        x.renderResult.foreach(function (y) {
                            y.classInstance.destroy();
                        });
                    }).then(function (x) {
                        me.boundSource.removeWhere(function (t) {
                            return t === foundItem;
                        });
                    });
                });
            }
        });
        options.added.foreach(function (addedDataItem) {
            me.updatePromise = me.updatePromise.then(function () {
                return me.renderItem(addedDataItem);
            }).then(function (item) {
                return me.positionAddDataItem(addedDataItem);
            });;
        });

        me.updatePromise = me.updatePromise.then(function () {
            me.renderinginprogress = false;
            if (me.updateQueue.length) {
                nextUpdate = me.updateQueue.pop();
                return me.updateList(null, nextUpdate);
            }
            else {
                me.fire('updatecomplete', me);
            }
        });
    },
    /**
     * Get last dom element.
     * @param {Object} boundSource
     **/
    getLastDomElement: function (boundSource) {
        var me = this;
        return me.getDomElements(boundSource).last();
    },
    /**
     * Gets the dom elements.
     * @param {Object} boundSource
     * @returns {Array}
     **/
    getDomElements: function (boundSource) {
        return boundSource.renderResult.first().templateNode;
    },
    /**
     * Positions the added dataitem in the list dom.
     * @param {Object} addedDataItem
     * @returns {Promise}
     **/
    positionAddDataItem: function (addedDataItem) {
        var sourceIndex, me = this,
                       info,
                       previousSource,
                       lastelement,
                       index = me.getBoundSourceIndex(addedDataItem);
        sourceIndex = me.source.indexOf(addedDataItem);

        if (index !== sourceIndex) {

            info = me.getBoundSourceInfo(addedDataItem);
            previousSource = me.getPreviousBoundSource(info);
            if (previousSource) {
                lastelement = me.getLastDomElement(previousSource);
                me.getDomElements(info).foreach(function (el) {
                    Dom.insertAfter(lastelement, el);
                    lastelement = el;
                });
                me.boundSource.removeWhere(function (x) { return x === info; });
                me.boundSource.splice(sourceIndex, 0, info);
            }
        }

        return Promise.resolve().then(function () { return addedDataItem; });
    },
    /**
     * Renders the list.
     * @returns {Promise}
     **/
    renderList: function () {
        var me = this,
            promise = Promise.resolve();
        promise = me.clearList().then(function () {
            promise = me.render().then(function () {
                me.renderingInProgress = false;
            });
            return promise;
        });
        me.fire('render', {
            renderComplete: promise
        });

        return promise;
    },
    /**
     * @private
     * Render the list. Do not execute this directly.
     * @returns {Promise}
     **/
    render: function () {
        var me = this;

        return me.templateCreationPromise.then(function () {
            var promise = Promise.resolve();
            MEPH.Array(me.source).foreach(function (item) {
                promise = promise.then(function () {
                    return me.renderItem(item);
                });
            });
            me.source.foreach(function (item) {
                promise = promise.then(function (item) {
                    return me.positionAddDataItem(item);
                });;
            });
            return promise;
        });
    },
    /**
     * Clears the list.
     * @returns {Promise}
     **/
    clearList: function () {
        var me = this,
            promise = Promise.resolve();
        me.boundSource.foreach(function (item) {
            promise = promise.then(function () {
                return me.removeItem(item).then(function (x) {
                    x.renderResult.foreach(function (y) {
                        y.classInstance.destroy();
                    });
                });
            })
        });

        return promise.then(function () {
            me.boundSource.removeWhere(function () {
                return true;
            })
        });;
    },
    /**
     * Removes an item visually.
     * @returns {Promise}
     **/
    removeItem: function (item) {
        var me = this;
        return Promise.resolve().then(function () {
            return item;
        });
    },
    /**
     * Renders an item.
     * @protected
     * @param {Object} dataItem
     * @returns {Promise}
     */
    renderItem: function (dataItem) {
        var me = this,
            dataTemplate,
            listspace;
        listspace = me.getListSpace();
        dataTemplate = me.getTemplateForDataItem(dataItem);
        if (typeof (dataTemplate) === 'string') {
            namespace = dataTemplate.split('.');
        }
        else {
            namespace = me.getNameSpace(dataTemplate);
        }
        return me.renderControl(namespace.join('.'), listspace, me).then(function (result) {

            me.boundSource.push({ renderResult: result, dataItem: dataItem });
            return result;
        }).then(function (result) {
            result.first().classInstance.data = dataItem;
            result.first().classInstance.fire('databound');
            return result;
        });
    },
    clickedItem: function () {
        var me = this;
    },
    /**
     * Gets the template for dataitem.
     * @param {Object} data
     * @returns {Object}
     **/
    getTemplateForDataItem: function (data) {
        var me = this,
            outsideFunction,
            template;
        me.templateSelectionFunctions.first(function (x) {
            outsideFunction = x(data);
            return outsideFunction;
        });
        if (outsideFunction) {
            return outsideFunction;
        }
        template = me.getListTemplates().first(function (x) {
            return x;
        });
        return template;
    },
    appendTemplateSelectionFunction: function (tempSelect) {
        var me = this;
        return me.templateSelectionFunctions.push(tempSelect);
    },
    removeTemplateSelectionFunction: function (tempSelect) {
        var me = this;
        return me.templateSelectionFunctions.removeWhere(function (x) {
            return x === tempSelect;
        });
    },
    /**
     * Gets list space.
     * @returns {Object}
     */
    getListSpace: function () {
        var me = this;
        return me.getDomTemplate().first(function (x) {
            return x.querySelector && x.querySelector(me.listspace);
        }).querySelector(me.listspace);
    },
    /**
     * Gets the list templates.
     * @returns {Array}
     **/
    getListTemplates: function () {
        var me = this;
        return me.listTemplates;
    },
    /**
     * @inheritdoc
     */
    destroy: function () {
        var me = this;


        if (me.boundSource) {

            me.boundSource.foreach(function (item) {
                item.dataItem.un(null, me);
                item.dataItem.dun(null, me);
                item.renderResult.foreach(function (result) {
                    result.classInstance.destroy();
                });
            });
        }
        me.callParent.apply(me, arguments);
    }
});