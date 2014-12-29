MEPH.define('Connection.main.view.create.CreateContact', {
    alias: 'create_contact',
    templates: true,
    extend: 'MEPH.mobile.activity.container.Container',
    mixins: ['MEPH.mobile.mixins.Activity'],
    injections: ['contactService'],
    requires: ['MEPH.input.Camera',
                'MEPH.input.Text',
                'MEPH.input.Image',
                'Connection.main.view.create.createcontactview.CreateContactView',
                'MEPH.qrcode.Qrcode',
                'MEPH.util.Observable',
                'MEPH.util.FileReader',
                'MEPH.util.Style',
                'MEPH.button.IconButton',
        'MEPH.qrcode.Generator'],
    properties: {
        status: null,
        $qrgenerator: null,
        $qrcode: null
    },
    initialize: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.on('load', me.onLoaded.bind(me));
        me.$qrgenerator = new MEPH.qrcode.Generator();

        me.$qrcode = new MEPH.qrcode.Qrcode();
        me.$qrcode.callback = function (str) {
            console.log("Code that was found is : " + str);
            if (str !== "error decoding QR Code") {
                me.status = '';
                try {
                    var holder = me.querySelector('[canvasholder]');
                    Style.hide(holder);
                    MEPH.publish(MEPH.Constants.OPEN_ACTIVITY, {
                        viewId: 'PreviewContact', path: 'main/preview/contact', data: str
                    });
                }
                catch (e) {
                }

            }
            me.status = str;
            me.$processing = false;
        }
        me.$supportsUserMedia = MEPH.util.Dom.supportsUserMedia();
    },
    onLoaded: function () {
        var me = this;
        me.name = 'Create Contact';
        if (false) {//me.$supportsUserMedia
            me.createview.camera.hide();
        }
        else {
            me.createview.camerasource.hide();
        }
    },
    onImageChange: function () {
        var me = this;
        console.log('image change');
        return MEPH.util.FileReader.readFileList(me.createview.camera.inputfield.files)
                .then(function (fileResults) {
                    if (!me.$processing) {
                        return new Promise(function (r) {
                            console.log('processing');
                            try {
                                me.$processing = true;
                                var file = fileResults.first();

                                if (file) {
                                    var myCanvas = me.createview.canvas;
                                    var ctx = myCanvas.getContext('2d');
                                    var holder = me.querySelector('[canvasholder]');
                                    var img = new Image;
                                    img.onload = function () {
                                        console.log('image loaded');
                                        var relwidth = Math.round(img.width)
                                        var relheight = Math.round(img.height);
                                        var scale = Math.max(img.width, img.height) / 300;
                                        console.log('image relwidth : ' + relwidth);
                                        me.createview.canvas.width = relwidth;
                                        console.log('image relheight : ' + relheight);
                                        me.createview.canvas.height = relheight;
                                        console.log('draw image ');
                                        try {
                                            me.createview.canvas.height = relheight * (1 / scale);
                                            me.createview.canvas.width = relwidth * (1 / scale);
                                            ctx.scale(1 / scale, 1 / scale);
                                            ctx.drawImage(img, 0, 0); // Or at whatever offset you like
                                            console.log('image drawn');
                                            console.log('holder ' + holder);
                                            Style.show(holder);
                                            console.log('decode qrcode');

                                            me.$qrcode.decode(me.createview.canvas);
                                            console.log('decode completed');
                                        } catch (e) {
                                            console.log(e);
                                        }

                                    };
                                    img.src = file.res;
                                    r();
                                }
                            }
                            catch (e) {
                                console.log(e);
                            }
                        });
                    }
                });


    },
    takeAPicture: function () {
        var me = this, video;
        return Promise.resolve().then(function () {
            me.status = 'processing';
        })
        .then(function () {
            if (me.createview.camerasource) {
                video = me.createview.camerasource.getVideo();
                MEPH.util.Dom.setSize(me.createview.canvas, {
                    height: video.clientHeight,
                    width: video.clientWidth
                }, true);

                me.createview.canvas.getContext('2d').drawImage(video, 0, 0, video.clientWidth, video.clientHeight);

                if (!me.$processing) {
                    me.$processing = true;
                    me.$qrcode.decode(me.createview.canvas);
                }
            }
        })
    },
    processPicture: function () {
        var me = this;
        if (me.pictureTaken && !me.$processing) {
            me.$processing = true;

            me.$qrcode.decode(me.createview.canvas);
        }
    }
});