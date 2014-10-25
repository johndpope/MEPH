/**
 * @class MEPH.audio.graph.node.BiquadFilter
 * @extend MEPH.audio.graph.node.Node
 **/
MEPH.define('MEPH.audio.graph.node.BiquadFilter', {
    extend: 'MEPH.audio.graph.node.Node',
    alias: 'biquadfilter',
    templates: true,
    properties: {
        qTitle: '',
        frequencyTitle: '',
        detuneTitle: '',
        gainTitle: '',
        typeTitle: ''
    },
    initialize: function () {
        var me = this;
        me.nodecontrols = me.nodecontrols || [];
        me.nodecontrols.push('bufferoutput');
        me.nodecontrols.push('bufferinput');
        me.nodecontrols.push('q');
        me.nodecontrols.push('frequency');
        me.nodecontrols.push('detune');
        me.nodecontrols.push('gain');
        me.nodecontrols.push('typeinput');
        me.super();
        me.nodeInputs.push(me.createInput('buffer', MEPH.audio.graph.node.Node.AudioBuffer));
        me.nodeInputs.push(me.createInput('Q', MEPH.audio.graph.node.Node.Number, { path: 'Q.value' }));
        me.nodeInputs.push(me.createInput('frequency', MEPH.audio.graph.node.Node.Number, { path: 'frequency.value' }));
        me.nodeInputs.push(me.createInput('detune', MEPH.audio.graph.node.Node.Number, { path: 'detune.value' }));
        me.nodeInputs.push(me.createInput('gain', MEPH.audio.graph.node.Node.Number, { path: 'gain.value' }));
        me.nodeInputs.push(me.createInput('type', MEPH.audio.graph.node.Node.String, {
            values: ['lowpass', 'highpass', 'bandpass', 'lowshelf', 'highshelf', 'peaking', 'notch', 'allpass']
        }));
        me.nodeOutputs.push(me.createOutput('buffer', MEPH.audio.graph.node.Node.AudioBuffer));
    },
    onLoaded: function () {
        var me = this;
        me.super();
        me.title = 'Biquad Filter';

        me.qTitle = 'Q';
        me.frequencyTitle = 'frequency';
        me.detuneTitle = 'detune';
        me.gainTitle = 'gain';
        me.typeTitle = 'type';
    }
});