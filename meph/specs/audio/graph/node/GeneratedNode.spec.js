﻿describe("MEPH/audio/graph/node/GeneratedNode.spec.js", 'MEPH.audio.graph.node.GeneratedNode', function () {
    var seed = { "connections": [{ "id": "016787b1-8cf5-4a79-85a3-0211ef113984", "nodes": ["122105de-4d3e-4196-a93e-561b8e46ac4c", "b9f71242-cec1-43cb-93d4-b34c6edddb1c"], "zones": ["122105de-4d3e-4196-a93e-561b8e46ac4c-bufferoutput-connector", "b9f71242-cec1-43cb-93d4-b34c6edddb1c-bufferinput-connector"] }, { "id": "c51b0dcd-96f6-422d-8257-24b662d75e1f", "nodes": ["19f18a51-4a2f-4f3e-9d59-932f7efc29d9", "b9f71242-cec1-43cb-93d4-b34c6edddb1c"], "zones": ["19f18a51-4a2f-4f3e-9d59-932f7efc29d9-bufferoutput-connector", "b9f71242-cec1-43cb-93d4-b34c6edddb1c-bufferinput-connector"] }, { "id": "1a7982d0-26ae-4a6c-b0e2-26f45c9616e6", "nodes": ["0d189e79-8bb1-42a2-850a-c193acbc0412", "122105de-4d3e-4196-a93e-561b8e46ac4c"], "zones": ["0d189e79-8bb1-42a2-850a-c193acbc0412-bufferoutput-connector", "122105de-4d3e-4196-a93e-561b8e46ac4c-bufferinput-connector"] }, { "id": "7bb3cffe-aade-4aa8-9119-818621dfc0e7", "nodes": ["0d189e79-8bb1-42a2-850a-c193acbc0412", "122105de-4d3e-4196-a93e-561b8e46ac4c"], "zones": ["0d189e79-8bb1-42a2-850a-c193acbc0412-bufferoutput-connector", "122105de-4d3e-4196-a93e-561b8e46ac4c-buffer2input-connector"] }, { "id": "14c3775f-a95f-47ff-9b16-367c99c689d8", "nodes": ["0d189e79-8bb1-42a2-850a-c193acbc0412", "122105de-4d3e-4196-a93e-561b8e46ac4c"], "zones": ["0d189e79-8bb1-42a2-850a-c193acbc0412-bufferoutput-connector", "122105de-4d3e-4196-a93e-561b8e46ac4c-buffer3input-connector"] }, { "id": "94c1411a-711a-47bf-87da-62c9e4555712", "nodes": ["0d189e79-8bb1-42a2-850a-c193acbc0412", "19f18a51-4a2f-4f3e-9d59-932f7efc29d9"], "zones": ["0d189e79-8bb1-42a2-850a-c193acbc0412-bufferoutput-connector", "19f18a51-4a2f-4f3e-9d59-932f7efc29d9-bufferinput-connector"] }, { "id": "0d179aeb-9d6f-437d-b8b6-8b01c41cd4e3", "nodes": ["122105de-4d3e-4196-a93e-561b8e46ac4c", "0d189e79-8bb1-42a2-850a-c193acbc0412"], "zones": ["122105de-4d3e-4196-a93e-561b8e46ac4c-buffer4input-connector", "0d189e79-8bb1-42a2-850a-c193acbc0412-bufferoutput-connector"] }], "nodes": [{ "id": "b9f71242-cec1-43cb-93d4-b34c6edddb1c", "position": { "x": 1545, "y": 175, "z": 0 }, "data": { "id": "d33cabce-a8c7-4269-928d-f18fbb3dca0d", "type": "MEPH.audio.graph.node.OutputNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "Anything", "connector": null, "id": "066c2cfa-0472-45c0-a4b5-006d39fc52c8", "options": null, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "merger output", "title": "merger output", "type": "AudioBuffer", "connector": "122105de-4d3e-4196-a93e-561b8e46ac4c-bufferoutput-connector", "id": "c8986bd2-a9e5-44fb-be50-eb7a83a98a81", "output": true }, { "name": "conv output", "title": "conv output", "type": "AudioBuffer", "connector": "19f18a51-4a2f-4f3e-9d59-932f7efc29d9-bufferoutput-connector", "id": "bcbc3758-1211-4c30-8fee-2d7ecd452c77", "output": true }] } }, { "id": "122105de-4d3e-4196-a93e-561b8e46ac4c", "position": { "x": 931, "y": 7, "z": 0 }, "data": { "id": "4375dc3b-a561-49f2-9e0d-f1684f519db5", "type": "MEPH.audio.graph.node.ChannelMergerNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "connector": null, "id": "84777cd5-a01b-47aa-8c81-abeb70026514", "options": { "count": 100 }, "output": false, "isOutput": false }, { "name": "buffer2", "title": "buffer2", "type": "AudioBuffer", "connector": null, "id": "085bfbf5-81cb-4549-828c-7bbf59f33adb", "options": null, "output": false, "isOutput": false }, { "name": "buffer3", "title": "buffer3", "type": "AudioBuffer", "connector": null, "id": "c81f58d6-0bc8-4c2c-9ea0-a3a1ceedc012", "options": null, "output": false, "isOutput": false }, { "name": "buffer4", "title": "buffer4", "type": "AudioBuffer", "connector": null, "id": "bff87be6-ab9c-4440-9fb6-43146b9a21d2", "options": null, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "connector": null, "id": "049f64fc-686a-4996-9850-299d4e731615", "output": true, "isOutput": false }] } }, { "id": "19f18a51-4a2f-4f3e-9d59-932f7efc29d9", "position": { "x": 935, "y": 211, "z": 0 }, "data": { "id": "99a48af0-a507-47c5-9b01-ac133b7c26a1", "type": "MEPH.audio.graph.node.Convolver", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "connector": null, "id": "3c69d83e-fd37-4162-8a97-de77d98bd17b", "options": null, "output": false, "isOutput": false }, { "name": "normalize", "title": "normalize", "type": "boolean", "connector": null, "id": "5887e9ba-0eb7-4545-96d7-d3b8dfb2f0ee", "options": null, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "connector": null, "id": "b727d2fc-288a-4637-afea-1d837f27fb44", "output": true, "isOutput": false }] } }, { "id": "0d189e79-8bb1-42a2-850a-c193acbc0412", "position": { "x": 190, "y": 101, "z": 0 }, "data": { "id": "c5ffae40-3e78-4929-9a4b-1abe0d60915a", "type": "MEPH.audio.graph.node.InputNode", "nodeInputs": [{ "name": "bufferinput", "title": "bufferinput", "type": "AudioBuffer", "connector": "122105de-4d3e-4196-a93e-561b8e46ac4c-bufferinput-connector", "id": "47f48aee-a605-4662-a205-c4cde95b44dd", "options": null, "output": false }, { "name": "buffer2input", "title": "buffer2input", "type": "AudioBuffer", "connector": "122105de-4d3e-4196-a93e-561b8e46ac4c-buffer2input-connector", "id": "7c6dad36-2737-4520-a52c-69e3e30b5f23", "options": null, "output": false }, { "name": "buffer3input", "title": "buffer3input", "type": "AudioBuffer", "connector": "122105de-4d3e-4196-a93e-561b8e46ac4c-buffer3input-connector", "id": "0f4c7dc2-9523-4489-953d-4d7b57326b42", "options": null, "output": false }, { "name": "bufferinput", "title": "bufferinput", "type": "AudioBuffer", "connector": "19f18a51-4a2f-4f3e-9d59-932f7efc29d9-bufferinput-connector", "id": "76732bf6-1f3a-4ba1-bffa-b333be9c366e", "options": null, "output": false }, { "name": "buffer4input", "title": "buffer4input", "type": "AudioBuffer", "connector": "122105de-4d3e-4196-a93e-561b8e46ac4c-buffer4input-connector", "id": "3c847c3f-6ea3-4255-805b-847dc68a8366", "options": null, "output": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "Anything", "connector": null, "id": "24beabdd-9b5c-4afc-8dc4-b8e27c66f438", "output": true, "isOutput": false }] } }] };
    beforeEach(function () {
        jasmine.addMatchers(MEPH.customMatchers);
    });

    it('can create a GeneratedNode node', function () {
        var GeneratedNode = new MEPH.audio.graph.node.GeneratedNode();

        expect(GeneratedNode).toBeTruthy();
    });


    it('can setup the nodeInputs and Outputs from a configuartion', function () {
        var generated = new MEPH.audio.graph.node.GeneratedNode(seed);

        expect(generated.nodeInputs).toBeTruthy();
        expect(generated.nodeOutputs).toBeTruthy();
        expect(generated.nodeInputs.length).toBeTruthy();
        expect(generated.nodeOutputs.length).toBeTruthy();
    });

    it('can generate a template and store it in the framework base on the seed in the constructor', function () {
        var generated = new MEPH.audio.graph.node.GeneratedNode(seed);

        expect(generated.templates.length === 2).toBeTruthy();
    });

    it('can render a generated ndoe', function (done) {
        MEPH.render('MEPH.audio.graph.node.GeneratedNode', 'generatednode', seed).then(function (r) {
            var results = r.res;
            var app = r.app;

            var dom,
                AudioGraph = results.first().classInstance;
            ///Assert
            dom = AudioGraph.getDomTemplate()[0]
            expect(dom).toBeTruthy();
            //if (app) {
            //    app.removeSpace();
            //}
        }).catch(function (error) {
            expect(error || new Error('did not render as expected')).caught();
        }).then(function () {
            done();
        });
    })
});