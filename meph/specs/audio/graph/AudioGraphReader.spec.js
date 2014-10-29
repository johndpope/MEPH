describe("MEPH/audio/graph/AudioGraphReader.spec.js", 'MEPH.audio.graph.AudioGraphReader', function () {
    var graph;
    beforeEach(function () {
        jasmine.addMatchers(MEPH.customMatchers);
        graph = {
            "connections": [{
                "id": "7747813e-0146-4faa-9d97-09d7640d55b1",
                "nodes": ["87d2ad5d-5558-4d0f-9997-01c1447a5471", "19133682-6a3f-4b83-9cc3-235c9dae7ce8"],
                "zones": ["87d2ad5d-5558-4d0f-9997-01c1447a5471-bufferoutput-connector",
                    "19133682-6a3f-4b83-9cc3-235c9dae7ce8-bufferinput-connector"]
            },
                    {
                        "id": "8582faef-7af3-4554-8ee0-367422cd4ad5",
                        "nodes": ["2006630d-e4dd-4b8c-b9cb-6d18fc6657d1", "87d2ad5d-5558-4d0f-9997-01c1447a5471"],
                        "zones": ["2006630d-e4dd-4b8c-b9cb-6d18fc6657d1-bufferoutput-connector", "87d2ad5d-5558-4d0f-9997-01c1447a5471-bufferinput-connector"]
                    }],
            "nodes": [{
                "id": "87d2ad5d-5558-4d0f-9997-01c1447a5471",
                "position": { "x": 382, "y": 147, "z": 0 },
                "data": {
                    "id": "ae5cc6de-060d-4181-8c3f-c178392885fd",
                    "type": "MEPH.audio.graph.node.BiquadFilter",
                    "nodeInputs": [{
                        "name": "buffer",
                        "title": "buffer",
                        "type": "AudioBuffer",
                        "id": "2acf9240-518f-4807-b7cc-3c56d4c420c9",
                        "options": null,
                        "output": false,
                        "isOutput": false
                    }, {
                        "name": "q",
                        "title": "q",
                        "type": "Number",
                        "id": "005055d3-3d68-4640-9629-ae2c099d2d24",
                        "options": {
                            "path": "Q.value"
                        },
                        "output": false,
                        "isOutput": false,
                        "defaultValue": "7.86"
                    }, {
                        "name": "frequency",
                        "title": "frequency",
                        "type": "Number",
                        "id": "677fa052-c84c-4ab5-8fe8-a6974305c941",
                        "options": {
                            "path": "frequency.value"
                        },
                        "output": false,
                        "isOutput": false
                    }, {
                        "name": "detune",
                        "title": "detune",
                        "type": "Number",
                        "id": "dac1ec84-7685-4b8d-a0d7-eb318541700f",
                        "options": {
                            "path": "detune.value"
                        },
                        "output": false,
                        "isOutput": false,
                        "defaultValue": "6.79"
                    }, {
                        "name": "gain",
                        "title": "gain",
                        "type": "Number",
                        "id": "37dba55d-b5f1-4295-8f31-403790068a0c",
                        "options": {
                            "path": "gain.value"
                        },
                        "output": false,
                        "isOutput": false
                    }, {
                        "name": "type",
                        "title": "type",
                        "type": "String",
                        "id": "0fff33de-2fd4-4c2a-b5ff-e96d8a506319",
                        "options": {
                            "values": ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "peaking", "notch", "allpass"]
                        },
                        "output": false,
                        "isOutput": false
                    }],
                    "nodeOutputs": [{
                        "name": "buffer",
                        "title": "buffer",
                        "type": "AudioBuffer",
                        "id": "d69ac7ce-9c8c-4521-95cc-6986ffc497cf",
                        "output": true,
                        "isOutput": false
                    }]
                }
            },
            {
                "id": "19133682-6a3f-4b83-9cc3-235c9dae7ce8",
                "position": {
                    "x": 734, "y": 165, "z": 0
                },
                "data": {
                    "id": "b33a508e-ea65-4aac-863b-2c5e72f11499",
                    "type": "MEPH.audio.graph.node.GainNode",
                    "nodeInputs": [{
                        "name": "buffer",
                        "title": "buffer",
                        "type": "AudioBuffer",
                        "id": "d68ab7d5-b87c-479a-a033-2395ec0172ef",
                        "options": null,
                        "output": false,
                        "isOutput": false
                    }, {
                        "name": "gain",
                        "title": "gain",
                        "type": "Number",
                        "id": "5bc8b885-9b50-4a8b-b303-e6581f79ec9a",
                        "options": {
                            "path": "gain.value"
                        },
                        "output": false,
                        "isOutput": false,
                        "defaultValue": "6.61"
                    }],
                    "nodeOutputs": [{
                        "name": "buffer",
                        "title": "buffer",
                        "type": "AudioBuffer",
                        "id": "1c1bc6bc-1fbb-4b68-af39-2ff5c77be4d8",
                        "output": true,
                        "isOutput": false
                    }]
                }
            }, {
                "id": "2006630d-e4dd-4b8c-b9cb-6d18fc6657d1",
                "position": { "x": 73, "y": 136, "z": 0 },
                "data": {
                    "id": "1681b16c-05fd-4538-9311-228a72c59dae",
                    "type": "MEPH.audio.graph.node.PannerNode",
                    "nodeInputs": [{
                        "name": "buffer",
                        "title": "buffer",
                        "type": "AudioBuffer",
                        "id": "50982c59-74b9-4f92-93cd-d6c7046252c6",
                        "options": null,
                        "output": false,
                        "isOutput": false
                    }, {
                        "name": "coneInnerAngle",
                        "title": "coneInnerAngle",
                        "type": "Number",
                        "id": "238692ec-1cc1-473d-bd54-8d47d078bb80",
                        "options": null,
                        "output": false,
                        "isOutput": false,
                        "defaultValue": "3.66"
                    }, {
                        "name": "coneOuterAngle",
                        "title": "coneOuterAngle",
                        "type": "Number",
                        "id": "991af44a-737e-451a-bc57-df038fa3d95a",
                        "options": null,
                        "output": false,
                        "isOutput": false,
                        "defaultValue": "3.04"
                    }, {
                        "name": "coneOuterGain",
                        "title": "coneOuterGain",
                        "type": "Number",
                        "id": "2964f8da-5f77-403e-b2bf-18a15f45be7a",
                        "options": null,
                        "output": false,
                        "isOutput": false,
                        "defaultValue": "4.02"
                    }, {
                        "name": "refDistance",
                        "title": "refDistance",
                        "type": "Number",
                        "id": "33d655d5-e4b0-4ce6-9e84-e1c2296dabf9",
                        "options": null,
                        "output": false,
                        "isOutput": false
                    }, {
                        "name": "rolloffFactor",
                        "title": "rolloffFactor",
                        "type": "Number",
                        "id": "c0770f07-24ec-4fd9-b965-3fb309d7ccfb",
                        "options": null,
                        "output": false,
                        "isOutput": false
                    }, {
                        "name": "panningModel",
                        "title": "panningModel",
                        "type": "String",
                        "id": "d27981fa-9afc-4532-be39-9d1e954aa077",
                        "options": {
                            "values": ["equalpower", "HRTF"]
                        },
                        "output": false,
                        "isOutput": false
                    }, {
                        "name": "distanceModel",
                        "title": "distanceModel",
                        "type": "String",
                        "id": "d3b1bb3f-c388-4a37-8684-c23156dc579c",
                        "options": { "values": ["linear", "inverse", "exponential"] },
                        "output": false,
                        "isOutput": false
                    }],
                    "nodeOutputs": [{
                        "name": "buffer",
                        "title": "buffer",
                        "type": "AudioBuffer",
                        "id": "83a00178-4bc8-4ffd-8456-f5cb4b183b92",
                        "output": true,
                        "isOutput": false
                    }]
                }
            }]
        }
    });

    it("can create a AudioGraphReader", function () {
        //Arrange

        //Assert
        var reader = new MEPH.audio.graph.AudioGraphReader();

        expect(reader).toBeTruthy();

    });

    it('can set a graph to be read ', function () {
        var reader = new MEPH.audio.graph.AudioGraphReader();

        reader.setGraph(graph);

        expect(reader.getGraph()).toBeTruthy();
    });

    it('a graph can get all the nodes from a graph', function () {
        var reader = new MEPH.audio.graph.AudioGraphReader();
        reader.setGraph(graph);

        var nodes = reader.getNodes();

        expect(nodes.length).toBe(3);
    });

    it('can get node by id', function () {
        var reader = new MEPH.audio.graph.AudioGraphReader();
        reader.setGraph(graph);
        var node = reader.getNodeById(graph.nodes.first().id)
        expect(node).toBeTruthy();
    });

    it('can get node connector by id from connection', function () {

        var reader = new MEPH.audio.graph.AudioGraphReader();
        reader.setGraph(graph);
        var nodeinput = reader.getNodeConnectorById(graph.connections.first().zones.first());
        expect(nodeinput).toBeTruthy();
    });

    it('can get dependencies of a node', function () {
        var reader = new MEPH.audio.graph.AudioGraphReader();
        reader.setGraph(graph);
        var nodes = reader.getDependentNodes(graph.nodes.nth(2));
        expect(nodes.length).toBe(1);
    });

    it('can get the root of a graph ', function () {
        var reader = new MEPH.audio.graph.AudioGraphReader();
        reader.setGraph(graph);
        var node = reader.getRoot();
        expect(node).toBeTruthy();
    });
    it('can detecte if a graph has a single root', function () {
        var reader = new MEPH.audio.graph.AudioGraphReader();
        reader.setGraph(graph);
        var node = reader.hasSingleRoot();
        expect(node).toBeTruthy();
    });

    it('can construct an audio object for playin sounds', function () {
        var reader = new MEPH.audio.graph.AudioGraphReader();
        reader.setGraph(graph);
        var audio = reader.constructAudio();
        expect(audio).toBeTruthy();
    })
})