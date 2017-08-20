
jQuery.extend({
    handleError: function (s, xhr, status, e) {
        ///	<summary>
        ///		此方法为内部方法。
        ///	</summary>
        ///	<private />

        // If a local callback was specified, fire it
        if (s.error) {
            s.error.call(s.context || s, xhr, status, e);
        }

        // Fire the global callback
        if (s.global) {
            (s.context ? jQuery(s.context) : jQuery.event).trigger("ajaxError", [xhr, s, e]);
        }
    },
    createUploadIframe: function (id, uri) {
        //create frame
        var frameId = 'jUploadFrame' + id;
        var iframeHtml = '<iframe id="' + frameId + '" name="' + frameId + '" style="position:absolute; top:-9999px; left:-9999px"';
        if (window.ActiveXObject) {
            if (typeof uri == 'boolean') {
                iframeHtml += ' src="' + 'javascript:false' + '"';

            }
            else if (typeof uri == 'string') {
                iframeHtml += ' src="' + uri + '"';

            }
        }
        iframeHtml += ' />';
        jQuery(iframeHtml).appendTo(document.body);

        return jQuery('#' + frameId).get(0);
    },
    createUploadForm: function (id, fileElementId, data) {
        //create form	
        var formId = 'jUploadForm' + id;
        var fileId = 'jUploadFile' + id;
        var form = jQuery('<form  action="" method="POST" name="' + formId + '" id="' + formId + '" enctype="multipart/form-data"></form>');
        if (data) {
            for (var i in data) {
                jQuery('<input type="hidden" name="' + i + '" value="' + data[i] + '" />').appendTo(form);
            }
        }
        var oldElement = jQuery('#' + fileElementId);
        var newElement = jQuery(oldElement).clone(true);
        jQuery(oldElement).attr('id', fileId);
        jQuery(oldElement).before(newElement);
        jQuery(oldElement).appendTo(form);



        //set attributes
        jQuery(form).css('position', 'absolute');
        jQuery(form).css('top', '-1200px');
        jQuery(form).css('left', '-1200px');
        jQuery(form).appendTo('body');
        return form;
    },

    ajaxFileUpload: function (s) {
        // TODO introduce global settings, allowing the client to modify them for all requests, not only timeout		
        s = jQuery.extend({}, jQuery.ajaxSettings, s);
        var id = new Date().getTime()
        var form = jQuery.createUploadForm(id, s.fileElementId, (typeof (s.data) == 'undefined' ? false : s.data));
        var io = jQuery.createUploadIframe(id, s.secureuri);
        var frameId = 'jUploadFrame' + id;
        var formId = 'jUploadForm' + id;
        // Watch for a new set of requests
        if (s.global && !jQuery.active++) {
            jQuery.event.trigger("ajaxStart");
        }
        var requestDone = false;
        // Create the request object
        var xml = {}
        if (s.global)
            jQuery.event.trigger("ajaxSend", [xml, s]);
        // Wait for a response to come back
        var uploadCallback = function (isTimeout) {
            var io = document.getElementById(frameId);
            try {
                if (io.contentWindow) {
                    xml.responseText = io.contentWindow.document.body ? io.contentWindow.document.body.innerHTML : null;
                    xml.responseXML = io.contentWindow.document.XMLDocument ? io.contentWindow.document.XMLDocument : io.contentWindow.document;

                } else if (io.contentDocument) {
                    xml.responseText = io.contentDocument.document.body ? io.contentDocument.document.body.innerHTML : null;
                    xml.responseXML = io.contentDocument.document.XMLDocument ? io.contentDocument.document.XMLDocument : io.contentDocument.document;
                }
            } catch (e) {
                jQuery.handleError(s, xml, null, e);
            }
            if (xml || isTimeout == "timeout") {
                requestDone = true;
                var status;
                try {
                    status = isTimeout != "timeout" ? "success" : "error";
                    // Make sure that the request was successful or notmodified
                    if (status != "error") {
                        // process the data (runs the xml through httpData regardless of callback)
                        var data = jQuery.uploadHttpData(xml, s.dataType);
                        // If a local callback was specified, fire it and pass it the data
                        if (s.success)
                            s.success(data, status);

                        // Fire the global callback
                        if (s.global)
                            jQuery.event.trigger("ajaxSuccess", [xml, s]);
                    } else
                        jQuery.handleError(s, xml, status);
                } catch (e) {
                    status = "error";
                    jQuery.handleError(s, xml, status, e);
                }

                // The request was completed
                if (s.global)
                    jQuery.event.trigger("ajaxComplete", [xml, s]);

                // Handle the global AJAX counter
                if (s.global && ! --jQuery.active)
                    jQuery.event.trigger("ajaxStop");

                // Process result
                if (s.complete)
                    s.complete(xml, status);

                jQuery(io).unbind()

                setTimeout(function () {
                    try {
                        jQuery(io).remove();
                        jQuery(form).remove();

                    } catch (e) {
                        jQuery.handleError(s, xml, null, e);
                    }

                }, 100)

                xml = null

            }
        }
        // Timeout checker
        if (s.timeout > 0) {
            setTimeout(function () {
                // Check to see if the request is still happening
                if (!requestDone) uploadCallback("timeout");
            }, s.timeout);
        }
        try {

            var form = jQuery('#' + formId);
            jQuery(form).attr('action', s.url);
            jQuery(form).attr('method', 'POST');
            jQuery(form).attr('target', frameId);
            if (form.encoding) {
                jQuery(form).attr('encoding', 'multipart/form-data');
            }
            else {
                jQuery(form).attr('enctype', 'multipart/form-data');
            }
            jQuery(form).submit();

        } catch (e) {
            jQuery.handleError(s, xml, null, e);
        }

        jQuery('#' + frameId).load(uploadCallback);
        return { abort: function () { } };

    },

    uploadHttpData: function (r, type) {
        var data = !type;
        data = type == "xml" || data ? r.responseXML : r.responseText;
        // If the type is "script", eval it in global context
        if (type == "script")
            jQuery.globalEval(data);
        // Get the JavaScript object, if JSON is used.
        if (type == "json")
        //eval("data = " + data);
            data = $.parseJSON(data);
        // evaluate scripts within html
        if (type == "html")
            jQuery("<div>").html(data).evalScripts();

        return data;
    }
})


