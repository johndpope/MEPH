describe("MEPH/audio/graph/AudioGraphReader.spec.js", 'MEPH.audio.graph.AudioGraphReader', function () {
    var graph, seed, largegraph, splitgraph, feathergraph,deepseed;
    beforeEach(function () {
        jasmine.addMatchers(MEPH.customMatchers);
        splitgraph = { "connections": [{ "id": "ddd81b59-5ba5-45d6-9a7d-9fa36e9ab3b4", "nodes": ["995fabb6-f1c2-4313-bb9a-abfd83e54625", "ec74ae2f-8402-434c-8713-d571363aba56"], "zones": ["995fabb6-f1c2-4313-bb9a-abfd83e54625-bufferoutput-connector", "ec74ae2f-8402-434c-8713-d571363aba56-bufferinput-connector"] }, { "id": "03101829-a5cd-4573-9d16-0f3edd11cfb2", "nodes": ["ec74ae2f-8402-434c-8713-d571363aba56", "03b40752-4e01-45a1-81e6-b708bae992f5"], "zones": ["ec74ae2f-8402-434c-8713-d571363aba56-bufferoutput-connector", "03b40752-4e01-45a1-81e6-b708bae992f5-bufferinput-connector"] }, { "id": "0fc23b3c-00c1-42ab-972e-7d37cfba741c", "nodes": ["ec74ae2f-8402-434c-8713-d571363aba56", "03b40752-4e01-45a1-81e6-b708bae992f5"], "zones": ["ec74ae2f-8402-434c-8713-d571363aba56-buffer2output-connector", "03b40752-4e01-45a1-81e6-b708bae992f5-buffer2input-connector"] }, { "id": "4243c58b-916a-438c-be67-650e9049321f", "nodes": ["03b40752-4e01-45a1-81e6-b708bae992f5", "814c608e-4b3c-40ba-88c3-113854447a65"], "zones": ["03b40752-4e01-45a1-81e6-b708bae992f5-bufferoutput-connector", "814c608e-4b3c-40ba-88c3-113854447a65-bufferinput-connector"] }], "nodes": [{ "id": "995fabb6-f1c2-4313-bb9a-abfd83e54625", "position": { "x": 213, "y": 125, "z": 0 }, "data": { "id": "3bc480e1-9bcc-45a8-b2b6-551c66d57520", "type": "MEPH.audio.graph.node.OscillatorNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "ec6d666b-fe7e-4b11-9643-39b9a36208e6", "options": null, "output": false, "isOutput": false }, { "name": "detune", "title": "detune", "type": "Number", "id": "9e48f4f4-b66b-4578-b8d4-ae241eb7d9c5", "options": { "path": "detune.value" }, "output": false, "isOutput": false }, { "name": "frequency", "title": "frequency", "type": "Number", "id": "8f103574-68ce-4adb-81a3-3656275a5d39", "options": { "path": "frequency.value" }, "output": false, "isOutput": false }, { "name": "type", "title": "type", "type": "String", "id": "b31c1eed-ac52-4881-9ba6-c0bbf5707204", "options": { "values": ["sine", "square", "sawtooth", "triangle", "custom"] }, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "37e349da-bc33-4e9d-b03d-6052d3547dc1", "output": true, "isOutput": false }] } }, { "id": "ec74ae2f-8402-434c-8713-d571363aba56", "position": { "x": 485, "y": 104, "z": 0 }, "data": { "id": "6fdbb205-643b-4af5-877e-d695a12bae6d", "type": "MEPH.audio.graph.node.ChannelSplitterNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "c31fc065-4fbf-42e2-b4a7-6b6a9592ee6f", "options": null, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "e2fb73ba-ba2d-4cf3-8d61-61febf08a660", "output": true, "isOutput": false }, { "name": "buffer2", "title": "buffer2", "type": "AudioBuffer", "id": "5bccca76-3b3c-4240-81a0-b23e98cbb7ca", "output": true, "isOutput": false }, { "name": "buffer3", "title": "buffer3", "type": "AudioBuffer", "id": "ce09b0bf-97da-4652-bb63-8c6ba8d19339", "output": true, "isOutput": false }, { "name": "buffer4", "title": "buffer4", "type": "AudioBuffer", "id": "10b6f63b-b613-4f38-b08b-69d106552ca9", "output": true, "isOutput": false }] } }, { "id": "03b40752-4e01-45a1-81e6-b708bae992f5", "position": { "x": 724, "y": 141, "z": 0 }, "data": { "id": "e5db50db-96f8-4b22-84c1-c17bda40f29c", "type": "MEPH.audio.graph.node.ChannelMergerNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "7d47006b-abff-4581-b529-9df7b8a0e2ad", "options": { "count": 100 }, "output": false, "isOutput": false }, { "name": "buffer2", "title": "buffer2", "type": "AudioBuffer", "id": "7508e50d-8b74-4f7b-a2b0-b08e4a22bb8b", "options": null, "output": false, "isOutput": false }, { "name": "buffer3", "title": "buffer3", "type": "AudioBuffer", "id": "75ce6d5d-0cdc-44af-b573-512120f2e634", "options": null, "output": false, "isOutput": false }, { "name": "buffer4", "title": "buffer4", "type": "AudioBuffer", "id": "68d20ca1-cdc1-4531-81ca-6d7523a7ff44", "options": null, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "e66149ea-5772-4792-ac9b-0acc06920cea", "output": true, "isOutput": false }] } }, { "id": "814c608e-4b3c-40ba-88c3-113854447a65", "position": { "x": 1009, "y": 146, "z": 0 }, "data": { "id": "f8d6be0c-9267-4dfa-b603-821a92f158d0", "type": "MEPH.audio.graph.node.GainNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "b0def547-bc55-4073-9ca0-78bc84b5269b", "options": null, "output": false, "isOutput": false }, { "name": "gain", "title": "gain", "type": "Number", "id": "dc8dda41-a8cb-476d-95b0-d07a87db998d", "options": { "path": "gain.value" }, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "0a7823a4-83fb-4ede-81c5-a537bbaa4f74", "output": true, "isOutput": false }] } }] };
        largegraph = { "connections": [{ "id": "e31c3889-8b37-420f-8c38-f3f0e47f1b52", "nodes": ["75418304-a0df-4199-a738-98826665e424", "c7d4b365-2df1-494f-973c-490f0e00caef"], "zones": ["75418304-a0df-4199-a738-98826665e424-bufferoutput-connector", "c7d4b365-2df1-494f-973c-490f0e00caef-bufferinput-connector"] }, { "id": "f39aa42c-aa7d-474d-a40d-1bef9d284c8e", "nodes": ["75418304-a0df-4199-a738-98826665e424", "c7d4b365-2df1-494f-973c-490f0e00caef"], "zones": ["75418304-a0df-4199-a738-98826665e424-buffer2output-connector", "c7d4b365-2df1-494f-973c-490f0e00caef-buffer2input-connector"] }, { "id": "1892e02e-3ec7-4806-b5c3-fb1c7f2a13ee", "nodes": ["c7d4b365-2df1-494f-973c-490f0e00caef", "75418304-a0df-4199-a738-98826665e424"], "zones": ["c7d4b365-2df1-494f-973c-490f0e00caef-buffer3input-connector", "75418304-a0df-4199-a738-98826665e424-buffer3output-connector"] }, { "id": "256de516-77ff-4c0c-9801-51540cfb259d", "nodes": ["75418304-a0df-4199-a738-98826665e424", "c7d4b365-2df1-494f-973c-490f0e00caef"], "zones": ["75418304-a0df-4199-a738-98826665e424-buffer4output-connector", "c7d4b365-2df1-494f-973c-490f0e00caef-buffer4input-connector"] }, { "id": "34431010-b447-4b22-94fd-6b52a73668a3", "nodes": ["7d624fe4-a172-497f-ad58-a83afca33e97", "75418304-a0df-4199-a738-98826665e424"], "zones": ["7d624fe4-a172-497f-ad58-a83afca33e97-bufferoutput-connector", "75418304-a0df-4199-a738-98826665e424-bufferinput-connector"] }, { "id": "33992ef1-be56-4920-81c1-03b1bcd7e57d", "nodes": ["813b4aaa-2315-4378-a7e3-20158a06e7a2", "7d624fe4-a172-497f-ad58-a83afca33e97"], "zones": ["813b4aaa-2315-4378-a7e3-20158a06e7a2-bufferoutput-connector", "7d624fe4-a172-497f-ad58-a83afca33e97-bufferinput-connector"] }, { "id": "fc0c859f-c827-43d4-8719-e38a622ba63c", "nodes": ["1860ca16-c3ff-4ea5-a318-86c12d34074f", "813b4aaa-2315-4378-a7e3-20158a06e7a2"], "zones": ["1860ca16-c3ff-4ea5-a318-86c12d34074f-bufferoutput-connector", "813b4aaa-2315-4378-a7e3-20158a06e7a2-bufferinput-connector"] }, { "id": "d6a6c4f6-170a-425d-a20e-93ff1dfcec63", "nodes": ["c36241d7-cf92-4f04-b692-7edc65fc3a01", "1860ca16-c3ff-4ea5-a318-86c12d34074f"], "zones": ["c36241d7-cf92-4f04-b692-7edc65fc3a01-bufferoutput-connector", "1860ca16-c3ff-4ea5-a318-86c12d34074f-bufferinput-connector"] }, { "id": "720aeb8e-42aa-4720-a1ff-f6e53d1bc66a", "nodes": ["e022d284-b611-431b-a546-9bce37a3b0e0", "87bbba5a-8e16-4deb-8c79-5755754d4fb3"], "zones": ["e022d284-b611-431b-a546-9bce37a3b0e0-bufferoutput-connector", "87bbba5a-8e16-4deb-8c79-5755754d4fb3-bufferinput-connector"] }, { "id": "a9f93b28-0087-40f3-a560-93faa575c26c", "nodes": ["635a8d95-47d9-4cbf-a527-2c3b59d872d1", "e022d284-b611-431b-a546-9bce37a3b0e0"], "zones": ["635a8d95-47d9-4cbf-a527-2c3b59d872d1-bufferoutput-connector", "e022d284-b611-431b-a546-9bce37a3b0e0-bufferinput-connector"] }, { "id": "fb94facd-3253-4222-8cb2-a448039d752b", "nodes": ["f1ccb178-b4ce-4c54-b1ad-941b1fbdf667", "635a8d95-47d9-4cbf-a527-2c3b59d872d1"], "zones": ["f1ccb178-b4ce-4c54-b1ad-941b1fbdf667-bufferoutput-connector", "635a8d95-47d9-4cbf-a527-2c3b59d872d1-bufferinput-connector"] }, { "id": "df2dbf96-c1a0-48f4-8ab8-79ffc1fe43d0", "nodes": ["afd8ab99-754a-46ad-b281-2d1b1790258c", "c7d4b365-2df1-494f-973c-490f0e00caef"], "zones": ["afd8ab99-754a-46ad-b281-2d1b1790258c-bufferinput-connector", "c7d4b365-2df1-494f-973c-490f0e00caef-bufferoutput-connector"] }, { "id": "a5457ea5-324e-4aa2-9683-522bd5c9356e", "nodes": ["afd8ab99-754a-46ad-b281-2d1b1790258c", "f1ccb178-b4ce-4c54-b1ad-941b1fbdf667"], "zones": ["afd8ab99-754a-46ad-b281-2d1b1790258c-bufferoutput-connector", "f1ccb178-b4ce-4c54-b1ad-941b1fbdf667-bufferinput-connector"] }], "nodes": [{ "id": "c7d4b365-2df1-494f-973c-490f0e00caef", "position": { "x": 626, "y": 162, "z": 0 }, "data": { "id": "95822bd5-3256-4c11-889f-cf3d630fb584", "type": "MEPH.audio.graph.node.ChannelMergerNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "3ddff32e-ad1a-49cc-bdee-16cf17a8b47a", "options": { "count": 100 }, "output": false, "isOutput": false }, { "name": "buffer2", "title": "buffer2", "type": "AudioBuffer", "id": "789116e4-d9c8-4f65-b112-259a934c84c7", "output": true, "isOutput": false }, { "name": "buffer3", "title": "buffer3", "type": "AudioBuffer", "id": "3d26006e-5209-4154-8886-c2461a91df35", "output": true, "isOutput": false }, { "name": "buffer4", "title": "buffer4", "type": "AudioBuffer", "id": "a7c74baa-e047-4ecf-b42a-c2ac4e8a7961", "output": true, "isOutput": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "ce6d0f2f-d7af-453a-b55f-d75734578bc4", "output": true, "isOutput": false }] } }, { "id": "75418304-a0df-4199-a738-98826665e424", "position": { "x": 404, "y": 189, "z": 0 }, "data": { "id": "ef6dab5d-27a2-4a08-b28d-34450720cc44", "type": "MEPH.audio.graph.node.ChannelSplitterNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "45d24287-0e3f-4548-ac3c-4e364f0c6da0", "options": null, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "629884d0-eb78-4860-9df8-fc52333da4fc", "output": true, "isOutput": false }, { "name": "buffer2", "title": "buffer2", "type": "AudioBuffer", "id": "1aa6fa71-69e2-4f08-a745-ed2d4854ef41", "output": true, "isOutput": false }, { "name": "buffer3", "title": "buffer3", "type": "AudioBuffer", "id": "09b2481b-7fbc-4f01-a55c-0bf96ca4b863", "output": true, "isOutput": false }, { "name": "buffer4", "title": "buffer4", "type": "AudioBuffer", "id": "9f1c6316-ae26-4648-9e2f-ef5af63d04a5", "output": true, "isOutput": false }] } }, { "id": "7d624fe4-a172-497f-ad58-a83afca33e97", "position": { "x": 175, "y": 186, "z": 0 }, "data": { "id": "00fc8748-f986-453d-b696-3bc9a762d370", "type": "MEPH.audio.graph.node.BiquadFilter", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "35dc0692-e821-4ad2-9d58-eeda4f794abc", "options": null, "output": false, "isOutput": false }, { "name": "q", "title": "q", "type": "Number", "id": "5b5e5dea-9d0d-45b9-a787-f4e2294eddca", "options": { "path": "Q.value" }, "output": false, "isOutput": false, "defaultValue": "2.14" }, { "name": "frequency", "title": "frequency", "type": "Number", "id": "7ddc0dcd-cd7e-435b-8ad5-2f2a599fe20a", "options": { "path": "frequency.value" }, "output": false, "isOutput": false, "defaultValue": "2.41" }, { "name": "detune", "title": "detune", "type": "Number", "id": "8feaaeaa-09bd-4117-a224-bbc12a226de0", "options": { "path": "detune.value" }, "output": false, "isOutput": false, "defaultValue": "3.3" }, { "name": "gain", "title": "gain", "type": "Number", "id": "2fdbe17d-7634-400d-9987-806da6bef793", "options": { "path": "gain.value" }, "output": false, "isOutput": false, "defaultValue": "3.04" }, { "name": "type", "title": "type", "type": "String", "id": "2236b7f2-d433-4c0a-8727-459c48938c99", "options": { "values": ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "peaking", "notch", "allpass"] }, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "a6f6e4ac-4b17-481c-861e-78d69a77cbcb", "output": true, "isOutput": false }] } }, { "id": "813b4aaa-2315-4378-a7e3-20158a06e7a2", "position": { "x": -63, "y": 222, "z": 0 }, "data": { "id": "d5e763bf-e974-40ae-97bb-5c33518c7519", "type": "MEPH.audio.graph.node.DelayNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "58000b4a-d108-4579-89f4-7dca43d0d6bc", "options": null, "output": false, "isOutput": false }, { "name": "delayTime", "title": "delayTime", "type": "Number", "id": "d34070df-a600-4b43-87b6-3a567331b10b", "options": { "path": "delayTime.value" }, "output": false, "isOutput": false, "defaultValue": "3.13" }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "aa83fdb7-e5fc-4a4b-9950-1a76391a96a8", "output": true, "isOutput": false }] } }, { "id": "c36241d7-cf92-4f04-b692-7edc65fc3a01", "position": { "x": -480, "y": 131, "z": 0 }, "data": { "id": "efdbf0ae-d7ab-41e0-b46e-32b0b569072e", "type": "MEPH.audio.graph.node.AudioBufferSourceNode", "nodeInputs": [{ "name": "source", "title": "source", "type": "String", "id": "08cfe668-a636-473c-b0f1-36bda653027e", "options": null, "output": false, "isOutput": false }, { "name": "loop", "title": "loop", "type": "boolean", "id": "05ef0127-f6ec-4b92-b972-2c65df18ca83", "options": null, "output": false, "isOutput": false }, { "name": "loopEnd", "title": "loopEnd", "type": "Number", "id": "9a582f22-9661-4322-9f13-b72001113ca2", "options": null, "output": false, "isOutput": false, "defaultValue": "3.57" }, { "name": "loopStart", "title": "loopStart", "type": "Number", "id": "4dc0cf39-b6b8-4a05-a35f-f48911f929e0", "options": null, "output": false, "isOutput": false, "defaultValue": "3.93" }, { "name": "playbackRate", "title": "playbackRate", "type": "Number", "id": "6f56c083-5f9f-485c-b8e6-01f6d91b0383", "options": { "path": "playbackRate.value" }, "output": false, "isOutput": false, "defaultValue": "3.57" }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "a73a15d9-c1f8-4f23-8567-7cd62efcfc20", "output": true, "isOutput": false }] } }, { "id": "1860ca16-c3ff-4ea5-a318-86c12d34074f", "position": { "x": -273, "y": 185, "z": 0 }, "data": { "id": "ca9e1828-7f15-43c9-9b6a-dd93c7e50665", "type": "MEPH.audio.graph.node.Convolver", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "0330aeea-622b-429d-b455-e142f2fd0dd5", "options": null, "output": false, "isOutput": false }, { "name": "normalize", "title": "normalize", "type": "boolean", "id": "b43558ae-6bcd-4b10-acad-d7b1357f7391", "options": null, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "919488ab-1dea-4ac7-9df1-81fe2e099309", "output": true, "isOutput": false }] } }, { "id": "afd8ab99-754a-46ad-b281-2d1b1790258c", "position": { "x": 847, "y": 79, "z": 0 }, "data": { "id": "1f274eef-8f64-4654-a664-af86b0f5a7c1", "type": "MEPH.audio.graph.node.DynamicsCompressorNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "04afe250-01f4-4beb-8ad7-f4deed45dc26", "options": null, "output": false, "isOutput": false }, { "name": "attack", "title": "attack", "type": "Number", "id": "10d7117f-d648-4830-a815-2d407ae10262", "options": { "path": "attack.value" }, "output": false, "isOutput": false }, { "name": "knee", "title": "knee", "type": "Number", "id": "b003ee10-9f5e-4da9-bd81-4077bc16b5ba", "options": { "path": "knee.value" }, "output": false, "isOutput": false }, { "name": "ratio", "title": "ratio", "type": "Number", "id": "a3717c58-4bc6-4b5e-85c7-606f1a3cbb19", "options": { "path": "ratio.value" }, "output": false, "isOutput": false, "defaultValue": "2.14" }, { "name": "reduction", "title": "reduction", "type": "Number", "id": "88d75feb-c309-4077-b56d-1ff0cb83b01c", "options": { "path": "reduction.value" }, "output": false, "isOutput": false, "defaultValue": "3.04" }, { "name": "release", "title": "release", "type": "Number", "id": "8b0044d5-ac1d-4cdc-9591-c7e682eb1810", "options": { "path": "release.value" }, "output": false, "isOutput": false }, { "name": "threshold", "title": "threshold", "type": "Number", "id": "b962f9e8-d37b-41ca-ae35-341c91d65d09", "options": { "path": "threshold.value" }, "output": false, "isOutput": false, "defaultValue": "3.3" }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "7a9f479f-5a1d-4854-8e10-703de86a2898", "output": true, "isOutput": false }] } }, { "id": "f1ccb178-b4ce-4c54-b1ad-941b1fbdf667", "position": { "x": 1062, "y": 50, "z": 0 }, "data": { "id": "1931ac56-5ba9-4e10-abde-ee8e3feb1904", "type": "MEPH.audio.graph.node.GainNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "3ec46630-76f9-47a2-a1b4-053f991121a8", "options": null, "output": false, "isOutput": false }, { "name": "gain", "title": "gain", "type": "Number", "id": "32ef6ea2-86d0-4e4d-b726-009365de5920", "options": { "path": "gain.value" }, "output": false, "isOutput": false, "defaultValue": "7.59" }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "62d40b9c-4f11-40d3-a75e-ab78277fa9aa", "output": true, "isOutput": false }] } }, { "id": "635a8d95-47d9-4cbf-a527-2c3b59d872d1", "position": { "x": 1300, "y": 29, "z": 0 }, "data": { "id": "93947a33-6427-4e60-8738-4a4af852211c", "type": "MEPH.audio.graph.node.OscillatorNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "44655c21-8a25-40db-ac36-cd8a907aab85", "options": null, "output": false, "isOutput": false }, { "name": "detune", "title": "detune", "type": "Number", "id": "b4b440ea-8770-49b1-a9a8-3edcd27f0e57", "options": { "path": "detune.value" }, "output": false, "isOutput": false, "defaultValue": "2.05" }, { "name": "frequency", "title": "frequency", "type": "Number", "id": "dd438397-3336-4968-92f7-372712dad26c", "options": { "path": "frequency.value" }, "output": false, "isOutput": false, "defaultValue": "2.32" }, { "name": "type", "title": "type", "type": "String", "id": "b0a734ea-d02e-417a-9d1b-46fac1f596a5", "options": { "values": ["sine", "square", "sawtooth", "triangle", "custom"] }, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "b8c8a263-3fb3-4530-93db-d27701ab1528", "output": true, "isOutput": false }] } }, { "id": "e022d284-b611-431b-a546-9bce37a3b0e0", "position": { "x": 1556, "y": 26, "z": 0 }, "data": { "id": "fdc7d502-e2ca-49f4-a633-0b91e534e996", "type": "MEPH.audio.graph.node.PannerNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "1c9beda4-0d65-460e-828a-3cfd805af448", "options": null, "output": false, "isOutput": false }, { "name": "coneInnerAngle", "title": "coneInnerAngle", "type": "Number", "id": "aa77cf87-6eeb-4671-a3d4-1c1ba81a5e5a", "options": null, "output": false, "isOutput": false, "defaultValue": "3.04" }, { "name": "coneOuterAngle", "title": "coneOuterAngle", "type": "Number", "id": "1a902688-0fbe-421f-8889-ebf1c0ab82b3", "options": null, "output": false, "isOutput": false, "defaultValue": "2.5" }, { "name": "coneOuterGain", "title": "coneOuterGain", "type": "Number", "id": "5b6b08fa-3a34-406d-bd5e-480a5ca577af", "options": null, "output": false, "isOutput": false, "defaultValue": "2.68" }, { "name": "refDistance", "title": "refDistance", "type": "Number", "id": "ff17476a-4246-4010-9346-9c05a4c640d4", "options": null, "output": false, "isOutput": false, "defaultValue": "1.7" }, { "name": "rolloffFactor", "title": "rolloffFactor", "type": "Number", "id": "326a60a0-02e2-46b7-9ccb-ce3a78df4922", "options": null, "output": false, "isOutput": false, "defaultValue": "2.23" }, { "name": "panningModel", "title": "panningModel", "type": "String", "id": "4c4b23bc-3076-4d6a-8aa0-0032099b08ca", "options": { "values": ["equalpower", "HRTF"] }, "output": false, "isOutput": false }, { "name": "distanceModel", "title": "distanceModel", "type": "String", "id": "a03d1c6b-a2ad-4c90-8e8f-e6b30ce2c9cc", "options": { "values": ["linear", "inverse", "exponential"] }, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "8a9bb31b-cafa-4c0b-b9f6-042c4da4995c", "output": true, "isOutput": false }] } }, { "id": "87bbba5a-8e16-4deb-8c79-5755754d4fb3", "position": { "x": 1784, "y": 93, "z": 0 }, "data": { "id": "22f56325-0ddf-4d56-8076-e146888356ec", "type": "MEPH.audio.graph.node.WaveShaperNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "26a6e8e0-5d5d-4462-b141-f7935f9a7b37", "options": null, "output": false, "isOutput": false }, { "name": "curve", "title": "curve", "type": "Number", "id": "d90c7380-e362-4c82-9953-f3fdf951f2cc", "options": null, "output": false, "isOutput": false, "defaultValue": "3.3" }, { "name": "oversample", "title": "oversample", "type": "String", "id": "14758a95-cea4-4031-8fbf-f7b95956c22c", "options": { "values": ["none", "2x", "4x"] }, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "182232b0-95f8-4a39-a6fd-837d6e0456ad", "output": true, "isOutput": false }] } }] }
        feathergraph = { "connections": [{ "id": "7a956c5a-2e92-4dc2-b7d2-96567bc0a376", "nodes": ["22d6afaf-737f-4984-84f1-ddba767d672f", "5a320214-91e1-4bf1-a59a-4b770f61a4c8"], "zones": ["22d6afaf-737f-4984-84f1-ddba767d672f-bufferoutput-connector", "5a320214-91e1-4bf1-a59a-4b770f61a4c8-bufferinput-connector"] }, { "id": "c605a589-bdaa-4478-b95b-64766f4d82c3", "nodes": ["5a320214-91e1-4bf1-a59a-4b770f61a4c8", "7864d5b2-1d26-48e3-95d6-54cd39d53ac2"], "zones": ["5a320214-91e1-4bf1-a59a-4b770f61a4c8-bufferoutput-connector", "7864d5b2-1d26-48e3-95d6-54cd39d53ac2-bufferinput-connector"] }, { "id": "612e15eb-8672-4b11-9d54-759894328b8f", "nodes": ["22d6afaf-737f-4984-84f1-ddba767d672f", "7864d5b2-1d26-48e3-95d6-54cd39d53ac2"], "zones": ["22d6afaf-737f-4984-84f1-ddba767d672f-bufferoutput-connector", "7864d5b2-1d26-48e3-95d6-54cd39d53ac2-buffer2input-connector"] }, { "id": "33a941cd-e50d-4298-94d4-ce7840cf1d4f", "nodes": ["7864d5b2-1d26-48e3-95d6-54cd39d53ac2", "867f8ff3-d673-4f48-b28d-aa457cdbfc0b"], "zones": ["7864d5b2-1d26-48e3-95d6-54cd39d53ac2-bufferoutput-connector", "867f8ff3-d673-4f48-b28d-aa457cdbfc0b-bufferinput-connector"] }], "nodes": [{ "id": "22d6afaf-737f-4984-84f1-ddba767d672f", "position": { "x": 157, "y": 123, "z": 0 }, "data": { "id": "77fbeef5-36c4-454f-902c-08cd420fa1de", "type": "MEPH.audio.graph.node.OscillatorNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "752cd863-af43-4bba-8bb2-7bda6ebbb00c", "options": null, "output": false, "isOutput": false }, { "name": "detune", "title": "detune", "type": "Number", "id": "7c3a934c-0cfb-4468-93be-28e017e639c0", "options": { "path": "detune.value" }, "output": false, "isOutput": false }, { "name": "frequency", "title": "frequency", "type": "Number", "id": "ea2c010d-0174-4922-83e9-acf6cb47d3fe", "options": { "path": "frequency.value" }, "output": false, "isOutput": false }, { "name": "type", "title": "type", "type": "String", "id": "7495b95c-c7f3-4fa1-bbc4-221dbd46af63", "options": { "values": ["sine", "square", "sawtooth", "triangle", "custom"] }, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "1993c1bc-71ba-435b-b145-649ded1326c5", "output": true, "isOutput": false }] } }, { "id": "7864d5b2-1d26-48e3-95d6-54cd39d53ac2", "position": { "x": 729, "y": 91, "z": 0 }, "data": { "id": "d58fc67d-b701-4d0f-aff3-1fef3e4b656c", "type": "MEPH.audio.graph.node.ChannelMergerNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "0357b80d-7417-4699-af29-4258293ae681", "options": { "count": 100 }, "output": false, "isOutput": false }, { "name": "buffer2", "title": "buffer2", "type": "AudioBuffer", "id": "0b210ad3-a1bc-491a-b776-c40c2e9a46f3", "options": null, "output": false, "isOutput": false }, { "name": "buffer3", "title": "buffer3", "type": "AudioBuffer", "id": "534c2666-9ed0-46bc-beaf-1c0f2d698c6e", "options": null, "output": false, "isOutput": false }, { "name": "buffer4", "title": "buffer4", "type": "AudioBuffer", "id": "99f7ff9c-05bb-42ec-a68b-ed5f5d8d4bfa", "options": null, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "5401dd08-c8a7-4ae2-9878-6a6f052bd258", "output": true, "isOutput": false }] } }, { "id": "5a320214-91e1-4bf1-a59a-4b770f61a4c8", "position": { "x": 441, "y": 58, "z": 0 }, "data": { "id": "9100680f-d0d9-4e9a-9e5a-13e35d6d9915", "type": "MEPH.audio.graph.node.PannerNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "02f983e7-0fdc-46d9-ab45-a97734337bb2", "options": null, "output": false, "isOutput": false }, { "name": "coneInnerAngle", "title": "coneInnerAngle", "type": "Number", "id": "5c2cffa6-8c24-4931-825d-256b48c88f87", "options": null, "output": false, "isOutput": false }, { "name": "coneOuterAngle", "title": "coneOuterAngle", "type": "Number", "id": "18035327-98e0-4c37-973b-63963a43e91b", "options": null, "output": false, "isOutput": false }, { "name": "coneOuterGain", "title": "coneOuterGain", "type": "Number", "id": "65c6bb94-1cc7-46c7-80dd-655b220e6e4c", "options": null, "output": false, "isOutput": false }, { "name": "refDistance", "title": "refDistance", "type": "Number", "id": "4be4c7d1-fa2d-4e21-b169-c7d56e29af3b", "options": null, "output": false, "isOutput": false }, { "name": "rolloffFactor", "title": "rolloffFactor", "type": "Number", "id": "eebc998e-b4db-4c73-8759-ddc3dd80056f", "options": null, "output": false, "isOutput": false }, { "name": "panningModel", "title": "panningModel", "type": "String", "id": "5a77acaf-8f17-48e7-9541-6025d56af569", "options": { "values": ["equalpower", "HRTF"] }, "output": false, "isOutput": false }, { "name": "distanceModel", "title": "distanceModel", "type": "String", "id": "e3366cee-a4f3-41fb-b99d-d11188be7450", "options": { "values": ["linear", "inverse", "exponential"] }, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "bfb12240-8efc-4620-8d91-35ff38981b03", "output": true, "isOutput": false }] } }, { "id": "867f8ff3-d673-4f48-b28d-aa457cdbfc0b", "position": { "x": 1003, "y": 91, "z": 0 }, "data": { "id": "3047547d-c57a-4dd8-ad70-bb9abcbbdbe9", "type": "MEPH.audio.graph.node.GainNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "41f4f60a-66da-4e27-8c8f-13618854ac67", "options": null, "output": false, "isOutput": false }, { "name": "gain", "title": "gain", "type": "Number", "id": "16a7d27f-a6ba-416a-b735-c3bf5722d7b5", "options": { "path": "gain.value" }, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "id": "45eb7749-55de-4e84-89df-efc20a76966a", "output": true, "isOutput": false }] } }] };
        seed = { "connections": [{ "id": "6634500d-dbe9-494a-abde-0231e7351ea9", "nodes": ["6ffc6b32-90ef-445a-9242-72c11fb90c82", "ee5bda49-d7ea-43a3-83af-6d0c24de1f56"], "zones": ["6ffc6b32-90ef-445a-9242-72c11fb90c82-bufferinput-connector", "ee5bda49-d7ea-43a3-83af-6d0c24de1f56-bufferoutput-connector"] }, { "id": "0b80fbbe-fd76-4164-bf08-5af3f1cee0d5", "nodes": ["6ffc6b32-90ef-445a-9242-72c11fb90c82", "ee5bda49-d7ea-43a3-83af-6d0c24de1f56"], "zones": ["6ffc6b32-90ef-445a-9242-72c11fb90c82-normalizeinput-connector", "ee5bda49-d7ea-43a3-83af-6d0c24de1f56-bufferoutput-connector"] }, { "id": "b799e998-9585-4fa9-a69d-4629ddfe1dda", "nodes": ["6ffc6b32-90ef-445a-9242-72c11fb90c82", "623f508d-97d3-4532-aadf-47b8483bc234"], "zones": ["6ffc6b32-90ef-445a-9242-72c11fb90c82-bufferoutput-connector", "623f508d-97d3-4532-aadf-47b8483bc234-bufferinput-connector"] }, { "id": "588f2211-b68f-4f5a-a272-9ee3f0998407", "nodes": ["623f508d-97d3-4532-aadf-47b8483bc234", "0a90b8ef-75a1-4df7-ab03-4ef23a0b7983"], "zones": ["623f508d-97d3-4532-aadf-47b8483bc234-bufferoutput-connector", "0a90b8ef-75a1-4df7-ab03-4ef23a0b7983-bufferinput-connector"] }, { "id": "d9395206-26db-4132-aadf-3cc932bc69e9", "nodes": ["0a90b8ef-75a1-4df7-ab03-4ef23a0b7983", "ee5bda49-d7ea-43a3-83af-6d0c24de1f56"], "zones": ["0a90b8ef-75a1-4df7-ab03-4ef23a0b7983-attack-connector", "ee5bda49-d7ea-43a3-83af-6d0c24de1f56-bufferoutput-connector"] }, { "id": "dbf6afd6-ee2f-4d44-829b-648a9fe4eed1", "nodes": ["0a90b8ef-75a1-4df7-ab03-4ef23a0b7983", "ee5bda49-d7ea-43a3-83af-6d0c24de1f56"], "zones": ["0a90b8ef-75a1-4df7-ab03-4ef23a0b7983-knee-connector", "ee5bda49-d7ea-43a3-83af-6d0c24de1f56-bufferoutput-connector"] }, { "id": "0ce7919e-6cb4-4f6c-8542-a379d3e52c78", "nodes": ["0a90b8ef-75a1-4df7-ab03-4ef23a0b7983", "ee5bda49-d7ea-43a3-83af-6d0c24de1f56"], "zones": ["0a90b8ef-75a1-4df7-ab03-4ef23a0b7983-ratio-connector", "ee5bda49-d7ea-43a3-83af-6d0c24de1f56-bufferoutput-connector"] }, { "id": "db902eb3-827e-4f9f-a865-aaffa4fb11b4", "nodes": ["623f508d-97d3-4532-aadf-47b8483bc234", "d8a85c16-c09d-4b50-a553-23d493b7633d"], "zones": ["623f508d-97d3-4532-aadf-47b8483bc234-buffer2output-connector", "d8a85c16-c09d-4b50-a553-23d493b7633d-bufferinput-connector"] }, { "id": "db895ac4-c900-4885-862e-94420882b5a6", "nodes": ["0a90b8ef-75a1-4df7-ab03-4ef23a0b7983", "39d00021-74f6-4dca-abaa-01f18633c31a"], "zones": ["0a90b8ef-75a1-4df7-ab03-4ef23a0b7983-bufferoutput-connector", "39d00021-74f6-4dca-abaa-01f18633c31a-bufferinput-connector"] }, { "id": "f299e869-5883-464b-96ad-a4718292da60", "nodes": ["d8a85c16-c09d-4b50-a553-23d493b7633d", "39d00021-74f6-4dca-abaa-01f18633c31a"], "zones": ["d8a85c16-c09d-4b50-a553-23d493b7633d-bufferoutput-connector", "39d00021-74f6-4dca-abaa-01f18633c31a-bufferinput-connector"] }], "nodes": [{ "id": "ee5bda49-d7ea-43a3-83af-6d0c24de1f56", "position": { "x": 146, "y": 262, "z": 0 }, "data": { "id": "1d51ee23-3f12-45e4-82a1-01a33d01cbfd", "type": "MEPH.audio.graph.node.InputNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "connector": "6ffc6b32-90ef-445a-9242-72c11fb90c82-bufferinput-connector", "id": "2f586a10-52cd-4607-a830-fe265048ff18", "options": null, "output": false }, { "name": "convolver normalize", "title": "convolver normalize", "type": "boolean", "connector": "6ffc6b32-90ef-445a-9242-72c11fb90c82-normalizeinput-connector", "id": "9c04d317-b752-4823-9b6c-03e10a9d7e38", "options": null, "output": false }, { "name": "dyn attack", "title": "dyn attack", "type": "Number", "connector": "0a90b8ef-75a1-4df7-ab03-4ef23a0b7983-attack-connector", "id": "62b3289e-95ce-49f5-983f-1cb278946d92", "options": null, "output": false }, { "name": "dyn knee", "title": "dyn knee", "type": "Number", "connector": "0a90b8ef-75a1-4df7-ab03-4ef23a0b7983-knee-connector", "id": "de20033b-3c68-4527-8fe9-46ca67d8a96e", "options": null, "output": false }, { "name": "dyn ratio", "title": "dyn ratio", "type": "Number", "connector": "0a90b8ef-75a1-4df7-ab03-4ef23a0b7983-ratio-connector", "id": "c9110427-c987-4935-a66b-53ecf663c847", "options": null, "output": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "Anything", "connector": null, "id": "4a29096e-971a-44c3-9c9a-72435c990cb5", "output": true, "isOutput": false }] } }, { "id": "39d00021-74f6-4dca-abaa-01f18633c31a", "position": { "x": 1567, "y": 206, "z": 0 }, "data": { "id": "805bea5b-05eb-425d-ab0c-857aec24ad66", "type": "MEPH.audio.graph.node.OutputNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "Anything", "connector": null, "id": "6f624af9-e991-44fd-a238-c0a8322dd133", "options": null, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "gain output", "title": "gain output", "type": "AudioBuffer", "connector": "0a90b8ef-75a1-4df7-ab03-4ef23a0b7983-bufferoutput-connector", "id": "e525d3be-8e54-473c-9542-4f73c9e2849b", "output": true }, { "name": "dynamic out", "title": "dynamic out", "type": "AudioBuffer", "connector": "d8a85c16-c09d-4b50-a553-23d493b7633d-bufferoutput-connector", "id": "c6227500-909e-4760-b41f-0cc186553bdf", "output": true }] } }, { "id": "6ffc6b32-90ef-445a-9242-72c11fb90c82", "position": { "x": 427, "y": 122, "z": 0 }, "data": { "id": "68ac4d71-5acc-4e32-8e8d-6a6cec6fc206", "type": "MEPH.audio.graph.node.Convolver", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "connector": null, "id": "ad868211-358f-44b3-83dd-cc032f2427f7", "options": null, "output": false, "isOutput": false }, { "name": "normalize", "title": "normalize", "type": "boolean", "connector": null, "id": "23e7c23c-01d9-4235-9ce9-474fe3e4c317", "options": null, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "connector": null, "id": "649bb2c8-ae1f-40d0-8889-d5900b85db72", "output": true, "isOutput": false }] } }, { "id": "623f508d-97d3-4532-aadf-47b8483bc234", "position": { "x": 685, "y": 122, "z": 0 }, "data": { "id": "39301a5e-4f74-4e76-8604-c92304b86108", "type": "MEPH.audio.graph.node.ChannelSplitterNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "connector": null, "id": "007fdfbe-a36e-43d6-931b-a5f8058e0685", "options": null, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "connector": null, "id": "d39b2505-508c-450d-a03b-2ed7e5e3c709", "output": true, "isOutput": false }, { "name": "buffer2", "title": "buffer2", "type": "AudioBuffer", "connector": null, "id": "811cdbfb-ea1e-4d78-8c27-53079387aac7", "output": true, "isOutput": false }, { "name": "buffer3", "title": "buffer3", "type": "AudioBuffer", "connector": null, "id": "f0ce017c-f558-43ed-ab61-9f5acd18b52e", "output": true, "isOutput": false }, { "name": "buffer4", "title": "buffer4", "type": "AudioBuffer", "connector": null, "id": "78a42222-2dea-4f3c-adc1-f7c135b7fbf6", "output": true, "isOutput": false }] } }, { "id": "0a90b8ef-75a1-4df7-ab03-4ef23a0b7983", "position": { "x": 981, "y": 150, "z": 0 }, "data": { "id": "ddeecf54-7b50-49a0-9ac2-a1ba0b1aef57", "type": "MEPH.audio.graph.node.DynamicsCompressorNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "connector": null, "id": "2b2b04d7-eeba-40be-8a31-a3e99bce5ef8", "options": null, "output": false, "isOutput": false }, { "name": "attack", "title": "attack", "type": "Number", "connector": null, "id": "d0adb5da-6185-46b2-b921-4d4c8e9de391", "options": { "path": "attack.value" }, "output": false, "isOutput": false }, { "name": "knee", "title": "knee", "type": "Number", "connector": null, "id": "cc52a4d4-6235-4ba5-bccc-9426ed0889b8", "options": { "path": "knee.value" }, "output": false, "isOutput": false }, { "name": "ratio", "title": "ratio", "type": "Number", "connector": null, "id": "010917da-f370-421c-9d9c-4c01ca7163ef", "options": { "path": "ratio.value" }, "output": false, "isOutput": false }, { "name": "reduction", "title": "reduction", "type": "Number", "connector": null, "id": "dea5195d-e488-4224-8260-9b3ce9e91902", "options": { "path": "reduction.value" }, "output": false, "isOutput": false, "defaultValue": "0.18" }, { "name": "release", "title": "release", "type": "Number", "connector": null, "id": "d944d433-498d-4379-9263-3556f1b39d50", "options": { "path": "release.value" }, "output": false, "isOutput": false }, { "name": "threshold", "title": "threshold", "type": "Number", "connector": null, "id": "927a2ede-783b-48ae-bef2-da2d86fd8ec7", "options": { "path": "threshold.value" }, "output": false, "isOutput": false, "defaultValue": "0.45" }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "connector": null, "id": "080c5c05-a9fd-4d2d-baa9-6d9f55c30faa", "output": true, "isOutput": false }] } }, { "id": "d8a85c16-c09d-4b50-a553-23d493b7633d", "position": { "x": 1202, "y": 48, "z": 0 }, "data": { "id": "866faa00-3713-406e-9a78-ff97c6d0fb48", "type": "MEPH.audio.graph.node.GainNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "connector": null, "id": "9f27bba3-98e3-42d3-8074-af49e88f0792", "options": null, "output": false, "isOutput": false }, { "name": "gain", "title": "gain", "type": "Number", "connector": null, "id": "c63af8e0-a216-4efb-aa62-aeb6a7e73045", "options": { "path": "gain.value" }, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "connector": null, "id": "9d6b1fe4-18cb-46e3-8370-5a101ace1ee2", "output": true, "isOutput": false }] } }] };
        deepseed = { "connections": [{ "id": "906e25e7-ca3e-40ba-b685-24a5e45e3f73", "nodes": ["23967a02-5c66-4885-9273-2fd2d31a9bfc", "806db083-b119-4a5f-8f39-03a198e70e08"], "zones": ["23967a02-5c66-4885-9273-2fd2d31a9bfc-bufferoutput-connector", "806db083-b119-4a5f-8f39-03a198e70e08-input_b93e0659_1814_45d9_b1c7_11ab66c8a47d-connector"] }, { "id": "d12dcf51-6240-4288-a531-3abb88494d24", "nodes": ["fac068c0-2253-4d16-bc0a-3753a6f68ddd", "23967a02-5c66-4885-9273-2fd2d31a9bfc"], "zones": ["fac068c0-2253-4d16-bc0a-3753a6f68ddd-bufferoutput-connector", "23967a02-5c66-4885-9273-2fd2d31a9bfc-bufferinput-connector"] }, { "id": "81d2c73f-685f-4728-b5aa-f080899265f2", "nodes": ["806db083-b119-4a5f-8f39-03a198e70e08", "37a0500f-86c4-442d-ba69-de2f4fb661e1"], "zones": ["806db083-b119-4a5f-8f39-03a198e70e08-output_4661739b_6418_4901_ae0b_3bcd01875f2c-connector", "37a0500f-86c4-442d-ba69-de2f4fb661e1-bufferinput-connector"] }, { "id": "d782c11a-51ad-4bfb-b257-fbdd98581c0f", "nodes": ["806db083-b119-4a5f-8f39-03a198e70e08", "37a0500f-86c4-442d-ba69-de2f4fb661e1"], "zones": ["806db083-b119-4a5f-8f39-03a198e70e08-output_997dd3db_9985_4032_bc42_c3cc3f2625d9-connector", "37a0500f-86c4-442d-ba69-de2f4fb661e1-bufferinput-connector"] }, { "id": "f976724d-3ede-4585-b0fd-560057836311", "nodes": ["23967a02-5c66-4885-9273-2fd2d31a9bfc", "fac068c0-2253-4d16-bc0a-3753a6f68ddd"], "zones": ["23967a02-5c66-4885-9273-2fd2d31a9bfc-q-connector", "fac068c0-2253-4d16-bc0a-3753a6f68ddd-bufferoutput-connector"] }, { "id": "5c07efa9-7963-4406-95eb-58f9220efce4", "nodes": ["806db083-b119-4a5f-8f39-03a198e70e08", "fac068c0-2253-4d16-bc0a-3753a6f68ddd"], "zones": ["806db083-b119-4a5f-8f39-03a198e70e08-input_6ffe6a23_ade0_485b_b765_b35091300491-connector", "fac068c0-2253-4d16-bc0a-3753a6f68ddd-bufferoutput-connector"] }, { "id": "be3d01a6-6ca9-48bd-83ab-53b49d4784f3", "nodes": ["806db083-b119-4a5f-8f39-03a198e70e08", "fac068c0-2253-4d16-bc0a-3753a6f68ddd"], "zones": ["806db083-b119-4a5f-8f39-03a198e70e08-input_e32ecd39_aee1_436a_98ef_e4ea4347b4cc-connector", "fac068c0-2253-4d16-bc0a-3753a6f68ddd-bufferoutput-connector"] }], "nodes": [{ "id": "806db083-b119-4a5f-8f39-03a198e70e08", "position": { "x": 683, "y": 15, "z": 0 }, "data": { "id": "0932d416-f2dc-4e27-8b44-5474202e593c", "type": "MEPH.audio.graph.node.GeneratedNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "connector": null, "id": "14847a4d-149f-43c4-9a76-68292dda3777", "options": null, "output": false, "isOutput": false }, { "name": "convolver_normalize", "title": "convolver normalize", "type": "boolean", "connector": null, "id": "6f3b1932-eff4-4631-96d0-d589e9b7f04b", "options": null, "output": false, "isOutput": false }, { "name": "dyn_attack", "title": "dyn attack", "type": "Number", "connector": null, "id": "87c7db09-c717-4a21-8a09-48dcc6168679", "options": null, "output": false, "isOutput": false }, { "name": "dyn_knee", "title": "dyn knee", "type": "Number", "connector": null, "id": "e2247948-7aa7-4db8-953a-ee74981f0645", "options": null, "output": false, "isOutput": false }, { "name": "dyn_ratio", "title": "dyn ratio", "type": "Number", "connector": null, "id": "1cb0dc37-986d-4ae6-ab02-a5051353322c", "options": null, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "gain_output", "title": "gain output", "type": "AudioBuffer", "connector": null, "id": "a50bd612-9902-489b-8d64-7263aa2de5c6", "output": true, "isOutput": false }, { "name": "dynamic_out", "title": "dynamic out", "type": "AudioBuffer", "connector": null, "id": "cbb56579-02eb-4a38-998f-ceed336ef805", "output": true, "isOutput": false }], "subGraph": { "connections": [{ "id": "c645b72b-535d-42ca-938e-e1f38bb09c8f", "nodes": ["ce1bd10b-dff0-48a9-b7a4-107dafa2faaf", "13eda045-03cd-4802-9bbc-4ba83d306482"], "zones": ["ce1bd10b-dff0-48a9-b7a4-107dafa2faaf-bufferinput-connector", "13eda045-03cd-4802-9bbc-4ba83d306482-bufferoutput-connector"] }, { "id": "78528e01-45c4-4876-ad0f-f96c93ca5470", "nodes": ["ce1bd10b-dff0-48a9-b7a4-107dafa2faaf", "13eda045-03cd-4802-9bbc-4ba83d306482"], "zones": ["ce1bd10b-dff0-48a9-b7a4-107dafa2faaf-normalizeinput-connector", "13eda045-03cd-4802-9bbc-4ba83d306482-bufferoutput-connector"] }, { "id": "c0a570e5-2a99-418a-867c-c11576d9246b", "nodes": ["ce1bd10b-dff0-48a9-b7a4-107dafa2faaf", "9c18f49e-0cb7-485e-b87a-4a95b29a25cb"], "zones": ["ce1bd10b-dff0-48a9-b7a4-107dafa2faaf-bufferoutput-connector", "9c18f49e-0cb7-485e-b87a-4a95b29a25cb-bufferinput-connector"] }, { "id": "abd0b5f9-0f45-48a8-a36f-8da58c8b626e", "nodes": ["9c18f49e-0cb7-485e-b87a-4a95b29a25cb", "fbd6cb73-316d-4e28-8745-b0e1e9a9aefb"], "zones": ["9c18f49e-0cb7-485e-b87a-4a95b29a25cb-bufferoutput-connector", "fbd6cb73-316d-4e28-8745-b0e1e9a9aefb-bufferinput-connector"] }, { "id": "40e3e891-8c51-43e3-b412-34c0fe4e1e46", "nodes": ["fbd6cb73-316d-4e28-8745-b0e1e9a9aefb", "13eda045-03cd-4802-9bbc-4ba83d306482"], "zones": ["fbd6cb73-316d-4e28-8745-b0e1e9a9aefb-attack-connector", "13eda045-03cd-4802-9bbc-4ba83d306482-bufferoutput-connector"] }, { "id": "a400f25b-dc8d-44f0-bc28-c8367ccfc063", "nodes": ["fbd6cb73-316d-4e28-8745-b0e1e9a9aefb", "13eda045-03cd-4802-9bbc-4ba83d306482"], "zones": ["fbd6cb73-316d-4e28-8745-b0e1e9a9aefb-knee-connector", "13eda045-03cd-4802-9bbc-4ba83d306482-bufferoutput-connector"] }, { "id": "d5fb050e-ca7b-4053-899c-4d8e83b0ff64", "nodes": ["fbd6cb73-316d-4e28-8745-b0e1e9a9aefb", "13eda045-03cd-4802-9bbc-4ba83d306482"], "zones": ["fbd6cb73-316d-4e28-8745-b0e1e9a9aefb-ratio-connector", "13eda045-03cd-4802-9bbc-4ba83d306482-bufferoutput-connector"] }, { "id": "4eb0f6b9-e102-436f-878e-af991191f5b7", "nodes": ["9c18f49e-0cb7-485e-b87a-4a95b29a25cb", "34884661-d5b1-41a8-bc13-469785d9bb9d"], "zones": ["9c18f49e-0cb7-485e-b87a-4a95b29a25cb-buffer2output-connector", "34884661-d5b1-41a8-bc13-469785d9bb9d-bufferinput-connector"] }, { "id": "767c2002-c233-47cd-b409-74f8f4136d51", "nodes": ["fbd6cb73-316d-4e28-8745-b0e1e9a9aefb", "e34ac127-7fa1-4baf-aaa7-395c7a6ddcd1"], "zones": ["fbd6cb73-316d-4e28-8745-b0e1e9a9aefb-bufferoutput-connector", "e34ac127-7fa1-4baf-aaa7-395c7a6ddcd1-bufferinput-connector"] }, { "id": "11fae129-e594-457d-bf3b-37c01bec9d62", "nodes": ["34884661-d5b1-41a8-bc13-469785d9bb9d", "e34ac127-7fa1-4baf-aaa7-395c7a6ddcd1"], "zones": ["34884661-d5b1-41a8-bc13-469785d9bb9d-bufferoutput-connector", "e34ac127-7fa1-4baf-aaa7-395c7a6ddcd1-bufferinput-connector"] }], "nodes": [{ "id": "13eda045-03cd-4802-9bbc-4ba83d306482", "position": { "x": 146, "y": 262, "z": 0 }, "data": { "id": "1d51ee23-3f12-45e4-82a1-01a33d01cbfd", "type": "MEPH.audio.graph.node.InputNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "connector": "ce1bd10b-dff0-48a9-b7a4-107dafa2faaf-bufferinput-connector", "id": "2d60aabc-0077-44e4-bf86-dbd92fa43931", "options": null, "output": false }, { "name": "convolver normalize", "title": "convolver normalize", "type": "boolean", "connector": "ce1bd10b-dff0-48a9-b7a4-107dafa2faaf-normalizeinput-connector", "id": "15e153f3-0680-4d9b-8f42-aa9bbaa7ce23", "options": null, "output": false }, { "name": "dyn attack", "title": "dyn attack", "type": "Number", "connector": "fbd6cb73-316d-4e28-8745-b0e1e9a9aefb-attack-connector", "id": "824c8900-0a6f-417a-a26c-e90f92bb378e", "options": null, "output": false }, { "name": "dyn knee", "title": "dyn knee", "type": "Number", "connector": "fbd6cb73-316d-4e28-8745-b0e1e9a9aefb-knee-connector", "id": "c549babc-d69d-4b01-9c45-bf6570d223a9", "options": null, "output": false }, { "name": "dyn ratio", "title": "dyn ratio", "type": "Number", "connector": "fbd6cb73-316d-4e28-8745-b0e1e9a9aefb-ratio-connector", "id": "0a5df165-a9f3-4056-8c3e-d9632ed8f293", "options": null, "output": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "Anything", "connector": null, "id": "52e28411-c54e-4117-b720-0ce42c6876ac", "output": true, "isOutput": false }] } }, { "id": "e34ac127-7fa1-4baf-aaa7-395c7a6ddcd1", "position": { "x": 1567, "y": 206, "z": 0 }, "data": { "id": "805bea5b-05eb-425d-ab0c-857aec24ad66", "type": "MEPH.audio.graph.node.OutputNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "Anything", "connector": null, "id": "5520d542-0a10-4b13-9aee-cc863946c1ac", "options": null, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "gain output", "title": "gain output", "type": "AudioBuffer", "connector": "fbd6cb73-316d-4e28-8745-b0e1e9a9aefb-bufferoutput-connector", "id": "fccd5d99-04b2-4d37-badf-c79d5ad209f9", "output": true }, { "name": "dynamic out", "title": "dynamic out", "type": "AudioBuffer", "connector": "34884661-d5b1-41a8-bc13-469785d9bb9d-bufferoutput-connector", "id": "abf8a82c-f21a-4f1c-8d85-b18684388829", "output": true }] } }, { "id": "ce1bd10b-dff0-48a9-b7a4-107dafa2faaf", "position": { "x": 427, "y": 122, "z": 0 }, "data": { "id": "68ac4d71-5acc-4e32-8e8d-6a6cec6fc206", "type": "MEPH.audio.graph.node.Convolver", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "connector": null, "id": "37395cd6-d71a-4bd4-a819-94034b01f38f", "options": null, "output": false, "isOutput": false }, { "name": "normalize", "title": "normalize", "type": "boolean", "connector": null, "id": "631a2892-ece3-46f6-a948-dbed22037e91", "options": null, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "connector": null, "id": "8495cbb7-d824-4600-b46f-7c72a69671c9", "output": true, "isOutput": false }] } }, { "id": "9c18f49e-0cb7-485e-b87a-4a95b29a25cb", "position": { "x": 685, "y": 122, "z": 0 }, "data": { "id": "39301a5e-4f74-4e76-8604-c92304b86108", "type": "MEPH.audio.graph.node.ChannelSplitterNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "connector": null, "id": "6a994f7e-4143-453d-bb0d-39a35b4da3ad", "options": null, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "connector": null, "id": "782adcda-9ab6-4169-840b-db943a4a60be", "output": true, "isOutput": false }, { "name": "buffer2", "title": "buffer2", "type": "AudioBuffer", "connector": null, "id": "ae9ae757-5005-4b8a-829e-b09219a66ed9", "output": true, "isOutput": false }, { "name": "buffer3", "title": "buffer3", "type": "AudioBuffer", "connector": null, "id": "d7c709dc-f795-413f-8eb2-90bf47e4cdf8", "output": true, "isOutput": false }, { "name": "buffer4", "title": "buffer4", "type": "AudioBuffer", "connector": null, "id": "568b88a9-eafa-4326-a26b-df26c35f7570", "output": true, "isOutput": false }] } }, { "id": "fbd6cb73-316d-4e28-8745-b0e1e9a9aefb", "position": { "x": 981, "y": 150, "z": 0 }, "data": { "id": "ddeecf54-7b50-49a0-9ac2-a1ba0b1aef57", "type": "MEPH.audio.graph.node.DynamicsCompressorNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "connector": null, "id": "4831a0ef-4743-44bd-b455-169bdfd1fc49", "options": null, "output": false, "isOutput": false }, { "name": "attack", "title": "attack", "type": "Number", "connector": null, "id": "e08a97e1-2de1-4666-8818-c1775eb239f5", "options": { "path": "attack.value" }, "output": false, "isOutput": false }, { "name": "knee", "title": "knee", "type": "Number", "connector": null, "id": "cc3b6063-5282-487d-b1d0-7c1196c4b0c6", "options": { "path": "knee.value" }, "output": false, "isOutput": false }, { "name": "ratio", "title": "ratio", "type": "Number", "connector": null, "id": "977fa241-1079-4b5f-b277-7aab4a645905", "options": { "path": "ratio.value" }, "output": false, "isOutput": false }, { "name": "reduction", "title": "reduction", "type": "Number", "connector": null, "id": "e08ef9c2-0f74-409e-ab98-b849ed5b395d", "options": { "path": "reduction.value" }, "output": false, "isOutput": false, "defaultValue": "0.18" }, { "name": "release", "title": "release", "type": "Number", "connector": null, "id": "b7321bff-2b93-493d-b0b0-002e6fcd4395", "options": { "path": "release.value" }, "output": false, "isOutput": false }, { "name": "threshold", "title": "threshold", "type": "Number", "connector": null, "id": "4005d76e-d211-453a-93ad-ee9745a500bf", "options": { "path": "threshold.value" }, "output": false, "isOutput": false, "defaultValue": "0.45" }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "connector": null, "id": "ffcc2b56-9659-4279-b2f1-52add5d674e3", "output": true, "isOutput": false }] } }, { "id": "34884661-d5b1-41a8-bc13-469785d9bb9d", "position": { "x": 1202, "y": 48, "z": 0 }, "data": { "id": "866faa00-3713-406e-9a78-ff97c6d0fb48", "type": "MEPH.audio.graph.node.GainNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "connector": null, "id": "9e4a2279-01d2-483b-a399-70136e5c7648", "options": null, "output": false, "isOutput": false }, { "name": "gain", "title": "gain", "type": "Number", "connector": null, "id": "11640043-4073-4fbf-a8f7-224d2b1bcee7", "options": { "path": "gain.value" }, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "connector": null, "id": "b09ef93a-132b-47d6-b0cf-72b72b3f4a2f", "output": true, "isOutput": false }] } }] } } }, { "id": "23967a02-5c66-4885-9273-2fd2d31a9bfc", "position": { "x": 367, "y": 32, "z": 0 }, "data": { "id": "c911a3e5-175e-46c3-b7f2-1b8aa23a5e32", "type": "MEPH.audio.graph.node.BiquadFilter", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "connector": null, "id": "9a1a22ce-6350-4980-93b3-f2b86de1fc83", "options": null, "output": false, "isOutput": false }, { "name": "q", "title": "q", "type": "Number", "connector": null, "id": "38d72358-e4a0-4315-a58d-4c2c4578f61b", "options": { "path": "Q.value" }, "output": false, "isOutput": false }, { "name": "frequency", "title": "frequency", "type": "Number", "connector": null, "id": "5c071ef3-e070-4525-b330-3e856e3640a0", "options": { "path": "frequency.value" }, "output": false, "isOutput": false, "defaultValue": "2.86" }, { "name": "detune", "title": "detune", "type": "Number", "connector": null, "id": "a9a62e8f-b293-420d-ad8f-0834192d8d17", "options": { "path": "detune.value" }, "output": false, "isOutput": false, "defaultValue": "0.18" }, { "name": "gain", "title": "gain", "type": "Number", "connector": null, "id": "7eefef0c-b7ad-45fa-b045-0f63a6b3f82f", "options": { "path": "gain.value" }, "output": false, "isOutput": false, "defaultValue": "1.43" }, { "name": "type", "title": "type", "type": "String", "connector": null, "id": "d44019f2-c1fc-4ecf-8a20-dcc5b855cca9", "options": { "values": ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "peaking", "notch", "allpass"] }, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "connector": null, "id": "44b21f53-601b-4d92-81ae-54c8edc006d5", "output": true, "isOutput": false }] } }, { "id": "37a0500f-86c4-442d-ba69-de2f4fb661e1", "position": { "x": 965, "y": 79, "z": 0 }, "data": { "id": "67a4e427-f9fe-41d4-b45c-f72d081c45c3", "type": "MEPH.audio.graph.node.OutputNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "Anything", "connector": null, "id": "d69ebbeb-9e5e-469f-96d0-f95445bbfbd9", "options": null, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "outpua", "title": "outpua", "type": "AudioBuffer", "connector": "806db083-b119-4a5f-8f39-03a198e70e08-output_4661739b_6418_4901_ae0b_3bcd01875f2c-connector", "id": "c2346ecd-347d-4332-81e1-844521874abd", "output": true }, { "name": "alkd", "title": "alkd", "type": "AudioBuffer", "connector": "806db083-b119-4a5f-8f39-03a198e70e08-output_997dd3db_9985_4032_bc42_c3cc3f2625d9-connector", "id": "bbef364e-38a7-407b-bc7c-cdad9ece585e", "output": true }] } }, { "id": "fac068c0-2253-4d16-bc0a-3753a6f68ddd", "position": { "x": 72, "y": 92, "z": 0 }, "data": { "id": "36c9fd21-0b05-48c8-a220-a33551901f46", "type": "MEPH.audio.graph.node.InputNode", "nodeInputs": [{ "name": "bufferinput", "title": "bufferinput", "type": "AudioBuffer", "connector": "23967a02-5c66-4885-9273-2fd2d31a9bfc-bufferinput-connector", "id": "fc7359b6-8468-4296-bf32-39eb6a2d59ca", "options": null, "output": false }, { "name": "q", "title": "q", "type": "Number", "connector": "23967a02-5c66-4885-9273-2fd2d31a9bfc-q-connector", "id": "48a4d72e-e586-468c-ad19-0d32b05e16c0", "options": null, "output": false }, { "name": "ok input", "title": "ok input", "type": "Number", "connector": "806db083-b119-4a5f-8f39-03a198e70e08-input_6ffe6a23_ade0_485b_b765_b35091300491-connector", "id": "1f0974f2-e376-4131-bc24-19cf97fad56e", "options": null, "output": false }, { "name": "3rd input", "title": "3rd input", "type": "boolean", "connector": "806db083-b119-4a5f-8f39-03a198e70e08-input_e32ecd39_aee1_436a_98ef_e4ea4347b4cc-connector", "id": "0a5d3fb6-5fd6-4d04-bec4-3c822d38aeba", "options": null, "output": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "Anything", "connector": null, "id": "5f7fb016-6440-46f4-bc9d-b6c6593f8765", "output": true, "isOutput": false }] } }] };
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


    it('can construct an array of options for creating and audio object', function () {
        var reader = new MEPH.audio.graph.AudioGraphReader();
        reader.setGraph(largegraph);
        var audio = reader.constructAudioNodeList();
        expect(audio).toBeTruthy();
    });

    it('can create an audio object ', function () {
        var reader = new MEPH.audio.graph.AudioGraphReader();
        reader.setGraph(largegraph);
        var audio = reader.createAudio();
        expect(audio).toBeTruthy();

    });

    it('can create an audio with a splitter and merger ', function () {
        var reader = new MEPH.audio.graph.AudioGraphReader();
        reader.setGraph(splitgraph);

        var audio = reader.createAudio();
        expect(audio.nodes.length).toBe(splitgraph.nodes.length);
        expect(audio).toBeTruthy();
    });

    it('an audio object can connect up a nodes correctly when the node contains information about where its inputs come from', function () {
        var reader = new MEPH.audio.graph.AudioGraphReader();
        reader.setGraph(splitgraph);
        var audio = reader.createAudio();
        expect(audio).toBeTruthy();

        expect(audio.nodes.length).toBe(splitgraph.nodes.length);
        audio.complete();
    });


    it('feathergraph: an audio object can connect up a nodes correctly when the node contains information about where its inputs come from', function () {
        var reader = new MEPH.audio.graph.AudioGraphReader();
        reader.setGraph(feathergraph);
        var audio = reader.createAudio();
        expect(audio).toBeTruthy();

        expect(audio.nodes.length).toBe(feathergraph.nodes.length);
        audio.complete();
    });

    it('can produce a unique version of a graph, meaning the ids are switch , but all is relatively the same', function () {
        var result = MEPH.audio.graph.AudioGraphReader.cloneUnique(seed);

        expect(result).toBeTruthy();
    })

    it('can produce a unique version of a graph with deep nodes, meaning the ids are switch , but all is relatively the same', function () {
        var result = MEPH.audio.graph.AudioGraphReader.cloneUnique(deepseed);

        expect(result).toBeTruthy();
    })

});