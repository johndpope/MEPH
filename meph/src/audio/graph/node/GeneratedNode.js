/**
 * @class MEPH.audio.graph.node.GeneratedNode
 * @extend MEPH.audio.graph.node.Node
 **/
MEPH.define('MEPH.audio.graph.node.GeneratedNode', {
    extend: 'MEPH.audio.graph.node.Node',
    alias: 'generatednode',
    templates: true,
    properties: {
    },
    initialize: function (seed) {
        var me = this, input, output;

        me.nodecontrols = me.nodecontrols || [];
        if (seed) {
            input = seed.nodes.first(function (x) {
                return x.data.type === 'MEPH.audio.graph.node.InputNode';
            });

            output = seed.nodes.first(function (x) {
                return x.data.type === 'MEPH.audio.graph.node.OutputNode';
            });

            if (input && output) {
                
                input = input.data;
                output = output.data;   
                input.nodeInputs.foreach(function (inp) {
                    me.nodecontrols.push(inp.name);
                });

                output.nodeOutputs.foreach(function (inp) {
                    me.nodecontrols.push(inp.name);
                });
            }
        }
        //me.nodecontrols.push('bufferoutput');
        //me.nodecontrols.push('bufferinput');
        //me.nodecontrols.push('gain');

        me.super();
        if (input && output) {
            input.nodeInputs.foreach(function (inp) {
                me.nodeInputs.push(me.createInput(inp.name, inp.type));
            });

            output.nodeOutputs.foreach(function (inp) {
                me.nodeOutputs.push(me.createOutput(inp.name, inp.type));
            });
        }
        //
        //me.nodeOutputs.push(me.createOutput('buffer', MEPH.audio.graph.node.Node.AudioBuffer));

    },
    onLoaded: function () {
        var me = this;
        me.super();
        me.title = 'Generated Node';

    }

});