$(function () {
    var fileUploader = function (opts) {
        var toArray = function (files) {
            var output = [];
            for (var i = 0, f; f = files[i]; i++) {
                output.push(f);
            }
            return output;
        };

        var uploadBlob = function (params) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", params.url, true);
            xhr.onload = params.success;
            xhr.upload.onprogress = params.progress;
            xhr.send(params.blob);
            return params;
        };

        var stopEvent = function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
        };

        var filePanel = $(opts.dropPanel);
        var updateProgress = function (state, result) {
            var progressPanel = null;
            var progess = null;
            if (opts.progressPanel) {
                progressPanel = $(opts.progressPanel);
                progess = progressPanel.children("progress");
            }
            else {
                progess = filePanel.next("progress");
            }
            if (progess.length == 0) {
                progess = $("<progress value=\"0\"/>");
                progressPanel ? progressPanel.append(progess) : progess.insertAfter(filePanel);
                progess.hide();
                progess.css({ 'margin-left': 5, 'margin-right': 2 });
            }
            var percent = progess.next("span");
            if (percent.length == 0) {
                percent = $("<span/>").insertAfter(progess);
            }
            if (state == 'start') {
                progess.fadeIn(500);
                return progess.attr("max", 100);
            }
            if (state == 'stop') {
                return progess.fadeOut(500);
            }
            if (state == 'done') {
                if (result && result.Error) {
                    percent.html(result.Error);
                    progess.fadeOut(500);
                }
                else {
                    percent.html('100%');
                    progess.attr("value", 100);
                }
                return;
            }
            if (state == 'error') {
                opts.error(result);
                return;
            }

            percent.html(Math.ceil(state) + '%');
            return progess.attr("value", state);
        };

        var packageFiles = function (files) {
            var formData = new FormData();
            files.map(function (file) {
                formData.append(file.fileName, file);
                return file;
            });
            var block = {
                url: opts.url,
                success: function (e) {
                    try {
                        var result = $.parseJSON(e.target.responseText);
                        updateProgress("done", result);
                        opts.onComplete.call(opts.UserSetting || opts, result);
                    }
                    catch (ex) {
                        updateProgress("error", ex);
                    }
                },
                progress: function (evt) {
                    if (opts.onProgress) {
                        opts.onProgress(evt.loaded, evt.total);
                    }
                    updateProgress(100 * (evt.loaded / evt.total));
                },
                blob: formData
            };
            return block;
        };

        var beginUpload = function (files) {
            if (files) {
                updateProgress("start");
                uploadBlob(packageFiles(toArray(files)));
            }
        }

        var init = function () {
            if (opts.dropPanel && opts.dropPanel.length > 0) {
                var el = opts.dropPanel[0];
                if (el.addEventListener) {
                    el.addEventListener("dragover", stopEvent, false);
                    el.addEventListener("drop", function (evt) {
                        stopEvent(evt);
                        var files = toArray(evt.dataTransfer.files);
                        beginUpload(files);
                    }, false);
                }
            }
        };

        init();

        return {
            uploadFile: function () {
                var formElem = document.getElementById(opts.formID);
                if (formElem) {
                    beginUpload(formElem.FileList);
                }
            },
            uploadFiles: function (files) {
                beginUpload(files);
            }
        };
    }
    $.extend({
        fileUpload: function (opts) {
            var fileElem = $("#" + opts.fileElementID);
            var loading = opts.loading;
            var files = fileElem[0].files;
            var url = (opts.url || $.fileUploadDefaults.url) + "?" + $.param(opts.params);
            var callback = opts.onComplete || $.fileUploadDefaults.onComplete;
            if (files) {
                if (files.length > 0) {
                    var settings = $.extend({}, $.fileUploadDefaults, {
                        url: url,
                        dropPanel: opts.dropPanel,
                        formID: opts.formID,
                        progressPanel: opts.progressPanel || loading,
                        onComplete: callback,
                        UserSetting: opts
                    });
                    settings.error = opts.error || function () {
                    };
                    settings.onProgress = opts.onProgress || function () {
                    };
                    var uploader = fileUploader(settings);
                    if (!opts.onStart || opts.onStart(fileElem) !== false) {
                        uploader.uploadFiles(fileElem[0].files);
                    }
                }
                else {
                    callback.call(opts);
                }
            }
            else {
                if (fileElem.val()) {
                    loading.html("正在上传...");
                    if (!opts.onStart || opts.onStart(fileElem) !== false) {
                        var settings = $.extend({}, $.fileUploadDefaults, {
                            url: url,
                            fileElementId: opts.fileElementID,
                            success: function (data, status) {
                                if (data) {
                                    if (data.Error) {
                                        loading.html(data.Error);
                                    }
                                    else {
                                        loading.html("上传成功");
                                    }
                                    callback.call(opts, data);
                                }
                                $("#" + opts.fileElementID).val("");
                            },
                            error: function (data, status, e) {
                                loading.html(e);
                            }
                        });
                        $.ajaxFileUpload(settings);
                    }
                }
                else {
                    callback.call(opts);
                }
            }
        },
        fileUploadDefaults: {
            url: '/UploadFile',
            secureuri: false,
            dataType: 'json',
            onComplete: function (state, msg) {

            }
        },
        getUploader: function (opts) {
            var onChanged = opts.onChanged || function (n) { };
            $("#" + opts.fileElementID).change(function (e) {
                var files = e.dataTransfer || this.files;
                var fileName = "";
                if (files && files.length > 0) {
                    var file = files[0];
                    fileName = file.name;
                    onChanged(fileName, file);
                }
                else {
                    fileName = $(this).val();
                    fileName = fileName.substr(fileName.lastIndexOf("\\") + 1);
                    onChanged(fileName);
                }
            });
            return {
                beginUpload: function () {
                    $.fileUpload(opts);
                }
            };
        }
    });
});