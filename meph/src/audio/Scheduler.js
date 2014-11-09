/**
 * @class MEPH.audio.Sequence
 * Defines a base class for an audio sequence.
 **/
MEPH.define('MEPH.audio.Scheduler', {
    requires: ['MEPH.audio.Sequence',
                'MEPH.audio.Audio',
                'MEPH.query.QueryableWorker'],
    properties: {
        $sequence: null,
        $queryWorker: null,
        playWindow: 2,
        interval: 50,
        playing: false
    },
    initialize: function (args) {
        var me = this;
        MEPH.Events(me);

        if (args && args.init) {
            me.init();
        }
    },
    get: function (from, duration) {
        var me = this;
        return me.sequence().getScheduledAudio(from, duration);
    },
    getAudio: function (from, duration) {
        var me = this;
        me.orderedSequence = me.orderedSequence = me.sequence().getAudioWithAbsoluteTime();
        return me.orderedSequence.where(function (x) {
            return x.absoluteTime >= from && x.absoluteTime <= (duration + from)
        })
    },
    play: function () {
        var me = this, played = [], started;
        var lasttime = me.sequence().duration();
        me.on('tick', function () {
            var currentTime = MEPH.audio.Audio.AudioContext.currentTime;
            if (started === undefined) {
                started = currentTime;
                lasttime += started;
            }
            var items = me.getAudio(currentTime - started, me.playWindow);
            items = items.where(function (t) { return played.indexOf(t) === -1; })
            items.foreach(function (audio) {
                var time = me.sequence().getAbsoluteTime(audio);

                audio.source.complete();
                audio.source.play(time + started);
                audio.source.stop(time + started + audio.source.duration());
                played.push(audio);
            });
            if (lasttime < currentTime && me.playing) {
                me.fire('complete', { currentTime: currentTime });

                me.stop();
            }
        }, 'play')
        me.start();
        me.playing = true;
    },
    /**
     * Initializes a scheduler.
     **/
    init: function () {
        var me = this;
        me.$queryWorker = new MEPH.query.QueryableWorker();
        return me.$queryWorker.ready().then(function (q) {
            return q.load('MEPH.audio.AudioTimer')
        });
    },
    start: function () {
        var me = this;
        if (me.playing) return;
        me.$queryWorker.message(function () {
            MEPH.audio.AudioTimer.start(100);
        }, [], function (message) {
            if (message.data && message.data.tick) {
                me.fire('tick', true);
            }
        })
    },
    stop: function () {
        var me = this;
        if (!me.playing) return;
        me.$queryWorker.message(function () {
            MEPH.audio.AudioTimer.stop();
        }, [], function (message) {
        })
        //me.$queryWorker.terminate();
        me.un(null, 'play');
        me.playing = false;
    },
    sequence: function (s) {
        if (s instanceof MEPH.audio.Sequence) {
            this.$sequence = s;
        }
        return this.$sequence;
    }
});