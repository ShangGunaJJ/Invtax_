
(function () {

    EMW.Global = {
        DateTimer: {
            Build: function (elem, view) {
                if (elem.attr("datetimer")) return;
                var parent = elem.parent();
                var div = $("<div class='searcher-datetimer'></div>").appendTo(parent);
                div.append(elem);
                div.append('<span class="glyphicon glyphicon-calendar datetimer-icon"></span>');
                elem.attr("datetimer", 1);
                this.Init(elem, view);
            },
            Init: function (elem, view) {
                if (elem.attr("datetimer-event")) return;
                elem.attr("datetimer-event", 1);
                elem.click(EMW.Global.DateTimer.Show.bind(EMW.Global.DateTimer, elem, view));

            },
            Show: function (elem, view) {
                if (!this.Picker) {
                    this.Picker = new EMW.UI.DateTimePicker();
                }
                if (elem.attr("data-disabled")) return;
                this.Picker.Show(elem, view);
            }
        }
    }
})();

/*Window*/
(function ($) {
    $.extend(EMW.Global, { UI: {} });

    EMW.Global.UI.Window = function (opts) {
        var opts = $.extend({}, EMW.Global.UI.Window.defaults, opts);

        var panel = Create(opts);

        var wind = new MyWindow(panel, opts);

        Init(wind);

        return wind;
    }

    var Create = function (opts) {
        var modal = $("<div></div>").addClass("modal emw-window");
        if (opts.windCls) {
            modal.addClass(opts.windCls);
        }
        if (opts.onCreate) {
            opts.onCreate(modal, opts);
        }

        var wrap = opts.wrap || "body";

        modal.appendTo(wrap);

        var dialog = $("<div class=\"modal-dialog\"></div");

        modal.append(dialog);

        var content = $("<div class=\"modal-content\"></div>");
        if (!opts.IsBorder)
            modal.addClass("modal-content-HideBorder");
        dialog.append(content);


        if (opts.showHeader) {
            var header = $("<div class=\"modal-header\"><div class='panel-tool'></div></div>");
            opts.toolPanel = header.find(">.panel-tool");
            content.append(header);
            if (opts.closable) {
            }
            header.append("<h4 class=\"modal-title\" style='text-align:left;padding-left:10px;'>" + (opts.title || "&nbsp;") + "</h4>");
            if (opts.hideHeader) {
                header.css({ "min-height": "0", "height": 0, "padding": 0, "margin": 0 });
            }
        }
        var modalBody = $("<div class=\"modal-body\"></div>");
        content.append(modalBody);
        CreateFooter(opts, content);
        return modal;
    }

    var CreateFooter = function (opts, container, wind) {
        if (opts.showFooter) {
            var footer = $("<div class=\"modal-footer\"></div");
            container.append(footer);
            if (opts.buttons) {
                for (var i = 0; i < opts.buttons.length; i++) {
                    var o = opts.buttons[i];
                    var btn = $("<button type=\"button\" class=\"btn btn-default\"></button>");
                    btn.html(o.text);
                    btn.attr("id", o.id).data("data", o).on("click", function (e) {
                        var oo = $(this).data("data");
                        if (oo.handler) {
                            return oo.handler.call(this, e);
                        }
                    });
                    footer.append(btn);
                }
            }
            if (opts.showCloseBtn) {
                footer.append("<button type=\"button\" class=\"btn btn-default btn-Close delete-btn-default\">" + opts.cancelText + "</button>");
            }
            if (opts.showOKBtn) {
                var btn = $("<button type=\"button\" class=\"btn btn-primary btn-OK delete-btn-primary\">" + opts.okText + "</button>");

                footer.append(btn);
            }
        }
    }

    var createDoc = function (opts) { }

    var ShowPageTools = function (wind) {
        var opts = wind.options;

        if (opts.showHeader) {
            if (!opts.Tools) {
                opts.Tools = [];
            }
            var frame = wind.Frame;
            if (frame) {
                var win = frame.contentWindow;
                if (win && win.GetPanelTools) {
                    opts.Tools = opts.Tools.concat(win.GetPanelTools() || []);
                }
            }
            wind.ShowTools(opts.Tools);
        }
    }
    var Init = function (wind) {

        var panel = wind.panel;
        var opts = wind.options;
        var windBody = panel.find(".modal-dialog>.modal-content>.modal-body");
        var _this = wind;
        var ready = opts.onReady;
        if (opts.url) {
            AddIFrame(windBody, { src: opts.url }, wind, function (frame) {
                if ($.isFunction(frame.contentWindow.GetParam)) {
                    var w = frame.contentWindow.GetParam(0);
                    if (w) {
                        var t = w.options.title;
                        if (t == '新窗口') {
                            t = frame.contentDocument.title || t;
                            w.SetTitle(t);
                        }
                    }
                }
                wind.Frame = frame;
                ShowPageTools(wind);
                if ($.isFunction(ready)) {
                    ready(_this);
                }
            });
        }
        else if (opts.content) {
            var con = $(opts.content);
            if (con.length > 0) {
                opts.content = con;
            }
            windBody.css({ overflow: "auto" });
            windBody.html(opts.content);
            ShowPageTools(wind);
            if ($.isFunction(ready)) {
                ready(_this);
            }
        }

        panel.on("show.bs.modal", function (e) {
            return opts.OnBeforeOpen.call(this, e);
        }).on("shown.bs.modal", wind, function (e) {
            wind.Resize(opts.width, opts.height);
            return opts.OnOpen.call(this, e);
        }).on("hide.bs.modal", function (e) {
            return opts.OnBeforeClose.call(this, e);
        }).on("hidden.bs.modal", wind, function (e) {
            if (opts._OnCloseExt) {
                opts._OnCloseExt.call(this, e);
            }
            opts.OnClose.call(this, e);
            if (opts.destroyOnClose) {
                panel.remove();
            }
            if (opts.wrap && !opts.wrap.find(">.emw-window").length) {
                opts.wrap.remove();
                if (opts.footerFixPanel) {
                    opts.footerFixPanel.remove();
                }
            }
            var callbacks = opts._OnWindowResizeCallbacks;
            if (callbacks) {
                for (var i = 0; i < callbacks.length; i++) {
                    OffWindowResize(callbacks[i]);
                }
            }
        });
        var windFooter = panel.find(".modal-dialog>.modal-content>.modal-footer");
        if (opts.showOKBtn) {
            windFooter.find(".btn-OK").on("click", wind, function (e) {
                var w = e.data;
                var setting = w.options;
                var returnResult = setting.OnBeforeOK(setting.content);
                if (returnResult !== false) {
                    if (!setting.OnOK || setting.OnOK(setting.content) != false) {
                        w.Close();
                    }
                }
            });
        }
        if (opts.showCloseBtn) {
            windFooter.find(".btn-Close").on("click", wind, function (e) {
                var w = e.data;

                var setting = w.options;
                if (setting.OnCancel() != false) {
                    //w.panel.modal("hide");
                    w.Close();
                }
            });
        }
        panel.draggable({
            handle: ".modal-header",
            start: function (e, o) {
                wind.MoveTop();
                if (opts.moveable === false) {
                    return false;
                }
                $(this).next(".modal-backdrop").addClass("dragging");
            },
            stop: function (e, o) {
                opts.originalTop = opts.top;
                opts.originalLeft = opts.left;

                opts.top = o.position.top;
                opts.left = o.position.left;
                $(this).next(".modal-backdrop").removeClass("dragging");
            }
        });
        if (opts.resizable) {
            panel.resizable({
                helper: "ui-resizable-helper",
                zIndex: 9999,
                maxHeight: opts.maxHeight,
                maxWidth: opts.maxWidth,
                minHeight: opts.minHeight,
                minWidth: opts.minWidth,
                start: function (e, o) {
                    $(this).next(".modal-backdrop").addClass("resizing");
                    wind.MoveTop();
                },
                stop: function (e, o) {
                    wind.Resize(o.size.width, o.size.height);
                    $(this).next(".modal-backdrop").removeClass("resizing");
                }
            });
        }
        InitHeaderTools(wind);
        InitPos(wind);

        panel.modal($.extend({
            show: true,
            keyboard: false
        }, opts));
        if (!opts.modal) {
            panel.next(".modal-backdrop").addClass("window-backdrop");
        }
        wind.MoveTop(true);
        //wind.Resize(opts.width, opts.height);
    }

    var InitHeaderTools = function (wind) {
        var opts = wind.options;
        if (opts.showHeader) {
            var panel = wind.panel;
            var header = panel.find(">.modal-dialog>.modal-content>.modal-header");

            //var panelTool = header.find(".panel-tool");

            //header.prepend(panelTool);

            if (opts.collapsible) {
                //panelTool.append("<span class='tool-btn panel-tool-item glyphicon glyphicon-collapse-up' data-action=\"Collapse\" title='收缩'></span>");
            }
            if (opts.minimizable) {
                //panelTool.append("<span class='tool-btn panel-tool-item glyphicon icon-content_remove' data-action=\"Minimize\" title='最小化'></span>");
            }
            if (opts.maximizable) {
                //panelTool.append("<span class='tool-btn panel-tool-item glyphicon glyphicon-resize-full' data-action=\"MaximizeOrRestore\" title='最大化'></span>");
            }
            if (opts.SearchBox) {
                var box = $('<span class="glyphicon glyphicon-search search-icon"></span><input class="Search-box" id="where" data-action="OnSearch" placeholder="搜索用户" />');
                header.prepend(box);
            }
            header.on("click", wind, function (e) {
                var wind = e.data;
                wind.MoveTop();
            }).on("keyup", ".Search-box", function () {
                var act = $(this).attr("data-action");
                if (eval('$(document).find(".modal-body>iframe")[0].contentWindow.' + act + '')) eval('$(document).find(".modal-body>iframe")[0].contentWindow.' + act + '("' + this.value + '")');
            });
            opts.toolPanel.on("click", ".tool-btn", wind, function (e) {
                //header.find(".tool-btn").on("click", wind, function (e) {
                var wind = e.data;
                wind.MoveTop();
                var act = $(this).attr("data-action");
                if (act) {
                    var fn = headerToolActions[act];
                    if ($.isFunction(fn)) {
                        fn.call(this, wind);
                        return false;
                    }
                }
                var index = $(this).attr("data-index");
                if (index) {
                    var tool = opts.Tools[index];
                    if (tool && tool.OnClick) {
                        tool.OnClick.apply(this, [tool, e]);
                        return false;
                    }
                }
            }).on("dblclick", ".tool-btn", function () {
                return false;
            });
            if (opts.maximizable) {
                header.on("dblclick", wind, function (e) {
                    var wind = e.data;
                    var opts = wind.options;
                    if (!opts.maximized) {
                        wind.Maximize();
                    }
                    else {
                        wind.Restore();
                    }
                    return false;
                })
            }
            if (opts.closable) {
                if (opts.isTopWindow) {
                    opts.toolBarPanel = opts.toolPanel.clone(true);
                    opts.toolBarPanel.addClass("emw-window-toolbar");
                    opts.toolBarPanel.append("<span class='tool-btn panel-tool-item glyphicon icon-navigation_close' data-action=\"Close\"><span class='tool-text'>关闭</span></span>");
                    opts.toolBarPanel.appendTo("body");
                    opts.toolBarPanel.css({ "z-index": EMW.Global.UI.Window.ZIndex++ });
                }
            }
        }
    }

    var headerToolActions = {
        Collapse: function (wind) {
            var opts = wind.options;
            var header = wind.panel.find(">.modal-dialog>.modal-content>.modal-header");
            var footer = wind.panel.find(">.modal-dialog>.modal-content>.modal-footer");
            var target = $(this);
            if (!opts.collapsing) {
                opts.collapsing = true;
                if (!opts.collapsed) {
                    footer.fadeOut();
                    wind.panel.animate({
                        height: header.outerHeight()
                    }, function () {
                        opts.collapsed = true;
                        delete opts.collapsing;
                        target.find(">.glyphicon").removeClass().addClass("glyphicon glyphicon-collapse-down");
                    });
                }
                else {
                    footer.fadeIn();
                    wind.panel.animate({
                        height: opts.height
                    }, function () {
                        opts.collapsed = false;
                        delete opts.collapsing;
                        target.find(">.glyphicon").removeClass().addClass("glyphicon glyphicon-collapse-up");
                    });
                }
            }
        },
        Minimize: function (wind) {
            wind.Minimize();
        },
        MaximizeOrRestore: function (wind) {
            opts = wind.options;
            if (!opts.maximized) {
                wind.Maximize();
            }
            else {
                wind.Restore();
            }
        },
        Close: function (wind) {
            wind.panel.modal("hide");
        }
    };

    var InitPos = function (wind) {
        var panel = wind.panel;
        var opts = wind.options;
        if (opts.onInitPos) {
            opts.onInitPos(wind);
        }
        var $wind = $(window);
        var left = opts.left;
        if (left == null) {
            left = ($wind.innerWidth() - opts.width) / 2;
        }
        var top = opts.top;
        if (top == null) {
            var h = opts.height == 'auto' ? panel.outerHeight() : opts.height;
            top = ($wind.innerHeight() - h) * 0.382;// 0.618 / 1.618;黄金分割
        }
        opts.left = left;
        opts.top = top;
        panel.css({ left: left, top: top });
        if (opts.toolBarPanel) {
            opts.toolBarPanel.css({ top: opts.top + EMW.Global.UI.Window.FixTopHeight + EMW.Global.UI.Window.MarginTop - 5 });
        }
    }

    var MyWindow = function (panel, opts) {
        this.panel = panel;
        this.options = opts;
        this.panel.data("EMW_window", this);
    }

    MyWindow.prototype.Close = function (closeType, returnValue) {
        var fn = this.options.OnBeforeClose;
        this.options.OnBeforeClose = function () { };

        if (closeType == true && this.options.OnOK) {
            this.options.OnOK(returnValue);
        }
        else if (closeType == false && this.options.OnCancel) {
            this.options.OnCancel();
        }

        this.panel.modal("hide");
    };
    MyWindow.prototype.ShowTools = function (tools) {
        var opts = this.options;
        var toolPanel = opts.toolPanel;//this.panel.find(">.modal-dialog>.modal-content>.modal-header>.panel-tool");
        var html = [];
        if (toolPanel.length > 0) {
            for (var i = 0; i < tools.length; i++) {
                var item = tools[i];
                html.push("<span data-index='" + i + "' class='tool-btn glyphicon icon-" + item.icon + " panel-tool-item'><span class='tool-text'>" + item.text + "</span></span>");
            }
        }
        if (opts.closable) {
            if (!opts.isTopWindow) {
                html.push("<span class='tool-btn panel-tool-item glyphicon icon-navigation_close' data-action=\"Close\"><span class='tool-text'>关闭</span></span>");
            }
        }
        toolPanel.html(html.join(""));
        opts.Tools = tools;
    }

    MyWindow.prototype.Resize = function (width, height) {
        var opts = this.options;
        this.panel.css({ width: width, height: height });
        var header = this.panel.find(">.modal-dialog>.modal-content>.modal-header");
        var footer = this.panel.find(">.modal-dialog>.modal-content>.modal-footer");
        var bodyPanel = this.panel.find(">.modal-dialog>.modal-content>.modal-body");
        if (height == 'auto') {
            this.panel.find(">.modal-dialog").css({ height: 'auto' });
            footer.css({ position: 'static' });
        }
        else {
            bodyPanel.css({ height: (height - header.outerHeight() - (footer.outerHeight() || 0)) - Z.ToInt(this.panel.css("border-radius")) * 2 });
        }
        SaveOriginal(this);
        opts.width = width;
        opts.height = height;
        if (opts.wrap) {
            var size = this.GetWindowSize();
            opts.wrap.css({ height: size.height - EMW.Global.UI.Window.FixTopHeight - EMW.Global.UI.Window.FixFooterHeight });
        }
    }

    MyWindow.prototype.Restore = function () {
        var opts = this.options;
        if (opts.minimized) {//处于最小化
            this.panel.animate({ left: opts.left, top: opts.top });
        }
        else {
            opts.left = opts.originalLeft;
            opts.top = opts.originalTop;
            var _this = this;
            this.panel.animate({ left: opts.left, top: opts.top }, function () {
                //_this.Resize(opts.originalWidth, opts.originalHeight);
            });
            this.Resize(opts.originalWidth, opts.originalHeight);
            var header = this.panel.find(">.modal-dialog>.modal-content>.modal-header");
            header.find(".glyphicon-resize-small").removeClass("glyphicon-resize-small").addClass("glyphicon-resize-full");
            opts.maximized = false;
        }
        opts.minimized = false;
    }

    MyWindow.prototype.MoveTop = function (isInit) {
        if (this.options.moveTop !== false || isInit) {
            this.panel.next(".modal-backdrop").css("z-index", EMW.Global.UI.Window.ZIndex++);
            this.panel.css("z-index", EMW.Global.UI.Window.ZIndex++);
            this.options.zIndex = EMW.Global.UI.Window.ZIndex;
        }
    }
    //浏览器窗口大小
    MyWindow.prototype.GetWindowSize = function () {
        var $wind = $(window);

        return { width: $wind.innerWidth(), height: $wind.innerHeight() };
    }

    var SaveOriginal = function (wind) {
        var opts = wind.options;
        opts.originalHeight = opts.height;
        opts.originalLeft = opts.left;
        opts.originalTop = opts.top;
        opts.originalWidth = opts.width;
    }
    //最小化
    MyWindow.prototype.Minimize = function () {
        var opts = this.options;
        var _this = this;
        if (!opts.minimized) {
            //wind.panel.fadeOut();
            this.panel.animate({
                left: -10000,
                top: 10000
            }, function () {
                opts.minimized = true;
                //SaveOriginal(_this);
                if (!opts.maximized) {
                    SaveOriginal(_this);
                }
                opts.OnMinimize(_this);
            });
        }
    }

    //最大化
    MyWindow.prototype.Maximize = function () {
        var opts = this.options;
        if (!opts.maximized) {
            var $wind = $(window);
            var w = $wind.innerWidth();
            var h = $wind.innerHeight();
            //SaveOriginal(this);
            this.panel.css({ left: 0, top: 0 });
            var header = this.panel.find(">.modal-dialog>.modal-content>.modal-header");
            header.find(".glyphicon-resize-full").removeClass("glyphicon-resize-full").addClass("glyphicon-resize-small");

            this.Resize(w, h);
            opts.left = 0;
            opts.top = 0;
            this.options.maximized = true;
        }
    }

    MyWindow.prototype.SetTitle = function (title) {
        this.panel.find(">.modal-dialog>.modal-content>.modal-header>.modal-title").html(title);
    };

    MyWindow.prototype.OnWindowResize = function (fn) {
        var callbacks = this.options._OnWindowResizeCallbacks;
        if (!callbacks) {
            callbacks = this.options._OnWindowResizeCallbacks = [];
        }
        callbacks.push(fn);
        OnWindowResize(fn);
    }

    EMW.Global.UI.Window.defaults = {
        draggable: true,
        resizable: true,
        maxHeight: null,
        maxWidth: null,
        minHeight: 150,
        minWidth: 200,
        shadow: true,
        modal: false,
        title: '新窗口',
        collapsible: true,
        minimizable: true,
        maximizable: true,
        closable: true,
        collapsible: true,
        showHeader: true,
        IsBorder: true,
        SearchBox: false,
        /*showFooter: true,*/
        showCloseBtn: true,
        showOKBtn: true,
        backdrop: "static",
        left: null,
        right: null,
        width: 600,
        height: 340,
        cancelText: "取消",
        okText: "确定",
        destroyOnClose: true,
        OnBeforeOpen: function (e) {

        },
        OnOpen: function (e) {

        },
        OnBeforeClose: function (e) {
        },
        OnClose: function () {

        },
        OnMinimize: function (o) {

        },
        OnSearch: function (v) {

        }
    };

    EMW.Global.UI.Dialog = function (opts) {
        return EMW.Global.UI.Window($.extend({}, EMW.Global.UI.Dialog.defaults, opts, { modal: true }));
    }
    EMW.Global.UI.Window.ZIndex = 2000;
    EMW.Global.UI.Window.FixFooterHeight = 0;
    EMW.Global.UI.Window.FixTopHeight = 0;
    EMW.Global.UI.Window.MarginBottom = 10;
    EMW.Global.UI.Window.MarginTop = 10;
    EMW.Global.UI.Window.RightToolBarWidth = 40;
    EMW.Global.UI.Window.GetWindowSize = function () {
        var $wind = $(window);

        return { width: $wind.innerWidth(), height: $wind.innerHeight() };
    }
    EMW.Global.UI.Dialog.defaults = $.extend({}, {
        draggable: true,
        resizable: false,
        maxHeight: null,
        maxWidth: null,
        minHeight: 150,
        minWidth: 200,
        shadow: true,
        modal: true,
        title: '新窗口',
        collapsible: false,
        minimizable: false,
        maximizable: false,
        closable: true,
        showHeader: true,
        showFooter: true,
        showCloseBtn: true,
        showOKBtn: true,
        backdrop: "static",
        left: null,
        right: null,
        width: 600,
        height: 340,
        destroyOnClose: true,
        OnBeforeOK: function () {

        },
        ImgLR: function () {

        },
        OnOK: function () {

        },
        OnCancel: function () {

        },
        OnBeforeOpen: function (e) {

        },
        OnOpen: function (e) {

        },
        OnBeforeClose: function (e) {
        },
        OnClose: function () {

        },
        OnMinimize: function (o) {

        },
        OnSearch: function (v) {

        }
    });

    var onResizeCallbacks;

    var OnWindowResize = function (fn) {
        if ($.isFunction(fn)) {
            if (!onResizeCallbacks) {
                onResizeCallbacks = $.Callbacks("unique stopOnFalse");
            }
            onResizeCallbacks.add(fn);
        }
        else {
            if (onResizeCallbacks) {
                onResizeCallbacks.fireWith(this, {
                    width: $(window).width(),
                    height: $(window).height()
                });
            }
        }
    };

    var OffWindowResize = function (fn) {
        if (onResizeCallbacks) {
            onResizeCallbacks.remove(fn);
        }
    }

    $(window).resize(function (e) {
        OnWindowResize(e);
    });

})(jQuery);

