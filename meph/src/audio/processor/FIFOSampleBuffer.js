/**
 * @class MEPH.audio.processor.RateTransposer 
 **/
MEPH.define('MEPH.audio.processor.FIFOSampleBuffer', {
    statics: {
    },
    properties: {
        sizeInBytes: 0,// reasonable initial value
        buffer: null,
        bufferUnaligned: null,
        samplesInBuffer: 0,
        bufferPos: 0
    },
    assert: function (val) {
        if (!val) {
            throw new Error('not true')
        }
    },
    initialize: function (numChannels) {
        var me = this;
        me.assert(numChannels || 0 > 0);
        me.sizeInBytes = 0; // reasonable initial value
        me.buffer = null;
        me.bufferUnaligned = null;
        me.samplesInBuffer = 0;
        me.bufferPos = 0;
        me.channels = numChannels;
        me.ensureCapacity(32);     // allocate initial capacity 
    },
    setChannels: function (numChannels) {
        var usedBytes;
        var me = this;

        me.assert(numChannels > 0);
        usedBytes = channels * samplesInBuffer;
        me.channels = numChannels;
        me.samplesInBuffer = usedBytes / channels;
    },
    // Returns a pointer to the beginning of the currently non-outputted samples. 
    // This function is provided for accessing the output samples directly. 
    // Please be careful!
    //
    // When using this function to output samples, also remember to 'remove' the
    // outputted samples from the buffer by calling the 
    // 'receiveSamples(numSamples)' function
    ptrBegin: function () {
        var me = this;
        me.assert(me.buffer);
        return me.buffer + me.bufferPos * me.channels;
    },


    // Returns a pointer to the end of the used part of the sample buffer (i.e. 
    // where the new samples are to be inserted). This function may be used for 
    // inserting new samples into the sample buffer directly. Please be careful! 
    //
    // Parameter 'slackCapacity' tells the function how much free capacity (in
    // terms of samples) there _at least_ should be, in order to the caller to
    // succesfully insert all the required samples to the buffer. When necessary, 
    // the function grows the buffer size to comply with this requirement.
    //
    // When using this function as means for inserting new samples, also remember 
    // to increase the sample count afterwards, by calling  the 
    // 'putSamples(numSamples)' function.
    ptrEnd: function (slackCapacity) {
        var me = this;
        me.ensureCapacity(me.samplesInBuffer + slackCapacity);
        return me.buffer + me.samplesInBuffer * me.channels;
    },

    // if output location pointer 'bufferPos' isn't zero, 'rewinds' the buffer and
    // zeroes this pointer by copying samples from the 'bufferPos' pointer 
    // location on to the beginning of the buffer.
    rewind: function () {
        var me = this;
        if (me.buffer && me.bufferPos) {
            //memmove(buffer, ptrBegin(), sizeof(SAMPLETYPE) * channels * samplesInBuffer);
            var newbuffer = new Float32Array(me.buffer.length);
            me.buffer.subset(me.ptrBegin()).foreach(function (x, index) {
                newbuffer[index] = x;
            })
            me.buffer = newbuffer;
            me.bufferPos = 0;
        }
    },

    // Adds 'numSamples' pcs of samples from the 'samples' memory position to 
    // the sample buffer.
    putSamples: function (samples, nSamples) {
        var me = this;
        if (Array.isArray(samples)) {
            me.memcpy(me.ptrEnd(nSamples), samples, nSamples * me.channels);
            me.samplesInBuffer += nSamples;
        }
        else {
            me.$putSamples(samples);
        }
    },
    $putSamples: function (nSamples) {
        var req;
        var me = this;
        req = me.samplesInBuffer + nSamples;
        me.ensureCapacity(req);
        me.samplesInBuffer += nSamples;
    },
    memcpy: function (endIndx, samples, count) {
        var me = this;
        [].interpolate(endIndx, count, function (t, i) {
            me.buffer[i] = t;
        });
    },

    // Ensures that the buffer has enought capacity, i.e. space for _at least_
    // 'capacityRequirement' number of samples. The buffer is grown in steps of
    // 4 kilobytes to eliminate the need for frequently growing up the buffer,
    // as well as to round the buffer size up to the virtual memory page size.
    ensureCapacity: function (capacityRequirement) {
        var tempUnaligned,
            temp;
        var me = this;

        if (capacityRequirement > me.getCapacity()) {
            // enlarge the buffer in 4kbyte steps (round up to next 4k boundary)
            var temp = new Float32Array(capacityRequirement);
            if (me.samplesInBuffer) {
                me.buffer.foreach(function (t, i) {
                    temp[i] = t;
                })
            }
            me.buffer = temp;
            me.bufferPos = 0;
        }
        else {
            // simply rewind the buffer (if necessary)
            me.rewind();
        }
    },

    // Returns the current buffer capacity in terms of samples
    getCapacity: function () {
        var me = this;
        return me.sizeInBytes / me.channels;
        //return me.buffer.length;
    },

    // Returns the number of samples currently in the buffer
    numSamples: function () {
        var me = this; return me.samplesInBuffer;
    },
    // Output samples from beginning of the sample buffer. Copies demanded number
    // of samples to output and removes them from the sample buffer. If there
    // are less than 'numsample' samples in the buffer, returns all available.
    //
    // Returns number of samples copied.
    receiveSamples: function (output, maxSamples) {
        var num;
        var me = this;

        num = (maxSamples > me.samplesInBuffer) ? me.samplesInBuffer : maxSamples;

        me.memcpy(me.ptrBegin(), output, channels * num);
        return me.$receiveSamples(num);
    },

    // Removes samples from the beginning of the sample buffer without copying them
    // anywhere. Used to reduce the number of samples in the buffer, when accessing
    // the sample buffer with the 'ptrBegin' function.
    $receiveSamples: function (maxSamples) {
        var me = this;
        if (maxSamples >= me.samplesInBuffer) {
            var temp;

            temp = me.samplesInBuffer;
            me.samplesInBuffer = 0;
            return temp;
        }

        me.samplesInBuffer -= maxSamples;
        me.bufferPos += maxSamples;

        return maxSamples;
    },

    // Returns nonzero if the sample buffer is empty
    isEmpty: function () {
        var me = this;
        return (me.samplesInBuffer == 0) ? 1 : 0;
    },
    clear: function () {
        var me = this;
        me.samplesInBuffer = 0;
        me.bufferPos = 0;
    },
    adjustAmountOfSamples: function (numSamples) {
        if (numSamples < me.samplesInBuffer) {
            me.samplesInBuffer = numSamples;
        }
        return me.samplesInBuffer;
    }
});