/*global MEPH*/

/**
* @class
*
* This is a convenient way of defining a visual selector.
*/
MEPH.define('MEPH.audio.view.VisualSelector', {
    alias: 'visualselector',
    extend: 'MEPH.audio.view.Visualizer',
    requires: ['MEPH.input.Range',
        'MEPH.util.Renderer',
        'MEPH.signalprocessing.SignalProcessor'],
    templates: true,
    properties: {
        stop: 100,
        position: 0,
        step: .0001,
        markBtnText: 'Mark',
        max: null,
        min: null,
        marks: null,
        offsetbtnheight: 19,
        marktype: 'default',
        markercolor: '#d9534f',
        markscolor: '#f0ad4e',
        markerBtns: null,
        pitchShift: .5,
        smallestStep: 0.0000001,
        renderer: null,
        injectControls: {
            location: 'buttonpanel'
        },
        $signalProcessor: null,
        markerrenderer: null
    },
    initialize: function () {
        var me = this;
        me.super();
        me.markerBtns = [];
        me.$signalProcessor = new SignalProcessor();;
        me.on('altered', function (type, args) {
            if (args.path === 'marks') {
                if (me.marks) {
                    me.marks.on('changed', me.update.bind(me));
                }
                me.update();

            }

            if (args.path === 'vertical' || args.path === 'scrollMutiplier' || args.path === 'scrollleft') {
                me.update();
            }
        });
    },
    addMark: function () {
        var me = this,
            relativePosition = me.getCurrentPosition();
        var absPosition = me.getAbsoluteMarkPosition(relativePosition, me.magnification, me.timeScroll)
        if (me.marks && !me.marks.some(function (x) {
            return x.position === absPosition;
        })) {
            me.marks.push({
                position: absPosition,
                type: me.marktype
            })
        }
    },
    getAbsoluteMarkPosition: function (position, magnification, timeOffset) {
        var result,
            me = this,
            pixels = me.width,
            buffer = me.getBuffer();
        if (buffer) {
            var start = buffer.length * me.timeScroll;
            var length = (buffer.length * me.magnification);

            return (position * length) + start;
        }
    },
    shiftPitch: function () {
        var me = this;
        var sp = me.$signalProcessor;

        if (me.playingClip) {
            me.playingClip.stop();
            return;
        }
        var buffer = me.getBuffer();
        var audioresult = me.getSnippet();
        var inbucket;
        var outbucket;
        if (!audioresult) return;
        debugger
        var audio = new MEPH.audio.Audio();
        audio.buffer(audioresult.buffer, { name: 'buffer' })
            .processor({
                name: 'proce',
                process: function (audioProcessingEvent) {
                    var inputBuffer = audioProcessingEvent.inputBuffer;
                    var inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                    var d = audioProcessingEvent.outputBuffer.getChannelData(0);
                    sp.pitchShift(parseFloat(me.pitchShift), inputData.length, inputData.length, 4, me.source.buffer.buffer.sampleRate, inputData, d);
                }
            })
            .complete();
        var snippet = audio.get({ name: 'buffer' });
        snippet.first().node.onended = function () {
            audio.disconnect();
            delete me.playingClip;
            delete audio;
            delete snippet.first().node;
        }
        me.playingClip = snippet.first().node;
        me.playingClip.start();

    },
    getSnippet: function () {
        var me = this,
           source = me.source,
           audio = new MEPH.audio.Audio(),
           magnification = parseFloat(me.magnification),
           timeScroll = parseFloat(me.timeScroll);
        if (me.source) {
            var start = timeScroll * source.buffer.buffer.duration;
            var time = source.buffer.buffer.duration * magnification;

            var snippet = MEPH.audio.Audio.clip(source, start, Math.min(source.buffer.buffer.duration, time + start));
            return snippet;
        }
        return null;
    },
    playClip: function () {
        var me = this;
        if (me.playingClip) {
            me.playingClip.stop();
            return;
        }

        var snippet = me.getSnippet();;

        if (snippet) {
            snippet = me.$playSnippet(snippet);
        }

    },
    saveClip: function () {
        var me = this, snippet = me.getSnippet();

        if (!snippet) return;
        me.markCanvas.dispatchEvent(MEPH.createEvent('saveclip', {
            snippets: [snippet]
        }))
    },
    saveClips: function () {
        var me = this, source;
        if (!me.source) {
            return null;
        }
        source = me.source;
        var tmarks = me.marks.orderBy(function (x, y) {
            return x.position - y.position;
        });

        me.marks.length = 0;
        me.marks.push.apply(me.marks, tmarks);
        var res = me.marks.select(function (x, index) {
            if (index) {
                var mark = me.marks[index - 1];
                var end = me.marks[index] ? me.marks[index].position : source.buffer.buffer.length;
                var snippet = MEPH.audio.Audio.clipBuffer(me.source, mark.position, end);
                return snippet;
            }
            return false;
        }).where();

        if (res.length)
            me.markCanvas.dispatchEvent(MEPH.createEvent('saveclip', {
                snippets: res
            }))
    },
    cutSectionOut: function () {
        var me = this, pixels = me.width;
        if (me.selectedRange) {
            var start = me.getAbsoluteMarkPosition(me.selectedRange.start / pixels);
            var end = me.getAbsoluteMarkPosition((me.selectedRange.end) / pixels);
            if (end - start > 10) {
                var res = MEPH.audio.Audio.cutOutSection(me.source, start, end, null);
                me.source.buffer = res.buffer;
            }
        }
    },
    trimSection: function () {
        var me = this,
            pixels = me.width;
        if (me.selectedRange) {
            var start = me.getAbsoluteMarkPosition(me.selectedRange.start / pixels);
            var end = me.getAbsoluteMarkPosition((me.selectedRange.end) / pixels);
            console.log('start : ' + start + ' ' + ' end ' + end)
            if (end - start > 10) {
                me.marks.removeWhere(function (x) {
                    return x.position > end || x.position < start;
                });
                me.marks.where(function (x) {
                    return x.position < end && x.position > start;
                }).foreach(function (mark) {
                    mark.position -= start;
                })
                var res = MEPH.audio.Audio.clipBuffer(me.source, start, end, null);
                me.source.buffer = res.buffer;
            }
        }
    },
    $playSnippet: function (snippet) {
        var me = this;
        if (snippet) {
            var audio = new MEPH.audio.Audio();
            audio.buffer(snippet.buffer.buffer, { name: 'buffer' }).gain({ name: 'gain', volume: 1 }).complete();
            var snippet = audio.get({ name: 'buffer' });
            snippet.first().node.onended = function () {
                audio.disconnect();
                delete me.playingClip;
                delete audio;
                delete snippet.first().node;
            }
            me.playingClip = snippet.first().node;
            me.playingClip.start();

        }
        return snippet;
    },
    getRelativeMarkPosition: function (position, magnification, timeOffset) {
        var me = this,
            pixels = me.width,
            buffer = me.getBuffer();
        if (buffer) {
            var start = buffer.length * me.timeScroll;
            position -= start;
            var length = (buffer.length * me.magnification);
            position /= length;

            return (position) * pixels;
        }
    },
    getCurrentPosition: function () {
        var me = this;
        var position = parseFloat(me.position);
        var a = parseFloat(me.container.scrollLeft);
        var canvasWidth = parseFloat(me.canvas.clientWidth);
        var containerWidth = parseFloat(me.container.clientWidth);

        var windowWidth = Math.min(containerWidth, canvasWidth - a);
        var windowStep = windowWidth * position;

        return (windowStep + a) / canvasWidth
    },
    getMarkerPosition: function () {
        var me = this;
        var position = parseFloat(me.position);
        var a = parseFloat(me.container.scrollLeft);
        var canvasWidth = parseFloat(me.canvas.clientWidth);
        var containerWidth = parseFloat(me.container.clientWidth);

        var windowWidth = Math.min(containerWidth, canvasWidth - a);
        var windowStep = windowWidth * position;

        return (windowStep + a);
    },
    scanToMark: function (dir) {
        var me = this, buffer = me.getBuffer();
        if (buffer) {
            if (me.$currentMark === undefined) {
                var mark = me.marks.first();
                if (mark) {
                    me.timeScroll = mark.position / buffer.length;
                    me.$currentMark = 0;
                }
            }
            else {
                me.$currentMark = (me.$currentMark + parseInt(dir));
                if (me.$currentMark === me.marks.length) me.$currentMark = -1;
                if (me.$currentMark < -1) me.$currentMark = me.marks.length - 1;
                if (me.$currentMark === -1) {
                    me.timeScroll = 0;
                    return;
                }
                me.$currentMark = me.$currentMark % me.marks.length
                var position = me.marks[me.$currentMark].position;
                me.timeScroll = position / buffer.length;

            }
        }
    },

    updateMarkBtns: function () {
        var me = this;
        if (me.marks) {
            var removed = me.markerBtns.removeWhere(function (btnObject) {
                return !me.marks.some(function (x) { return x === btnObject.marker });
            });
            removed.foreach(function (x) {
                x.dom.parentNode.removeChild(x.dom);
            });
            var newmarks = me.marks.where(function (x) {
                return !me.markerBtns.some(function (t) { return t.marker === x; });
            });

            var newmarksObjects = me.createNewMarkerBtns(newmarks);
            me.markerBtns.push.apply(me.markerBtns, newmarksObjects);

            me.markerBtns.foreach(function (x) {
                var rel = me.getRelativeMarkPosition(x.marker.position, me.magnification, me.timeScroll);
                x.dom.style.left = (rel) + 'px';
                x.dom.style.top = (me.height - me.offsetbtnheight) + 'px';
            })
        }
    },
    createNewMarkerBtns: function (newmarks) {
        var me = this;
        return newmarks.select(function (x, index) {
            var btntemplate = me.createMarkerBtn();
            var btn = btntemplate.querySelector('[removebtn]');
            me.don('click', btn, function (x) {
                me.marks.removeWhere(function (y) { return y === x; });
            }.bind(me, x));

            me.don('click', btntemplate.querySelector('[playbtn]'), function (x) {
                console.log('play snippet')
                me.playSnippet(x);
            }.bind(me, x))

            return {
                marker: x,
                dom: btntemplate
            }
        })
    },
    /**
     * Plays the snippet.
     * @param {Object} percentage
     ***/
    playSnippet: function (mark) {
        var me = this;
        var tmarks = me.marks.orderBy(function (x, y) {
            return x.position - y.position;
        });
        me.marks.length = 0;
        me.marks.push.apply(me.marks, tmarks);
        var index = me.marks.indexWhere(function (x) {
            return x.position === mark.position;
        }).first();
        if (index !== null) {
            var end = me.marks[index + 1] ? me.marks[index + 1].position : source.buffer.buffer.length;
            var snippet = MEPH.audio.Audio.clipBuffer(me.source, mark.position, end);
            me.$playSnippet(snippet)
        }
    },
    createMarkerBtn: function () {
        var me = this;
        var clone = me.markerBtnTemplate.cloneNode(true);
        me.markerCanvas.parentNode.appendChild(clone);
        return clone;
    },
    update: function () {
        var me = this;
        return Promise.resolve().then(function () {
            me.updateMarkBtns();
        }).then(function () {
            return me.updateMarks()
        }).then(function () {
            return me.updateMarker();
        }).then(function () {
            me.draw();
        })
    },
    updateMarks: function () {
        var me = this;


        return me.render();
    },
    updateMarker: function () {
        var me = this;
        if (me.markerFrame)
            cancelAnimationFrame(me.markerFrame)
        me.markerFrame = requestAnimationFrame(function () {
            var HEIGHT = me.height;
            var WIDTH = me.width;
            var dataArray = me.source;
            me.markerFrame = null;

            if (!me.markerrenderer) {
                me.markerrenderer = new MEPH.util.Renderer();
                me.markerrenderer.setCanvas(me.markerCanvas);
            }
            me.markerrenderer.clear();
            var xpos = me.getMarkerPosition();
            me.markerrenderer.draw({
                shape: MEPH.util.Renderer.shapes.line,
                end: {
                    x: xpos,
                    y: HEIGHT
                },
                start: {
                    x: xpos,
                    y: 0
                },
                strokeStyle: me.markercolor
            });
            rsolve();
        });
        var rsolve;
        return new Promise(function (r) {
            rsolve = r;
        });
    },
    render: function () {
        var me = this;
        if (me.markframe)
            cancelAnimationFrame(me.markframe)
        me.markframe = requestAnimationFrame(function () {
            var HEIGHT = me.height;
            var WIDTH = me.width;
            var dataArray = me.source;
            me.markframe = null;

            if (!me.renderer) {
                me.renderer = new MEPH.util.Renderer();
                me.renderer.setCanvas(me.markCanvas);
            }


            me.renderer.clear();
            if (me.marks) {
                var lines = me.marks.select(function (x) {
                    var xpos = me.getRelativeMarkPosition(x.position, me.magnification, me.timeScroll);
                    return {
                        shape: MEPH.util.Renderer.shapes.line,
                        end: {
                            x: xpos,
                            y: HEIGHT
                        },
                        start: {
                            x: xpos,
                            y: 0
                        },
                        strokeStyle: me.markscolor
                    }
                });
                me.renderer.draw(lines);
            }
            rsolve();
        });
        var rsolve;
        return new Promise(function (r) {
            rsolve = r;
        });
    }
});