/*DateTimePicker*/
(function ($) {

    function DateTimePicker() {
        this.cancelText = "关闭";
        this.okText = "确定";
        this.weekStr = '日一二三四五六';
        this.weekStrArr = ['日', '一', '二', '三', '四', '五', '六'];
        this.monthsStr = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
    }
    //EMW.UI.DateTimePicker = DateTimePicker;
    DateTimePicker.prototype.Show = function (elem, view) {
        this.View = view || 1;//1只是选日期 2，选日期和时间 
        if (!this._Init) {
            this.Init();
        }
        var val = elem.val();
        var dt = val ? Z.ToDate(val) : new Date();
        if (!dt) dt = new Date();
        this.SelectedDate = new Date(dt);
        this.ShowCalendar(dt);

        this.Target = elem;
        var body = elem.closest("body");
        var parent = this.Element.parent();
        if (!parent || body[0] != parent[0]) {
            this.Element.off();
            this.Element.appendTo(elem.closest("body"));
            this.InitEvent();
        }
        this.Element.find(".dtp-btn-cancel").html("关闭");
        if (this.View == 2) {
            this.InitHMTimePanel();
            this.Element.find(".dtp-picker-datetime,.dtp-buttons").show();
        }
        else {
            this.Element.find(".dtp-picker-datetime,.dtp-buttons").hide();
        }
        this.position();
        this.Element.show().fadeIn("fast").focus();
        var _that = this;
        $(window).resize(function () {
            _that.position(_that.animateClock);
        })
        this.Move();
        this.Element.find(".date-inner").removeClass("moveLeft");
        this.Element.find(".date-inner").removeClass("moveRight");
        _this = this;
    }
    DateTimePicker.prototype.position = function () {
        //if (document.documentElement.clientHeight > 898) {
        //    this.Element.position({
        //        of: this.Target,
        //        at: "left bottom",
        //        my: "left top",
        //        collision: "fit"
        //    });
        //} else {
        //    this.Element.position({ 
        //        of: this.Target,
        //        at: "left+70 middle",
        //        my: "left+70 middle",
        //        collision: "fit"
        //    });
        //}
        //var spill = document.documentElement.clientHeight - 100 - this.Element.position().top;
        //var leftSpi = this.Element.width() + this.Element.position().left
        //if (spill < this.Element.height()) {
        //    //this.Element.css('top', document.documentElement.clientHeight - this.Target.height() - 100 - this.Element.height() + "px")
        //    this.Element.css('top', this.Target[0].getBoundingClientRect().top +this.Element.height() + "px");
        //}
        //if (leftSpi > this.Element.parent().width()) {
        //    this.Element.css('left', this.Element.parent().width() - this.Element.width());
        //}
        var targetTop = this.Target[0].getBoundingClientRect().top;
        var bodyHei = this.Element.parents("body").height();
        var clientHei = parseInt(this.Element.parents("body").height() - this.Element.height() - this.Target.height()), elmTop;
        var client = document.documentElement.clientHeight / 2;
        if (document.documentElement.clientHeight > bodyHei) {
            targetTop > client ? elmTop = targetTop - this.Element.height() : elmTop = targetTop + this.Target.height();
        } else {
            clientHei < targetTop ? elmTop = targetTop - this.Element.height() : elmTop = targetTop + this.Target.height();
        }
        this.Element.css('top', elmTop + "px");
        this.Element.css('left', this.Target[0].getBoundingClientRect().left + "px");
    }
    DateTimePicker.prototype.animateClock = function animate(to) {
        $(this).stop(true, false).animate(to);
    }
    DateTimePicker.prototype.InitHMTimePanel = function () {
        var selectHoursPan = this.Element.find(".dtp-selecthours").empty();
        var selectMinPan = this.Element.find(".dtp-selectminutes").empty();
        for (var hours = 1; hours <= 23; hours++) {
            $('<li class="' + (this.SelectedDate && this.SelectedDate.getHours() == hours ? "select" : "") + '">' + (hours < 10 ? '0' + hours : hours) + '</li>').appendTo(selectHoursPan);
        }
        $('<li class="' + (this.SelectedDate && this.SelectedDate.getHours() == 0 ? "select" : "") + '">00</li>').appendTo(selectHoursPan);
        for (var Min = 0; Min <= 60; Min++) {
            $('<li class="' + (this.SelectedDate && this.SelectedDate.getMinutes() == Min ? "select" : "") + '">' + (Min < 10 ? '0' + Min : Min) + '</li>').appendTo(selectMinPan);
        }
    }
    DateTimePicker.prototype.IsEqual = function (dt1, dt2) {
        return dt1.getFullYear() == dt2.getFullYear() && dt1.getMonth() == dt2.getMonth() && dt1.getDate() == dt2.getDate();
    }
    DateTimePicker.prototype.ShowCalendar = function (date) {
        if (this.CurDate && this.IsEqual(this.CurDate, date)) return;
        var _template = [];
        this.CurDate = date;
        _template.push('<table class="table dtp-picker-days"><thead>');

        for (var i = 0; i < this.weekStr.length; i++) {
            _template.push('<th>' + this.weekStr[i] + '</th>');
        }
        _template.push('</thead>');
        _template.push('<tbody>');
        var sdate = new Date(date.getFullYear(), date.getMonth(), 1);
        sdate = sdate.AddDays(-sdate.getDay() % 7);
        var edate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        if (edate.getDay() > 0) {
            edate = edate.AddDays(7 - edate.getDay());
        }
        while (sdate < edate) {
            if (sdate.getDay() % 7 == 0)
                _template.push('<tr>');
            _template.push('<td>');
            if (sdate.getMonth() == date.getMonth()) {
                _template.push('<button tabindex="0" type="button"  data-day="' + sdate.getDate() + '" class="dtp-select-day ' + (this.IsEqual(sdate, this.SelectedDate) ? "selected_date" : "") + '"><div></div><span >' + sdate.getDate() + '</span></button>');
            }
            sdate = sdate.AddDays(1);
            _template.push('</td>');
            if (sdate.getDay() % 7 == 0)
                _template.push('</tr>');
        }
        _template.push('</tr></tbody></table>');
        this.Element.find('.dtp-picker-calendar').html(_template.join(""));
        this.Element.find(".dtp-actual-month").html(this.monthsStr[this.CurDate.getMonth()]);
        this.Element.find(".dtp-actual-year").html(this.CurDate.getFullYear());
        if (this.CurDate.getHours() == 0) {
            this.Element.find(".clock-hour").html("12");
        } else if (this.CurDate.getHours() < 10 && this.CurDate.getHours() > 0) {
            this.Element.find(".clock-hour").html("0" + this.CurDate.getHours());
        } else if (this.CurDate.getHours() <= 12 && this.CurDate.getHours() >= 10) {
            this.Element.find(".clock-hour").html(this.CurDate.getHours());
        } else if (this.CurDate.getHours() >= 13 && this.CurDate.getHours() < 22) {
            this.Element.find(".clock-hour").html("0" + this.CurDate.getHours() % 12);
        } else {
            this.Element.find(".clock-hour").html(this.CurDate.getHours() % 12);
        }
        //默认显示现在的时间
        var _this = this;
        if (this.CurDate.getHours() <= 12 && this.CurDate.getHours() > 0) {
            //显示下午
            _this.Element.find(".clock-PM").addClass("is-opacity").siblings("div").removeClass("is-opacity");
        } else {
            //显示上午
            _this.Element.find(".clock-AM").addClass("is-opacity").siblings("div").removeClass("is-opacity");
        }
        this.CurDate.getMinutes() < 10 ? this.Element.find(".clock-min").html("0" + this.CurDate.getMinutes()) : this.Element.find(".clock-min").html(this.CurDate.getMinutes());
        $(this.Element).find(".dtp-select-day.selected_date").length == 0 || this.Element.find(".dtp-actual-num").html("星期" + this.weekStrArr[$(this.Element).find(".dtp-select-day.selected_date").parents("td").index()] + "," + this.monthsStr[this.CurDate.getMonth()] + this.CurDate.getDate() + "日");
    }
    DateTimePicker.prototype.ToMonth = function (v) {
        this.ShowCalendar(new Date(this.CurDate).AddMonths(v));
        this.Element.focus();
        return false;
    }
    DateTimePicker.prototype.ToYear = function (v) {
        this.ShowCalendar(new Date(this.CurDate).AddYears(v));
        this.Element.focus(); return false;
    }
    DateTimePicker.prototype.Close = function () {
        if (this.Element.find(".dtp-btn-cancel").text() == "返回") {
            this.Element.find(".date-inner").addClass("moveRight").removeClass("moveLeft");
            this.Element.find(".dtp-btn-cancel").html("关闭");
            return false;
        }
        this.Element.hide();
        this.Element.position({ "top": 0, "left": 0 });
        return false;
    }
    DateTimePicker.prototype.InitEvent = function () {
        var _this = this;
        var parent = this.Element.parent();
        this.Element.click(function () { return false; }).on("blur", function (e) {
            if (e.relatedTarget) {
                if ($(e.relatedTarget).closest(".dtp").length) return;
            }
            this.Close();
        }.bind(this)).on("click", ".dtp-select-month-before", this.ToMonth.bind(this, -1))
        .on("click", ".dtp-select-month-after", this.ToMonth.bind(this, 1))
        .on("click", ".dtp-select-year-before", this.ToYear.bind(this, -1))
        .on("click", ".dtp-select-year-after", this.ToYear.bind(this, 1))
        .on("click", ".dtp-select-btn-cancel", this.Close.bind(this))
        .on("click", ".dtp-select-btn-ok", this.ShowTimePicker.bind(this))
        .on("click", ".dtp-btn-ok", (function () {
            this.Save();
            this.Element.find(".dtp-btn-cancel").text("关闭");
            this.Close();
            return false;
        }).bind(this)).on("click", ".dtp-hours,.dtp-minutes", function () {
            $(this).find("+ul").css("display", "block");
            $(this).find("+ul").animate({ "top": "-102", "opacity": 1 });
            return false;
        })
        .on("click", "td button", this.SelectDay.bind(this)).on("click", ".dtp-btn-cancel", this.Close.bind(this)).on("click", ".dtp-selecthours li,.dtp-selectminutes li", (function () {
            var parentPan = $(this.parentNode);
            if (parentPan.hasClass("dtp-selecthours")) {
                _this.Element.find(".clock-hour").html($(this).text());
                parentPan.animate({ "top": "0", "opacity": 0 }, function () { _this.Element.find(".dtp-selecthours").css("display", "none"); });
            }
            else {
                _this.Element.find(".clock-min").html($(this).text());
                parentPan.animate({ "top": "0", "opacity": 0 }, function () { _this.Element.find(".dtp-selectminutes").css("display", "none"); });
            }
            parentPan.find("li.select").removeClass("select");
            $(this).addClass("select");
            _this.Save;
            return false;
        }))
        .on("click", ".clock-hour", function () {
            $(this).removeClass("is-opacity").siblings(".clock-min").addClass("is-opacity");
            $(this).parents(".clock-head").next().css("display", "none").next().css("display", "block");
        })
        .on("click", ".clock-min", function () {
            $(this).removeClass("is-opacity").siblings(".clock-hour").addClass("is-opacity");
            $(this).parents(".clock-head").next().css("display", "block").next().css("display", "none");
        })
        .on("click", ".clock-style>div", function () {
            $(this).removeClass("is-opacity").css("pointer-events", 'none').siblings().addClass("is-opacity").css("pointer-events", 'auto');
            var hourHtml = parseInt($(this).parents(".clock-inner").find(".clock-hour").html());
        })
        .on("mousedown", ".clock-middle.Minutes .clock-area", function (e) {
            $(this).on("mousemove", function (e) {
                _this.minuteDeg(e, $(this), $(this).siblings(".clock-hand"), $(this).parents(".clock-middle-time"), $(this).parents(".clock-middle-time").find("span"), $(this).parents(".clock-inner").find(".clock-min"));
            });
            return false;
        })
        .on("mousedown", ".clock-middle.Hours .clock-area", function (e) {
            $(this).on("mousemove", function (e) {
                _this.hourDeg(e, $(this), $(this).siblings(".clock-hand"), $(this).parents(".clock-middle-time"), $(this).parents(".clock-inner").find(".clock-hour"), $(this).parents(".clock-inner").find(".clock-PM"));
            })
            return false;
        })
        .on("mouseup", ".clock-area", function () {
            $(this).unbind("mousemove");
            if ($(this).parents(".clock-middle.Hours").length > 0) {
                var _that = $(this);
                setTimeout(function () {
                    _that.parents(".clock-inner").find(".clock-min").removeClass("is-opacity").siblings(".clock-hour").addClass("is-opacity");
                    _that.parents(".clock-middle").css("display", "none").siblings(".clock-middle").css("display", "block");
                }, 300)
            }
        })
        .on("click", ".clock-middle.Minutes .clock-area", function (e) {
            _this.minuteDeg(e, $(this), $(this).siblings(".clock-hand"), $(this).parents(".clock-middle-time"), $(this).parents(".clock-middle-time").find("span"), $(this).parents(".clock-inner").find(".clock-min"));
        })
        .on("click", ".clock-middle.Hours .clock-area", function (e) {
            _this.hourDeg(e, $(this), $(this).siblings(".clock-hand"), $(this).parents(".clock-middle-time"), $(this).parents(".clock-inner").find(".clock-hour"), $(this).parents(".clock-inner").find(".clock-PM"));
        })
        .on("mouseout", ".clock-area", function (e) {
            $(this).unbind("mousemove");
        });
        return false;
    }
    DateTimePicker.prototype.IsDateOnly = function () {
        return !(this.Target.attr("data-showtime"));
    }
    DateTimePicker.prototype.switch = function (LabelDate, IsDown) {
        var old_num = this.Element.find(".dtp-actual-num");
        LabelDate.appendTo(old_num.parent());
        if (IsDown) {
            LabelDate.addClass("down");
            old_num.addClass("up h");
            setTimeout(function () { old_num.remove(); LabelDate.removeClass("down h"); }, 100);
        } else {
            LabelDate.addClass("up");
            old_num.addClass("down h");
            setTimeout(function () { old_num.remove(); LabelDate.removeClass("up h"); }, 100);
        }
    }
    DateTimePicker.prototype.SelectDay = function (e) {
        var a = $(e.target).hasClass("dtp-select-day") ? $(e.target) : $(e.target).parents(".dtp-select-day");
        var LabelData = "<div class=\"dtp-actual-num h p80\">星期" + this.weekStrArr[$(e.target).parents("td").index()] + "," + this.Element.find(".dtp-actual-month").text() + a.attr("data-day") + "日</div>";
        LabelData = $(LabelData);
        var newSelectedDate = new Date(this.CurDate.getFullYear(), this.CurDate.getMonth(), a.attr("data-day"), this.Element.find(".clock-hour").val(), this.Element.find(".clock-min").val());
        this.switch(LabelData, (this.SelectedDate > newSelectedDate))
        this.SelectedDate = newSelectedDate;
        this.Element.find(".selected_date").removeClass("selected_date");
        a.addClass("selected_date");
        setTimeout(function () {
            if (a.parents(".date-inner").is(".moveRight")) {
                a.parents(".date-inner").removeClass("moveRight").addClass("moveLeft");
            } else {
                a.parents(".date-inner").addClass("moveLeft");
            }
            textClose = "返回";
            a.parents(".dtp-content").find(".dtp-btn-cancel").html(textClose);
        }, 300);
        this.InitTime();
        this.Save();
        return false;
    }
    DateTimePicker.prototype.Save = function () {
        var valHour;
        var _this = this
        if (this.Element.find(".dtp-select-day.selected_date").length > 0)
            if (_this.Element.find(".clock-AM").hasClass("is-opacity")) {
                if (_this.Element.find(".clock-hour").html() == 0) {
                    valHour = "00";
                } else {
                    valHour = parseInt(_this.Element.find(".clock-hour").html()) + 12;
                }
            } else {
                if (_this.Element.find(".clock-hour").html() == 0) {
                    valHour = "12";
                } else {
                    valHour = _this.Element.find(".clock-hour").html();
                }
            }
        this.SelectedDate = new Date(this.CurDate.getFullYear(), this.CurDate.getMonth(), this.Element.find(".dtp-select-day.selected_date").attr("data-day"), valHour, this.Element.find(".clock-min").html());
        this.Target.val(this.SelectedDate.ToString(this.View == 1 ? "yyyy-MM-dd" : "yyyy-MM-dd HH:mm"));
        this.Target.change();
        if (this.View == 1) {
            this.Close();
        }
        if (this.Element.find(".date-inner").is(".moveRight")) {
            this.Element.find(".date-inner").removeClass("moveRight")
        }
    }
    DateTimePicker.prototype.ShowTimePicker = function () {

    }
    DateTimePicker.prototype.Move = function () {

        var _this = this;

        (function (document) {
            //Usage: $("#id").drag()
            //Author: hooyes
            $.fn.Drag = function () {
                var M = false;
                var Rx, Ry;
                var t = $(this);
                t.mousedown(function (event) {
                    Rx = event.pageX - (parseInt(t.css("left")) || 0);
                    Ry = event.pageY - (parseInt(t.css("top")) || 0);
                    t.css("position", "absolute");
                    M = true;
                })
                .mouseup(function (event) {
                    M = false;
                });
                this.parent().mousemove(function (event) {
                    if (M && event.target.className != "clock-area") {
                        t.css({ top: event.pageY - Ry, left: event.pageX - Rx });
                    }
                });
            }
        })(document);
        $(this.Element).Drag();
    }
    DateTimePicker.prototype.Init = function () {
        var template = '<div class="dtp" style="display:none;" tabindex="-1">' +
                              '<div class="dtp-content"><div class="date-inner">' +
                                  '<div class="dtp-date-view">' +
                                      '<div class="dtp-date ">' +
											'<div>' +
												'<div class="left center p10">' +
													'<a href="javascript:void(0);" class="dtp-select-year-before"><i class="material-icons icon-hardware_keyboard_arrow_left"></i></a>' +
												'</div>' +
												'<div class="dtp-actual-year p80"></div>' +
												'<div class="right center p10">' +
													'<a href="javascript:void(0);" class="dtp-select-year-after"><i class="material-icons icon-hardware_keyboard_arrow_right"></i></a>' +
												'</div>' +
												'<div class="clearfix"></div>' +
											'</div>' +
											'<div>' +
												'<div class="dtp-actual-num p80">2014</div>' +
												'<div class="clearfix"></div>' +
											'</div>' +
										'</div>' +
                                       '<div class="dtp-TurnMonth">' +
                                           '<div class="">' +
													'<a href="javascript:void(0);" class="dtp-select-month-before"><i class="material-icons icon-hardware_keyboard_arrow_left"></i></a>' +
										    '</div>' +
											'<div class="dtp-actual-month"><span class="Mon">13</span><span class="Year">2014</span></div>' +
                                            '<div class="right center p10">' +
													'<a href="javascript:void(0);" class="dtp-select-month-after"><i class="material-icons icon-hardware_keyboard_arrow_right"></i></a>' +
										    '</div>' +
                                       '</div>' +
                                      '<div class="dtp-picker">' +
                                          '<div class="dtp-picker-calendar"></div>' +
                                      '</div>' +
                                  '</div>' +
                                      '<div class="box-clock">' +
                                          '<div class="clock-inner">' +
                                             '<div style="-webkit-user-select: none;">' +
                                               '<div class="clock-head"><div class="clock-time">' +
                                                '<div class="clock-time-left"></div>' +
                                             '<div class="clock-time-in" >' +
                                '<span class="clock-hour timeMin">12</span>' +
                                '<span>:</span>' +
                                '<span class="clock-min is-opacity timeMin">00</span></div>' +
                                '<div class="clock-style">' +
                                '<div class="clock-PM">PM</div>' +
                                '<div class="clock-AM">AM</div></div>' +
                                '</div></div>' +
                               '<div class="clock-middle Minutes">' +
                               '<div class="clock-bg"></div>' +
                              '<div class="clock-middle-time">' +
                              '<div class="clock-hand">' +
                                '<div class="clock-hand-circle"></div>' +
                            '</div>' +
                            '<span>00</span><span>5</span><span>10</span><span>15</span><span>20</span><span>25</span><span>30</span><span>35</span><span>40</span><span>45</span><span>50</span><span>55</span>' +
                            '<div class="clock-area"></div>' +
                            '</div></div>' +
                            '<div class="clock-middle Hours">' +
                            '<div class="clock-bg"></div>' +
                            '<div class="clock-middle-time">' +
                            '<div class="clock-hand">' +
                            ' <div class="clock-hand-circle"></div>' +
                            '</div>' +
                            '<span>12</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span>' +
                            '<div class="clock-area"></div>' +
                            '</div></div></div></div></div></div>' +
                                  '<div class="dtp-buttons">' +
                                      '<button class="dtp-btn-cancel btn btn-flat">' + this.cancelText + '</button>' +
                                      '<button class="dtp-btn-ok btn btn-flat">' + this.okText + '</button>' +
                                      '<div class="clearfix"></div>' +
                                  '</div>' +
                              '</div>' +
                          '</div>';
        this.Element = $(template);
        this._Init = true;
    }
    DateTimePicker.prototype.InitTime = function () {
        //默认显示时针
        this.Element.find(".clock-middle").css("display", "block").eq(0).css("display", "none");
        this.Element.find(".timeMin").removeClass("is-opacity").eq(1).addClass("is-opacity");
        //现在时间相对应旋转的角度           
        bgColorHour = this.Element.find(".clock-hour").html() % 12;
        this.Element.find(".clock-middle-time").eq(1).find("span").removeClass("is-bgColor").eq(bgColorHour).addClass("is-bgColor");
        this.Element.find(".clock-hand").eq(1).css("transform", "rotateZ(" + bgColorHour * 30 + "deg)");
        bgColorMin = this.Element.find(".clock-min").html();
        this.Element.find(".clock-hand").eq(0).css("transform", "rotateZ(" + bgColorMin * 6 + "deg)");
        this.Element.find(".clock-middle-time").eq(0).find("span").removeClass("is-bgColor");
        if (bgColorMin % 5 == 0) {
            var MinSpan = bgColorMin / 5;
            this.Element.find(".clock-middle-time").eq(0).find("span").eq(MinSpan).addClass("is-bgColor");
        }

    }
    DateTimePicker.prototype.hourDeg = function (obj, outContant, ob, obSpan, sp, PMstyle) {
        obSpan.find("span").removeClass("is-bgColor");
        var y = obj.pageY - outContant.offset().top;
        var x = obj.pageX - outContant.offset().left;
        var val = this.degRotate(y, x, 30, ob, Math.round);
        val == 12 ? obSpan.find("span").eq(0).addClass("is-bgColor").siblings("span").removeClass("is-bgColor") : obSpan.find("span").eq(val).addClass("is-bgColor").siblings("span").removeClass("is-bgColor");
        val < 10 ? sp.html("0" + val) : sp.html(val);
        if (val == 0) {
            val = 12;
            sp.html(val)
        }

    }
    DateTimePicker.prototype.degRotate = function (y, x, degNum, ob, MathStyle) {
        var val = 0;
        if (y <= 140 && x >= 130) {
            val = MathStyle((Math.atan((x - 130) / (140 - y)) * (180 / Math.PI)) / degNum);
            ob.css("transform", "rotateZ(" + val * degNum + "deg)");
        } else if (y > 140 && x >= 130) {
            val = MathStyle((Math.atan((y - 140) / (x - 130)) * (180 / Math.PI) + 90) / degNum);
            ob.css("transform", "rotateZ(" + val * degNum + "deg)");
        } else if (y > 140 && x < 130) {
            val = MathStyle((Math.atan((130 - x) / (y - 140)) * (180 / Math.PI) + 180) / degNum);
            ob.css("transform", "rotateZ(" + val * degNum + "deg)");
        } else {
            val = MathStyle((Math.atan((140 - y) / (130 - x)) * (180 / Math.PI) + 270) / degNum);
            ob.css("transform", "rotateZ(" + val * degNum + "deg)");
        }
        return val
    }
    DateTimePicker.prototype.minuteDeg = function (obj, outContant, ob, obSpan, sp, spIn) {
        obSpan.find("span").removeClass("is-bgColor");
        var y = obj.pageY - outContant.offset().top;
        var x = obj.pageX - outContant.offset().left;
        var val = this.degRotate(y, x, 6, ob, Math.floor);
        if (val > 59) { val = 0; }
        if (val % 5 == 0) {
            var eqVal = val / 5;
            sp.eq(eqVal).addClass("is-bgColor").siblings("span").removeClass("is-bgColor");
        }
        val < 10 ? spIn.html("0" + val) : spIn.html(val);
    }

})(jQuery);


