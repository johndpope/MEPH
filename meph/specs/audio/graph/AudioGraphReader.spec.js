describe("MEPH/audio/graph/AudioGraphReader.spec.js", 'MEPH.audio.graph.AudioGraphReader', function () {
    var graph, largegraph;
    beforeEach(function () {
        jasmine.addMatchers(MEPH.customMatchers);
        largegraph = { "connections": [{ "id": "e31c3889-8b37-420f-8c38-f3f0e47f1b52", "nodes": ["75418304-a0df-4199-a738-98826665e424", "c7d4b365-2df1-494f-973c-490f0e00caef"], "zones": ["75418304-a0df-4199-a738-98826665e424-bufferoutput-connector", "c7d4b365-2df1-494f-973c-490f0e00caef-bufferinput-connector"] }, { "id": "f39aa42c-aa7d-474d-a40d-1bef9d284c8e", "nodes": ["75418304-a0df-4199-a738-98826665e424", "c7d4b365-2df1-494f-973c-490f0e00caef"], "zones": ["75418304-a0df-4199-a738-98826665e424-buffer2output-connector", "c7d4b365-2df1-494f-973c-490f0e00caef-buffer2input-connector"] }, { "id": "1892e02e-3ec7-4806-b5c3-fb1c7f2a13ee", "nodes": ["c7d4b365-2df1-494f-973c-490f0e00caef", "75418304-a0df-4199-a738-98826665e424"], "zones": ["c7d4b365-2df1-494f-973c-490f0e00caef-buffer3input-connector", "75418304-a0df-4199-a738-98826665e424-buffer3output-connector"] }, { "id": "256de516-77ff-4c0c-9801-51540cfb259d", "nodes": ["75418304-a0df-4199-a738-98826665e424", "c7d4b365-2df1-494f-973c-490f0e00caef"], "zones": ["75418304-a0df-4199-a738-98826665e424-buffer4output-connector", "c7d4b365-2df1-494f-973c-490f0e00caef-buffer4input-connector"] }, { "id": "34431010-b447-4b22-94fd-6b52a73668a3", "nodes": ["7d624fe4-a172-497f-ad58-a83afca33e97", "75418304-a0df-4199-a738-98826665e424"], "zones": ["7d624fe4-a172-497f-ad58-a83afca33e97-bufferoutput-connector", "75418304-a0df-4199-a738-98826665e424-bufferinput-connector"] }, { "id": "33992ef1-be56-4920-81c1-03b1bcd7e57d", "nodes": ["813b4aaa-2315-4378-a7e3-20158a06e7a2", "7d624fe4-a172-497f-ad58-a83afca33e97"], "zones": ["813b4aaa-2315-4378-a7e3-20158a06e7a2-bufferoutput-connector", "7d624fe4-a172-497f-ad58-a83afca33e97-bufferinput-connector"] }, { "id": "fc0c859f-c827-43d4-8719-e38a622ba63c", "nodes": ["1860ca16-c3ff-4ea5-a318-86c12d34074f", "813b4aaa-2315-4378-a7e3-20158a06e7a2"], "zones": ["1860ca16-c3ff-4ea5-a318-86c12d34074f-bufferoutput-connector", "813b4aaa-2315-4378-a7e3-20158a06e7a2-bufferinput-connector"] }, { "id": "d6a6c4f6-170a-425d-a20e-93ff1dfcec63", "nodes": ["c36241d7-cf92-4f04-b692-7edc65fc3a01", "1860ca16-c3ff-4ea5-a318-86c12d34074f"], "zones": ["c36241d7-cf92-4f04-b692-7edc65fc3a01-bufferoutput-connector", "1860ca16-c3ff-4ea5-a318-86c12d34074f-bufferinput-connector"] }, { "id": "720aeb8e-42aa-4720-a1ff-f6e53d1bc66a", "nodes": ["e022d284-b611-431b-a546-9bce37a3b0e0", "87bbba5a-8e16-4deb-8c79-5755754d4fb3"], "zones": ["e022d284-b611-431b-a546-9bce37a3b0e0-bufferoutput-connector", "87bbba5a-8e16-4deb-8c79-5755754d4fb3-bufferinput-connector"] }, { "id": "a9f93b28-0087-40f3-a560-93faa575c26c", "nodes": ["635a8d95-47d9-4cbf-a527-2c3b59d872d1", "e022d284-b611-431b-a546-9bce37a3b0e0"], "zones": ["635a8d95-47d9-4cbf-a527-2c3b59d872d1-bufferoutput-connector", "e022d284-b611-431b-a546-9bce37a3b0e0-bufferinput-connector"] }, { "id": "fb94facd-3253-4222-8cb2-a448039d752b", "nodes": ["f1ccb178-b4ce-4c54-b1ad-941b1fbdf667", "635a8d95-47d9-4cbf-a527-2c3b59d872d1"], "zones": ["f1ccb178-b4ce-4c54-b1ad-941b1fbdf667-bufferoutput-connector", "635a8d95-47d9-4cbf-a527-2c3b59d872d1-bufferinput-connector"] }, { "id": "df2dbf96-c1a0-48f4-8ab8-79ffc1fe43d0", "nodes": ["afd8ab99-754a-46ad-b281-2d1b1790258c", "c7d4b365-2df1-494f-973c-490f0e00caef"], "zones": ["afd8ab99-754a-46ad-b281-2d1b1790258c-bufferinput-connector", "c7d4b365-2df1-494f-973c-490f0e00caef-bufferoutput-connector"] }, { "id": "a5457ea5-324e-4aa2-9683-522bd5c9356e", "nodes": ["afd8ab99-754a-46ad-b281-2d1b1790258c", "f1ccb178-b4ce-4c54-b1ad-941b1fbdf667"], "zones": ["afd8ab99-754a-46ad-b281-2d1b1790258c-bufferoutput-connector", "f1ccb178-b4ce-4c54-b1ad-941b1fbdf667-bufferinput-connector"] }], "nodes": [{ "id": "c7d4b365-2df1-494f-973c-490f0e00caef", "position": { "x": 626, "y": 162, "z": 0 }, "data": { "id": "95822bd5-3256-4c11-889f-cf3d630fb584", "type": "MEPH.audio.graph.node.ChannelMergerNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "3ddff32e-ad1a-49cc-bdee-16cf17a8b47a", "options": { "count": 100 }, "output": false, "isOutput": false }, { "name": "buffer2", "title": "buffer2", "type": "AudioBuffer", "id": "789116e4-d9c8-4f65-b112-259a934c84c7", "output": true, "isOutput": false }, { "name": "buffer3", "title": "buffer3", "type": "AudioBuffer", "id": "3d26006e-5209-4154-8886-c2461a91df35", "output": true, "isOutput": false }, { "name": "buffer4", "title": "buffer4", "type": "AudioBuffer", "id": "a7c74baa-e047-4ecf-b42a-c2ac4e8a7961", "output": true, "isOutput": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "ce6d0f2f-d7af-453a-b55f-d75734578bc4", "output": true, "isOutput": false }] } }, { "id": "75418304-a0df-4199-a738-98826665e424", "position": { "x": 404, "y": 189, "z": 0 }, "data": { "id": "ef6dab5d-27a2-4a08-b28d-34450720cc44", "type": "MEPH.audio.graph.node.ChannelSplitterNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "45d24287-0e3f-4548-ac3c-4e364f0c6da0", "options": null, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "629884d0-eb78-4860-9df8-fc52333da4fc", "output": true, "isOutput": false }, { "name": "buffer2", "title": "buffer2", "type": "AudioBuffer", "id": "1aa6fa71-69e2-4f08-a745-ed2d4854ef41", "output": true, "isOutput": false }, { "name": "buffer3", "title": "buffer3", "type": "AudioBuffer", "id": "09b2481b-7fbc-4f01-a55c-0bf96ca4b863", "output": true, "isOutput": false }, { "name": "buffer4", "title": "buffer4", "type": "AudioBuffer", "id": "9f1c6316-ae26-4648-9e2f-ef5af63d04a5", "output": true, "isOutput": false }] } }, { "id": "7d624fe4-a172-497f-ad58-a83afca33e97", "position": { "x": 175, "y": 186, "z": 0 }, "data": { "id": "00fc8748-f986-453d-b696-3bc9a762d370", "type": "MEPH.audio.graph.node.BiquadFilter", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "35dc0692-e821-4ad2-9d58-eeda4f794abc", "options": null, "output": false, "isOutput": false }, { "name": "q", "title": "q", "type": "Number", "id": "5b5e5dea-9d0d-45b9-a787-f4e2294eddca", "options": { "path": "Q.value" }, "output": false, "isOutput": false, "defaultValue": "2.14" }, { "name": "frequency", "title": "frequency", "type": "Number", "id": "7ddc0dcd-cd7e-435b-8ad5-2f2a599fe20a", "options": { "path": "frequency.value" }, "output": false, "isOutput": false, "defaultValue": "2.41" }, { "name": "detune", "title": "detune", "type": "Number", "id": "8feaaeaa-09bd-4117-a224-bbc12a226de0", "options": { "path": "detune.value" }, "output": false, "isOutput": false, "defaultValue": "3.3" }, { "name": "gain", "title": "gain", "type": "Number", "id": "2fdbe17d-7634-400d-9987-806da6bef793", "options": { "path": "gain.value" }, "output": false, "isOutput": false, "defaultValue": "3.04" }, { "name": "type", "title": "type", "type": "String", "id": "2236b7f2-d433-4c0a-8727-459c48938c99", "options": { "values": ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "peaking", "notch", "allpass"] }, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "a6f6e4ac-4b17-481c-861e-78d69a77cbcb", "output": true, "isOutput": false }] } }, { "id": "813b4aaa-2315-4378-a7e3-20158a06e7a2", "position": { "x": -63, "y": 222, "z": 0 }, "data": { "id": "d5e763bf-e974-40ae-97bb-5c33518c7519", "type": "MEPH.audio.graph.node.DelayNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "58000b4a-d108-4579-89f4-7dca43d0d6bc", "options": null, "output": false, "isOutput": false }, { "name": "delayTime", "title": "delayTime", "type": "Number", "id": "d34070df-a600-4b43-87b6-3a567331b10b", "options": { "path": "delayTime.value" }, "output": false, "isOutput": false, "defaultValue": "3.13" }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "aa83fdb7-e5fc-4a4b-9950-1a76391a96a8", "output": true, "isOutput": false }] } }, { "id": "c36241d7-cf92-4f04-b692-7edc65fc3a01", "position": { "x": -480, "y": 131, "z": 0 }, "data": { "id": "efdbf0ae-d7ab-41e0-b46e-32b0b569072e", "type": "MEPH.audio.graph.node.AudioBufferSourceNode", "nodeInputs": [{ "name": "source", "title": "source", "type": "String", "id": "08cfe668-a636-473c-b0f1-36bda653027e", "options": null, "output": false, "isOutput": false }, { "name": "loop", "title": "loop", "type": "boolean", "id": "05ef0127-f6ec-4b92-b972-2c65df18ca83", "options": null, "output": false, "isOutput": false }, { "name": "loopEnd", "title": "loopEnd", "type": "Number", "id": "9a582f22-9661-4322-9f13-b72001113ca2", "options": null, "output": false, "isOutput": false, "defaultValue": "3.57" }, { "name": "loopStart", "title": "loopStart", "type": "Number", "id": "4dc0cf39-b6b8-4a05-a35f-f48911f929e0", "options": null, "output": false, "isOutput": false, "defaultValue": "3.93" }, { "name": "playbackRate", "title": "playbackRate", "type": "Number", "id": "6f56c083-5f9f-485c-b8e6-01f6d91b0383", "options": { "path": "playbackRate.value" }, "output": false, "isOutput": false, "defaultValue": "3.57" }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "a73a15d9-c1f8-4f23-8567-7cd62efcfc20", "output": true, "isOutput": false }] } }, { "id": "1860ca16-c3ff-4ea5-a318-86c12d34074f", "position": { "x": -273, "y": 185, "z": 0 }, "data": { "id": "ca9e1828-7f15-43c9-9b6a-dd93c7e50665", "type": "MEPH.audio.graph.node.Convolver", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "0330aeea-622b-429d-b455-e142f2fd0dd5", "options": null, "output": false, "isOutput": false }, { "name": "normalize", "title": "normalize", "type": "boolean", "id": "b43558ae-6bcd-4b10-acad-d7b1357f7391", "options": null, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "919488ab-1dea-4ac7-9df1-81fe2e099309", "output": true, "isOutput": false }] } }, { "id": "afd8ab99-754a-46ad-b281-2d1b1790258c", "position": { "x": 847, "y": 79, "z": 0 }, "data": { "id": "1f274eef-8f64-4654-a664-af86b0f5a7c1", "type": "MEPH.audio.graph.node.DynamicsCompressorNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "04afe250-01f4-4beb-8ad7-f4deed45dc26", "options": null, "output": false, "isOutput": false }, { "name": "attack", "title": "attack", "type": "Number", "id": "10d7117f-d648-4830-a815-2d407ae10262", "options": { "path": "attack.value" }, "output": false, "isOutput": false }, { "name": "knee", "title": "knee", "type": "Number", "id": "b003ee10-9f5e-4da9-bd81-4077bc16b5ba", "options": { "path": "knee.value" }, "output": false, "isOutput": false }, { "name": "ratio", "title": "ratio", "type": "Number", "id": "a3717c58-4bc6-4b5e-85c7-606f1a3cbb19", "options": { "path": "ratio.value" }, "output": false, "isOutput": false, "defaultValue": "2.14" }, { "name": "reduction", "title": "reduction", "type": "Number", "id": "88d75feb-c309-4077-b56d-1ff0cb83b01c", "options": { "path": "reduction.value" }, "output": false, "isOutput": false, "defaultValue": "3.04" }, { "name": "release", "title": "release", "type": "Number", "id": "8b0044d5-ac1d-4cdc-9591-c7e682eb1810", "options": { "path": "release.value" }, "output": false, "isOutput": false }, { "name": "threshold", "title": "threshold", "type": "Number", "id": "b962f9e8-d37b-41ca-ae35-341c91d65d09", "options": { "path": "threshold.value" }, "output": false, "isOutput": false, "defaultValue": "3.3" }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "7a9f479f-5a1d-4854-8e10-703de86a2898", "output": true, "isOutput": false }] } }, { "id": "f1ccb178-b4ce-4c54-b1ad-941b1fbdf667", "position": { "x": 1062, "y": 50, "z": 0 }, "data": { "id": "1931ac56-5ba9-4e10-abde-ee8e3feb1904", "type": "MEPH.audio.graph.node.GainNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "3ec46630-76f9-47a2-a1b4-053f991121a8", "options": null, "output": false, "isOutput": false }, { "name": "gain", "title": "gain", "type": "Number", "id": "32ef6ea2-86d0-4e4d-b726-009365de5920", "options": { "path": "gain.value" }, "output": false, "isOutput": false, "defaultValue": "7.59" }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "62d40b9c-4f11-40d3-a75e-ab78277fa9aa", "output": true, "isOutput": false }] } }, { "id": "635a8d95-47d9-4cbf-a527-2c3b59d872d1", "position": { "x": 1300, "y": 29, "z": 0 }, "data": { "id": "93947a33-6427-4e60-8738-4a4af852211c", "type": "MEPH.audio.graph.node.OscillatorNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "44655c21-8a25-40db-ac36-cd8a907aab85", "options": null, "output": false, "isOutput": false }, { "name": "detune", "title": "detune", "type": "Number", "id": "b4b440ea-8770-49b1-a9a8-3edcd27f0e57", "options": { "path": "detune.value" }, "output": false, "isOutput": false, "defaultValue": "2.05" }, { "name": "frequency", "title": "frequency", "type": "Number", "id": "dd438397-3336-4968-92f7-372712dad26c", "options": { "path": "frequency.value" }, "output": false, "isOutput": false, "defaultValue": "2.32" }, { "name": "type", "title": "type", "type": "String", "id": "b0a734ea-d02e-417a-9d1b-46fac1f596a5", "options": { "values": ["sine", "square", "sawtooth", "triangle", "custom"] }, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "b8c8a263-3fb3-4530-93db-d27701ab1528", "output": true, "isOutput": false }] } }, { "id": "e022d284-b611-431b-a546-9bce37a3b0e0", "position": { "x": 1556, "y": 26, "z": 0 }, "data": { "id": "fdc7d502-e2ca-49f4-a633-0b91e534e996", "type": "MEPH.audio.graph.node.PannerNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "1c9beda4-0d65-460e-828a-3cfd805af448", "options": null, "output": false, "isOutput": false }, { "name": "coneInnerAngle", "title": "coneInnerAngle", "type": "Number", "id": "aa77cf87-6eeb-4671-a3d4-1c1ba81a5e5a", "options": null, "output": false, "isOutput": false, "defaultValue": "3.04" }, { "name": "coneOuterAngle", "title": "coneOuterAngle", "type": "Number", "id": "1a902688-0fbe-421f-8889-ebf1c0ab82b3", "options": null, "output": false, "isOutput": false, "defaultValue": "2.5" }, { "name": "coneOuterGain", "title": "coneOuterGain", "type": "Number", "id": "5b6b08fa-3a34-406d-bd5e-480a5ca577af", "options": null, "output": false, "isOutput": false, "defaultValue": "2.68" }, { "name": "refDistance", "title": "refDistance", "type": "Number", "id": "ff17476a-4246-4010-9346-9c05a4c640d4", "options": null, "output": false, "isOutput": false, "defaultValue": "1.7" }, { "name": "rolloffFactor", "title": "rolloffFactor", "type": "Number", "id": "326a60a0-02e2-46b7-9ccb-ce3a78df4922", "options": null, "output": false, "isOutput": false, "defaultValue": "2.23" }, { "name": "panningModel", "title": "panningModel", "type": "String", "id": "4c4b23bc-3076-4d6a-8aa0-0032099b08ca", "options": { "values": ["equalpower", "HRTF"] }, "output": false, "isOutput": false }, { "name": "distanceModel", "title": "distanceModel", "type": "String", "id": "a03d1c6b-a2ad-4c90-8e8f-e6b30ce2c9cc", "options": { "values": ["linear", "inverse", "exponential"] }, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "8a9bb31b-cafa-4c0b-b9f6-042c4da4995c", "output": true, "isOutput": false }] } }, { "id": "87bbba5a-8e16-4deb-8c79-5755754d4fb3", "position": { "x": 1784, "y": 93, "z": 0 }, "data": { "id": "22f56325-0ddf-4d56-8076-e146888356ec", "type": "MEPH.audio.graph.node.WaveShaperNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "26a6e8e0-5d5d-4462-b141-f7935f9a7b37", "options": null, "output": false, "isOutput": false }, { "name": "curve", "title": "curve", "type": "Number", "id": "d90c7380-e362-4c82-9953-f3fdf951f2cc", "options": null, "output": false, "isOutput": false, "defaultValue": "3.3" }, { "name": "oversample", "title": "oversample", "type": "String", "id": "14758a95-cea4-4031-8fbf-f7b95956c22c", "options": { "values": ["none", "2x", "4x"] }, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "182232b0-95f8-4a39-a6fd-837d6e0456ad", "output": true, "isOutput": false }] } }] }
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

    it('can get inputs for a node.', function () {
        var reader = new MEPH.audio.graph.AudioGraphReader();
        reader.setGraph(graph);

        var root = reader.getRoot();
        var inputs = reader.getInputs(root);

        expect(inputs.length).toBeTruthy();

    });

    it('can take inputs and construct the audio node', function () {
        var reader = new MEPH.audio.graph.AudioGraphReader();
        reader.setGraph(graph);
        var root = reader.getRoot();
        var inputs = reader.getInputs(root);
        var audionode = reader.constructAudioNode(root, inputs);
        expect(audionode).toBeTruthy();
    });

    it('can create a MEPH.audio.graph.node.BiquadFilter node', function () {
        var reader = new MEPH.audio.graph.AudioGraphReader();
        reader.setGraph(graph);
        var n = graph.nodes.first(function (x) { return x.data.type === 'MEPH.audio.graph.node.BiquadFilter'; });
        var inputs = reader.getInputs(n);

        var audionode = reader.constructAudioNode(n, inputs);

        expect(audionode).toBeTruthy();
        expect(audionode.gain).toBe(null);
        expect(audionode.frequency).toBe(null);
        expect(audionode.type).toBe(null);
        expect(audionode.buffer).toBeTruthy();
        expect(audionode.detune).toBeTruthy();

    });

    it('can create a MEPH.audio.graph.node.PannerNode node', function () {
        var reader = new MEPH.audio.graph.AudioGraphReader();
        reader.setGraph(graph);
        var n = graph.nodes.first(function (x) { return x.data.type === 'MEPH.audio.graph.node.PannerNode'; });
        var inputs = reader.getInputs(n);

        var audionode = reader.constructAudioNode(n, inputs);

        expect(audionode).toBeTruthy();
        expect(audionode.hasOwnProperty('coneInnerAngle')).toBeTruthy();
        expect(audionode.hasOwnProperty('coneOuterAngle')).toBeTruthy();
        expect(audionode.hasOwnProperty('coneOuterGain')).toBeTruthy();
        expect(audionode.hasOwnProperty('refDistance')).toBeTruthy();
        expect(audionode.hasOwnProperty('rolloffFactor')).toBeTruthy();
        expect(audionode.hasOwnProperty('panningModel')).toBeTruthy();
        expect(audionode.hasOwnProperty('buffer')).toBeTruthy();

    });

    it('can create a MEPH.audio.graph.node.AudioBufferSourceNode', function () {
        //
        var reader = new MEPH.audio.graph.AudioGraphReader();
        reader.setGraph(largegraph);
        var n = largegraph.nodes.first(function (x) { return x.data.type === 'MEPH.audio.graph.node.AudioBufferSourceNode'; });

        var inputs = reader.getInputs(n);

        var audionode = reader.constructAudioNode(n, inputs);

        expect(audionode).toBeTruthy();
        expect(audionode.hasOwnProperty('source')).toBeTruthy();
        expect(audionode.hasOwnProperty('loop')).toBeTruthy();
        expect(audionode.hasOwnProperty('loopEnd')).toBeTruthy();
        expect(audionode.hasOwnProperty('loopStart')).toBeTruthy();
        expect(audionode.hasOwnProperty('playbackRate')).toBeTruthy();

    });

    it('can create a MEPH.audio.graph.node.ChannelMergerNode ', function () {
        var reader = new MEPH.audio.graph.AudioGraphReader();
        reader.setGraph(largegraph);
        var n = largegraph.nodes.first(function (x) {
            return x.data.type === 'MEPH.audio.graph.node.ChannelMergerNode';
        });

        var inputs = reader.getInputs(n);

        var audionode = reader.constructAudioNode(n, inputs);

        expect(audionode).toBeTruthy();
        expect(audionode.hasOwnProperty('buffer')).toBeTruthy();
        expect(audionode.hasOwnProperty('buffer2')).toBeTruthy();
        expect(audionode.hasOwnProperty('buffer3')).toBeTruthy();
        expect(audionode.hasOwnProperty('buffer4')).toBeTruthy();
    });

    it('can create a MEPH.audio.graph.node.ChannelSplitterNode', function () {
        var reader = new MEPH.audio.graph.AudioGraphReader();
        reader.setGraph(largegraph);
        var n = largegraph.nodes.first(function (x) {
            return x.data.type === 'MEPH.audio.graph.node.ChannelSplitterNode';
        });

        var inputs = reader.getInputs(n);

        var audionode = reader.constructAudioNode(n, inputs);

        expect(audionode).toBeTruthy();
        expect(audionode.hasOwnProperty('buffer')).toBeTruthy();
    });

    it('can create a MEPH.audio.graph.node.Convolver', function () {
        var reader = new MEPH.audio.graph.AudioGraphReader();
        reader.setGraph(largegraph);
        var n = largegraph.nodes.first(function (x) {
            return x.data.type === 'MEPH.audio.graph.node.Convolver';
        });

        var inputs = reader.getInputs(n);

        var audionode = reader.constructAudioNode(n, inputs);

        expect(audionode).toBeTruthy();
        expect(audionode.hasOwnProperty('normalize')).toBeTruthy();
        expect(audionode.hasOwnProperty('buffer')).toBeTruthy();
    });

    it('can create a MEPH.audio.graph.node.DelayNode', function () {
        var reader = new MEPH.audio.graph.AudioGraphReader();
        reader.setGraph(largegraph);
        var n = largegraph.nodes.first(function (x) {
            return x.data.type === 'MEPH.audio.graph.node.DelayNode';
        });

        var inputs = reader.getInputs(n);

        var audionode = reader.constructAudioNode(n, inputs);

        expect(audionode).toBeTruthy();
        expect(audionode.hasOwnProperty('delayTime')).toBeTruthy();
        expect(audionode.hasOwnProperty('buffer')).toBeTruthy();
    });

    it('can create a MEPH.audio.graph.node.DynamicsCompressorNode', function () {
        var reader = new MEPH.audio.graph.AudioGraphReader();
        reader.setGraph(largegraph);
        var n = largegraph.nodes.first(function (x) {
            return x.data.type === 'MEPH.audio.graph.node.DynamicsCompressorNode';
        });

        var inputs = reader.getInputs(n);

        var audionode = reader.constructAudioNode(n, inputs);

        expect(audionode).toBeTruthy();
        expect(audionode.hasOwnProperty('attack')).toBeTruthy();
        expect(audionode.hasOwnProperty('knee')).toBeTruthy();
        expect(audionode.hasOwnProperty('ratio')).toBeTruthy();
        expect(audionode.hasOwnProperty('reduction')).toBeTruthy();
        expect(audionode.hasOwnProperty('release')).toBeTruthy();
        expect(audionode.hasOwnProperty('threshold')).toBeTruthy();
        expect(audionode.hasOwnProperty('buffer')).toBeTruthy();
    });

    it('can create a MEPH.audio.graph.node.GainNode', function () {
        var reader = new MEPH.audio.graph.AudioGraphReader();
        reader.setGraph(largegraph);
        var n = largegraph.nodes.first(function (x) {
            return x.data.type === 'MEPH.audio.graph.node.GainNode';
        });

        var inputs = reader.getInputs(n);

        var audionode = reader.constructAudioNode(n, inputs);

        expect(audionode).toBeTruthy();
        expect(audionode.hasOwnProperty('buffer')).toBeTruthy();
        expect(audionode.hasOwnProperty('gain')).toBeTruthy();
    });

    it('can create a MEPH.audio.graph.node.OscillatorNode', function () {
        var reader = new MEPH.audio.graph.AudioGraphReader();
        reader.setGraph(largegraph);
        var n = largegraph.nodes.first(function (x) {
            return x.data.type === 'MEPH.audio.graph.node.OscillatorNode';
        });

        var inputs = reader.getInputs(n);

        var audionode = reader.constructAudioNode(n, inputs);

        expect(audionode).toBeTruthy();
        expect(audionode.hasOwnProperty('buffer')).toBeTruthy();
        expect(audionode.hasOwnProperty('frequency')).toBeTruthy();
        expect(audionode.hasOwnProperty('detune')).toBeTruthy();
        expect(audionode.hasOwnProperty('type')).toBeTruthy();
    });


    it('can create a MEPH.audio.graph.node.WaveShaperNode', function () {
        var reader = new MEPH.audio.graph.AudioGraphReader();
        reader.setGraph(largegraph);
        var n = largegraph.nodes.first(function (x) {
            return x.data.type === 'MEPH.audio.graph.node.WaveShaperNode';
        });

        var inputs = reader.getInputs(n);

        var audionode = reader.constructAudioNode(n, inputs);

        expect(audionode).toBeTruthy();
        expect(audionode.hasOwnProperty('buffer')).toBeTruthy();
        expect(audionode.hasOwnProperty('curve')).toBeTruthy();
        expect(audionode.hasOwnProperty('oversample')).toBeTruthy();
    });


    it('can construct an audio object for playin sounds', function () {
        var reader = new MEPH.audio.graph.AudioGraphReader();
        reader.setGraph(largegraph);
        var audio = reader.constructAudioNodeList();
        expect(audio).toBeTruthy();
    });

})