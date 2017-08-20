
$.addNamespace("EMW.UI");

//窗口、对话框
(function ($) {
    //$(document).bind("contextmenu", function (e) { return false; })
    $(document).on("keydown", function (e) {
        if (e.keyCode == 8 && !$(e.target).is("input,textarea") && !$(e.target).attr("contenteditable") == "true") return false;
    });
    EMW.UI.Window = function (opts) {
        if (!opts.isAlert) {
            return EMW.UI.WindowExt(opts);
        }
        var wind = EMW.Global.UI.Window(opts);
        wind.Opener = GetWindow();
        wind.OpenerWindow = window;
        return wind;
    }
    EMW.UI.Dialog = function (opts) {
        opts = opts || {};
        var wind = EMW.Global.UI.Dialog(opts);
        wind.Opener = GetWindow();
        wind.OpenerWindow = window;
        return wind;
    }
    EMW.UI.Extend = function (name, func) {
        this[name] = func;
        return this;
    }
    EMW.UI.AddControl = function (name) {
        $.fn[name] = function (a, b) {
            var ds = [];
            for (var i = 0; i < this.length; i++) {
                var _this = $(this[i])
                var ctrl = _this.data("__control");
                if (!ctrl) {
                    ctrl = new EMW.UI[name](_this, a);
                    ctrl.Extend = EMW.UI.Extend;
                    if (ctrl.target && ctrl.panel) {
                        var id = ctrl.target.attr("id");
                        ctrl.panel.data("__control", ctrl);
                        ctrl.panel.attr("id", id);
                        ctrl.target.removeAttr("id");
                    }
                    _this.data("__control", ctrl);
                }
                ds.push(ctrl);
            }
            return ds.length > 1 ? ds : ds[0];
        }
    }
    EMW.UI.Overlay = function (opts) {
        return EMW.Global.UI.Overlay(opts);
    };

})(jQuery);

/*Window扩展*/

(function () {
    var windTopFixHeight, windFooterFixHeight, windMarginTop, windMarginBottom, defaultScrollWidth = 6;
    EMW.UI.WindowExt = function (opts) {
        windTopFixHeight = EMW.Global.UI.Window.FixTopHeight;
        windFooterFixHeight = EMW.Global.UI.Window.FixFooterHeight;
        windMarginTop = EMW.Global.UI.Window.MarginTop;
        windMarginBottom = EMW.Global.UI.Window.MarginBottom;
        var opener = GetOpenerWindow();
        var extOpts = $.extend({}, opts, extOptions, {
            moveTop: false,
            modal: !opener,
            backdrop: !opener,
            draggable: false,
            resizable: false,
            minimizable: false,
            maximizable: false,
            moveable: false,
            isTopWindow: !opener
        });
        if (extOpts.height == "auto") {
            var size = EMW.Global.UI.Window.GetWindowSize();
            var height = size.height - windTopFixHeight - windFooterFixHeight - windMarginTop - windMarginBottom;
            extOpts.height = height;
        }
        if (opener) {
            extOpts.wrap = opener.options.wrap; //opener.panel;
            var size = opener.GetWindowSize();
            var openerOpts = opener.options;
            var original = openerOpts.originalOpitions;
            var h = size.height - (extOpts.height + original.top);
            if (h < 0) {
                extOpts.height = extOpts.height + h;
            }
        }
        else {
            extOpts.wrap = top.$("<div class='emw-window-wrap'></div>");
            extOpts.wrap.appendTo("body");
            //extOpts.footerFixPanel = top.$('<div class="emw-window-footer-fix"></div>').appendTo("body");
        }
        extOpts.originalOpitions = opts;
        var wind = EMW.Global.UI.Window(extOpts);
        return wind;
    }

    var IsTopWindow = function () {
        var opener = GetOpenerWindow();
        return !opener;
    }

    var GetOpenerWindow = function () {
        var curWind = GetWindow(); //curWind.constructor.name == "MyWindow"
        if (curWind && curWind.GetWindowSize) {
            return curWind;
        }
    }

    var GetTopWindow = function () {
        var topWind, curWind = GetWindow();
        while (curWind) {
            if (curWind && curWind.constructor.name == "MyWindow") {
                topWind = curWind;
            }
            curWind = curWind.Parent;
        }
        return topWind;
    }

    var OnOpenWindow = function (e) {
        var wind = e.data;//当前窗口(将要打开的窗口)
        wind.Opener = GetWindow();
        wind.OpenerWindow = window;
        var panel = wind.panel;

        //panel.find(".delete-modal-content").removeClass("delete-modal-content");

        var opts = wind.options;
        opts._dialog = panel.find(">.modal-dialog");
        opts._header = panel.find(">.modal-dialog>.modal-content>.modal-header");
        opts._footer = panel.find(">.modal-dialog>.modal-content>.modal-footer");
        opts._bodyPanel = panel.find(">.modal-dialog>.modal-content>.modal-body");
        var toolPanel = panel.find(".modal-header>.panel-tool");
        opts._toolPanel = toolPanel;

        toolPanel.on("mouseover", ">.tool-btn", function (evt) {
            var $text = $(this).find(">.tool-text");
            $text.css("margin-left", ($text.outerWidth() / -2));
        });
        var curWind = GetOpenerWindow();//Opener
        if (curWind) {

            HideChildWind(curWind);//coverTop:false情况
            wind.Parent = curWind;
            if (!curWind.ChildWindows) {
                curWind.ChildWindows = [];
            }
            if (opts.onlyChild)
                var removeChildWind = curWind.ChildWindows[0];

            curWind.ChildWindows.push(wind);
            OpenWind(wind);
            if (opts.onlyChild && removeChildWind) {
                var prevObject = removeChildWind.options._bodyPanel.prevObject;
                CloseWind(removeChildWind);
                if (prevObject) {
                    prevObject.remove();
                }
            }
        }
        else {//顶级窗口
            ResetWindowSize(wind);
            ResetTopWindowToolPos(null, wind, true);

            wind.OnWindowResize(function (size) {
                var cur = opts._CurrentChild || wind;
                ResetWindowSize(wind);
                ResetTopWindowToolPos(opts._CurrentChild ? wind : null, cur, true);
            });
        }
        var original = opts.originalOpitions;
        if ($.isFunction(original.OnOpen)) {
            original.OnOpen.apply(this, $.makeArray(arguments));
        }
        if (original.height == "auto" && !curWind) {
            SetAutoResizeWindow(wind);
        }
    }
    var OnReady = function (wind) {
        if (wind.Frame && !wind.Parent && wind.options.originalOpitions.height == "auto") {
            var d = wind.Frame.contentWindow.$(wind.Frame.contentDocument);
            d.find("body").css({ height: "auto" });
        }
        //if (!GetOpenerWindow()) {
        //    AutoResizeWindow(wind);
        //}
    }

    var extOptions = {
        onCreate: function (panel, opts) {
            var curWind = GetWindow();//Opener
            if (!curWind) {
                panel.addClass("emw-fade");//emw-window-slide-down
            }
            var original = opts.originalOpitions;
            if (original.height == "auto" && !curWind) {
                //panel.addClass("emw-window-wrap");
            }
            if ($.isFunction(original.onCreate)) {
                original.onCreate(panel, opts);
            }
        },
        onInitPos: function (wind) {
            var opts = wind.options;
            var original = opts.originalOpitions;
            var topWind = GetTopWindow();
            var size = wind.GetWindowSize();
            if (topWind) {
                var topOpts = topWind.options;
                wind.panel.css("position", "fixed");
                opts.top = topOpts.top + windTopFixHeight;
                opts.left = topOpts.left + (topOpts.width - opts.width);
            }
            else {
                if (original.height == 'auto') {
                    opts.top = 0;
                }
                if (opts.wrap) {
                    opts.wrap.css({ top: windTopFixHeight });
                }
                //original.top = t;
            }
        },
        onReady: OnReady,
        OnOpen: OnOpenWindow,
        //OnBeforeClose: function (e) {
        _OnCloseExt: function (e) {
            var wind = e.data;//当前窗口(关闭的)
            if (wind._isClosing) {
                return;
            }
            var topWind = GetTopWindow();
            CloseWind(wind);
            var opts = wind.options;
            if (opts.toolBarPanel) {
                opts.toolBarPanel.remove();
            }
            if (topWind) {
                //topWind.options._CurrentChild = null;
            }
        }
    };

    var OpenWind = function (wind) {
        var topWind = wind.Parent;
        while (topWind && topWind.Parent) {
            HideWind(topWind);//隐藏父级窗口            
            topWind = topWind.Parent;
        }
        var size = wind.GetWindowSize();//浏览器窗口大小
        var opts = wind.options;
        if (topWind) {
            //HideChildWind(topWind);
            var topOpts = topWind.options;
            var joinWidth = 2;//交叉部分2px
            var left = size.width - (topOpts.width + opts.width) + (joinWidth / 2) - EMW.Global.UI.Window.RightToolBarWidth;
            if (left >= 0) {
                left = left / 2;
            }

            topOpts.left = left;
            var panel = topWind.panel;
            panel.animate({ left: left }, "fast");//, top: t

            left = topOpts.width + left - joinWidth;//交叉部分6px
            opts.left = left;
            panel = wind.panel;
            panel.animate({ left: left, "z-index": topOpts.zIndex - 2 }, "fast");//, top: t

            ResetTopWindowToolPos(topWind, wind);

            CoverTop(topWind, wind);
            topOpts._CurrentChild = wind;
        }
        else {
            /*
            opts.left = opts.originalLeft;
            var _this = this;
            wind.panel.animate({ left: opts.left }, function () {
                //_this.Resize(opts.originalWidth, opts.originalHeight);
            });
            */
            wind.options._CurrentChild = null;
            ResetWindowSize(wind, true);
            ResetTopWindowToolPos(null, wind);
            HideCover(wind);
        }
    }

    var ResetTopWindowToolPos = function (topWind, wind, disableAnimate) {
        var size = wind.GetWindowSize();
        var right, toolPanel, original;

        if (!topWind) {
            var opts = wind.options;
            original = opts.originalOpitions;
            right = size.width - opts.left - opts.width - 40;
            toolPanel = opts.toolBarPanel;
        }
        else {
            var opts = wind.options;
            var topOpts = topWind.options;
            var right = size.width - (opts.left + opts.width + 45);
            original = opts.originalOpitions;
            toolPanel = topWind.options.toolBarPanel;
        }
        if (toolPanel) {
            if (right < 0) {
                right = 0;
            }
            if (disableAnimate) {
                toolPanel.css({ right: right });//(toolPanel.outerHeight() + 16)
            }
            else {
                toolPanel.animate({ right: right }, "fast");//(toolPanel.outerHeight() + 16)  
            }
        }
    }

    //只需要顶级窗口调用
    var ResetWindowSize = function (topWind, animate) {
        var topOpts = topWind.options;
        var size = topWind.GetWindowSize();
        var windWidth = size.width - defaultScrollWidth - EMW.Global.UI.Window.RightToolBarWidth;//默认减掉滚动条宽度
        var curWind = topOpts._CurrentChild;
        if (curWind) {
            var curOpts = curWind.options;
            var width = Math.min(windWidth, curOpts.originalWidth || curOpts.width);
            var left = windWidth - (topOpts.width + width) + 3;//交叉部分6px

            if (left >= 0) {
                left = left / 2;
            }

            topOpts.left = left;
            var panel = topWind.panel;
            panel.css({ left: left }, "fast");//animate

            left = topOpts.width + left - 6;//交叉部分6px
            curOpts.left = left;
            curOpts.width = width;
            panel = curWind.panel;
            panel.css({ left: left, width: width }, "fast");//, top: t 
        }
        else {
            var width = Math.min(windWidth, topOpts.originalWidth || topOpts.width);
            var left = (windWidth - width) / 2;
            topOpts.left = left;
            topOpts.width = width;
            var panel = topWind.panel;
            //panel.css({ left: left, width: width }, "fast");//, top: t
            animate ? panel.animate({ left: left, width: width }, "fast") : panel.css({ left: left, width: width }, "fast");
        }
        if (topOpts.wrap) {
            topOpts.wrap.css({ height: size.height - windTopFixHeight - windFooterFixHeight });
        }
    }

    var CloseWind = function (wind) {
        var opts = wind.options;
        if (opts._autoResizeTimer) {
            clearTimeout(opts._autoResizeTimer);
        }
        if (opts.toolPanel) {
            opts.toolPanel.remove();
        }
        var opener = wind.Parent;
        if (opener) {
            var preWind = opener;
            if (opener.ChildWindows) {
                opener.ChildWindows.Remove(wind);
            }
            if (opener.ChildWindows.length > 0) {
                preWind = opener.ChildWindows[opener.ChildWindows.length - 1];
            }
            OpenWind(preWind);
            ShowWind(preWind);
        }
        CloseChildWind(wind);
    }

    var CloseChildWind = function (wind) {
        if (wind.ChildWindows) {
            for (var i = 0; i < wind.ChildWindows.length; i++) {
                var childWind = wind.ChildWindows[i];
                CloseChildWind(childWind);
                childWind._isClosing = true;
                childWind.Close();
            }
        }
    }

    var HideWind = function (wind) {
        //HideChildWind(wind);

        var opts = wind.options;
        var panel = wind.panel;

        panel.fadeOut();
        panel.css({ right: (-1 * opts.width), left: "initial" });
        //wind.Minimize();
    }

    var HideChildWind = function (wind) {
        if (wind.ChildWindows) {
            for (var i = 0; i < wind.ChildWindows.length; i++) {
                var childWind = wind.ChildWindows[i];
                HideWind(childWind);
            }
        }
    }

    var ShowWind = function (wind) {
        var opts = wind.options;
        var panel = wind.panel;

        //wind.Restore();
        panel.show();
        panel.animate({ right: "initial", left: opts.left }, "fast");
    }

    var CoverTop = function (topWind, wind) {
        var opts = wind.options;
        if (opts.coverTop === false) {
            return;
        }

        var topOpts = topWind.options;
        var jq = top.$;
        if (!topWind.topCover) {
            topWind.topCover = EMW.UI.Overlay({
                backElem: topOpts._dialog,
                closeOn: false,
                maskStyle: {
                    opacity: "0"
                }
            });
            if (false && topOpts.toolBarPanel) {
                topWind.topToolCover = EMW.UI.Overlay({
                    backElem: topOpts.toolBarPanel,
                    closeOn: false,
                    maskStyle: {
                        opacity: "0"
                    },
                    style: {
                        height: topOpts.toolBarPanel.outerHeight() + 1,
                        width: topOpts.toolBarPanel.outerWidth() + 1,
                    }
                });
            }
        }
        topWind.topCover.Show();
        if (topWind.topToolCover) {
            topWind.topToolCover.Show();
        }
    }

    var HideCover = function (wind) {
        if (wind.topCover) {
            wind.topCover.Hide();
        }
        if (wind.topToolCover) {
            wind.topToolCover.Hide();
        }
    }
    var SetAutoResizeWindow = function (wind) {
        wind.options._autoResizeTimer = setTimeout(function () {
            AutoResizeWindow(wind);
            SetAutoResizeWindow(wind);
        }, 500);
    }

    var AutoResizeWindow = function (wind) {
        var opts = wind.options;
        var panel = wind.panel;
        var contentHeight;
        var size = wind.GetWindowSize();
        if (wind.Frame && wind.Frame.contentWindow) {
            if (wind.Frame.contentDocument.scrollingElement) {
                contentHeight = wind.Frame.contentDocument.scrollingElement.scrollHeight;
            }
        }
        //窗口最小高度
        var height = (contentHeight + opts._header.outerHeight() + (opts._footer.outerHeight() || 0)) + (Z.ToInt(panel.css("border-radius")) * 2);

        var height2 = (size.height - windTopFixHeight - windFooterFixHeight - windMarginTop - windMarginBottom);//剩余高度

        if (opts._contentHeight == contentHeight) {
            return;
        }
        opts._contentHeight = contentHeight;
        height = Math.max(height, height2);
        wind.Resize(opts.width, height);
    }
})(jQuery);
EMW.UI.AddControl("Section");
EMW.UI.AddControl("Tree");

$(function () {
    $(".section").Section();
});


EMW.Controls = {
    ZIndex: 1000
};
//(function ($$) {
EMW.Event = function () {
    this.Events = $.Callbacks("unique stopOnFalse");
};
EMW.Event.prototype.Add = function (fn) {
    this.Events.add(fn);
};
EMW.Event.prototype.Remove = function (fn) {

};
EMW.Event.prototype.Call = function (context, args) {
    this.Events.fireWith(context, $.makeArray(args));
}

EMW.Event.On = function (obj, events, opts) {
    var callbacks = {
    };
    for (var i = 0; i < events.length; i++) {
        var name = events[i];
        obj[name] = (function (evt) {
            return function (fn) {
                var event = callbacks[evt];
                if (!event) {
                    event = callbacks[evt] = new EMW.Event();
                }
                if ($.isFunction(fn)) {
                    event.Add(fn);
                }
                else {
                    event.Call(obj, arguments);
                }
                return obj;
            }
        })(name); //形成闭包
        if (opts && opts[events[i]]) {
            obj[name](opts[events[i]]);
        }
    }
};

EMW.EventArgument = function (data) {
    this.IsStop = false;
    this.Data = data;
};
/*Tree*/
(function () {
    var Tree = function (elem, opts) {
        if (!elem) return;
        this.Element = elem;
        this.Data = [];
        this.Element.attr("onselectstart", "return false;");
        EMW.Event.On(this, ["OnSelected", "OnUnSelected", "OnCheck", "OnExpand", "OnBeforeExpand", "OnDblClick"]);

        this.Options = $.extend({
        }, {
            isCheck: false,
            expandLevel: 1,
            loadLevel: 1,
            expandIcon: "icon-content_remove_circle_outline",
            collapseIcon: "icon-content_add_circle_outline",
            defaultIcon: "file"
        }, opts);

        this.Element.click(this.Click.bind(this));
        this.LoadData(this.Options.data);
        this.Element.on("dblclick", ".tree-item", this.DBLClick.bind(this));
    }
    Tree.prototype.DBLClick = function (evt) {
        var elem = $(evt.target).closest(".tree-item");
        this.OnDblClick(elem.data("tree_data"));
    }
    Tree.prototype.LoadData = function (data) {
        if (data == undefined) return this.Data;
        data = data || [];
        this.selectedItem = null;
        this.Element.html("");
        this.Data = data;
        this.LoadChildData(data, this.Element, 0);
        return this;
    }
    Tree.prototype.LoadChildData = function (data, parent, lv) {
        if (!data) return;

        for (var i = 0; i < data.length; i++) {
            var itemdata = data[i];
            itemdata = this.ParseData(itemdata);
            var item = this.CreateItem(itemdata, lv);
            item.appendTo(parent);

            if (itemdata.children) {
                this.CreateChildDiv(itemdata, lv).appendTo(parent);
            }
        }
    }
    Tree.prototype.CreateChildDiv = function (itemdata, lv) {
        var children_panel = $("<div class='tree-children' " +
                     (itemdata.__isExpand ? "" : "style='display:none'") + "></div>");
        this.LoadChildData(itemdata.children, children_panel, lv + 1);
        return children_panel;
    }
    Tree.prototype.Expand = function (data, isexpand) {
        var elem = data.__target;
        if (!elem) return;
        var data = elem.data("tree_data");


        var children = elem.next();
        var exIcon =
            elem.find(".tree-exicon");
        if (data.__isExpand && (isexpand == undefined || isexpand == false)) {
            exIcon.removeClass(this.Options.expandIcon);
            exIcon.addClass(this.Options.collapseIcon);
            children.slideUp("fast");
            data.__isExpand = false;
        } else if (isexpand == undefined || isexpand == true) {
            if (this.OnBeforeExpand(data, elem) == false) return;

            children.slideDown("fast");

            exIcon.removeClass(this.Options.collapseIcon);
            exIcon.addClass(this.Options.expandIcon);
            data.__isExpand = true;
            this.OnExpand(data, elem);
        }

    }
    Tree.prototype.GetParent = function (data) {
        var elem = data.__target;
        if (!elem) return;
        return elem.parent().prev().data("tree_data");
    }
    Tree.prototype.Insert = function (data, item) {
        if (!item) return this.Append(data);
        var parent = this.GetParent(item);
        data = this.ParseData(data);
        var insert_item = this.CreateItem(data, item.__lv);
        insert_item.insertBefore(item.__target);
        if (data.children)
            this.CreateChildDiv(data, item.__lv).insertBefore(item.__target);
        if (parent) {
            parent.children.Insert(parent.children.IndexOf(item), data);
        } else {
            this.Data.Insert(this.Data.IndexOf(item), data);
        }

    }
    Tree.prototype.Append = function (data, parent_data) {
        var child_div;
        if (!parent_data) {
            child_div = this.Element;
        } else {
            var elem = parent_data.__target;
            if (!parent_data.children) {
                parent_data.children = [];
            }
            child_div = elem.next();
            if (!child_div.is(".tree-children")) {
                child_div = $("<div class='tree-children' " +
                    (parent_data.__isExpand ? "" : "style='display:none'") + "></div>");
                child_div.insertAfter(elem);
            }
            elem.find(".tree-exicon").css({ visibility: "visible" });
        }
        if (!$.isArray(data)) {
            data = [data];
        }
        for (var i = 0; i < data.length; i++) {

            var itemdata = this.ParseData(data[i]);
            var item = this.CreateItem(itemdata, (parent_data ? parent_data.__lv : -1) + 1);
            child_div.append(item);
            if (parent_data)
                parent_data.children.push(itemdata);
            else
                this.Data.push(itemdata);
        }
    }
    Tree.prototype.GetCheckedItems = function (data, items) {
        data = data || this.Data;
        items = items || [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].isCheck) {
                items.push(data[i]);
            }
            if (data[i].children && data[i].children.length > 0) {
                this.GetCheckedItems(data[i].children, items);
            }
        }
        return items;
    }
    Tree.prototype.CheckItem = function (data) {
        var elem = data.__target;
        if (!elem) return;
        var data = elem.data("tree_data");
        var checkbox = elem.find(".tree-checkbox");
        data.isCheck = checkbox.is(":checked");
        if (this.OnCheck(data) == false) {
            data.isCheck = !data.isCheck;
            if (data.isCheck) {
                checkbox.prop("checked");
            } else {
                checkbox.removeAttr("checked");
            }
        }
    }
    Tree.prototype.Filter = function (func) {
        var ary = [];
        this.FilterByArray(this.Data, ary, func);
        this.Element.empty();
        this.LoadChildData(ary, this.Element, 0);
    }
    Tree.prototype.FilterByArray = function (data, ary, func) {
        var isShow = false;
        for (var i = 0; i < data.length; i++) {
            var item = this.ParseData(data[i]);
            if (item.children && func) {
                var child_ary = [];
                var child_isshow = this.FilterByArray(item.children, child_ary, func);
                if (child_isshow) {
                    item.temp_children = item.children;
                    item.children = child_ary;
                    ary.push(item);
                    isShow = true;
                    continue;
                }
            }
            if (!func || func(data[i])) {
                if (item.temp_children) {
                    item.children = item.temp_children;
                    item.temp_children = null;
                }
                ary.push(item);
                if (func) item.children = null;
                isShow = true;
            }
        }
        return isShow;
    }
    Tree.prototype.Click = function (evt) {

        var elem = $(evt.target), data;
        while (elem.length && !elem.is(".tree-item")) {
            elem = elem.parent();
        }
        data = elem.data("tree_data");
        if (!data || data.disabled) return;
        //if ($(evt.target).is(".badge")) {

        //    return false;
        //}
        if ($(evt.target).is(".tree-exicon")) {
            // this.Expand(elem.data("_treeitem"));
            this.Expand(data);
            return false;
        }
        if ($(evt.target).is(".tree-checkbox")) {
            this.CheckItem(data);
            return true;
        }
        this.SelectItem(elem, data);
        //this.SelectedID = data.id;
        return;
    }
    Tree.prototype.SelectItem = function (elem, data) {
        if (this.selectedItem) {
            if (this.selectedItem.data("tree_data") == data) return;
            this.UnSelect();
        }
        this.selectedItem = elem;
        this.selectedItem.addClass("selected");
        this.OnSelected(data, this);
    }
    Tree.prototype.Select = function (obj) {
        if (!obj) return;
        if (obj.__target) {
            return this.SelectItem(obj.__target, obj);
        }
    }
    Tree.prototype.GetSelected = function () {
        if (this.selectedItem)
            return this.selectedItem.data("tree_data");
    }

    Tree.prototype.GetSelectedData = function () {
        if (this.selectedItem)
            return this.selectedItem.data("tree_data").data;
    }
    Tree.prototype.UnSelect = function () {
        if (this.selectedItem) {
            this.selectedItem.removeClass("selected");
            this.OnUnSelected(this.selectedItem.data("tree_data"), this);
            this.selectedItem = null;
        }
    }
    Tree.prototype.Remove = function (items) {
        if (!items) return;
        if (!$.isArray(items)) {
            items = [items];
        }
        for (var i = 0; i < items.length; i++) {
            var elem = items[i].__target;
            var parent = this.GetParent(items[i]);
            if (items[i].children) {
                var child_div = elem.next();
                if (child_div.is(".tree-children")) {
                    child_div.remove();
                }
            }
            if (elem) {
                elem.remove();
            }
            items[i].__target = null;
            if (parent) {
                parent.children.Remove(items[i]);
            } else {
                this.Data.Remove(items[i]);
            }
        }
    }
    Tree.prototype.ParseData = function (item) {
        if (item.data) return item;
        if (this.Options.parse) {
            if ($.isFunction(this.Options.parse)) {
                var ida = this.Options.parse(item);
                ida.data = item;
                return ida;
            }
            var itemdata = {};
            itemdata.data = item;
            itemdata.id = item[this.Options.parse.id || "id"];
            itemdata.text = item[this.Options.parse.text || "text"];
            itemdata.icon = item[this.Options.parse.icon || "icon"];
            itemdata.isCheck = item[this.Options.parse.isCheck || "isCheck"];
            itemdata.badge = item[this.Options.parse.badge || "badge"];
            itemdata.children = item[this.Options.parse.children || "children"];
            itemdata.desc = item[this.Options.parse.desc || "desc"];
            return itemdata;
        }
        return item;
    }
    Tree.prototype.CreateItem = function (itemdata, lv) {
        itemdata.__isExpand = lv < this.Options.expandLevel;
        itemdata.__lv = lv;
        var hasChild = itemdata.children && itemdata.children.length > 0;
        var tree_item = $('<div class="tree-item"  style="padding-left:' + (lv * 17) + 'px">' +
           "<span class='glyphicon " + (itemdata.__isExpand ? this.Options.expandIcon : this.Options.collapseIcon) +
           " tree-exicon' " + (hasChild ? "" : "style='visibility:collapse'") + "></span>" +
            (this.Options.isCheck ? "<input type='checkbox' class='tree-checkbox' " + (itemdata.isCheck ? "checked" : "") + ">" : "") +
            '<span class="glyphicon icon-' + (itemdata.icon || this.Options.defaultIcon) + ' tree-icon"></span>' +
            '<span class="tree-item-text">' + (this.Options.formatter ? this.Options.formatter(itemdata) : itemdata.text) + "</span>" +
            (this.Options.showDesc ? "<span class='tree-item-desc'>" + (itemdata.desc || "") + "</span>" : "") +
            (itemdata.badge != undefined ? '<span class="badge pull-right">' + itemdata.badge + '</span>' : "") +
            '</div>');
        itemdata.__target = tree_item;
        tree_item.data("tree_data", itemdata);
        if (itemdata.desc) {
            tree_item.attr("title", itemdata.desc);
        }
        if (itemdata.isSelected) {
            this.selectedItem = tree_item;
            this.selectedItem.addClass("selected");
        }
        return tree_item;
    }

    Tree.prototype.UpdateItem = function (data) {

        var elem = data.__target;
        if (!elem) return;
        elem.find(".tree-item-text").html(data.text);
        elem.find(".tree-icon").attr("class", 'glyphicon icon-' + (data.icon || "file") + ' tree-icon');
        if (data.badge != undefined) {
            var bag = elem.find(".badge");
            if (data.badge == "clear") {
                bag.remove();
                return;
            }
            if (!bag.length) {
                bag = $('<span class="badge pull-right"></span>').appendTo(elem);
            }
            bag.html(data.badge);
        }

        if (data.desc) {
            elem.attr("title", data.desc);
        }
    }
    EMW.UI.Tree = Tree;

    var Section = function (elem, opts) {
        if (!elem) return;
        this.Element = elem;
        EMW.Event.On(this, ["OnOpen", "OnClose"]);

        this.Options = $.extend({
        }, {
            isOpen: true,
            title: "节",
            closeIcon: "icon-hardware_keyboard_arrow_right",
            openIcon: "icon-hardware_keyboard_arrow_down"
        }, opts);
        this.Init();
    }
    Section.prototype.Init = function () {
        this.Icon = this.Element.find(".section-icon");
        this.Element.find(".section-header").click(this.Click.bind(this));
        this.Content = this.Element.find(".section-body");
        if (!this.Options.isOpen) this.Content.hide();
        this.Icon.addClass(this.Options.isOpen ? this.Options.openIcon : this.Options.closeIcon);
    }
    Section.prototype.SetTitle = function (title) {
        this.Element.find("section-title").html(title);
    }
    Section.prototype.Open = function () {
        this.Content.slideDown("fast");
        this.Options.isOpen = true;
        this.Icon.removeClass(this.Options.closeIcon);
        this.Icon.addClass(this.Options.openIcon);
        this.OnOpen(this);
    }
    Section.prototype.Close = function () {
        this.Content.slideUp("fast");
        this.Options.isOpen = false; //glyphicon - chevron - right
        this.Icon.removeClass(this.Options.openIcon);
        this.Icon.addClass(this.Options.closeIcon);
        this.OnClose(this);
    }
    Section.prototype.Click = function () {
        if (this.Options.isOpen) {
            this.Close();
        } else {
            this.Open();
        }
        return false;
    }
    EMW.UI.Section = Section;


    EMW.UI.AddControl("ToolBar");
    var ToolBar = function (elem, opts) {
        if (!elem) return;
        this.Element = elem;
        EMW.Event.On(this, ["OnClick"]);
        this.Options = opts || {};

        this.Init();
    }
    ToolBar.prototype.Init = function () {
        if (!this.Options.items) return;

        this.Element.addClass(this.Options.display || "tool-block");
        this.AddItems(this.Element, this.Options.items);
    }
    ToolBar.prototype.Insert = function (item, old_item) {
        var parent = this.Element;
        if (old_item) {
            parent = old_item.__target.parent();
        }
        this.AddItems(parent, $.isArray(item) ? item : [item]);
    }
    ToolBar.prototype.AddItems = function (parent, par_data) {
        for (var i = 0; i < par_data.length; i++) {
            var item = par_data[i];
            item.icon = item.icon || "plus";

            var tool_item = $('<div class="tool"  title="' + (item.desc || item.text) + '" ><span class="glyphicon icon-' + item.icon
                + ' tool-icon"></span><span class="tool-text">' + (item.text || "") + '</span></div>');
            tool_item.click(this.Click.bind(this, item));
            if (item.isOn) {
                tool_item.addClass("on");
            }
            tool_item.appendTo(parent);
            item.__target = tool_item;
            if (item.isShow == false) {
                tool_item.hide();
            }
            if (item.menu && item.menu.items) {
                var child_menus = $("<div class='tool-bar'></div>");
                if (!item.menu.action || item.menu.action == "click" || item.menu.action == "hover") {
                    child_menus.hide();
                    if (item.menu.action == "hover") {
                        tool_item.mouseenter(this.ShowSubMenu.bind(this, item, tool_item[0]));
                        tool_item.mouseleave(this.HideSubMenu.bind(this, item, tool_item[0]));
                        child_menus.mouseleave(this.HideSubMenu.bind(this, item, tool_item[0]));
                    }
                } else {
                    item.showSubMenu = true;
                }
                $('<span class="caret"></span>').appendTo(tool_item);
                item.subMenu = child_menus;
                child_menus.addClass(item.menu.display || "tool-block");
                this.AddItems(child_menus, item.menu.items);
                child_menus.appendTo(parent);
            }
        }
    }
    ToolBar.prototype.UpdateItem = function (item, expitem) {
        var elem = item.__target;
        if (!elem) return;
        for (var prop in expitem) {
            switch (prop) {
                case "text":
                    item.text = expitem.text;
                    elem.attr("title", item.text);
                    elem.find(".tool-text").html(item.text);
                    break;
                case "icon":
                    elem.find(".tool-icon").removeClass("glyphicon-" + item.icon).addClass("glyphicon-" + expitem.icon);
                    item.icon = expitem.icon;
                    break;
            }
        }

    }
    ToolBar.prototype.HideSubMenu = function (item, elem, e) {

        if (e && (e.toElement == item.subMenu || e.toElement == this.Element[0])) return;

        if (item.showSubMenu) {
            item.subMenu.slideUp("fast");
            item.showSubMenu = false;
        }
        return false;
    }
    ToolBar.prototype.ShowSubMenu = function (item, elem, e) {

        if (item.subMenu) {
            if (!item.showSubMenu) {
                item.subMenu.slideDown("fast");
                item.showSubMenu = true;
            }
        }
        return false;
    }
    ToolBar.prototype.FindItem = function (field, value, action) {
        return this.FindItemFromAry(this.Options.items, field, value, action);
    }
    ToolBar.prototype.FindItemFromAry = function (ary, field, value, action) {
        if (!ary) return;
        for (var i = 0; i < ary.length; i++) {
            var item = ary[i];
            if (item[field] == value) {
                if ($.isPlainObject(action)) {
                    this.UpdateItem(item, action);
                } else {
                    switch (action) {
                        case "hide":
                            item.__target.slideUp("fast");
                            break;
                        case "show":
                            item.__target.slideDown("fast");
                            break;
                        case "disable":
                            item.__target.addClass("disable");
                            item.__disable = true;
                            break;
                        case "enable":
                            item.__disable = false;
                            item.__target.removeClass("disable");
                            break;
                        default:
                            return item;
                    }
                }
            }
            if (item.menu) {
                this.FindItemFromAry(item.menu.items, field, value, action);
            }
        }
    }

    ToolBar.prototype.ToggleItemsByGroup = function (item, ary) {
        if (!ary) return;
        for (var i = 0; i < ary.length; i++) {
            if (ary[i].group == item.group && ary[i] != item) {
                this.Toggle(ary[i], !item.isOn);
            }
            if (ary[i].menu) {
                this.ToggleItemsByGroup(item, ary[i].menu.items);
            }
        }
    }
    ToolBar.prototype.Toggle = function (item, isOn) {
        if (!item.isOn == !isOn) return;
        if (item.isOn) {
            item.__target.removeClass("on");
            item.isOn = false;
        } else {
            item.isOn = true;
            item.__target.addClass("on");
            if (item.group) {
                this.ToggleItemsByGroup(item, this.Options.items);
            }
        }
        if (item.OnClick) {
            item.OnClick(item, item.isOn);
        } else {
            this.OnClick(item, item.isOn);
        }
    }
    ToolBar.prototype.Click = function (item) {
        if (item.subMenu) {
            item.showSubMenu ? this.HideSubMenu(item) : this.ShowSubMenu(item);
            return;
        }
        if (item.isToggle) {
            return this.Toggle(item, !item.isOn);
        }
        if (item.OnClick) {
            item.OnClick(item);
        } else {
            this.OnClick(item);
        }
    }
    EMW.UI.ToolBar = ToolBar;
    EMW.UI.AddControl("SearchBox");
    var SearchBox = function (elem, opts) {
        if (!elem) return;
        this.Element = elem;
        opts = opts || {};
        EMW.Event.On(this, ["OnSearch"]);
        this.Title = opts.title || "搜索";
        this.Init();
    }
    SearchBox.prototype.Init = function () {
        this.TextBox = this.Element.find("input");
        if (!this.TextBox) {
            this.Element.html('<span class="glyphicon glyphicon-search search-icon"></span><input class="text-box" placeholder="' + this.Title + '"/>');
            this.TextBox = this.Element.find("input");
        }
        this.TextBox.keydown(this.DoSearch.bind(this))
        this.Element.click(this.Click.bind(this));
    }
    SearchBox.prototype.Click = function (evt) {
        if ($(evt.target).is(".search-icon")) {
            this.OnSearch && this.OnSearch(this.TextBox.val());
        }
    }
    SearchBox.prototype.Value = function (v) {
        if (v == undefined)
            return this.TextBox.val();
        this.TextBox.val(v);
    }
    SearchBox.prototype.DoSearch = function (e) {
        if (e.keyCode == 13)
            this.OnSearch && this.OnSearch(this.TextBox.val());
    }
    EMW.UI.SearchBox = SearchBox;
    EMW.UI.AddControl("GridList");
    var GridList = function (elem, opts) {
        if (!elem) return;
        this.Options = $.extend(opts, {
        });
        elem.addClass("gridlist");
        EMW.Event.On(this, ["OnLinkClick", "OnChecked", "OnClick"], opts);
        this.CheckedRows = [];
        this.Init(elem);
        this.BindData(this.Options.Data);
    }
    GridList.prototype.Init = function (elem) {
        this.Element = elem;
        var cols = this.Options.Columns;
        var html = ["<thead><tr>"];
        if (cols) {
            html.push("<td style='width:20px'>");
            html.push("<label><span class='icon-action_done'></span><input type='checkbox' isall=\"true\"></label>");
            html.push("</td>");
            for (var i = 0; i < cols.length; i++) {

                var col = cols[i];
                if (this.Options.showDetails && col.Field == 'Memo') continue;
                html.push("<td style='width:" + (col.Width || 120) + "px'>");
                //html.push(col.Header);
                html.push("<span>" + col.Header + "</span>");
                html.push("</td>");
            }
        }


        html.push("<td></td></tr></thead><tbody></tbody>");
        this.Element.html(html.join(""));
        this.Content = this.Element.find("tbody");
        this.Element.click(this.Click.bind(this));
        if (this.Options.Sortable) {
            this.Content.sortable({
                update: this.SortEnd.bind(this)
            });
            this.Content.disableSelection();
        }
    }
    GridList.prototype.SortEnd = function (event, ui) {
        var child = this.Content.children();
        for (var i = 0; i < child.length; i++) {
            this.Data[i] = $(child[i]).data("grid-list-item");
        }
    }
    GridList.prototype.GetData = function () {
        return this.Data;
        //var data = [];
        //var child = this.Content.children();
        //for (var i = 0; i < child.length; i++) {
        //    data.push($(child[i]).data("grid-list-item"));
        //}
        //return data;
    }
    GridList.prototype.Filter = function (func) {
        var child = this.Content.children();
        for (var i = 0; i < child.length; i++) {
            var data = $(child[i]).data("grid-list-item");
            if (func(data)) {
                $(child[i]).show("fast");
            } else {
                $(child[i]).hide("fast");
            }
        }
    }
    GridList.prototype.Insert = function (item) {
        if (this.Data == undefined) this.Data = [];
        var elem = this.CreateItem(item);
        this.Content.append(elem);
        this.Data.push(item);
    }
    GridList.prototype.Update = function (data, newData) {
        var child = this.Content.children();
        var cols = this.Options.Columns;
        newData = newData || data;
        for (var i = 0; i < child.length; i++) {
            var tr = $(child[i]);
            var item = tr.data("grid-list-item");
            if (data == item) {
                this.Data[i] = newData;
                tr.data("grid-list-item", newData);
                var td = tr.children();
                for (var i = 0; i < cols.length; i++) {
                    $(td[i + 1]).html(this.ColumnContent(newData, cols[i]));
                }
                return;
            }
        }
    }
    GridList.prototype.RemoveChecked = function () {
        var child = this.Content.children();
        for (var i = 0; i < child.length; i++) {
            var row = $(child[i]);
            if (row.find("input").is(":checked")) {
                this.Data.Remove(row.data("grid-list-item"));
                row.remove();
                continue;
            }
        }
    }
    GridList.prototype.aniClick = function (elem, name, cssColor, type) {
        if (elem.is(".ImgDetails")) {
            elem.parent(".show_details1").attr('name', name).css("color", cssColor);
        } else {
            elem.attr('name', name).css("color", cssColor);
        }
        switch (type) {
            case 1:
                if (elem.is(".ImgDetails")) {
                    elem.addClass("active");
                } else {
                    elem.find(".ImgDetails").addClass("active")
                }
                break;
            case 2:
                if (elem.is(".ImgDetails")) {
                    elem.removeClass("active");
                } else {
                    elem.find(".ImgDetails").removeClass("active");
                }
                break;
            default:
                break;
        }
    }
    GridList.prototype.Click = function (evt) {
        var elem = $(evt.target);
        var row = elem.closest("tr ");
        if (elem.is(".show_details")) {

            if (elem.attr("name") == "show_details") {
                row.find("td:first").attr('rowspan', 2)
                row.next().show();
                elem.text('收起').attr('name', 'hide_details')
            } else {
                row.find("td:first").attr('rowspan', 1)
                row.next().hide();
                elem.text('查看详情').attr('name', 'show_details')
            }
            return;
        }
        if (elem.is(".show_details1") || elem.is(".ImgDetails")) {
            var eleDiv = elem.parents("tr").next().find(".aniDetails");
            var shiwDat = $("table tbody td > span.show_details1");
            if (elem.attr("name") == "show_details") {
                row.next().slideDown();
                eleDiv.slideDown(250, "linear", function () { shiwDat.removeClass("active"); });
                if ($(eleDiv).hasClass("active")) eleDiv.addClass("act");
                this.aniClick(elem, "hide_details", "#333C48", 1);
            } else {
                eleDiv.removeClass("active").slideUp(250);
                row.next().slideUp();
                this.aniClick(elem, "show_details", "#9298A0", 2);
            }
            return;
        }
        var data = row.data("grid-list-item");
        if (!data) {
            if (elem.attr("isall") && !this.Options.singleSelect) {
                var ischeck = elem.is(":checked");
                this.CheckedRows = [];
                var $grid = this;
                this.Element.find("tr").each(function (i, elem) {
                    if (i == 0) return;
                    if (ischeck) {
                        $grid.CheckedRows.push($(elem));
                        $(elem).find("label span").addClass("selColor")
                    }
                    else {
                        $(elem).find("label span").removeClass("selColor")
                    };
                    $(elem).find("input").first().prop("checked", ischeck);
                });
            }
            return;
        }
        if (this.OnClick(data, evt) === false) return;
        if (elem.is(".link-text")) {
            this.OnLinkClick(data);
            //return;
        }

        if (elem.is(".icon-action_done")) {
            if (!elem.is(".selColor")) {
                if (this.Options.singleSelect) {
                    for (var i = 0; i < this.CheckedRows.length; i++) {
                        this.CheckedRows[i].removeClass("sel");
                        //this.CheckedRows[i].find("label span").removeClass("selColor")
                        this.CheckedRows[i].find("input").prop("checked", false);
                    }
                    this.CheckedRows.length = 0;
                }

                this.CheckedRows.push(row);
                row.find("label span").addClass("selColor")
                row.addClass("sel");

                this.OnChecked(data, row);
            }
            else {
                for (var i = 0; i < this.CheckedRows.length; i++) {
                    if (this.CheckedRows[i][0] == row[0]) {
                        this.CheckedRows.splice(i, 1);
                        elem.removeClass("selColor")
                        return row.removeClass("sel");

                    }
                }
            }
            return false;
        }
        var isChecked = false;
        for (var i = 0; i < this.CheckedRows.length; i++) {
            if (this.CheckedRows[i] == row) {
                isChecked = true;
                continue;
            }
            this.CheckedRows[i].find("label span").removeClass("selColor")
            this.CheckedRows[i].removeClass("sel");
            this.CheckedRows[i].find("input").prop("checked", false);
        }
        this.CheckedRows.length = 0;
        this.CheckedRows.push(row);
        if (isChecked) return;
        row.addClass("sel");
        row.find("input").prop("checked", true);
        row.find("label span").addClass("selColor")
        this.OnChecked(data, row);
        return false;
    }
    GridList.prototype.GetCheckRows = function () {
        var data = [];
        for (var i = 0; i < this.CheckedRows.length; i++) {
            data.push(this.CheckedRows[i].data("grid-list-item"));
        }
        return data;
    }
    GridList.prototype.RemoveItem = function (len) {
        this.CheckedRows.splice(0, len);
    }
    GridList.prototype.ClearSelections = function () {
        for (var i = 0; i < this.CheckedRows.length; i++) {
            this.CheckedRows[i].find("label span").removeClass("selColor")
            this.CheckedRows[i].removeClass("sel");
            this.CheckedRows[i].find("input").prop("checked", false);
        }
        this.CheckedRows = [];
    }

    GridList.prototype.SelectRow = function (o) {
        var child = this.Content.children();
        for (var i = 0; i < child.length; i++) {
            var row = $(child[i]);
            var rowData = row.data("grid-list-item");
            if (($.isFunction(o) && o(rowData)) || (rowData == o)) {
                row.find("label span").addClass("selColor")
                row.addClass("sel");
                row.find("input").prop("checked", true);
                this.CheckedRows.push(row);
                break;
            }
        }
    }

    GridList.prototype.BindData = function (list) {
        this.Content.empty();
        this.CheckedRows = [];
        this.Data = list;
        if (!list) return;
        //this.Data = list;
        for (var i = 0; i < list.length; i++) {
            var elem = this.CreateItem(list[i]);
            this.Content.append(elem);
        }
    }
    GridList.prototype.ColumnContent = function (data, col) {
        var text = col.Formatter ? col.Formatter(data, col) : data[col.Field];
        if (col.IsLink) {
            var html = [];
            html.push("<div class='hyperlink'>");
            if (col.Icon) {
                html.push("<span class='glyphicon glyphicon-" + col.Icon + " link-icon'></span>");
            }
            html.push("<span class='link-text'>");
            html.push(text);
            html.push("</span>");
            html.push("</div>");
            return html.join("");
        }
        return text;
    }
    GridList.prototype.CreateItem = function (data) {
        var cols = this.Options.Columns;
        var html = ["<tr>"];
        if (cols) {
            //var rowspan = this.Options.showDetails ? 'rowspan = 2' : '';
            html.push("<td style='width:20px'>");
            html.push("<label><span class='icon-action_done'></span><input type='checkbox'></label>");
            html.push("</td>");
            for (var i = 0; i < cols.length; i++) {
                var col = cols[i];
                if (this.Options.showDetails && col.Field && col.Field == 'Memo') continue;

                html.push("<td>");
                var text = col.Formatter ? col.Formatter(data, col) : data[col.Field];
                if (col.IsLink) {
                    html.push("<div class='hyperlink'>");
                    if (col.Icon) {
                        html.push("<span class='glyphicon glyphicon-" + col.Icon + " link-icon'></span>");
                    }
                    html.push("<span class='link-text'>");
                    html.push(text);
                    html.push("</span>");
                    html.push("</div>");

                } else {
                    html.push(text);
                }

                html.push("</td>");
            }
        }
        var subData;
        var typeDetails = this.Options.typeDetails;
        if (typeDetails) {
            data.Memo.length > 5 ? subData = data.Memo.substring(0, 5) + "..." : subData = data.Memo;
            var sp = '<span  class="ImgDetails icon-navigation_expand_more"></span>'
            var extraElem = this.Options.showDetails ? '<span class="show_details1" name="show_details">' + subData + sp + '</span>' : '';
            html.push("<td class='showDetails1'>" + extraElem + "</td></tr>");
        } else {
            var extraElem = this.Options.showDetails ? '<span class="show_details" name="show_details">查看详情</span>' : '';
            html.push("<td>" + extraElem + "</td></tr>");
        }
        if (this.Options.showDetails) {
            var colspan = cols.length + 1 || 0
            if (typeDetails) {
                html.push("<tr style='color: #999;display:none;height:0' class='pageSetup'><td style='white-space: pre-wrap;height:0;padding:0;' colspan=" + colspan + "><div class='aniDetails active'>" + data.Memo + "</div>");
            } else {
                html.push("<tr style='color: #999;display:none;'><td style='white-space: pre-wrap;' colspan=" + colspan + ">" + data.Memo);
            }
            html.push('</td></tr>')
        }
        var elem = $(html.join(""));
        elem.data("grid-list-item", data);
        return elem;
    }

    EMW.UI.GridList = GridList;

    EMW.UI.Popover = {
        Show: function (opts) {
            if (!opts) return;
            this.Init();
            this.Element.find(".popover-title").html(opts.Title);

            this.Element.find(".popover-content").html(opts.Content.show());
            var pos = { left: opts.Left, top: opts.Top, width: opts.Width || 300 };
            this.Element.css(pos);
            if (opts.Position) {
                this.Element.show();
                this.Element.position(opts.Position);
            }
            this.Opition = opts;
            EMW.UI.Popover.Element.fadeIn("fast").focus();
        },
        Init: function () {
            if (this.Element) return;
            this.Element =
                $('<div tabindex="-1" class="popover"><div class="popover-header" ><h3 class="popover-title"></h3><span class="icon-navigation_close popover-close"></span> </div><div class="popover-content"></div></div>');
            this.Element.appendTo(document.body);
            this.Element.find(".popover-close").click(EMW.UI.Popover.Close);
            this.Element.on("blur", function (e) {
                if (e.relatedTarget) {
                    var panel = $(e.relatedTarget).closest(".popover");
                    if (panel.length) return;
                }
                EMW.UI.Popover.Close();
            });
        }, Close: function () {
            if (EMW.UI.Popover.Element)
                EMW.UI.Popover.Element.fadeOut("fast");
            this.Opition && this.Opition.OnClose && this.Opition.OnClose();
        }
    };

    EMW.UI.AddControl("PropertyPanel");
    var PropertyPanel = function (elem, opts) {
        if (!elem) return;
        this.Element = elem;
        EMW.Event.On(this, ["OnChange", "OnBeforeChange"]);

    }
    EMW.UI.PropertyPanel = PropertyPanel;
    PropertyPanel.prototype.Bind = function (data, obj) {
        if (!data || !obj) return;
        this.EndEdit();
        if (data == this.Data && this.Object == obj) {

            return;
        }
        this.Element.empty();
        var html = [];
        this.Items = {};
        this.Object = obj;
        this.Data = data;

        html.push("<table class='propertypanel'>");
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            item.__target = null;
            if (item.rows) {
                this.CreateGroup(html, item);
            } else {
                this.CreateItem(html, item);
            }
        }
        html.push("</table>");

        this.Content = $(html.join("")).appendTo(this.Element).click(this.Click.bind(this));
        data.__editor = this.Content;
    }
    PropertyPanel.prototype.InitItem = function (name, value) {
        if (!name) return;
        var item;
        if (typeof (name) == "string") {
            item = this.Items[name];
        } else {
            item = name;
        }
        if (!item.name) return;
        item.__editor = null;
        if (value != undefined) this.Object[item.name] = value;
    }
    PropertyPanel.prototype.Update = function (name, value) {
        if (!name) return;
        var item;
        if (typeof (name) == "string") {
            item = this.Items[name];
        } else {
            item = name;
        }
        if (!item || !item.name) return;

        if (!item.__target) {
            item.__target = this.Element.find("tr[key='" + item.name + "'] td:nth-child(3)");
        }
        this.Object[item.name] = value;
        item.__target.html(this.GetText(item));
    }
    PropertyPanel.prototype.GetRow = function (item) {
        if (typeof item == "string") {
            if (!this.Items) {
                return;
            }
            item = this.Items[item];
        }
        if (item) {
            if (!item.__target) {
                item.__target = this.Element.find("tr[key='" + item.name + "'] td:nth-child(3)");
            }
            return item;
        }
    }
    PropertyPanel.prototype.HideRow = function (item) {
        if (!$.isArray(item)) item = [item];
        for (var i = 0; i < item.length; i++) {
            var target = this.GetRow(item[i]);
            if (target) {
                target.__target.closest("tr").hide();
                target.hide = true;
            }
        }
    }
    PropertyPanel.prototype.ShowRow = function (item) {
        if (!$.isArray(item)) item = [item];
        for (var i = 0; i < item.length; i++) {
            var target = this.GetRow(item[i]);
            if (target) {
                target.__target.closest("tr").show();
                target.hide = false;
            }
        }
    }
    PropertyPanel.prototype.Toggle = function (tr) {
        if (!tr.is("TR.group")) return;
        var isShow = tr.attr("isHide");
        var elem = tr.next();
        var index = 100;
        while (!elem.is(".group") && elem.attr("key")) {
            isShow ? elem.show() : elem.hide();
            elem = elem.next();
        }
        if (isShow) {
            tr.removeAttr("isHide");
            tr.find(".group-icon").addClass("icon-content_remove_circle_outline");
            tr.find(".group-icon").removeClass("icon-content_add_circle_outline");
        }
        else {
            tr.attr("isHide", "1");
            tr.find(".group-icon").removeClass("icon-content_remove_circle_outline");
            tr.find(".group-icon").addClass("icon-content_add_circle_outline");
        }
    }
    PropertyPanel.prototype.Click = function (evt) {

        var elem = $(evt.target);
        if (elem.is(".group-icon")) return this.Toggle(elem.parent().parent());
        if (elem.is("tr.group>td")) return this.Toggle(elem.parent());
        if (elem.is("td")) elem = elem.parent();
        var itemkey = elem.attr("key");

        if (itemkey == undefined) return;
        var item = this.Items[itemkey];
        if (this.LastEditor == item) return;
        this.EndEdit();
        if (!item) return;
        if (item.readOnly) return;

        if (item.__isEdit) {
            return item.__editor.focus();
        }
        if (elem.is("span")) return
        var editor = this.CreateElement(item);
        if (!editor) return;
        if (item.__editor) {
            this.SetValue(item);
        }
        if (item.onEdit && item.onEdit(this.Object, item) == false) return;
        item.__editor = editor;
        this.BindEvent(item);

        item.__target = $(elem.children()[2]);
        item.__target.html(editor);
        item.__isEdit = true;
        this.LastEditor = item;
        editor.focus();
    }
    PropertyPanel.prototype.CreateGroup = function (html, item) {
        html.push("<tr class='group'><td>");
        html.push("<span class='glyphicon icon-content_remove_circle_outline group-icon'></span>");
        html.push("</td><td colspan='2'>");
        html.push(item.text);
        html.push("</td>");
        html.push("</tr>");
        for (var i = 0; i < item.rows.length; i++) {
            this.CreateItem(html, item.rows[i]);
        }
    }
    PropertyPanel.prototype.GetOption = function (item) {
        if (item.optionCreator) {
            return item.optionCreator(this.Object, item);
        }
        return item.option;
    }
    PropertyPanel.prototype.CreateItem = function (html, item) {
        if (!item.text) return;
        if (item.onShow) item.onShow(this.Object, item);
        item.__isEdit = false;
        html.push("<tr " + (item.hide ? "style='display:none'" : "") + " key='" + item.name + "' " + (item.memo ? "title='" + item.memo + "'" : "") + "><td></td><td>");
        html.push(item.text);
        html.push("</td>");
        this.Items[item.name] = item;
        html.push("<td>");
        if (this.Object) html.push(this.GetText(item));
        html.push("</td>");
        //html.push("<td style='width:20px;'>");
        //if ($.isFunction(item.editor)) {
        //    html.push("<span class='glyphicon glyphicon-edit'></span>");
        //}
        //html.push("</td>");
        html.push("</tr>");
    }
    PropertyPanel.prototype.GetText = function (item) {
        if (item.formatter) return item.formatter(this.Object, item);
        var v = this.Object[item.name];
        v = v == undefined ? item.defaultValue : v;
        if (v == undefined) return "";
        switch (item.editor) {
            case "checkbox":
                return v == true || v == 1 || v == "true" ? "是" : "否";
            case "select":
                var textField = item.textField;
                var option = this.GetOption(item);
                if ($.isArray(option)) {
                    var valueField = item.valueField;
                    for (var i = 0; i < option.length; i++) {
                        if (valueField ? option[i][valueField] == v : option[i] == v)
                            return textField ? option[i][textField] : option[i];
                    }
                } else {
                    return textField ? option[v][textField] : v;
                }
            default:
                return item.textField ? v[item.textField] : v;
        }
    }
    PropertyPanel.prototype.GetValue = function (item) {
        var v;
        var elem = item.__editor;
        switch (item.editor) {
            case "checkbox":
                return elem.is(":checked");
            case "select":
                v = elem.val();
                var option = this.GetOption(item);
                if ($.isArray(option)) {
                    var selectItem = option[v];
                    if (selectItem)
                        return item.valueField ? selectItem[item.valueField] : selectItem;
                } else {
                    return v;
                }
            default:
                return elem.val();
        }
        return v;

    }
    PropertyPanel.prototype.SetValue = function (item) {
        var v = this.Object[item.name];
        if (v == undefined) v = item.defaultValue;
        var elem = item.__editor;
        switch (item.editor) {
            case "checkbox":
                elem.prop("checked", v ? true : false);
                break;
            case "select":
                var option = this.GetOption(item);
                if ($.isArray(option)) {
                    for (var i = 0; i < option.length; i++) {
                        if (this.IsEqual(item, v, (item.valueField ? option[i][item.valueField] : option[i]))) {
                            return elem.val(i);
                        }
                    }
                    elem.val(null);
                } else {
                    elem.val(v);
                }
                break;
            default:
                elem.val(v);
                break;
        }
    }
    PropertyPanel.prototype.EndEdit = function () {
        var item = this.LastEditor;
        if (!item || !item.__isEdit || !item.__editor) return;
        var td = item.__editor.parent();
        if ($.isFunction(item.editor)) {
            item.__isEdit = false;
            this.LastEditor = null;
            return;
        }
        var v = this.GetValue(item);
        var old_value = this.Object[item.name];
        if (!this.IsEqual(item, v, old_value)) {
            this.Object[item.name] = v;
            this.OnChange(item, this.Object, old_value);
        }
        td.html(this.GetText(item));
        item.__isEdit = false;
        this.LastEditor = null;
        return false;
    }
    PropertyPanel.prototype.IsEqual = function (item, v1, v2) {

        if (item.isEqual) return item.isEqual(v1, v2);
        return v1 == v2;
    }
    PropertyPanel.prototype.BindEvent = function (item) {
        var elem = item.__editor;
        switch (item.editor) {
            case "select":
                elem.bind("change", this.EndEdit.bind(this, item));
                break;
            case "checkbox":
                elem.bind("click", this.EndEdit.bind(this, item));
                break;
            default:
                elem.focusout(this.EndEdit.bind(this, item));
                break;
        }
    }
    PropertyPanel.prototype.CreateElement = function (item) {
        var v = this.Object[item.name];
        if (v == undefined) v = item.defaultValue;
        if (item.__editor && !item.optionCreator) {
            item.__editor.val(v);
            return item.__editor;
        }
        if ($.isFunction(item.editor)) {
            return item.editor(this.Object, item);
        }
        var elem;
        switch (item.editor) {

            case "select":
                var str = ["<select>"];
                var textField = item.textField;
                var valueField = item.valueField;
                var option = this.GetOption(item);
                if ($.isArray(option)) {
                    for (var i = 0; i < option.length; i++) {
                        var opt = option[i];
                        var issel = this.IsEqual(item, v, (valueField ? opt[valueField] : opt));
                        str.push("<option " + (issel ? "selected" : "") + " value='" + i + "' >" + (textField ? opt[textField] : opt) + "</option>");
                    }
                } else {
                    for (var prop in option) {
                        str.push("<option value='" + prop + "' " + (v == prop ? "selected" : "") + ">"
                            + (item.textField ? option[prop][textField] : prop) + "</option>");
                    }
                }
                str.push("</select>");
                elem = $(str.join(""));
                break;
            case "checkbox":
                elem = $("<input type='checkbox' " + (v ? "checked" : "") + "/>");
                break;
            case "textbox":
                elem = $("<input type='text' value='" + (v || "") + "'>");
                break;
            default:
                elem = $("<input type='text' value='" + (v || "") + "'>");
                break;
        }
        return elem;
    }

    //Talker模糊查询框
    EMW.UI.AddControl("InviteSearchFn");
    var InviteSearchFn = function (elem, Opts) {
        if (!elem) return;
        this.Element = elem;
        EMW.Event.On(this, ["OnClick", "OnSave"]);
        this.Options = $.extend(Opts, {});
        if (!this.needInvitePanel)
            this.Init();
    }
    InviteSearchFn.prototype.Close = function () {

    }
    InviteSearchFn.prototype.Init = function () {
        this.Element.bind("keyup", (function (e) {
            this.Show($(this.Element).val(), e);
        }).bind(this));
    }
    InviteSearchFn.prototype.BindEvent = function () {
        if (this.needInvitePanel) {
            var _this = this;
            this.needInvitePanel.bind("click", function () { return false; }).on("click", "dl.Avatartype1", this.Options.IsMore ? function () { $(this).toggleClass("select"); return false; } :
                function () {
                    _this.Save(this);
                    return false;
                }).on("click", ".Pan-OK", function () {
                    _this.Save();
                    return false;
                }).on("click", ".Pan-close", function () { _this.needInvitePanel.hide(); return false; }).bind("mouseover", function () { _this.InviteFocus = true; }).bind("mouseout", function () { _this.InviteFocus = false; });
            this.Element.bind("blur", (function () {
                if (_this.InviteFocus) return;
                this.needInvitePanel && this.needInvitePanel.hide();
                this.needInvitePanel = undefined;
            }).bind(this));
        }
    }
    InviteSearchFn.prototype.Show = function (v, e) {
        if (!this.Options.DataArr) {
            this.Options.Loader && this.Options.Loader(function (x) {
                this.Options.DataArr = x;
                this.Show();
            }.bind(this));
            return;
        }
        if (!this.needInvitePanel) {
            this.CreatPan();
            this.BindEvent();
        }
        if (v == "@")
            return;
        else
            v = v.replace("@", "");
        this.needInvitePanel.find(".context").empty();
        var _this = $(this);
        var IsArray = $.isArray(this.Options.DataArr);
        if (IsArray) {
            for (var Ai = 0; Ai < this.Options.DataArr.length; Ai++) {
                var data = this.Options.DataArr[Ai];
                if ($(this.Options.NoSearch).find("dl[value='" + data.ID + "']").length == 0
                    && (data.Name.indexOf(v) >= 0 || (data.Email && data.Email.indexOf(v))) >= 0) {
                    var IconOrImg = '<img src="/Resource/emw/UserImage/' + data.Image + '" onerror="this.src=\'/Theme/Image/custom.png\'" >';
                    var userInfo = '<dl class="Avatartype1 Avatartype2 icon-" value="' + data.ID + '""><dt class="avatarimg avatarcolor1">' + IconOrImg + '</dt><dd class="name userInfo0">' + data.Name + '</dd></dl>';
                    $(userInfo).appendTo(this.needInvitePanel.find(".context")).data("peopleInfo", data);
                }
            }
        } else
            for (var d in this.Options.DataArr) {
                if (this.Options.DataArr[d] && this.Options.DataArr[d].length != 0) {
                    var title = $('<div class="title" name="' + d + '"><span>' + d + '</span></div>');
                    title.appendTo($(this.needInvitePanel).find(".context"));
                    for (var i = 0; i < this.Options.DataArr[d].length; i++) {
                        var data = this.Options.DataArr[d][i];
                        if ($(this.Options.NoSearch).find("dl[value='" + data.ID + "'][name='" + d + "']").length == 0
                            && (data.Name.indexOf(v) >= 0 || (data.Email && data.Email.indexOf(v))) >= 0) {
                            var IconOrImg = data.Image == undefined ? "" : data.Email == undefined ? '<i class="icon-' + data.Image + '"></i>' : '<img src="/Resource/emw/UserImage/' + data.Image + '" onerror="this.src=\'/images/f.png\'" >';
                            var userInfo = '<dl class="Avatartype1 Avatartype2 icon-" value="' + data.ID + '" name="' + d + '"><dt class="avatarimg avatarcolor1">' + IconOrImg + '</dt><dd class="name userInfo0">' + data.Name + '</dd></dl>';
                            $(userInfo).insertAfter(title).data("peopleInfo", data);
                        }
                    }
                    $(this.needInvitePanel).find("dl[name='" + d + "']").length == 0 && title.remove();
                }
            }
        if (this.needInvitePanel.find("dl").length > 0) {
            //如果查询的人员多过3个就出现下拉框
            if ($(this.needInvitePanel).find("dl").length > 3) {
                $(this.needInvitePanel).css({ "height": this.Options.height });
                $(this.needInvitePanel).find(".context").css({ "height": this.Options.height - (this.IsMore ? 40 : 0) });
            } else {
                $(this.needInvitePanel).css({ "height": "" });
                $(this.needInvitePanel).find(".context").css({ "height": "" });
            }
            this.SetPostion(e);
        } else {
            $(this.needInvitePanel).hide();
        }
    }
    InviteSearchFn.prototype.CreatPan = function () {
        this.needInvitePanel = $('<div id="needInvitePanel723" class="needInvitePanel723 tabHide"><div class="context"><div></div>');
        this.Options.width = this.Options.width || "260";
        this.Options.width && this.needInvitePanel.css("width", this.Options.width);
        this.Options.height = this.Options.height || "350";
        this.Options.height && this.needInvitePanel.css("height", this.Options.height);
        this.Options.IsMore && $('<div class="footer"><span class="Pan-close">取消</span><span class="Pan-OK">确定</span></div>').appendTo(this.needInvitePanel);
        this.needInvitePanel.appendTo($(this.Element).closest("body"));
    }
    InviteSearchFn.prototype.SetPostion = function (e) {
        this.needInvitePanel.show();
        this.needInvitePanel.fadeIn("fast").focus();
        this.needInvitePanel.position({
            of: e.target,
            my: "left top",
            at: "left bottom",
            collision: "flip flip"
        });

    }
    InviteSearchFn.prototype.CreatItems = function (item) {
        return "";
    }
    InviteSearchFn.prototype.Save = function (elem) {
        if (elem) this.Options.OnSave(elem);
        else
            this.Options.OnSave(this.needInvitePanel.find("dl.select"));
        this.needInvitePanel.hide();
    }
    EMW.UI.InviteSearchFn = InviteSearchFn;
})();

/*DataGrid*/
(function ($) {
    EMW.UI.AddControl("DataGrid");
    var DataGrid = function (target, opts) {
        this.target = target;
        this.options = $.extend({}, $.fn.DataGrid.defaults, opts);
        var evts = [
            "OnClickRow",
            "OnDblClickRow",
            "OnClickCell",
            "OnDblClickCell",
            "OnPageBeforeChange",
            "OnPageChange",
            "OnPrePage",
            "OnNextPage",
            "OnColumnChanged",
            "OnSelect",
            "OnBeforeSelect",
            "OnUnSelect",
            "OnSelectAll",
            "OnUnSelectAll",
            "OnCheck",
            "OnUnCheck",
            "OnBeginEdit",
            "OnEndEdit",
            "OnBeforeExpand",
            "OnExpand", "OnRowBinded", "OnBeforeRowBind", "OnSort", "OnStartDrag", "OnDrop", "OnPageSizeChanged"];

        EMW.Event.On(this, evts);
        ForeachCoumns(opts.frozenColumns, function (col) {
            if (!col.hidden) {
                if (col.width == undefined) {
                    col.width = columnDefaultWidth;
                }
            }
        });
        ForeachCoumns(opts.columns, function (col) {
            if (!col.hidden) {
                if (col.width == undefined) {
                    col.width = columnDefaultWidth;
                }
            }
        });
        this.panel = Create(this);

        Init(this);
    }
    EMW.UI.DataGrid = DataGrid;

    var Init = function (grid) {
        var opts = grid.options;
        var panel = grid.panel;
        var type = opts.type || 0;
        var view = viewer[type];
        grid.viewer = view;
        if (opts.data) {
            grid.BindData(opts.data, true);
        }
        InitEvents(grid);
        //var view = panel.find(">.datagrid-view>.frozen-view");
        //view = panel.find(">.datagrid-view>.normal-view");
        // FitGrid(grid);
        ResizeDatagrid(grid);
    }

    var InitEvents = function (grid) {
        var opts = grid.options;
        var panel = grid.panel;

        var view = panel.find(">.datagrid-view>.frozen-view,>.datagrid-view>.normal-view");
        if (opts.hover) {
            view.on("mouseover.DataGrid.Row", "tr.datagrid-row", function (e) {
                var context = $(this).data("data");
                if (context) {
                    var tr1 = context.Tr1;
                    tr1.addClass("hover");
                    var tr2 = context.Tr2;
                    tr2.addClass("hover");
                }
                return false;
            }).on("mouseout.DataGrid.Row", "tr.datagrid-row", function (e) {
                var context = $(this).data("data");
                if (context) {
                    var tr1 = context.Tr1;
                    tr1.removeClass("hover");
                    var tr2 = context.Tr2;
                    tr2.removeClass("hover");
                }
                return false;
            });
        }
        view.on("click.DataGrid.Row", "tr.datagrid-row", grid, OnClickRow)
            .on("dblclick.DataGrid.Row", "tr.datagrid-row", grid, OnDblClickRow)
            .on("click.DataGrid.Check", "tr.datagrid-row>td.datagrid-cell-checkbox", grid, OnClickCheckCell)
            .on("click.DataGrid.CheckAll", ">.view-header>.datagrid-table>tbody>tr>td.datagrid-cell-checkbox", grid, OnClickCheckAllCell);
        //.on("click.DataGrid.ClickCell", ">.view-body>.datagrid-table>tbody>tr>td:not(.datagrid-cell-checkbox)", grid, OnClickCell);
        if (opts.pagination) {
            var pager = panel.find(">.datagrid-pager>ul");
            pager.on("click.Pager.SelectPage", ">li", grid, OnClickPager);
        }
        if (opts.resizable) {
            view.find(">.view-header>.datagrid-table>tbody>tr>td:not(.datagrid-cell-checkbox)").resizable({
                // start: StartResizeColumn,
                //resize: ResizingColumn,
                stop: StopResizeColumn,
                zIndex: 9999,
                handles: "e",
                datagrid: grid, ghost: true
            });
        }
        if (opts.type == 1 || opts.type == 2) {
            view.on("click.DataGrid.Expand", ".tree-grid-expand-node>.datagrid-cell", grid, OnClickExpandIcon)
        }
        if (opts.sortable) {
            view.find(".view-header .datagrid-header-row").sortable({
                appendTo: document.body, cancel: "td:last-child", forcePlaceholderSize: true,
                axis: "x", update: function (event, ui) {
                    var tds = ui.item.parent().children();
                    var cols = [];
                    for (var i = 0; i < tds.length; i++) {
                        var col = $(tds[i]).data("column");
                        if (col) cols.push(col);
                    }
                    grid.options.columns = [cols];
                    grid.ReBindData();
                    grid.OnColumnChanged(grid);
                }
            });
        }
        view.find(".view-header").on("click.DataGrid.Sort", ".datagrid-cell", function () {
            var col = $(this).parent().data("column");
            if (col.OnShowMenu) return grid.ShowColumnMenu(col, this);
            if (col.allowSort) {
                if (grid.SortColumn && grid.SortColumn != col) {
                    var td = grid.panel.find(".view-header .datagrid-cell-" + grid.SortColumn.field + " .datagrid-cell-sort");
                    td.attr("class", "datagrid-cell-sort");
                }
                var flag = $(this).find(".datagrid-cell-sort");
                if (col.orderBy) flag.removeClass(col.orderBy);
                if (!col.orderBy || col.orderBy == "ASC") col.orderBy = "DESC";
                else col.orderBy = "ASC";
                flag.addClass(col.orderBy);
                grid.SortColumn = col;
                grid.OnSort(col);
            }
        });
        var normalView = view.filter(".normal-view");
        normalViewBody = normalView.find(">.view-body");
        normalViewBody.scroll(grid, OnNormalViewBodyScroll);
        if (opts.fit) {
            var timer;
            $(window).on("resize.EMW.WindResize", grid, function (e) {
                clearTimeout(timer);
                var g = e.data;
                timer = setTimeout(function () {
                    ResizeDatagrid(g);
                }, 300);
            });
        };
        //panel.on("keydown", grid, function (e) {
        //    var _this = e.data;
        //    switch (e.keyCode) {
        //        case 38: //up
        //            _this.MoveHighlightRow(true);
        //            return false;
        //        case 40: //down
        //            _this.MoveHighlightRow(false);
        //            return false;
        //        case 13: //enter
        //            _this.SelectRowByIndex();
        //            return false;
        //        default:
        //            return;
        //    }
        //});
    }
    var columnDefaultWidth = 100;
    var checkboxColumnWidth = 28;
    var scrollBarWidth = 20;

    DataGrid.prototype.ReBuild = function (opts) {
        this.options = $.extend({}, $.fn.DataGrid.defaults, opts);
        this.panel.find(">.datagrid-view").remove();
        this.panel.find(">.datagrid-pager").remove();
        this.__initSize = false;
        Create(this);

        Init(this);
    }
    DataGrid.prototype.HideColumnMenu = function () {
        this.ColumnMenu && this.ColumnMenu.remove();
    }
    DataGrid.prototype.ShowColumnMenu = function (col, elem) {
        if (!col.OnShowMenu) return;
        this.HideColumnMenu();
        var ary = col.OnShowMenu(col);
        if (!ary || !ary.length) return;
        elem = $(elem).parent();
        var div = $("<div class='tool-bar datagrid-columnmenu' tabindex='-1'></div>").appendTo(document.body);
        var wid = elem.width();
        div.css({ "position": 'absolute', "min-width": "130px" });
        div.position({
            of: elem,
            my: "right left",
            at: "right bottom"
        });
        div.blur(function () {
            $(this).remove();
        }).focus();
        div.css("max-width", elem.width());
        div.ToolBar({
            items: ary,
            display: "tool-vertical"
        });
        this.ColumnMenu = div;
    }
    DataGrid.prototype.BindData = function (list, pagination) {
        /// <param name="list" type="Array">完整的键值对数组</param>

        if (!list) return;
        var opts = this.options;
        if (pagination && opts.pagination && opts.pageSize < list.length) {
            var s = (opts.pageIndex - 1) * opts.pageSize;
            var e = opts.pageIndex * opts.pageSize;
            list = list.Take(s, e);
        }
        this.viewer.render(this, list);

        opts._data = list;
    }

    DataGrid.prototype.RefreshChildren = function (parentID, children) {
        if (this.viewer.appendChildren) {
            var panel = this.panel;
            var tr = panel.find("tr[node-id='" + parentID + "']");
            var context = tr.data("data");
            var p = context.RowData;
            p.children = children;
            var level = Z.ToInt(tr.attr("tree-level")) + 1;
            this.viewer.appendChildren(this, context, level);
        }
    }
    var InitDraggable = function (grid, rowContext) {
        var opts = grid.options;
        if (opts.draggable) {
            //if (true) {
            rowContext.Tr1.add(rowContext.Tr2).draggable({
                start: OnStartDrag,
                drag: OnDraging,
                stop: OnStopDrag,
                revert: false,
                axis: "y",
                helper: true,
                containment: grid.panel,
                datagrid: grid
            }).droppable({
                drop: OnDrop,
                datagrid: grid
            });
        }
    }

    var OnStartDrag = function (e, o) {
        var target = $(this);
        var draggableOpts = target.draggable("option");
        var grid = draggableOpts.datagrid;
        var context = target.data("data");

        var arg = new EMW.EventArgument(context);

        grid.OnStartDrag(arg);

        if (arg.IsStop) {
            return false;
        }

        var pos = o.offset;
        var helper = $('<div class="datagrid-draggable-helper"></div>');
        helper.css({
            width: grid.panel.innerWidth(),
            top: pos.top - 18
        });
        context.Tr1.add(context.Tr2).children().each(function () {
            var cell = $('<div class="helper-cell"></div>');
            cell.append($(this).html());
            cell.css({
                width: $(this).width()
            });
            if ($(this).hasClass("datagrid-cell-checkbox")) {
                cell.addClass("cell-checkbox");
            }
            helper.append(cell);
        });

        helper.appendTo(grid.panel);
        grid.panel.addClass("disable-select");
    }

    var OnDraging = function (e, o) {
        var target = $(this);
        var resizeOpts = target.draggable("option");
        var grid = resizeOpts.datagrid;
        var panel = grid.panel;
        var helper = panel.find(".datagrid-draggable-helper");
        var pos = o.offset;
        helper.css({
            top: pos.top - 18//helper.height()/2
        });
    }

    var OnStopDrag = function (e, o) {
        var target = $(this);
        var resizeOpts = target.draggable("option");
        var grid = resizeOpts.datagrid;
        var panel = grid.panel;
        panel.find(".datagrid-draggable-helper").remove();
        panel.removeClass("disable-select");
    }

    var OnDrop = function (e, ui) {
        var dropOpts = $(this).droppable("option");
        var grid = dropOpts.datagrid;

        var targetContext = $(e.target).data("data");

        var sourceContext = $(ui.draggable).data("data");

        var arg = new EMW.EventArgument();
        arg.TargetContext = targetContext;
        arg.SourceContext = sourceContext;

        grid.OnDrop(arg);

        //$.logger.log(arg);
    }
    //0:一般列表,1:树列表,2:分组列表
    var viewer = [
        {
            render: function (datagrid, data) {
                var opts = datagrid.options;
                var frozenView = datagrid.panel.find(">.datagrid-view>.frozen-view");
                frozenView.find(">.view-body>.datagrid-table>tbody").empty();

                var normalView = datagrid.panel.find(">.datagrid-view>.normal-view");
                normalView.find(">.view-body>.datagrid-table>tbody").empty();
                if (!data || !data.length) return;
                var table1 = frozenView.find(">.view-body>.datagrid-table");
                var table2 = normalView.find(">.view-body>.datagrid-table");
                for (var i = 0; i < data.length; i++) {
                    var row = data[i];
                    var rowContext = this.renderRow(datagrid, table1, table2, i, row);
                    InitDraggable(datagrid, rowContext);
                }

                this.endRowSpan(datagrid);
            },
            renderRow: function (datagrid, table1, table2, rowIndex, row, isfooter) {
                var opts = datagrid.options;

                var rowContext = {
                    RowData: row,
                    Tr1: null
                };
                datagrid.OnBeforeRowBind(datagrid, rowContext);
                var tr1 = this.renderTableRow(datagrid, table1, opts.frozenColumns, rowIndex, row, isfooter);

                if (opts.checkbox) {
                    tr1.prepend(isfooter ? "<td></td>" : "<td class='datagrid-cell-checkbox check-row'><input type='checkbox' /></td>");
                }
                if (opts.rowHeader) {
                    tr1.prepend(isfooter ? "<td></td>" : "<td class='datagrid-rowheader'>" + (rowIndex + 1) + "</td>");
                }

                tr1.data("data", rowContext);
                rowContext.Tr1 = tr1;
                var tr2 = this.renderTableRow(datagrid, table2, opts.columns, rowIndex, row, isfooter);
                rowContext.Tr2 = tr2;
                tr2.data("data", rowContext);
                datagrid.OnRowBinded(datagrid, rowContext);
                return rowContext;
            },
            renderCell: function (row, col, td) {
                var field = col.field;
                var val = row[field];
                if (col.Formatter) {
                    val = col.Formatter(val, row, col);
                }
                var style;
                if (col.Styler) {
                    style = col.Styler(row, col);
                }
                var title = "";
                if (col.renderTitle) {
                    title = val ? "title = '" + val + "'" : "";
                }
                var cell = $("<div " + title + " class='datagrid-cell'></div>");
                if (col.tools && col.tools.length) {
                    for (var i = 0; i < col.tools.length; i++) {
                        var tool = col.tools[i];
                        var gridTool = $('<div class="grid-tool"></div>').attr("title", tool.desc || tool.text).attr("data-index", i);
                        ////显示方式：0图标，1文本，2文本与图标
                        var showType = Z.ToInt(tool.showType);
                        gridTool.addClass("show-type" + showType);
                        gridTool.append('<span class="glyphicon icon-' + tool.icon + '"></span>');
                        gridTool.append('<span class="grid-tool-text">' + tool.text + '</span>');
                        cell.append(gridTool);
                    }
                }
                else {
                    cell.html(val);
                }
                if (col.type) {
                    cell.addClass(col.type + "-cell");
                }
                if (style) {
                    cell.attr("style", style);
                }
                if (col.OnRenderCell) {
                    col.OnRenderCell(row, col, td);
                }
                td.html(cell);

                return val;
            },
            renderTableRow: function (datagrid, table, cols, rowIndex, row, isfooter) {
                var tbody = table.find(">tbody");
                if (!tbody.length) {
                    tbody = $("<tbody></tbody>").appendTo(table);
                }
                var style;
                var opts = datagrid.options;
                if (opts.Styler) {
                    style = opts.Styler(row, rowIndex);
                }
                var tr;
                if (isfooter) {
                    tr = $("<tr class='datagrid-footer-row' data-row-index='-1'></tr>").appendTo(tbody);
                } else {
                    tr = $("<tr  class='datagrid-row' data-row-index=\"" + rowIndex + "\"></tr>").appendTo(tbody);
                }
                if (style) {
                    tr.attr("style", style);
                }
                //if (opts.idField) {
                //    tr.attr("data-row-id", row[opts.idField]);
                //}

                if (cols) {
                    var groupCount = cols.length;
                    for (var i = 0; i < groupCount; i++) {
                        var groupCols = cols[i];
                        for (var j = 0; j < groupCols.length; j++) {
                            var col = groupCols[j];
                            var td = $("<td field='" + col.field + "' style='width:" + col.width + "px;" + (col.visible === false ? "display:none;'" : "") + "'  class='datagrid-cell-" + col.field + "'></td>");

                            var val = this.renderCell(row, col, td);

                            td.data("column", col);

                            tr.append(td);
                            if (col.rowspan) {
                                var spanColCahe = datagrid._rowspanColCache;
                                if (!spanColCahe) {
                                    spanColCahe = datagrid._rowspanColCache = {};
                                    datagrid._rowspanCols = [];
                                }
                                var spanCol = spanColCahe[col.field];
                                if (!spanCol) {
                                    spanCol = spanColCahe[col.field] = {
                                        beginTr: tr,
                                        beginTd: td,
                                        beginVal: val,
                                        rowspan: 0
                                    }
                                    datagrid._rowspanCols.push(col);
                                }
                                if (spanCol.beginVal == val) {
                                    if (spanCol.rowspan > 0) {
                                        td.hide();
                                    }
                                    spanCol.rowspan++;
                                }
                                else {
                                    spanCol.beginTd.attr("rowspan", spanCol.rowspan).addClass("span-cell");
                                    //新开始的合并
                                    spanCol.beginTr = tr;
                                    spanCol.beginTd = td;
                                    spanCol.rowspan = 1;
                                    spanCol.beginVal = val;
                                }
                            }
                        }
                    }
                    tr.append("<td style='width:auto;'></td>");
                }
                tr.data("data", row);

                return tr;
            },
            bindDataByDataTable: function (grid, dataTable) {
                var opts = grid.options;
                var frozenView = grid.panel.find(">.datagrid-view>.frozen-view");
                frozenView.find(">.view-body>.datagrid-table>tbody").empty();

                var normalView = grid.panel.find(">.datagrid-view>.normal-view");
                normalView.find(">.view-body>.datagrid-table>tbody").empty();

                if (dataTable) {
                    var rows = dataTable.Rows;
                    var cols = dataTable.Columns;
                    var data = [];
                    if (rows && rows.length > 0 && cols && cols.length > 0) {
                        var table1 = frozenView.find(">.view-body>.datagrid-table");
                        var table2 = normalView.find(">.view-body>.datagrid-table");
                        for (var i = 0; i < rows.length; i++) {
                            var row = rows[i];
                            //var row = {};
                            //for (var j = 0; j < cols.length; j++) {
                            //    row[cols[j]] = arr[j];
                            //}
                            var rowContext = this.renderRow(grid, table1, table2, i, row);
                            data.push(row);
                        }
                    }
                    if (dataTable.MaxRow > 0 && grid.GetPageIndex() == 0) {
                        var pageCount = Math.ceil(dataTable.MaxRow / opts.pageSize);
                        grid.RefreshPager({
                            pageIndex: 1,
                            pageCount: pageCount
                        });
                    }
                    this.endRowSpan(grid);

                    return data;
                }
                // ResizeDatagrid(grid);
            },
            endRowSpan: function (datagrid) {
                if (datagrid._rowspanCols) {
                    for (var i = 0; i < datagrid._rowspanCols.length; i++) {
                        var col = datagrid._rowspanCols[i];
                        var spanCol = datagrid._rowspanColCache[col.field];
                        spanCol.beginTd.attr("rowspan", spanCol.rowspan).addClass("span-cell");
                    }
                    delete datagrid._rowspanCols;
                    delete datagrid._rowspanColCache;
                }
            }
        },
        {
            render: function (datagrid, rows) {
                var opts = datagrid.options;

                var frozenView = datagrid.panel.find(">.datagrid-view>.frozen-view");
                frozenView.find(">.view-body>.datagrid-table>tbody>tr").remove();

                var normalView = datagrid.panel.find(">.datagrid-view>.normal-view");
                normalView.find(">.view-body>.datagrid-table>tbody>tr").remove();

                var roots = this.buildTree(opts, rows, frozenView, normalView, opts.treeField, opts.parentField, opts.topValue);
                var rowIndex = 0;
                for (var i = 0; i < roots.length; i++) {
                    var root = roots[i];
                    var table1 = frozenView.find(">.view-body>.datagrid-table");
                    var table2 = normalView.find(">.view-body>.datagrid-table");
                    var rowContext = this.renderRow(datagrid, table1, table2, rowIndex, root, 1);
                    rowIndex++;
                    if (opts.expandLevel != 1) {
                        var rowCount = this.renderChildren(datagrid, rowContext, 2, rowIndex);
                        rowIndex += rowCount;
                    }
                }

                return roots;
            },
            renderRow: function (datagrid, table1, table2, rowIndex, row, level) {
                var opts = datagrid.options;

                var rowContext = {
                    RowData: row,
                    Tr1: null
                };
                datagrid.OnBeforeRowBind(datagrid, rowContext);

                var tr1 = this.renderTableRow(datagrid, table1, opts.frozenColumns, rowIndex, row, level);
                rowContext.Tr1 = tr1;

                tr1.data("data", rowContext);

                var tr2 = this.renderTableRow(datagrid, table2, opts.columns, rowIndex, row, level);
                tr2.append("<td style='width:auto;'></td>");

                rowContext.Tr2 = tr2;
                tr2.data("data", rowContext);

                InitDraggable(datagrid, rowContext);

                datagrid.OnRowBinded(datagrid, rowContext);

                return rowContext;
            },
            renderTableRow: function (datagrid, table, cols, rowIndex, row, level) {
                var opts = datagrid.options;
                var tbody = table.find(">tbody");
                var tr = $("<tr class='datagrid-row' data-row-index=\"" + rowIndex + "\"></tr>").appendTo(tbody);
                //tr.addClass("datagrid-row");
                //if (opts.idField) {
                //    tr.attr("data-row-id", row[opts.idField]);
                //}
                if (opts.treeField) {
                    tr.attr("node-id", row[opts.treeField]);
                }
                if (opts.checkbox && cols == opts.frozenColumns) {
                    var h = $("<td class='datagrid-cell-checkbox check-row'><input type='checkbox' /></td>");
                    tr.prepend(h);
                }
                tr.attr("tree-level", level);
                var expandField = opts.expandField;
                if (!expandField) {
                    if (opts.frozenColumns && opts.frozenColumns.length > 0) {
                        expandField = opts.frozenColumns[0].field;
                    }
                    else {
                        expandField = opts.columns[0].field;
                    }
                }
                if (cols) {
                    var groupCount = cols.length;
                    for (var i = 0; i < groupCount; i++) {
                        var groupCols = cols[i];
                        for (var n = 0; n < groupCols.length; n++) {
                            var col = groupCols[n]
                            var td = $("<td field='" + col.field + "'  style='width:" + col.width + "px;" + (col.visible === false ? "display:none;'" : "") + "'  class='datagrid-cell-" + col.field + "'></td>");
                            var cell = $("<div class='datagrid-cell'></div>").appendTo(td);
                            if (col.type) {
                                cell.addClass(col.type + "-cell");
                            }
                            var field = col.field;
                            var val = row[field];
                            if (col.Formatter) {
                                val = col.Formatter(val, row, rowIndex, col);
                            }
                            if (col.OnRenderCell) {
                                col.OnRenderCell(row, col, td);
                            }
                            if (col.tools && col.tools.length) {
                                for (var i = 0; i < col.tools.length; i++) {
                                    var tool = col.tools[i];
                                    var gridTool = $('<div class="grid-tool"></div>').attr("title", tool.desc || tool.text).attr("data-index", i);
                                    ////显示方式：0图标，1文本，2文本与图标
                                    var showType = Z.ToInt(tool.showType);
                                    gridTool.addClass("show-type" + showType);
                                    gridTool.append('<span class="glyphicon icon-' + tool.icon + '"></span>');
                                    gridTool.append('<span class="grid-tool-text">' + tool.text + '</span>');
                                    cell.append(gridTool);
                                }
                            }
                            else {
                                cell.html(val);
                            }
                            if (field == expandField) {
                                var icon = $("<span class='expand-icon glyphicon'></span>");
                                var state = (!opts.expandLevel || level < opts.expandLevel) ? "open" : "closed";
                                icon.addClass(state);
                                SetExpandIcon(datagrid, row, state, icon, level);
                                cell.prepend(icon);
                                if (opts.hideIconIfNotChild && (!row.children || row.children.length == 0)) {
                                    icon.hide();
                                }
                                var lv = level - 1;
                                if (lv > 0) {
                                    //cell.css("padding-left", 25 * lv + 19);
                                    while (lv--) {
                                        var indent = $("<div class='tree-grid-indent tree-grid-line'></div>");
                                        cell.prepend(indent);
                                    }

                                    cell.find(">.tree-grid-indent:last").addClass("tree-grid-line-join");
                                }
                                td.addClass("tree-grid-expand-node");
                            }

                            if (col.renderTitle) {
                                td.attr("title", val);
                            }
                            td.data("column", col);
                            // td.attr("field", col.field);
                            tr.append(td);
                        }
                    }
                }

                // tr.append("<td style='width:auto;'></td>");

                return tr;
            },
            renderChildren: function (datagrid, rowContext, level, rowIndex) {
                var row = rowContext.RowData;
                var opts = datagrid.options;
                var expandLevel = opts.expandLevel;
                var renderRowCount = 0;
                if (!expandLevel || expandLevel >= level) {
                    if (row && row.children && row.children.length > 0) {
                        var tr1 = rowContext.Tr1;
                        var tree1 = this.createTreeRow(datagrid, tr1.children().length);
                        tr1.after(tree1);

                        var tr2 = rowContext.Tr2;
                        var tree2 = this.createTreeRow(datagrid, tr2.children().length);
                        tr2.after(tree2);
                        var ri = rowIndex;
                        for (var i = 0; i < row.children.length; i++) {
                            var child = row.children[i];
                            var childRowContext = this.renderRow(datagrid, tree1.find(">td>.view-body>table"), tree2.find(">td>.view-body>table"), ri, child, level);
                            ri++;
                            var count = this.renderChildren(datagrid, childRowContext, level + 1, ri);
                            ri += count;
                        }
                        renderRowCount = ri - rowIndex;
                    }
                }
                return renderRowCount;
            },
            appendChildren: function (datagrid, rowContext, level) {
                var row = rowContext.RowData;
                var opts = datagrid.options;
                if (row && row.children && row.children.length > 0) {
                    var tr1 = rowContext.Tr1;
                    var tree1 = tr1.next(".treegrid-tree-tr");
                    if (!tree1.length) {
                        tree1 = this.createTreeRow(datagrid, tr1.children().length);
                    }
                    tr1.after(tree1);
                    var table1 = tree1.find(">td>.view-body>table");
                    table1.find(">tbody").empty();

                    var tr2 = rowContext.Tr2;
                    var tree2 = tr2.next(".treegrid-tree-tr");
                    if (!tree2.length) {
                        tree2 = this.createTreeRow(datagrid, tr2.children().length);
                    }
                    tr2.after(tree2);
                    var table2 = tree2.find(">td>.view-body>table");
                    table2.find(">tbody").empty();

                    for (var i = 0; i < row.children.length; i++) {
                        var child = row.children[i];
                        var childRowContext = this.renderRow(datagrid, table1, table2, i, child, level);
                    }
                }
            },
            buildTree: function (opts, rows, frozenView, normalView, treeField, parentField, topValue) {
                var roots = [];
                if (rows) {
                    for (var i = 0; i < rows.length; i++) {
                        var row = rows[i];
                        var parentValue = row[parentField];
                        var hasParent = false;
                        if (!(((topValue === undefined || topValue === null) && (parentValue === "" || parentValue == topValue)) || (parentValue == topValue))) {//不是顶级                     
                            for (var j = 0; j < rows.length; j++) {//找出父亲
                                var row2 = rows[j];
                                if (row2[treeField] == parentValue) {
                                    if (!row2.children) {
                                        row2.children = [];
                                    }
                                    row2.children.push(row);
                                    hasParent = true;
                                    break;
                                }
                            }
                        }
                        if (!hasParent) {
                            //var tr = this.renderRow(opts, frozenView, normalView, i, row);
                            roots.push(row);
                        }
                    }
                }
                return roots;
            },
            createTreeRow: function (datagrid, colCount) {
                var opts = datagrid.options;

                var tree = $("<tr></tr>").addClass("treegrid-tree-tr");

                var td = $("<td></td>").attr("colspan", colCount);

                td.appendTo(tree);

                var viewBody = $("<div></div>").addClass("view-body");

                var table = $("<table></table>").addClass("datagrid-table");

                table.appendTo(viewBody);

                if (opts.border) {
                    //table.addClass("datagrid-table-bordered");
                }
                if (opts.striped) {
                    table.addClass("datagrid-table-striped");
                }

                td.append(viewBody);

                var tbody = $("<tbody></tbody");

                table.append(tbody);

                return tree;
            },
            bindDataByDataTable: function (grid, dataTable) {
                var data = Z.ParseData(dataTable);
                grid.BindData(data.Rows);
                //ResizeDatagrid(grid);
                return data.Rows;
            }
        },
        {
            render: function (datagrid, data) {
                var opts = datagrid.options;
                var frozenView = datagrid.panel.find(">.datagrid-view>.frozen-view");
                frozenView.find(">.view-body>.datagrid-table>tbody").empty();

                var normalView = datagrid.panel.find(">.datagrid-view>.normal-view");
                normalView.find(">.view-body>.datagrid-table>tbody").empty();

                var groups = this.groupBy(opts, data);
                var rowIndex = 0;
                var expandGroupCount = opts.expandGroupCount || groups.length;
                for (var i = 0; i < groups.length; i++) {
                    var group = groups[i];
                    var table1 = frozenView.find(">.view-body>.datagrid-table");
                    var table2 = normalView.find(">.view-body>.datagrid-table");
                    var isExpand = expandGroupCount > i;
                    var rowContext = this.renderGroupHeader(datagrid, table1, table2, i, group, isExpand);
                    rowIndex++;
                    if (isExpand) {
                        var childCount = this.renderItems(datagrid, rowContext, rowIndex);
                        rowIndex += childCount;
                    }
                }
            },
            renderGroupHeader: function (datagrid, table1, table2, rowIndex, group, isExpand) {
                var tbody = table1.find(">tbody");

                var tr1 = $("<tr class='datagrid-row groupgrid-group-header' data-row-index=\"" + rowIndex + "\"></tr>").appendTo(tbody);

                var td = $("<td></td>").appendTo(tr1);

                var cell = $("<div class='datagrid-cell'></div>").appendTo(td);

                var title = group.Key;

                var opts = datagrid.options;
                if (opts.HeaderFormatter) {
                    title = opts.HeaderFormatter(group);
                }

                var expandCell = cell;

                tbody = table2.find(">tbody");

                var tr2 = $("<tr class='datagrid-row groupgrid-group-header' data-row-index=\"" + rowIndex + "\"></tr>").appendTo(tbody);
                td = $("<td></td>");
                cell = $("<div class='datagrid-cell'></div>").appendTo(td);

                td.width(opts.NormalColumnsWidth);

                tr2.append(td);

                if (!opts.frozenColumns || !opts.frozenColumns.length) {
                    expandCell = cell;
                }

                expandCell.html(title);

                var icon = $("<span class='expand-icon glyphicon'></span>");
                var state = isExpand ? "open" : "closed";
                icon.addClass(state);
                icon.addClass(opts[state + "Icon"]);

                expandCell.prepend(icon);
                expandCell.parent().addClass("tree-grid-expand-node");

                var rowContext = {
                    RowData: group,
                    Tr1: tr1,
                    Tr2: tr2
                };
                tr1.data("data", rowContext);
                tr2.data("data", rowContext);
                return rowContext;
            },
            renderItems: function (datagrid, rowContext, rowIndex) {
                var group = rowContext.RowData;
                var opts = datagrid.options;
                var renderRowCount = 0;
                if (group.Items.length > 0) {
                    var tr1 = rowContext.Tr1;
                    var tree1 = this.createTreeRow(datagrid, tr1.children().length);
                    tr1.after(tree1);

                    var tr2 = rowContext.Tr2;
                    var tree2 = this.createTreeRow(datagrid, tr2.children().length);
                    tr2.after(tree2);

                    var ri = rowIndex;
                    for (var i = 0; i < group.Items.length; i++) {
                        var child = group.Items[i];
                        var childRowContext = this.renderRow(datagrid, tree1.find(">td>.view-body>table"), tree2.find(">td>.view-body>table"), ri, child);
                        ri++;
                    }
                    renderRowCount = ri - rowIndex;
                }
                return renderRowCount;
            },
            renderRow: function (datagrid, table1, table2, rowIndex, row) {
                var opts = datagrid.options;
                var rowContext = {
                    RowData: row,
                    Tr1: null
                };

                datagrid.OnBeforeRowBind(datagrid, rowContext);

                var tr1 = this.renderTableRow(datagrid, table1, opts.frozenColumns, rowIndex, row);
                if (opts.checkbox) {
                    var h = $("<td class='datagrid-cell-checkbox check-row'><input type='checkbox' /></td>");
                    tr1.prepend(h);
                }
                tr1.data("data", rowContext);
                rowContext.Tr1 = tr1;

                var tr2 = this.renderTableRow(datagrid, table2, opts.columns, rowIndex, row);
                tr2.append("<td style='width:auto;'></td>");
                rowContext.Tr2 = tr2;
                tr2.data("data", rowContext);

                var cell = tr1.children(":not('.datagrid-cell-checkbox')");
                if (!cell.length) {
                    cell = tr2.children();
                }
                cell.addClass("group-icon-node");

                cell = cell.first().children(".datagrid-cell");

                var icon = $("<span class='expand-icon glyphicon'></span>");
                var state = "closed";
                icon.addClass(state);
                //SetExpandIcon(datagrid, row, state, icon, 2);
                icon.addClass("icon-editor_insert_drive_file");
                cell.prepend(icon);

                var indent = $("<div class='tree-grid-indent tree-grid-line'></div>");
                cell.prepend(indent);

                cell.find(">.tree-grid-indent:last").addClass("tree-grid-line-join");

                InitDraggable(datagrid, rowContext);

                datagrid.OnRowBinded(datagrid, rowContext);

                return rowContext;
            },
            renderCell: function (row, col, td) {
                var field = col.field;
                var val = row[field];
                if (col.Formatter) {
                    val = col.Formatter(val, row, col);
                }
                var style;
                if (col.Styler) {
                    style = col.Styler(row, col);
                }
                var title = "";
                if (col.renderTitle) {
                    title = val ? "title = '" + val + "'" : "";
                }
                var cell = $("<div " + title + " class='datagrid-cell'></div>");
                if (col.type) {
                    cell.addClass(col.type + "-cell");
                }
                if (col.tools && col.tools.length) {
                    for (var i = 0; i < col.tools.length; i++) {
                        var tool = col.tools[i];
                        var gridTool = $('<div class="grid-tool"></div>').attr("title", tool.desc || tool.text).attr("data-index", i);
                        ////显示方式：0图标，1文本，2文本与图标
                        var showType = Z.ToInt(tool.showType);
                        gridTool.addClass("show-type" + showType);
                        gridTool.append('<span class="glyphicon icon-' + tool.icon + '"></span>');
                        gridTool.append('<span class="grid-tool-text">' + tool.text + '</span>');
                        cell.append(gridTool);
                    }
                }
                else {
                    cell.html(val);
                }
                if (style) {
                    cell.attr("style", style);
                }
                if (col.OnRenderCell) {
                    col.OnRenderCell(row, col, td);
                }
                td.html(cell);
            },
            createTreeRow: function (datagrid, colCount) {
                var opts = datagrid.options;

                var tree = $("<tr></tr>").addClass("treegrid-tree-tr");

                var td = $("<td></td>").attr("colspan", colCount);

                td.appendTo(tree);

                var viewBody = $("<div></div>").addClass("view-body");

                var table = $("<table></table>").addClass("datagrid-table");

                table.appendTo(viewBody);

                if (opts.border) {
                    //table.addClass("datagrid-table-bordered");
                }
                if (opts.striped) {
                    table.addClass("datagrid-table-striped");
                }

                td.append(viewBody);

                var tbody = $("<tbody></tbody");

                table.append(tbody);

                return tree;
            },
            renderTableRow: function (datagrid, table, cols, rowIndex, row) {
                var tbody = table.find(">tbody");
                var style;
                var opts = datagrid.options;
                if (opts.Styler) {
                    style = opts.Styler(row, rowIndex);
                }
                var tr = $("<tr class='datagrid-row' data-row-index=\"" + rowIndex + "\"></tr>").appendTo(tbody);
                if (style) {
                    tr.attr("style", style);
                }
                //if (opts.idField) {
                //    tr.attr("data-row-id", row[opts.idField]);
                //}
                if (cols) {
                    var groupCount = cols.length;
                    for (var i = 0; i < groupCount; i++) {
                        var groupCols = cols[i];
                        for (var j = 0; j < groupCols.length; j++) {
                            var col = groupCols[j];
                            var td = $("<td field='" + col.field + "' style='width:" + col.width + "px;" + (col.visible === false ? "display:none;'" : "") + "' class='datagrid-cell-" + col.field + "'></td>");
                            this.renderCell(row, col, td);
                            td.data("column", col);
                            tr.append(td);
                        }
                    }
                    // tr.append("<td style='width:auto;'></td>");
                }
                tr.data("data", row);
                return tr;
            },
            groupBy: function (opts, rows) {
                if (opts.groupField) {
                    return rows.GroupBy(function (r) {
                        return r[opts.groupField];
                    });
                }
                return rows;
            },
            bindDataByDataTable: function (grid, dataTable) {
                var data = Z.ParseData(dataTable);
                grid.BindData(data.Rows);
                //ResizeDatagrid(grid);
                return data.Rows;
            }
        }];

    DataGrid.prototype.BindDataByDataTable = function (dataTable) {
        /// <param name="dataTable" type="objeat">{Columns:[],Rows:[[],[]],MaxRow:Tatol}</param>        
        if (this.viewer) {
            var data = this.viewer.bindDataByDataTable(this, dataTable);
            this.options._data = data;
        }
    }
    DataGrid.prototype.ReBindData = function () {
        var rows = this.GetRows();
        if (rows && rows.length && this.options.type == 1) {
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].children) {
                    delete rows[i].children;
                }
            }
        }
        this.BindData(rows);
    }
    DataGrid.prototype.BindFooter = function (row) {
        if (!this.options.footer) return;
        var frozenView = this.panel.find(">.datagrid-view>.frozen-view");

        var normalView = this.panel.find(">.datagrid-view>.normal-view");

        var table1 = frozenView.find(">.view-footer>.datagrid-table").empty();
        var table2 = normalView.find(">.view-footer>.datagrid-table").empty();
        var rowContext = this.viewer.renderRow(this, table1, table2, -1, row || {}, true);
    }
    DataGrid.prototype.ShowDataCount = function (count) {
        if (this.options.pagination) {
            this.panel.find(".data-desc").html("共" + count + "条数据");
        }
    }
    DataGrid.prototype.AppendRow = function (rowdata) {
        rowdata = rowdata || {};
        var table1 = this.panel.find(">.datagrid-view>.frozen-view").find(">.view-body>.datagrid-table");
        var table2 = this.panel.find(">.datagrid-view>.normal-view").find(">.view-body>.datagrid-table");
        var index = table1.find("tr").length;
        var rowContext = this.viewer.renderRow(this, table1, table2, index, rowdata);
        var data = this.options._data;
        if (!data) {
            data = this.options._data = [];
            data.push(rowdata);
        }
    }
    DataGrid.prototype.Resize = function (width, height) {
        var changed = false;
        var opts = this.options;
        if (!opts.fit) {
            if (opts.width != width) {
                opts.width = width;
                changed = true;
            }
            if (opts.height != height) {
                opts.height = height;
                changed = true;
            }
        }
        if (changed) {
            ResizeDatagrid(this)
        }
    }

    DataGrid.prototype.SelectAll = function () {
        var opts = this.options;
        if (!opts.singleSelect) {
            var panel = this.panel;
            var view = panel.find(">.datagrid-view>.frozen-view,>.datagrid-view>.normal-view");
            view.find("tr.datagrid-row").addClass("grid-selected");
            view.find("tr.datagrid-row>td>input:checkbox").prop("checked", true);
        }
    }
    DataGrid.prototype.ClearSelection = function (fireEvent) {
        var opts = this.options;
        var panel = this.panel;
        var view = panel.find(">.datagrid-view>.frozen-view,>.datagrid-view>.normal-view");
        view.find("tr.datagrid-row.grid-selected").removeClass("grid-selected");
        ClearChecked(this);
        //this.OnUnSelect();
    }

    DataGrid.prototype.GetSelectedRows = function () {
        var opts = this.options;
        var panel = this.panel;
        var view = panel.find(">.datagrid-view>.normal-view");
        var rows = [];
        //view.find(">.view-body>.datagrid-table>tbody>tr.grid-selected").each(function () {
        view.find("tr.grid-selected").each(function () {
            rows.push($(this).data("data").RowData);
        });
        return rows;
    }

    DataGrid.prototype.GetSelectedIndex = function () {
        var opts = this.options;
        var panel = this.panel;
        var view = panel.find(">.datagrid-view>.normal-view");
        var index = -1;
        //view.find(">.view-body>.datagrid-table>tbody>tr.grid-selected").each(function () {
        view.find("tr.grid-selected").each(function () {
            index = $(this).attr('data-row-index');
        });
        return index;
    }

    DataGrid.prototype.GetRows = function () {
        var opts = this.options;

        return opts._data;

        var panel = this.panel;
        var view = panel.find(">.datagrid-view>.normal-view");
        var rows = [];
        view.find(">.view-body>.datagrid-table>tbody>tr").each(function () {
            var rowContext = $(this).data("data");
            if (rowContext) {
                rows.push(rowContext.RowData);
            }
        });
        return rows;
    }
    DataGrid.prototype.SelectRowByIndex = function (index, disableEvent) {
        if (index == undefined) {
            index = this.HighlightRowIndex || 0;
        }
        SelectRowByIndex(this, index, disableEvent, true);
    }
    DataGrid.prototype.SelectRowByID = function (ids, disableEvent) {
        var opts = this.options;
        var panel = this.panel;
        var view = panel.find(">.datagrid-view>.normal-view");
        var $this = this;
        var arr = $.isArray(ids) ? ids : [ids];
        var rows = null;
        if (!opts.type) {
            rows = view.find(">.view-body>.datagrid-table>tbody>tr");
        } else {
            rows = view.find(">.view-body>.datagrid-table>tbody>.treegrid-tree-tr>td>div>table>tbody>tr");
        }
        rows.each(function () {
            var rowContext = $(this).data("data");
            if (rowContext) {
                var idvalue = rowContext.RowData[opts.idField || "ID"];
                var ishas = false;
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] == idvalue) ishas = true;
                }
                if (ishas) {
                    SelectRow($this, rowContext, disableEvent);
                } else {
                    UnSelectRow($this, rowContext, disableEvent);
                }
            }
        });

    }

    DataGrid.prototype.RefreshPager = function (opts) {
        /// <param name="opts" type="object">{pageCount:总页数, pageIndex:当前页索引(1开始)}</param>
        if (this.options.pagination) {
            opts = opts || this.options;
            this.options.pageCount = opts.pageCount;
            this.options.pageIndex = opts.pageIndex;
            var ul = this.panel.find(".datagrid-pager>ul");
            ul.empty();
            var li = $("<li></li>");
            li.attr("page", "pre").append("<a href=\"javascript:void(0);\"><span>&laquo;</span></a>");
            ul.append(li);//Previous
            var isshowEmpty = true;
            for (var i = 0; i < opts.pageCount; i++) {
                var sub = opts.pageIndex - i;
                if (i == 0 || i == opts.pageCount - 1 || Math.abs(sub) < 3) {
                    li = $("<li></li>");
                    isshowEmpty = false;
                    var pageNum = (i + 1);
                    li.attr("page", pageNum).append("<a href=\"javascript:void(0);\"><span>" + pageNum + "</span></a>");
                    if (opts.pageIndex == pageNum) {
                        li.addClass("active");
                    }
                    ul.append(li);
                } else if (!isshowEmpty) {
                    isshowEmpty = true;
                    ul.append("<li page='0'><a href=\"javascript:void(0);\"><span>...</span></a></li>");
                }
            }

            var li = $("<li></li>");
            li.attr("page", "next").append("<a href=\"javascript:void(0);\"><span>&raquo;</span></a>");//next
            ul.append(li);
        }
        return this;
    }

    DataGrid.prototype.GetPageIndex = function () {
        if (this.options.pagination) {
            var selected = this.panel.find(".datagrid-pager li.active");
            if (selected.length > 0) {
                return Z.ToInt(selected.attr("page"));
            }
        }
        return 0;
    }
    DataGrid.prototype.MoveHighlightRow = function (isup) {
        if (this.HighlightRowIndex == undefined) {
            this.HighlightRowIndex = -1;
        }
        if (isup) this.HighlightRowIndex--;
        else this.HighlightRowIndex++;

        if (this.HighlightRowIndex < 0) {
            this.HighlightRowIndex = this.GetRowCount() - 1;
        }
        if (this.HighlightRowIndex == this.GetRowCount()) {
            this.HighlightRowIndex = 0;
        }
        this.HighlightRow(this.HighlightRowIndex);
    }
    DataGrid.prototype.HighlightRow = function (rowIndex) {
        var panel = this.panel;
        var view = panel.find(">.datagrid-view>.frozen-view,>.datagrid-view>.normal-view");
        var viewBody = view.find(">.view-body");
        var tr = viewBody.find(">.datagrid-table>tbody>tr[data-row-index='" + rowIndex + "']");
        tr.addClass("highlight").siblings().removeClass("highlight");

        var rh = tr.last().outerHeight();
        tr.prevAll().each(function () {
            //rh += $(this).outerHeight();
        });
        var prH = rh * (rowIndex + 1);
        var x = prH - viewBody.innerHeight() + 20 + rh;
        if (x > 0) {
            viewBody.scrollTop(x);
        }
        else {
            viewBody.scrollTop(0);
        }
    }

    DataGrid.prototype.ClearHighlightRow = function (rowIndex) {
        var panel = this.panel;
        if (rowIndex == undefined) {
            return panel.find(".highlight").removeClass("highlight");
        }
        var view = panel.find(">.datagrid-view>.frozen-view,>.datagrid-view>.normal-view");
        var viewBody = view.find(">.view-body");
        var tr = viewBody.find(">.datagrid-table>tbody>tr[data-row-index='" + rowIndex + "']");
        tr.removeClass("highlight");
    }

    DataGrid.prototype.Remove = function (row) {
        var panel = this.panel;
        if (!row) return;
    }
    DataGrid.prototype.RemoveSelected = function () {
        var view = this.panel.find(">.datagrid-view>.frozen-view,>.datagrid-view>.normal-view");
        view.find(">.view-body>.datagrid-table>tbody>tr.grid-selected").remove();
    }
    DataGrid.prototype.GetRowCount = function () {
        var panel = this.panel;
        var view = panel.find(">.datagrid-view>.normal-view");
        return view.find(">.view-body>.datagrid-table>tbody>tr").length;
    }

    DataGrid.prototype.Expand = function (treeID) {
        var opts = this.options;
        var panel = this.panel;
        var tr = panel.find("tr[node-id='" + treeID + "']");
        ExpandRow(this, tr.data("data"));
    }

    DataGrid.prototype.Collapse = function (treeID) {
        var opts = this.options;
        var panel = this.panel;
        var tr = panel.find("tr[node-id='" + treeID + "']");
        tr.next("tr.treegrid-tree-tr").hide();

        var context = tr.data("data");
        if (context) {
            var tr1 = context.Tr1;
            var tr2 = context.Tr2;
            var expandNode = tr1.find(">.tree-grid-expand-node .expand-icon");
            if (expandNode.length == 0) {
                expandNode = tr2.find(">.tree-grid-expand-node .expand-icon");
            }
            var opts = this.options;
            if (expandNode.hasClass("open")) {
                SetExpandIcon(this, context, "closed", expandNode, tr.attr("data-level"));
            }
        }
    }
    DataGrid.prototype.RenderStyle = function () {
        var arr = ["<style type=\"text/css\">"];
        var columns = this.options.columns;

        columns = this.options.frozenColumns;

        arr.push("</style>");
    }
    var appendStyle = function (col, ary) {

    }

    var FitGrid = function (grid) {
        var opts = grid.options;
        var changed = false;
        if (opts.fit) {
            var panel = grid.panel;
            var p = panel.parent();
            p.css({ overflow: "hidden" });
            //if (p.is("body")) {
            //    p = $(window);
            //}
            var height = p.height();
            if (opts.height != height) {
                opts.height = height;
                changed = true;
            }
            return changed;
        }
        return true;
    }

    var OnNormalViewBodyScroll = function (e) {
        var grid = e.data;
        var opts = grid.options;
        var panel = grid.panel;

        $(this).prev().scrollLeft(this.scrollLeft);
        $(this).next().scrollLeft(this.scrollLeft);

        var frozenBody = panel.find(">.datagrid-view>.frozen-view>.view-body");
        frozenBody.scrollTop(this.scrollTop);
    }
    var StopResizeColumn = function (e, o) {

        var target = $(this);
        var resizeOpts = target.resizable("option");
        var grid = resizeOpts.datagrid;
        var col = target.data("column");
        if (col) {
            var size = o.size;
            col.width = o.size.width;
        }
        grid.__initSize = false;
        InitGridWidth(grid);
        grid.ReBindData();
        grid.OnColumnChanged(this);
    }
    var ResizeDatagrid = function (grid) {
        var opts = grid.options;
        var width = opts.width;
        InitGridWidth(grid);
        if (!FitGrid(grid)) return;
        var height = opts.height;
        var panel = grid.panel;
        if (height) {

            if (opts.pagination) height -= 44;
            if (opts.footer) height -= 35;
            height -= 47;//列头
            if (opts.autoHeight) {
                grid.frozenBody.css({ maxHeight: height });
                grid.normalBody.css({ maxHeight: height });
            } else {
                grid.frozenBody.height(height);
                grid.normalBody.height(height);
            }
        }
    }
    var InitGridWidth = function (grid) {
        if (grid.__initSize) return; grid.__initSize = true;
        var opts = grid.options;
        var panel = grid.panel;
        var needWidth = 0;
        if (opts.checkbox) {
            needWidth = checkboxColumnWidth;
        }
        if (opts.rowHeader) {
            needWidth += checkboxColumnWidth;
        }
        ForeachCoumns(opts.frozenColumns, function (col) {
            if (!col.hidden) {
                if (col.width == undefined) {
                    col.width = columnDefaultWidth;
                }
                needWidth += col.width;
            }
        });
        var frozenView = panel.find(">.datagrid-view>.frozen-view");
        frozenView.width(needWidth);//设置冻结列宽
        grid.frozenBody = frozenView.find(".view-body");

        var normalView = panel.find(">.datagrid-view>.normal-view");
        normalView.css({ left: needWidth });
        grid.normalBody = normalView.find(".view-body");
        var columnsWidth = 0;
        ForeachCoumns(opts.columns, function (col) {
            if (!col.hidden) {
                if (col.width == undefined) {
                    col.width = columnDefaultWidth;
                }
            }
            columnsWidth += col.width;
        });
        opts.NormalColumnsWidth = columnsWidth;
    }
    var ForeachCoumns = function (cols, cb) {
        if (cols && cols.length > 0) {
            for (var i = 0; i < cols.length; i++) {
                var colGroup = cols[i];
                if (colGroup && colGroup.length > 0) {
                    for (var j = 0; j < colGroup.length; j++) {
                        cb(colGroup[j]);
                    }
                }
            }
        }
    }

    var OnClickPager = function (e) {
        var grid = e.data;
        var opts = grid.options;
        var pageCount = grid.options.pageCount;

        var curPageIndex = grid.GetPageIndex();

        var newPageIndex = curPageIndex;

        var page = $(this).attr("page");

        var o = {
            PageIndex: curPageIndex
        }
        var arg = new EMW.EventArgument(o);

        var li = $(this);
        if (page == "pre") {
            if (curPageIndex > 1) {
                grid.OnPrePage(arg);
                newPageIndex = curPageIndex - 1;
                li = li.siblings("[page='" + newPageIndex + "']");
            }
        }
        else if (page == "next") {
            if (curPageIndex < pageCount) {
                grid.OnNextPage(arg);
                newPageIndex = curPageIndex + 1;
                li = li.siblings("[page='" + newPageIndex + "']");
            }
        }
        else {
            newPageIndex = Z.ToInt(page);
        }
        if (!newPageIndex) return;
        if (!arg.IsStop && curPageIndex != newPageIndex) {

            grid.OnPageBeforeChange(arg);

            if (arg.IsStop) {
                e.stopPropagation();
            }
            else {
                li.addClass("active").siblings(".active").removeClass("active");
                o.PageIndex = newPageIndex;
                grid.options.pageIndex = newPageIndex;
                grid.OnPageChange(arg);
            }
            grid.RefreshPager();
        }
        return false;
    }

    var OnClickCell = function (e) {
        var grid = e.data;
        var tr = $(this).closest("tr");
        var rowIndex = $(this).attr("data-row-index");
        var rowData = tr.data("data");
        var arg = new EMW.EventArgument({
            Value: rowData[$(this).attr("field")],
            Column: $(this).data("column"),
            RowIndex: rowIndex,
            RowData: rowData,
            TR: tr
        });
        grid.OnClickCell(arg);
        if (arg.IsStop) {
            e.stopPropagation();
        }
    }

    var OnClickRow = function (e) {
        var grid = e.data;
        var rowIndex = $(this).attr("data-row-index");

        var rowContext = $(this).data("data");

        var arg = new EMW.EventArgument(rowContext);
        arg.target = e.target;
        arg.evt = e;
        grid.OnClickRow(arg);


        //if (!arg.IsStop) {

        var selected = $(this).hasClass("grid-selected");
        if (!grid.options.multiple) {
            grid.ClearSelection();
        }
        //}
        var curtd = $(e.target).closest("td");
        var col = curtd.data("column");
        if (col && grid.options.OnBeginEdit) {
            if (!grid.LastEditCell || (grid.LastEditCell[0] != curtd[0])) {

                grid.EndEdit();
                grid.LastEditCell = curtd;
                grid.LastEditRow = rowContext.RowData;

                grid.options.OnBeginEdit(col, grid.LastEditRow, grid.LastEditCell);

            }
        }
        SelectRow(grid, rowContext, selected);
        if (col && col.OnClick) {
            col.OnClick(rowContext, col, e);
        }
        if (col && col.type == "image" && col.zoomImage !== false) {
            var imgs = [];
            var curImg = curtd.find(">.image-cell>img");
            var curIndex = 0;
            grid.panel.find('td[field="' + col.field + '"]>.image-cell>img').each(function (i) {
                if (curImg[0] == this) {
                    curIndex = i;
                }
                imgs.push($(this).attr("src"));
            });
            //ImageViewer.Show(src);
            EMW.UI.AddZoomImg(imgs, curIndex, null, null, null);
        }

        var toolTarget = $(e.target).closest(".grid-tool");
        if (toolTarget.length) {
            var index = Z.ToInt(toolTarget.attr("data-index"));
            var tool = col.tools[index];
            if (tool.OnClick) {
                tool.OnClick.call(tool, tool);
            }
        }
        e.stopPropagation();
    }
    var ImageViewer = {
        Show: function (src) {
            if (src) {
                var _this = this;
                var img = $("<img src='" + src + "' alt='' title=''/>");
                var overlay = EMW.Global.UI.Overlay({
                    Content: img,
                    OnResize: function (e) {
                        _this.ScaleImage(img, overlayPanel.width(), overlayPanel.height());
                    }
                });
                var overlayPanel = overlay.Overlay;
                img.one("load", function (e) {
                    img.attr("actualwidth", img.width());
                    img.attr("actualheight", img.height());
                    _this.ScaleImage(img, overlayPanel.width(), overlayPanel.height());
                });
            }
        },
        ScaleImage: function (img, w, h) {
            var width = w;
            var height = h;
            if (!w) {
                var p = img.parent();
                w = p.width();
                h = p.height();
            }
            var imgWidth = Z.ToInt(img.attr("actualwidth"));
            var imgHeight = Z.ToInt(img.attr("actualheight"));
            if (imgWidth > 0 && imgHeight > 0) {
                if (imgWidth / imgHeight >= w / h) {
                    if (imgWidth > w) {
                        width = w;
                        height = (imgHeight * w) / imgWidth;
                    }
                    else {
                        width = imgWidth;
                        height = imgHeight;
                    }
                }
                else {
                    if (imgHeight > h) {
                        height = h;
                        width = (imgWidth * h) / imgHeight;
                    }
                    else {
                        width = imgWidth;
                        height = imgHeight;
                    }
                }
            }

            marginTop = (h - height) / 2;
            marginLeft = (w - width) / 2;
            height = Math.floor(height);
            width = Math.floor(width);
            img.css({ display: "inline-block", height: height, width: width, "margin-left": marginLeft, "margin-top": marginTop });
        }
    };

    DataGrid.prototype.Resize = function (opt) {
        this.options = $.extend(this.options, opt);
        ResizeDatagrid(this);
    }
    DataGrid.prototype.EndEdit = function () {
        if (this.LastEditCell) {
            var col = this.LastEditCell.data("column");
            if (!col) return;
            if (this.options.OnEndEdit) {
                this.options.OnEndEdit(col, this.LastEditRow);
            }
            this.viewer.renderCell(this.LastEditRow, col, this.LastEditCell);
            this.LastEditRow = null;
            this.LastEditCell = null;
        }
    }
    var SelectRow = function (grid, rowContext, disableEvent) {
        if (rowContext) {
            var opts = grid.options;
            var panel = grid.panel;
            var tr1 = rowContext.Tr1;
            if (!tr1.hasClass("grid-selected")) {
                var arg = new EMW.EventArgument(rowContext);
                if (!disableEvent) {
                    grid.OnBeforeSelect(arg);
                }
                if (!arg.IsStop) {
                    tr1.addClass("grid-selected");
                    rowContext.Tr2.addClass("grid-selected");
                    if (!disableEvent) {
                        grid.OnSelect(arg);
                    }
                }
                tr1.find(">td.datagrid-cell-checkbox>input:checkbox").prop("checked", !arg.IsStop);
                grid.ClearHighlightRow();
            } else {
                var arg = new EMW.EventArgument(rowContext);
                tr1.removeClass("grid-selected");
                rowContext.Tr2.removeClass("grid-selected");
                tr1.find(">td.datagrid-cell-checkbox>input:checkbox").prop("checked", false);
                grid.sub = true;
                grid.OnSelect(arg);
            }
            return rowContext;
        }
    }
    var UnSelectRow = function (grid, rowContext, disableEvent) {
        if (rowContext && rowContext.Tr1.is(".grid-selected") || grid.options.multiple) {
            rowContext.Tr1.removeClass("grid-selected");
            rowContext.Tr2.removeClass("grid-selected");
            rowContext.Tr1.find(">td.datagrid-cell-checkbox>input:checkbox").prop("checked", false);
            if (!disableEvent) {
                grid.OnUnSelect(rowContext);
                if (grid.options.multiple) {
                    var arg = new EMW.EventArgument(rowContext);
                    grid.sub = true;
                    grid.OnSelect(arg);
                }
            }
        }
    }


    var OnDblClickRow = function (e) {
        if ($(e.target).closest(".datagrid-cell-checkbox").length == 0) {//双击checkbox列就忽略
            var grid = e.data;
            var rowIndex = $(this).attr("data-row-index");
            var rowContext = $(this).data("data");
            var arg = new EMW.EventArgument(rowContext);
            arg.target = e.target;
            arg.evt = e;
            grid.OnDblClickRow(arg);
        }
        e.stopPropagation();
    }

    var OnClickExpandIcon = function (e) {
        var grid = e.data;
        var tr = $(this).closest("tr");
        ExpandRow(grid, tr.data("data"));

        //return false;
    }

    var SetExpandIcon = function (grid, row, state, expandNode, level) {
        var opts = grid.options;
        expandNode.removeClass("open closed " + opts.closedIcon + " " + opts.openIcon);
        expandNode.addClass(state);
        var iconCls = opts[state + "Icon"];
        if (opts.expandIconGetter) {
            iconCls = opts.expandIconGetter(expandNode, row[opts.treeField], state, row, level) || iconCls;
        }
        expandNode.addClass(iconCls);
    }

    var ExpandRow = function (grid, rowContext) {
        var context = rowContext;
        if (context) {
            var tr1 = context.Tr1;
            var tr2 = context.Tr2;
            var level = Z.ToInt(tr1.attr("tree-level")) + 1;
            var expandNode = tr1.find(">.tree-grid-expand-node .expand-icon");
            if (expandNode.length == 0) {
                expandNode = tr2.find(">.tree-grid-expand-node .expand-icon");
            }
            var opts = grid.options;
            if (expandNode.hasClass("open")) {

                //expandNode.removeClass("open").addClass("closed").addClass(opts.closedIcon).removeClass(opts.openIcon);
                SetExpandIcon(grid, context.RowData, "closed", expandNode, level - 1);

                tr1.next(".treegrid-tree-tr").hide();
                tr2.next(".treegrid-tree-tr").hide();
            }
            else {
                var arg = new EMW.EventArgument(context);
                arg.Target = expandNode;
                grid.OnBeforeExpand(arg);
                if (!arg.IsStop) {
                    //expandNode.removeClass("closed").addClass("open").removeClass(opts.closedIcon).addClass(opts.openIcon);
                    SetExpandIcon(grid, context.RowData, "open", expandNode, level - 1);
                    var tree1 = tr1.next(".treegrid-tree-tr");
                    if (tree1.length == 0) {
                        if (context.RowData.children && context.RowData.children.length > 0) {

                            grid.viewer.appendChildren(grid, context, level);
                        }
                    }
                    else {
                        tree1.show();
                        tr2.next(".treegrid-tree-tr").show();
                    }
                    grid.OnExpand(arg);
                }
            }
        }
    }

    var SelectRowByIndex = function (grid, rowIndex, disableEvent, istoggle) {
        var opts = grid.options;
        var panel = grid.panel;
        var view = panel.find(">.datagrid-view>.frozen-view,>.datagrid-view>.normal-view");
        var tr = view.find(">.view-body>.datagrid-table>tbody>tr[data-row-index=" + rowIndex + "]");
        if (tr.length > 0) {
            var rowContext = tr.data("data");
            if (rowContext) {
                if (!tr.hasClass("grid-selected")) {
                    SelectRow(grid, rowContext, disableEvent);
                } else if (istoggle) {
                    UnSelectRow(grid, rowContext, disableEvent);
                }
            }
            return rowContext;
        }
    }

    var OnClickCheckCell = function (e) {
        var grid = e.data;
        var opts = grid.options;
        var rowIndex = $(this).parent().attr("data-row-index");
        var target = $(e.target);
        var isCheck = false;
        var cb = $("input:checkbox", this);
        if (target.is(":checkbox")) {//点击checkbox
            isCheck = cb.is(":checked");
        }
        else {//点击checkbox所在单元格
            isCheck = !cb.is(":checked");
            cb.prop("checked", isCheck);
        }

        if (opts.singleSelect && !opts.multiple) {
            grid.ClearSelection();
        }

        var rowContext = $(this).parent().data("data");
        grid.EndEdit();
        if (isCheck) {
            SelectRow(grid, rowContext);
            //SelectRowByIndex(grid, rowIndex);
        }
        else {
            UnSelectRow(grid, rowContext);
        }
        e.stopPropagation();
    }

    var OnClickCheckAllCell = function (e) {
        var grid = e.data;
        var opts = grid.options;
        if (opts.singleSelect) {
            return false;
        }
        var target = $(e.target);
        var isCheck = false;
        var cb = $("input:checkbox", this);
        if (target.is(":checkbox")) {//点击checkbox
            isCheck = cb.is(":checked");
        }
        else {//点击checkbox所在单元格
            isCheck = !cb.is(":checked");
            cb.prop("checked", isCheck);
        }

        if (isCheck) {
            grid.SelectAll();
        }
        else {
            grid.ClearSelection();
        }
        e.stopPropagation();
    }

    var ClearChecked = function (grid) {
        var opts = grid.options;
        var panel = grid.panel;
        var view = panel.find(">.datagrid-view>.frozen-view");
        view.find("tr.datagrid-row>td.datagrid-cell-checkbox>input:checkbox").prop("checked", false);
        view.find(">.view-header>.datagrid-table>tbody>tr>td.datagrid-cell-checkbox>input:checkbox").prop("checked", false);
    }

    DataGrid.prototype.GetColumns = function () {
        var opts = this.options;
        if (!opts.AllColumns) {
            var cols = [];
            if (opts.frozenColumns) {
                cols = cols.concat(opts.frozenColumns);
            }
            if (opts.columns) {
                cols = cols.concat(opts.columns);
            }
            opts.AllColumns = []

            for (var i = 0; i < cols.length; i++) {
                var cc = cols[i];
                for (var j = 0; j < cc.length; j++) {
                    opts.AllColumns.push(cc[j]);
                }
            }
        }
        return opts.AllColumns;
    }
    DataGrid.prototype.RefreshNumber = function () {
        if (!this.options.rowHeader) return;
        var views = this.panel.find(">.datagrid-view>.frozen-view>.view-body .datagrid-rowheader");
        for (var i = 0; i < views.length; i++) {
            $(views[i]).html(i + 1);
        }
    }
    var Create = function (datagrid) {
        var panel = datagrid.target.parent();
        if (!panel.hasClass("emw-datagrid")) {
            datagrid.target.wrap("<div class='emw-datagrid'></div>");

            panel = datagrid.target.parent();

            var st = datagrid.target.attr("style");
            if (st) {
                st = st + ";" + panel.attr("style");
                panel.attr("style", st);
            }

            datagrid.target.hide();
        }

        var opts = datagrid.options;
        if (opts.border) {
            panel.addClass("datagrid-bordered");
        }
        if (opts.draggable) {
            panel.addClass("datagrid-draggable");
        }

        var view = $("<div></div>").addClass("datagrid-view");
        panel.append(view);

        var frozenView = CreateView(opts.frozenColumns, opts, true, datagrid);
        view.append(frozenView.addClass("frozen-view"));
        var viewHeader = frozenView.find(">.view-header");
        if (opts.rowHeader) {
            viewHeader.find(">.datagrid-table>tbody>tr").append("<td class='datagrid-rowheader'></td>");
        }
        if (opts.checkbox) {
            var h = $("<td class='datagrid-cell-checkbox check-all'><input type='checkbox' /></td>");
            var trs = viewHeader.find(">.datagrid-table>tbody>tr");
            trs.eq(0).prepend(h);
            if (trs.length > 1) {
                h.attr("rowspan", trs.length);
            }
        }

        var normalView = CreateView(opts.columns, opts, false, datagrid);
        view.append(normalView.addClass("normal-view"));
        if (opts.pagination) {
            var pagePanel = CreatePager(datagrid);
            panel.append(pagePanel);
        }
        if (opts.rowHeightType) {
            frozenView.find(">.view-body>.datagrid-table").addClass(RowHeightCls[opts.rowHeightType]);
            normalView.find(">.view-body>.datagrid-table").addClass(RowHeightCls[opts.rowHeightType]);
        }

        return panel;
    }

    var CreateView = function (cols, opts, isfrozen, datagrid) {
        var panel = $("<div></div>");

        /*视图头部*/
        var viewHeader = CreateHeader(cols, opts, isfrozen, datagrid);
        panel.append(viewHeader);

        /*视图主体*/
        var viewBody = CreateBody(cols, opts);
        panel.append(viewBody);
        if (opts.footer) {
            /*视图脚部*/
            var viewFooter = CreateFooter(cols, opts);
            panel.append(viewFooter);
        }
        return panel;
    }

    var CreateHeader = function (cols, opts, isfrozen, datagrid) {
        var viewHeader = $("<div class='view-header'></div>");

        var table = $("<table class='datagrid-table'></table>");

        viewHeader.append(table);

        var header = $("<tbody></tbody");

        table.append(header);

        var tr = $("<tr class=\"datagrid-header-row\"></tr>").appendTo(header);
        if (cols) {
            var rowCount = cols.length, groupColHeaderRow;
            if (opts.columnGroupHeaderRender) {
                groupColHeaderRow = $("<tr class=\"datagrid-header-row colgroup-header-row\"></tr>").prependTo(header);
                table.addClass("group-header-table");
            }
            for (var j = 0; j < rowCount; j++) {
                var groupCols = cols[j], groupWidth = 0, isGroupHeader = true;
                if (opts.columnGroupHeaderRender && opts.isGroupHeader) {
                    isGroupHeader = opts.isGroupHeader(groupCols, j, isfrozen);
                }
                for (var i = 0; i < groupCols.length; i++) {
                    var cell = [], col = groupCols[i];
                    cell.push("<td field='");
                    cell.push(col.field);
                    cell.push("'  class='datagrid-cell-");
                    cell.push(col.field);
                    cell.push("' style=\"width:");
                    cell.push(col.width);
                    groupWidth += col.width;
                    cell.push("px;");
                    if (col.visible === false) {
                        cell.push("display:none;");
                    }
                    cell.push("\">");// title='" + col.title + "' 重复表问题 先去掉
                    cell.push("<div class='datagrid-cell'>");

                    cell.push(col.title);
                    if (col.allowSort) {
                        cell.push("<span class='datagrid-cell-sort " + (col.orderBy || "") + "'></span>");
                        if (col.orderBy) datagrid.SortColumn = col;
                    }
                    if (col.OnShowMenu) {
                        cell.push("<span class='datagrid-cell-dropdown'></span>");
                    }
                    cell.push("</div>");
                    cell.push("</td>");
                    if (groupColHeaderRow) {
                        if (isGroupHeader) {
                            tr.append($(cell.join("")).data("column", col));
                        }
                        else {
                            groupColHeaderRow.append($(cell.join("")).data("column", col));
                            groupColHeaderRow.find(">td").attr("rowspan", 2);
                        }
                    }
                    else {
                        tr.append($(cell.join("")).data("column", col));
                    }
                    if (col.type == "image" && col.visible) {
                        opts.rowHeightType = 1;
                    }
                }
                if (groupColHeaderRow && isGroupHeader) {
                    var td = $('<td class="datagrid-colgroup-cell"></td>');
                    groupColHeaderRow.append(td);
                    td.attr("colspan", groupCols.length);
                    td.width(groupWidth);
                    var cell = $('<div class="datagrid-groupheader-cell"></div>').appendTo(td);
                    if (opts.columnGroupHeaderRender) {
                        opts.columnGroupHeaderRender(groupCols, cell, j, isfrozen);
                    }
                }
            }
            if (!isfrozen) {
                tr.append("<td style='width:auto;'></td>");
            }
            if (groupColHeaderRow) {
                if (!isfrozen) {
                    groupColHeaderRow.append("<td style='width:auto;'></td>");
                }
                tr.addClass("colgroup-header-row");
            }
        }
        return viewHeader;
    }
    var RowHeightCls = ["", "double-row-height"];
    var CreateBody = function (cols, opts) {
        var viewBody = $("<div class='view-body'></div>");

        var table = $("<table class='datagrid-table'></table>");

        if (opts.border) {
            //table.addClass("datagrid-table-bordered");
        }
        if (opts.striped) {
            table.addClass("datagrid-table-striped");
        }

        viewBody.append(table);

        var tbody = $("<tbody></tbody");

        table.append(tbody);

        return viewBody;
    }

    var CreateFooter = function (cols, opts) {
        var viewFooter = $("<div class='view-footer'><table class='datagrid-table'></table></div>");


        //  viewFooter.append(table);

        return viewFooter;
    }

    var CreatePager = function (datagrid) {
        var panel = $("<div class='datagrid-pager'><span class='data-desc'><span></div>");

        var opts = datagrid.options;

        if (opts.showPageList) {
            var lstPanel = $("<div class='gridpage-list'></div>").prependTo(panel);
            var lst = $("<div><div>").appendTo(lstPanel);
            var cmb = lst.Combobox({
                multiple: false,
                disabled: false,
                editable: false,
                emptyItem: false,
                width: 50,
                Items: opts.pageList.Select(function (p) {
                    return { Text: p, Value: p };
                })
            });
            cmb.SetValue(opts.pageSize);

            cmb.OnBeforeSelected(function (arg) {
                datagrid.OnPageBeforeChange(arg);
            });
            cmb.OnChanged(function (arg) {
                datagrid.OnPageSizeChanged(new EMW.EventArgument(arg.Data.Value));
                //datagrid.RefreshPager({ pageIndex: 1, pageCount: opts.pageCount });
                //datagrid.OnPageChange(arg);
            });
        }

        var ul = $("<ul class='pagination'></ul>")
        panel.append(ul);

        var li = $("<li></li>");
        li.attr("page", "pre").append("<a href=\"javascript:void(0);\"><span>&laquo;</span></a>");
        ul.append(li);//Previous
        /*
        for (var i = 0; i < 5; i++) {
            li = $("<li></li>");
            li.attr("page", i).append("<a href=\"javascript:void(0);\"><span>" + (i + 1) + "</span></a>");
            ul.append(li);
        }
        */
        var li = $("<li></li>");
        li.attr("page", "next").append("<a href=\"javascript:void(0);\"><span>&raquo;</span></a>");//next

        ul.append(li);

        return panel;
    }

    $.fn.DataGrid.defaults = {
        columns: undefined,
        frozenColumns: undefined,
        rowHeader: false,
        fit: false,
        rowHeightType: 0,//0默认，1：两倍行高
        striped: false,
        border: false,
        hover: true,
        idField: null,
        checkbox: true,
        data: null,
        loadMsg: "正在加载 ...",
        rownumbers: false,
        draggable: false,
        singleSelect: false,
        resizable: false,
        pagination: false,
        pagePosition: "bottom",
        pageIndex: 1,
        pageCount: 0,
        pageSize: 20,
        pageList: [10, 20, 30, 40, 50, 100],
        showHeader: true,
        showFooter: false,
        showPageList: true,
        rowStyler: function (x, y) {
        },
        //openIcon: "icon-content_remove_circle_outline",
        //closedIcon: "icon-content_add_circle_outline",
        openIcon: 'icon-folder-open',
        closedIcon: "icon-folder-close",
        expandIconGetter: function (icon, val, state, row, level) {
        },
        view: {}
    }
})(jQuery);

/*Combobox*/
(function ($) {
    EMW.UI.AddControl("Combobox");
    /*
    $.fn.Combobox = function (opts) {
        var combo = this.data("EMW_combo");
        if (!combo) {
            combo = new Combobox(this, opts);
            this.data("EMW_combo", combo);
        }
        return combo;
    }*/

    var Create = function (combox) {
        var opts = combox.options;
        var panel = $("<div></div>").addClass("input-group emw-combobox");
        panel.css({ width: opts.width });
        var cmbInput = $("<input type=\"text\" class=\"text-box combobox-input\"/>");
        if (opts.disabled) {
            cmbInput.addClass("disable-editable")
            .attr("readonly", "readonly");
        }
        if (!opts.editable) {
            cmbInput.attr("readonly", "readonly");
        }

        panel.append("<span class=\"input-group-addon\"><i class=\"glyphicon icon-navigation_expand_more\"></i></span>");
        panel.append(cmbInput);


        var st = combox.target.attr("style");
        if (st) {
            st = st + ";" + panel.attr("style");
            panel.attr("style", st);
        }
        combox.target.hide().after(panel);
        return panel;
    }
    var CreateDropPanel = function (combox) {
        if (combox.DropPanel) return;
        var panel = combox.panel;
        var opts = combox.options;
        var dropPanel = $("<div class='emw-combobox-drop' tabindex='-1'></div>");

        $(panel.closest("body")).append(dropPanel);
        var pos = panel.offset();
        var width = opts.panelWidth || panel.width();
        if (document.body.clientWidth < (pos.left + width))
            width = document.body.clientWidth - pos.left - 2;
        dropPanel.css({ left: pos.left, top: pos.top + panel.height(), width: width, height: opts.panelHeight });
        combox.DropPanel = dropPanel;
        BindData(combox);
        combox.DropPanel.blur(function (e) {
            if (e.relatedTarget) {
                var panel = $(e.relatedTarget).closest(".emw-combobox");
                if (panel.length) return;
            }
            combox.HideDropPanel();
        });
        combox.DropPanel.on("click", ".emw-comboxbox-item", function (e) {
            var item = $(this).data("data");
            var val = item && item[opts.valueField];
            var arg = new EMW.EventArgument(item);
            arg.FromUser = true;
            if (opts.multiple) {
                if ($(this).hasClass("selected")) {
                    $(this).removeClass("selected");
                    opts.IsSet = true;
                } else {
                    $(this).addClass("selected");
                    opts.IsSet = false;
                }
                combox.Value = val;
                if (!val) {
                    $(this).parent().children().removeClass("selected");
                }
                combox.SetText(item && item[opts.textField]);
                combox.OnChanged(arg);
                return false;
            }
            else {
                if ($(this).is(".selected")) return combox.HideDropPanel();
                combox.OnBeforeSelected(arg);
                if (!arg.IsStop) {
                    $(this).parent().find(".selected").removeClass("selected");
                    $(this).addClass("selected");
                    combox.Value = val;
                    combox.SetText(item && item[opts.textField]);
                    combox.OnChanged(arg);
                    combox.HideDropPanel();
                }
                return false;
            }
        });
        return dropPanel;
    }

    var BindData = function (combox) {
        var dropPanel = combox.DropPanel;
        if (!dropPanel) return;
        dropPanel.empty();
        var opts = combox.options;
        var items = opts.Items;
        if (!items) return;
        if (!opts.groupField) {
            if (opts.emptyItem) $("<div class='emw-comboxbox-item'>&nbsp;</div>").appendTo(dropPanel);
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var itemPanel = $("<div></div>").addClass("emw-comboxbox-item").data("data", item);
                if (combox.IsSelected(item)) {
                    itemPanel.addClass("selected");
                }
                itemPanel.html(opts.Formatter(item));
                if (dropPanel) {
                    itemPanel.append('');
                }
                dropPanel.append(itemPanel);
            }
        }
        else {
            var groups = items.GroupBy(function (o) {
                return o[opts.groupField];
            });
            for (var i = 0; i < groups.length; i++) {
                var g = groups[i];
                $("<div></div>").addClass("emw-combobox-group-header")
                    .attr("group-key", g.Key)
                    .html(opts.GroupFormatter(g))
                    .appendTo(dropPanel);
                for (var j = 0; j < g.Items.length; j++) {
                    var item = g.Items[j];
                    var itemPanel = $("<div></div>")
                        .attr("group-key", g.Key)
                        .addClass("emw-comboxbox-item emw-comboxbox-group-item")
                        .data("data", item);
                    if (combox.IsSelected(item)) {
                        itemPanel.addClass("selected");
                    }
                    itemPanel.html(opts.Formatter(item));
                    dropPanel.append(itemPanel);
                }
            }
        }
    }


    var Combobox = function (target, opts) {
        this.target = target;
        this.options = $.extend({}, $.fn.Combobox.defaults, opts);
        this.panel = Create(this);
        this.InitEvent();
        var events = ["OnChanged", "OnBeforeSelected", "OnSelected", "OnShowPanel"];
        BindData(this);
        EMW.Event.On(this, events);
    }

    EMW.UI.Combobox = Combobox;

    Combobox.prototype.InitEvent = function () {
        var cmbinput = this.panel.find(".combobox-input");
        var combox = this;
        var opts = combox.options;
        cmbinput.on("click", function (e) {

            if (!$(this).hasClass("disable-editable") && opts.dropOnClick !== false) {
                combox.ShowDropPanel();
            }
            return false;
        });
        cmbinput.blur(function (e) {
            if (e.relatedTarget) {
                var panel = $(e.relatedTarget).closest(".emw-combobox-drop");
                if (panel.length) return;
            }
            combox.HideDropPanel();
        });
        this.panel.find(".input-group-addon").on("click", combox, function (e) {
            cmbinput.focus();
            return combox.ShowDropPanel();
        });
    }
    Combobox.prototype.SetValue = function (v, disabledChange) {
        if (this.Value != v) {
            this.Value = v;
            var items = this.options.Items;
            if (!items || !items.length) return;
            var item = this.GetSelected();
            var text = "";
            if (this.options.multiple) {
                for (var i = 0; i < item.length; i++) {
                    if (i == (item.length - 1)) this.options.separator = "";
                    text += item[i][this.options.textField] + this.options.separator;
                }
            } else {
                text = item ? item[this.options.textField] : "";
            }
            this.SetText(text);
            if (!disabledChange) {
                this.OnChanged(new EMW.EventArgument(item));
            }
        }
    }

    Combobox.prototype.SetText = function (text) {
        if (text == undefined) { this.panel.find(".combobox-input").val(""); return };
        var val = this.panel.find(".combobox-input").val();
        if (this.options.multiple) {
            if (this.options.IsSet) {
                if (val.toString().indexOf(this.options.separator) <= -1)
                { str = ""; } else {
                    var aa = val.split(this.options.separator), str = "";
                    for (var i = 0; i < aa.length; i++) {
                        if (aa[i] == text) continue;
                        str = str.concat(aa[i] + this.options.separator);
                    }
                    str = str.substr(0, str.length - 1);
                }
                this.panel.find(".combobox-input").val(str);
                this.options.changCru = true;
                return;
            }
            if (val == text) return;
            if (val.indexOf(text) > -1) return;
            if (val != "") text = val.concat(this.options.separator + text);
            this.panel.find(".combobox-input").val(text);
        } else {
            this.panel.find(".combobox-input").val(text);
        }
    }

    Combobox.prototype.GetValue = function () {
        return this.Value;
    }

    Combobox.prototype.Clear = function () {
        this.BindData([]);
        this.SetValue("", false);
        this.SetText("");
    }
    Combobox.prototype.ToggleDropPanel = function () {
        if (this.IsShow) {
            this.HideDropPanel();
        } else {
            this.ShowDropPanel();
        }
    }
    Combobox.prototype.ShowDropPanel = function () {
        if (this.IsShow) return;
        this.IsShow = true;
        var dropPanel = this.DropPanel;
        if (!dropPanel) {
            dropPanel = CreateDropPanel(this);
        }
        if (!this.options.disabled) {
            var arg = new EMW.EventArgument();
            this.OnShowPanel(this, arg);
            if (!arg.IsStop) {
                dropPanel.show();
                dropPanel.position({
                    of: this.panel,
                    at: "left bottom",
                    my: "left top"
                });
                //var pos = this.panel.offset();
                //var t = pos.top + this.panel.height() + 2;
                //var height = this.options.panelHeight;
                //if (t + height > document.body.clientHeight) {
                //    if (pos.top > document.body.clientHeight - t) {
                //        if (height > pos.top) height = pos.top;
                //        t = pos.top - height;
                //    } else {
                //        height = Math.min(height, document.body.clientHeight - t);
                //    }
                //}
                //var pwidth = this.panel.width();
                //var width = this.options.panelWidth || this.panel.width();
                //if (pos.left + width + 10 > document.body.clientWidth) {
                //    width = document.body.clientWidth - pos.left - 10;
                //    if (width < pwidth) {
                //        width = pwidth;
                //        pos.left = document.body.clientWidth - pwidth;
                //    }
                //}
                //dropPanel.css({ left: pos.left, top: t, height: height, width: width });
            }
        }
    }

    Combobox.prototype.HideDropPanel = function () {
        var dropPanel = this.DropPanel;
        if (!dropPanel) return;
        dropPanel.hide();
        this.IsShow = false;
    }

    Combobox.prototype.BindData = function (items) {
        this.options.Items = items;
        this.InitDropPanel();
    }
    Combobox.prototype.InitDropPanel = function () {
        if (this.DropPanel) {//当项更改，重新绑定，设置值时删除重新创建
            this.DropPanel.remove();
            this.DropPanel = null;
        }
    }
    Combobox.prototype.AddItem = function (item) {
        var opts = this.options;

        opts.Items = opts.Items || [];
        opts.Items.push(item);
        this.InitDropPanel();
    }

    Combobox.prototype.Disable = function () {
        var inpt = this.panel.find(".combobox-input");
        if (!inpt.hasClass("disabled")) {
            inpt.addClass("disabled");
        }
        inpt.attr("disabled", "disabled");
        this.options.disabled = true;
    }

    Combobox.prototype.Enable = function () {
        var inpt = this.panel.find(".combobox-input");
        inpt.removeClass("disabled");
        inpt.removeAttr("disabled");
        this.options.disabled = false;
    }
    Combobox.prototype.IsSelected = function (item) {
        var v = this.Value;
        if (v === undefined || v === "") return false;
        var value = item[this.options.valueField];
        if (this.options.multiple) {
            return v.indexOf(value) > -1;
        }
        else {
            return v == value;
        }
    }
    Combobox.prototype.GetSelected = function () {
        var ary = [];
        var items = this.options.Items;
        if (!items) return;
        for (var i = 0; i < items.length; i++) {
            if (this.IsSelected(items[i])) {
                if (this.options.multiple) {
                    ary.push(items[i]);
                } else {
                    return items[i];
                }
            }
        }
        if (this.options.multiple) return ary;
    }

    Combobox.prototype.GetText = function () {
        return this.panel.find(".combobox-input").val();
    }

    $.fn.Combobox.defaults = {
        valueField: "Value",
        textField: "Text",
        groupField: null,
        width: "auto",
        height: 22,
        panelWidth: null,
        panelHeight: 200,
        panelAlign: "left",
        multiple: false,
        separator: ",",
        editable: false,
        disabled: false,
        readonly: false,
        pagination: true,
        emptyItem: true,
        Formatter: function (it) { return it[this.textField]; },
        GroupFormatter: function (g) { return g.Key; }
    };
})(jQuery);

/*Searcher*/
(function ($) {
    EMW.UI.AddControl("Searcher");
    var Searcher = function (target, opts) {
        this.target = target;
        this.options = $.extend({}, $.fn.Searcher.defaults, opts);
        var evts = [
            "OnShowPanel",
            "OnBeforeLoad",
            "OnPageChange",
            "OnSelect",
            "OnBeforeSelect",
            "OnChanged",
            "OnCreateGrid"
        ];

        EMW.Event.On(this, evts);

        Create(this);

        Init(this);
    }
    EMW.UI.Searcher = Searcher;

    var Create = function (searcher) {

        var opts = searcher.options;
        opts.dropOnClick = false;
        var combo = searcher.target.Combobox(opts);

        searcher.combo = combo;

        searcher.panel = searcher.combo.panel;
    }

    var Init = function (searcher) {
        var opts = searcher.options;
        var combo = searcher.combo;
        //准备好 filterFields
        var filterColumns = opts.filterColumns || [];
        var filterFields = filterColumns.Select(function (x) {
            return x.field;
        }, function (y) {
            return y.hidden !== true;
        });
        var cols = opts.columns[0];
        for (var i = 0; i < cols.length; i++) {
            var col = cols[i];
            if (!col.hidden) {
                filterFields.AddOrUpdate(col.field);
            }
        }
        opts.filterFields = filterFields;

        combo.isFirstShowPanel = true;
        combo.OnShowPanel(function (a, b) {
            searcher.OnShowPanel(a, b);
            if (this.isFirstShowPanel) {
                delete this.isFirstShowPanel;
                CreateGrid(searcher);
                SearchData(searcher, 1, function () {
                    if (searcher.selectedRow) {
                        var val = searcher.selectedRow[opts.valueField];
                        searcher.datagrid.SelectRowByID(val, true);
                    }
                });
            }
        });
        combo.OnChanged(function (v) {
            searcher.OnChanged(v);
        });
        InitEvents(searcher);
    }

    var CreateGrid = function (searcher) {
        if (!searcher.datagrid) {
            var opts = searcher.options;

            var combo = searcher.combo;

            var dropPanel = combo.DropPanel;
            if (!dropPanel) return;
            var dg = $("<div></div>").appendTo(dropPanel);

            var gridOpts = $.extend({}, opts, {
                border: true,
                pagination: true,
                singleSelect: true,
                fit: true,
                showPageList: false,
                checkbox: !!opts.multiple,
                multiple: opts.multiple,
                data: searcher.LocalData
            });
            gridOpts.idField = gridOpts.valueField;
            var grid = dg.DataGrid(gridOpts);

            searcher.datagrid = grid;
            grid.OnBeforeSelect(function (o) {
                searcher.OnBeforeSelect(o);
            });

            grid.OnSelect(function (o) {//确保只有用户选择时才触发
                var data = o.Data;
                var oldVal = combo.GetValue();
                var newVal = oldVal;
                if (data && data.RowData) {
                    var row = data.RowData;
                    searcher.selectedRow = row;
                    var v = newVal = row[opts.valueField];
                    var t = row[opts.textField];
                    if (this.sub) {
                        combo.options.IsSet = true;
                        this.sub = false;
                    } else {
                        combo.options.IsSet = false;
                    }
                    combo.SetValue(v);
                    combo.SetText(t);
                    if (!this.options.multiple) {
                        combo.HideDropPanel();
                    }
                }
                searcher.OnSelect(o);
                if (oldVal != newVal || !this.sub) {
                    var arg = new EMW.EventArgument(v);
                    arg.FromUser = true;
                    searcher.OnChanged(arg);
                }
            });

            grid.OnPageChange(function (a) {
                if (a && a.Data) {
                    searcher.pageIndex = a.Data.PageIndex;
                    //  SearchData(searcher, pageIndex);
                    searcher.RefreshPageData();
                }
                searcher.OnPageChange(a);
            });
            var arg = new EMW.EventArgument(grid);
            searcher.OnCreateGrid(arg);
        }
    }

    var InitEvents = function (searcher) {
        var keyTimerID;
        var opts = searcher.options;
        var combo = searcher.combo;

        var cmbTextBox = combo.panel.find(">.combobox-input");
        cmbTextBox.on("keydown.Searcher", searcher, function (e) {
            var _this = e.data;
            switch (e.keyCode) {
                case 37: //left
                case 39: //right
                case 27: //Esc                    
                    return false;
                case 8://backspace
                    var v = _this.GetValue();
                    if (v) {
                        _this.combo.SetValue("", true);
                        _this.combo.SetText("");
                        _this.selectedRow = null
                        _this.OnChanged(new EMW.EventArgument(""));
                    }
                    break;
                case 38: //up
                case 40: //down
                    if (_this.datagrid) _this.datagrid.panel.focus();
                    return false;
                case 13: //enter
                    _this.SearchKey = _this.GetText();
                    SearchData(_this, 1);
                    return false;
                default:
                    return;
            }
        });

        cmbTextBox.on("keyup.Searcher", searcher, function (e) {
            var _this = e.data;
            switch (e.keyCode) {
                case 37: //left
                case 39: //right
                case 27: //Esc    
                case 38: //up
                case 40: //down                
                    //return false;
                    break;
                default:
                    if (!_this.options.dataKey) {
                        _this.SearchKey = _this.GetText();
                        SearchData(_this, 1);
                    }
                    return;
            }
        });
    }

    var SearchData = function (searcher, pageIndex, cb) {
        var opts = searcher.options;
        var grid = searcher.datagrid;
        var combo = searcher.combo;
        var keyword = searcher.SearchKey;
        combo.ShowDropPanel();

        var filterFields = opts.filterFields;

        if (opts.dataKey) {//通过键值后台查询数据
            if (!searcher._IsLoading) {
                searcher._IsLoading = true;
                var pageSize = opts.pageSize;
                var start = (pageIndex - 1) * pageSize;
                var end = start + pageSize;
                searcher.pageIndex = pageIndex;
                //key,start,end,args,cb
                EMW.API.UserData.SearchSource(opts.dataKey, start, end, filterFields, keyword, opts.parameters, function (data) {
                    searcher.BindDataByDataTable(data);
                    searcher._IsLoading = false;
                    if ($.isFunction(cb)) {
                        cb();
                    }
                });
            }
        }
        else {//本地查询
            var localData = searcher.LocalData;
            if (localData && localData.length > 0) {
                var cols = opts.columns[0];
                var rows = keyword ? localData.Where(function (row) {
                    for (var i = 0; i < filterFields.length; i++) {
                        var field = filterFields[i];
                        if ((row[field] + "").Contains(keyword, true)) {
                            return true;
                        }
                    }
                    return false;
                }) : localData;
                searcher.BindData(rows, false);
                cb && cb(rows);
            }
            else {
                cb && cb();
            }
        }
    }

    Searcher.prototype.BindData = function (data, replaceLocalData) {
        var ds = data || [];
        var maxRow = 0;
        if (ds.MaxRow != undefined) {
            maxRow = ds.MaxRow;
            ds = Z.ParseData(ds).Rows;
        } else {
            maxRow = data.length;
        }
        if (!this.options.dataKey) {//本地数据
            if (replaceLocalData !== false) {
                this.LocalData = ds;
            }
        }
        if (this.datagrid) {
            if (!this.options.dataKey) {
                this.pageIndex = 1;
                this.pageCount = Math.ceil(maxRow / this.options.pageSize);
                var s = (this.pageIndex - 1) * this.options.pageSize;
                var e = this.pageIndex * this.options.pageSize;
                var pageData = ds.Take(s, e);
                this.datagrid.BindData(pageData);
            } else {
                if (this.pageIndex == 1) {
                    this.pageCount = Math.ceil(maxRow / this.options.pageSize);
                }
                this.datagrid.BindData(ds);
            }
            if (this.combo.options.multiple && this.selectedRow) {
                var selRow = this.selectedRow["ID"];
                if (selRow) {
                    if (selRow.indexOf(",") > -1) {
                        selRow = this.selectedRow["ID"].split(",");
                    }
                    this.datagrid.SelectRowByID(selRow, true);
                }
            }
            if (this.pageIndex == 1) {
                this.datagrid.RefreshPager({
                    pageIndex: this.pageIndex,
                    pageCount: this.pageCount
                });
            }


        }


    }
    Searcher.prototype.BindDataByDataTable = function (data, replaceLocalData) {
        this.BindData(data, replaceLocalData);
    }

    Searcher.prototype.GetValue = function () {
        if (this.combo) {
            return this.combo.GetValue();
        }
    }

    Searcher.prototype.GetText = function () {
        if (this.combo) {
            return this.combo.GetText();
        }
    }
    Searcher.prototype.Disable = function () {
        this.combo.Disable();
    }

    Searcher.prototype.Enable = function () {
        this.combo.Enable();
    }
    Searcher.prototype.SetValue = function (v, disableChange) {
        if (this.combo) {
            var oldValue = this.GetValue();
            if (oldValue != v) {
                var opts = this.options;
                if (this.LocalData) {
                    var row = this.LocalData.First(function (x) {
                        return x[opts.valueField] == v;
                    });
                    this.selectedRow = row;
                    if (row) {
                        this.combo.SetValue(v, disableChange);
                        var txt = row[opts.textField];
                        this.combo.SetText(txt);
                        if (!disableChange) {
                            this.OnChanged(new EMW.EventArgument(v));
                        }
                    }
                    return;
                }
                if (!opts.dataKey) return;
                var _this = this;
                //去后台查文本                
                EMW.API.UserData.SearchItem(opts.dataKey, opts.valueField, v, opts.parameters, function (data) {
                    if (data && data.Rows && data.Rows.length > 0) {
                        if (_this.datagrid) {
                            _this.BindDataByDataTable(data);
                            _this.datagrid.SelectRowByIndex(0);
                        }
                        else {
                            var row = Z.ParseData(data).Rows[0];
                            _this.combo.SetValue(v, disableChange);
                            var txt = row[opts.textField];
                            _this.combo.SetText(txt);
                            _this.selectedRow = row;
                        }
                        if (!disableChange) {
                            _this.OnChanged(new EMW.EventArgument(v));
                        }
                    }
                });
            }
        }
    }

    Searcher.prototype.SetRow = function (row, disableChange) {
        if (this.selectedRow == row) return;
        this.selectedRow = row;
        var opts = this.options;
        if (row) {
            var val = row[opts.valueField]
            this.combo.SetValue(val, true);
            var txt = row[opts.textField];
            this.combo.SetText(txt);
            if (!disableChange) {
                this.OnChanged(new EMW.EventArgument(val));
            }
        } else {
            this.combo.SetValue(null);
            this.combo.SetText(null);
        }
    }

    Searcher.prototype.Clear = function () {
        this.combo.SetValue("", true);
        this.combo.SetText("");
        this.combo.isFirstShowPanel = true;
        this.selectedRow = null;
        if (this.datagrid) {
            this.datagrid.ClearSelection();
        }

    }
    Searcher.prototype.HideDropPanel = function () {
        if (this.combo) {
            this.combo.HideDropPanel();
        }
    }

    Searcher.prototype.GetSelected = function () {
        return this.selectedRow;
    }
    Searcher.prototype.SetParameters = function (p) {
        this.options.parameters = p;
        this.Clear();
    }
    Searcher.prototype.RefreshPageData = function (opts) {
        /// <param name="opts" type="object">{pageCount:总页数, pageIndex:当前也索引(1开始)}</param>
        //在PAGE更改后调用
        if (this.datagrid) {
            var ds = this.LocalData;
            var cols = this.options.columns[0];
            var keyword = this.SearchKey;
            var filterFields = this.options.filterFields;
            var ds = keyword ? this.LocalData.Where(function (row) {
                for (var i = 0; i < filterFields.length; i++) {
                    var field = filterFields[i];
                    if ((row[field] + "").Contains(keyword, true)) {
                        return true;
                    }
                }
                return false;
            }) : this.LocalData;
            if (ds) {
                var s = (this.pageIndex - 1) * this.options.pageSize;
                var e = this.pageIndex * this.options.pageSize;
                var pageData = ds.Take(s, e);
                this.datagrid.BindData(pageData);
            } else {
                SearchData(this, this.pageIndex);
            }
        }
    }

    $.fn.Searcher.defaults = $.extend({
    }, $.fn.Combobox.defaults, {
        multiple: false,
        separator: ",",
        editable: true,
        disabled: false,
        readonly: false,
        pageSize: 20,
        panelHeight: 250,
        parameters: []
    });

    EMW.UI.RightPanel = {
        IsShow: false,
        IsInit: false,
        Init: function () {
            if (this.IsInit) return;
            this.IsInit = true;
            this.Element = $(".right-panel");
            if (!this.Element.length) {
                this.Element = $('<div class="right-panel"  style="display:none;"><div class="right-panel-header"><div class="panel-tool"></div><span class="right-panel-title">' +
                    '标题</span></div><div class="right-panel-content"></div></div>');
                if (false && window.frameElement) {
                    this.IsFloat = true;
                    this.Element.appendTo($(window.frameElement).closest(".emw-window"));
                } else {
                    this.Element.appendTo(document.body);
                }
                //this.Shadow = $('<div class="right-panel-backdrop"></div>').bind("click", function () {
                //    EMW.UI.RightPanel.Close();
                //}).appendTo(document.body);
                $(document.body).click(function (e) {
                    if ($(e.target).closest(".right-panel").length) return;
                    if (!$(e.target).closest("body").length) return;
                    EMW.UI.RightPanel.Close(true);
                });
            }
            this.Element.on("click", ".panel-tool-item", function () {
                var index = parseInt($(this).attr("index"));
                var tool = EMW.UI.RightPanel.Options.Tools[index];
                if (!tool) return;
                tool.OnClick && tool.OnClick(tool, this);
            }).on("click", ".panel-Pin", function () {
                if ($(this).hasClass("Pin")) {
                    $(this).removeClass("Pin");
                    EMW.UI.RightPanel.Fix = false;
                    //$(".right-panel-backdrop").show();
                } else {
                    $(this).addClass("Pin");
                    EMW.UI.RightPanel.Fix = true;
                    // $(".right-panel-backdrop").hide();
                }
            });
        },
        Close: function (isok) {
            var $this = EMW.UI.RightPanel;
            if (!$this.Options || this.IsOpening) return;
            if (isok) {
                if ($this.Options.Url) {
                    if ($this.Options.OnBeforeOK) {
                        var returnValue = $this.Options.OnBeforeOK();
                        if (returnValue == false) return;
                    }
                }
                if (this.Options.OnClose) {
                    if (this.Options.OnClose(isok, this.Options.ReturnValue) == false) return;
                }
            }
            $this.Hide();
        },
        Toggle: function (opts) {
            this.Init();
            if (this.IsShow) {
                this.Hide();
            } else {
                this.Show(opts);
            }
        },
        ShowTools: function (tools) {
            tools = tools || [];
            //拆分分组的工具
            for (var i = 0; i < tools.length; i++) {
                if (tools[i].menu) {
                    var items = tools[i].menu.items;
                    if (items) {
                        tools.splice(i, 1);
                        for (var j = 0; j < items.length; j++) {
                            tools.push(items[j]);
                        }
                    }
                }
            }
            if (this.Options.OnOK || this.Options.ShowOk) {
                tools.push({ icon: "action_done", text: "确认", OnClick: EMW.UI.RightPanel.Close.bind(this, true) });
            }
            var html = [];
            html.push("<span class='glyphicon panel-Pin icon-pin " + (this.Fix ? "Pin" : "") + "' title='图钉'></span>");
            for (var i = 0; i < tools.length; i++) {
                var item = tools[i];
                var ShowDefault = item.ShowDefault ? item.ShowDefault : "";
                html.push("<span index='" + i + "' class='glyphicon icon-" + item.icon + " panel-tool-item' title='" + item.text + "' " + ShowDefault + "></span>");
            }
            this.Element.find(".panel-tool").show().html(html.join(""));
            this.Options.Tools = tools;
        },
        Show: function (opts) {
            if (window != window.top) {
                top.EMW.UI.RightPanel.Close();
            }
            this.Init();
            if (!opts.Url && !opts.Content) return;
            if (this.IsShow && !this.Fix) {
                if (opts.Url) {
                    if (opts.Url == this.Options.Url) {
                        var frame = this.Options.Frame;
                        if (frame && frame.contentWindow && frame.contentWindow.Refresh) {
                            for (var key in opts) {
                                this.Options[key] = opts[key];
                            }
                            frame.contentWindow.Refresh();
                            return;
                        }
                    }
                }
                this.Hide(opts);
            } else {
                var elem = this.Element;
                this.Options = opts;
                this.Options.OpenerWindow = window;
                this.Options.Close = this.Hide.bind(this);
                this.Options.ShowTools = this.ShowTools.bind(this);
                var content = opts.Content;
                var title = opts.Title;
                opts.Width = opts.Width || 500;
                if (opts.Url) {
                    this.Parent = null;
                    this.Content = null;
                    if (opts.IsHold) {
                        this.Options.Frame = elem.find(".right-panel-content>iframe[src='" + opts.Url + "']").show()[0];
                    }
                    if (!this.Options.Frame) {
                        this.Options.Frame = AddIFrame(elem.find(".right-panel-content"), { src: opts.Url }, opts, function (e) {
                            var win = e.contentWindow;
                            if (win && win.GetPanelTools) {
                                this.ShowTools(win.GetPanelTools() || []);
                            }
                        }.bind(this), true)[0];
                    }
                } else {
                    this.Options.Parent = content.parent();
                    this.ShowTools(this.Options.Tools);
                    elem.find(".right-panel-content").append(content.show());
                }
                if (this.Options.StyleAttr != undefined && this.Options.StyleAttr != "")
                    for (var a = 0; a < this.Options.StyleAttr.length; a++)
                        elem.find(".right-panel-content").css(this.Options.StyleAttr[a], opts.StyleValue[a]);
                else
                    elem.find(".right-panel-content").attr("style", "");
                elem.find(".right-panel-title").html(title);
                if (!this.IsShow) {
                    this.IsShow = true;
                    elem.css({ width: opts.Width, right: -opts.Width });
                    elem.show();
                    this.IsOpening = true;
                    elem.animate({ right: 0 }, "fast", function () {
                        EMW.UI.RightPanel.IsOpening = false;
                        opts.callFn && typeof (opts.callFn) == "function" && opts.callFn();
                    });
                }
            }
        },
        Hide: function (opts) {
            if (!this.Options || this.IsOpening) return;
            this.LastOPTS = opts;
            if (this.Closing) return;
            var elem = this.Element;
            this.Closing = true;
            elem.animate({ right: -this.Options.Width }, "fast", function () {
                this.Closing = false;
                elem.hide();
                var old_opts = this.Options;
                this.Options = null;
                if (old_opts.Content && old_opts.Parent) {
                    old_opts.Parent.append(old_opts.Content.hide());
                } else {
                    if (!old_opts.IsHold) {
                        if (old_opts.Content) {
                            old_opts.Content.remove();
                        } else {
                            $(old_opts.Frame).remove();
                        }
                    } else {
                        elem.find(".right-panel-content").children().hide();
                    }
                }
                if (old_opts.Frame) {
                    old_opts.Frame["param0"] = null;
                    old_opts.Frame = null;
                }
                old_opts.OpenerWindow = null;
                old_opts.Close = null;
                this.IsShow = false;

                if (old_opts.OnClosed) {
                    old_opts.OnClosed(old_opts.ReturnValue);
                }

                if (this.LastOPTS && $.isPlainObject(this.LastOPTS)) this.Show(this.LastOPTS);
            }.bind(this));
        }
    }
    function Switch(elem, opts) {
        this.Options = $.extend({
            OnText: "ON",
            OffText: "OFF",
        }, opts);
        this.Element = elem;
        this.Init();
    }
    EMW.UI.Switch = Switch;
    EMW.UI.AddControl("Switch");
    Switch.prototype.Init = function () {

        this.Element.html('<span class="option on-option">' + this.Options.OnText + '</span><span class="option off-option">' + this.Options.OffText + '</span><span class="switch-target"></span>');
        this.Element.on("click", this.Click.bind(this));
    }
    Switch.prototype.Click = function () {
        if (this.Options.OnClick && this.Options.OnClick(this, this.Element.is(".on")) != false) {
            this.Element.toggleClass("on");
        }
    }
    Switch.prototype.SetValue = function (v) {
        var oldval = this.Element.is(".on");
        if (v == oldval) return;
        this.Element.toggleClass("on");
    }
    Switch.prototype.GetValue = function (v) {
        return this.Element.is(".on");
    }

    var Map = function (elem, opts) {
        this.Element = elem;
        if (!$("#__map_css").length) {
            $(' <link rel="stylesheet" id="__map_css" href="http://cache.amap.com/lbs/static/main1119.css" />').appendTo("head");
            // $('<script type="text/javascript" src=""></script>').appendTo("head").on("load",this.Init.bind(this));
            $.getScript('http://webapi.amap.com/maps?v=1.3&key=72081bd75e4aff883d857154583ad8a8&plugin=AMap.Transfer,AMap.CitySearch,AMap.Driving,AMap.Walking,AMap.Autocomplete,AMap.PlaceSearch', this.Init.bind(this))
        } else {
            this.Init();
        }
        this.IsMul = false;
        this.IsMarking = false;
        this.Markers = [];

    }
    Map.prototype.Init = function () {
        this.MapControl = new AMap.Map(this.Element.attr("id"), {
            resizeEnable: true,
            center: [114.032013, 22.607043],//地图中心点
            zoom: 13 //地图显示缩放级别
        });
        AMap.event.addListener(this.MapControl, "click", this.OnClick.bind(this));
        if (this._tempstr) {
            this.SetPoint(this._tempstr);
            this._tempstr = null;
        }
        var html = [];
        html.push("<div class='map-tool'>");
        html.push("<span class='glyphicon icon-maps_add_location map-tool-item' action='add' title='添加标记'></span>");
        html.push("</div>");
        $(html.join("")).appendTo(this.Element).on("click", ".map-tool-item", this.ToolCommand.bind(this));
    }
    Map.prototype.OnClick = function (e) {
        if (!this.IsMarking) return;
        var gd_mark = new AMap.Marker({
            position: e.lnglat,
            offset: new AMap.Pixel(14, 7),
            map: this.MapControl
        });
        //console.log(e.lnglat);
        this.MapControl.panTo(e.lnglat);
        if (!this.IsMul) {//清除前面的标记点
            for (var i = 0; i < this.Markers.length; i++) {
                this.Markers[i].setMap(null);
            }
            this.Markers.length = 0;
            this.MapControl.setDefaultCursor();//还原鼠标样式
            this.IsMarking = false;
        }
        this.Markers.push(gd_mark);
    }
    Map.prototype.ToolCommand = function (e) {
        var cmd = $(e.target).attr("action");
        if (cmd == "add") {
            if (this.IsMarking) {
                this.IsMarking = false;
                this.MapControl.setDefaultCursor();
            } else {
                this.IsMarking = true;
                this.MapControl.setDefaultCursor("url('../Images/icomark.cur'),pointer");
            }

        }
    }
    Map.prototype.SetPoint = function (str) {
        var axis_arr = str.split(";");
        if (!this.MapControl) {
            this._tempstr = str;
            return;
        }
        this.MapControl.clearMap();
        for (var i = 0; i < axis_arr.length; i++) {
            var temparr = axis_arr[i].split(",");
            this.Markers.push(new AMap.Marker({
                position: temparr,
                map: this.MapControl
            }));
        }
        this.MapControl.setFitView();
    }

    Map.prototype.GetPoint = function () {
        var str = [];
        for (var i = 0; i < this.Markers.length; i++) {
            var p = this.Markers[i].getPosition();
            str.push(p.lng + "," + p.lat);
        }
        return str.join(";");
    }
    //按用户计算路径 
    Map.prototype.PlanPath = function (user1, user2) {

        var driving = new AMap.Driving({
            map: this.MapControl,
            panel: 'panel'
        });
        if (user1.isInChinese() || user2.isInChinese()) {
            driving.search([{ keyword: user1 }, { keyword: user2 }]);
        } else {
            var temp_useraxis1 = user1.split(",");
            var temp_useraxis2 = user2.split(",");
            driving.search(new AMap.LngLat(temp_useraxis1[0], temp_useraxis1[1]), new AMap.LngLat(temp_useraxis2[0], temp_useraxis2[1]));
        }
    }
    EMW.UI.Map = Map;
    EMW.UI.AddControl("Map");
})(jQuery);

//滑动块-start
!function (a) {
    var b, c, d, e, f, g, h, i, j, k = { setNakedBarDelta: function (a, b) { if ("stickToSides" === a) j = { toEndWidth: b, toBeginLeft: 0, toBeginWidth: b }; else { if ("middle" !== a) throw new Error("unknown position of setNakedBarDelta: " + a); j = { toEndWidth: b / 2, toBeginLeft: b / 2, toBeginWidth: b / 2 } } }, getSliderValuesAtPositionPx: function (a, b) { var c, d, e = this, f = e.data("pixel_to_value_mapping"); if ("undefined" != typeof f) c = f(a), d = f(b); else { var g = k.getSliderWidthPx.call(e) - e.data("left_grip_width"); c = k.inverse_rangemap_0_to_n.call(e, a, g), d = k.inverse_rangemap_0_to_n.call(e, b, g) } return [c, d] }, validateAndMoveGripsToPx: function (a, b) { var c = this, d = k.getSliderWidthPx.call(c) - c.data("left_grip_width"); if (d >= b && a >= 0 && d >= a && (!c.data("has_right_grip") || b >= a)) { var e = c.data("cur_min"), f = c.data("cur_max"); k.set_position_from_px.call(c, a, b), k.refresh_grips_style.call(c), k.notify_changed_implicit.call(c, "drag_move", e, f) } return c }, updateAriaAttributes: function () { var a = this, b = a.data("settings"), c = a.find(b.left_grip_selector); if (a.data("has_right_grip")) { var d = a.find(b.right_grip_selector); c.attr("aria-valuemin", a.data("range_min")).attr("aria-valuenow", l.get_current_min_value.call(a)).attr("aria-valuemax", l.get_current_max_value.call(a)), d.attr("aria-valuemin", l.get_current_min_value.call(a)).attr("aria-valuenow", l.get_current_max_value.call(a)).attr("aria-valuemax", a.data("range_max")) } else c.attr("aria-valuemin", a.data("range_min")).attr("aria-valuenow", l.get_current_min_value.call(a)).attr("aria-valuemax", a.data("range_max")); return a }, getSliderWidthPx: function () { var a = this; return Math.round(a.width()) }, getGripPositionPx: function (a) { return parseInt(a.css("left").replace("px", ""), 10) }, getLeftGripPositionPx: function () { var a = this, b = a.data("settings"), c = a.find(b.left_grip_selector); return k.getGripPositionPx.call(a, c) }, getRightGripPositionPx: function () { var a = this, b = a.data("settings"); if (a.data("has_right_grip")) return k.getGripPositionPx.call(a, a.find(b.right_grip_selector)); var c = k.getSliderWidthPx.call(a) - a.data("left_grip_width"); return k.rangemap_0_to_n.call(a, a.data("cur_max"), c) }, getLeftGripWidth: function () { var a = this, b = a.data("settings"), c = a.find(b.left_grip_selector); return Math.round(c.outerWidth()) }, getRightGripWidth: function () { var a = this, b = a.data("settings"), c = a.find(b.right_grip_selector); return Math.round(c.outerWidth()) }, binarySearchValueToPxCompareFunc: function (b, c, d) { return b === c[d] ? 0 : b < c[d] && 0 === d ? 0 : c[d - 1] <= b && b < c[d] ? 0 : b > c[d] ? 1 : b <= c[d - 1] ? -1 : void a.error("cannot compare s: " + b + " with a[" + d + "]. a is: " + c.join(",")) }, binarySearch: function (a, b, c, d) { for (var e, f, g = 0, h = a.length - 1; h >= g;) { e = (g + h) / 2 | 0, f = c(a, e); var i = d(b, a, e); if (i > 0) g = e + 1; else { if (!(0 > i)) return e; h = e - 1 } } return -1 }, haveLimits: function () { var a = this, b = a.data("lower-limit"), c = a.data("upper-limit"), d = !1; return "undefined" != typeof b && "undefined" != typeof c && (d = !0), d }, refresh_grips_style: function () { var a = this, b = a.data("settings"); if ("undefined" != typeof b.highlight) { var c = a.data("highlightedRangeMin"); if ("undefined" != typeof c) { var d = a.find(b.left_grip_selector), e = a.find(b.right_grip_selector), f = a.data("highlightedRangeMax"), g = a.data("cur_min"), h = a.data("cur_max"), i = b.highlight.grip_class; c > g || g > f ? d.removeClass(i) : d.addClass(i), c > h || h > f ? e.removeClass(i) : e.addClass(i) } } }, set_position_from_val: function (a, b) { var c = this, d = c.data("range_min"), e = c.data("range_max"); d > a && (a = d), a > e && (a = e), c.data("has_right_grip") ? (b > e && (b = e), d > b && (b = d)) : b = c.data("cur_max"); var f = l.value_to_px.call(c, a), g = l.value_to_px.call(c, b); return k.set_handles_at_px.call(c, f, g), c.data("cur_min", a), c.data("has_right_grip") && c.data("cur_max", b), c }, set_position_from_px: function (a, b) { var c = this; k.set_handles_at_px.call(c, a, b); var d = k.getSliderValuesAtPositionPx.call(c, a, b), e = d[0], f = d[1]; return c.data("cur_min", e), c.data("has_right_grip") && c.data("cur_max", f), c }, set_handles_at_px: function (a, b) { var c = this, d = c.data("settings"), e = d.left_grip_selector, f = d.right_grip_selector, g = d.value_bar_selector, h = c.data("left_grip_width"); return c.find(e).css("left", a + "px"), c.find(f).css("left", b + "px"), c.data("has_right_grip") ? c.find(g).css("left", a + "px").css("width", b - a + h + "px") : (j || k.populateNakedBarDeltas.call(c, a, b, h), b > a ? c.find(g).css("left", a + "px").css("width", b - a + j.toEndWidth + "px") : c.find(g).css("left", b + j.toBeginLeft + "px").css("width", a - b + j.toBeginWidth + "px")), c }, drag_start_func_touch: function (a, b, c, e, f) { var g = this, h = a.originalEvent, i = h.touches[0], j = i.pageY, l = i.pageX, m = Math.abs(g.offset().top - j), n = g.offset().left, o = n - l, p = l - (n + g.width()); m > b.touch_tolerance_value_bar_y || o > b.touch_tolerance_value_bar_x || p > b.touch_tolerance_value_bar_x || (h.preventDefault(), d = i.pageX, k.drag_start_func.call(g, i, b, c, e, f)) }, drag_start_func: function (d, f, g, h, i) { var j = this; if (j.find(f.left_grip_selector + "," + f.value_bar_selector + "," + f.right_grip_selector).removeClass(f.animating_css_class), l.is_enabled.call(j)) { var m = a(d.target), n = !1; if ("object" == typeof f.highlight && (n = m.is(f.highlight.panel_selector)), i !== !1 || m.is(f.left_grip_selector) || m.is(f.right_grip_selector) || m.is(f.value_bar_selector) || n || m.is(j)) { b = j; var o, p, q, r, s, t, u = k.getGripPositionPx.call(j, g), v = k.getSliderWidthPx.call(j) - j.data("left_grip_width"), w = g.offset().left, x = k.getRightGripPositionPx.call(j); p = Math.round(d.pageX) - j.data("left_grip_width") / 2, q = Math.abs(w - p), s = p - w, j.data("has_right_grip") ? (o = h.offset().left, r = Math.abs(o - p), t = p - o) : (r = 2 * q, t = 2 * s), f.user_drag_start_callback.call(j, d), q === r ? w > p ? (u += s, e = !0) : (x += t, e = !1) : r > q ? (u += s, e = !0) : (x += t, e = !1), j.data("has_right_grip") ? x > v && (x = v) : u > v && (u = v), 0 > u && (u = 0), c = !0; var y = j.data("cur_min"), z = j.data("cur_max"); k.set_position_from_px.call(j, u, x), k.refresh_grips_style.call(j), k.notify_changed_implicit.call(j, "drag_start", y, z), "[object Touch]" !== Object.prototype.toString.apply(d) && d.preventDefault() } } }, drag_move_func_touch: function (a) { if (c === !0) { var b = a.originalEvent; b.preventDefault(); var d = b.touches[0]; k.drag_move_func(d) } }, drag_move_func: function (a) { if (c) { var f = b, g = f.data("settings"), h = k.getSliderWidthPx.call(f) - f.data("left_grip_width"), i = k.getLeftGripPositionPx.call(f), j = k.getRightGripPositionPx.call(f), l = Math.round(a.pageX), m = l - d, n = f.data("left_grip_width") / 2, o = f.offset().left + f.data("left_grip_width") - n, p = o + h; g.crossable_handles === !1 && f.data("has_right_grip") && (e ? p = o + j : o += i); var q = 0, r = 0; o > l && (q = 1, r = 0), l > p && (r = 1, q = 0), g.crossable_handles === !0 && f.data("has_right_grip") && (e ? h >= j && i + m > j && (e = !1, i = j) : i >= 0 && i > j + m && (e = !0, j = i)); var s = i, t = j; (m > 0 && !q || 0 > m && !r) && (e ? s += m : t += m), k.validateAndMoveGripsToPx.call(f, s, t), d = l, "[object Touch]" !== Object.prototype.toString.apply(a) && a.preventDefault() } }, drag_end_func_touch: function (a) { var b = a.originalEvent; b.preventDefault(); var c = b.touches[0]; k.drag_end_func(c) }, drag_end_func: function () { var a = b; if ("undefined" != typeof a) { c = !1, d = void 0, k.notify_mouse_up_implicit.call(a, e), b = void 0; var f = a.data("settings"); a.find(f.left_grip_selector + "," + f.value_bar_selector + "," + f.right_grip_selector).addClass(f.animating_css_class) } }, get_rounding_for_value: function (a) { var b = this, c = b.data("rounding"), d = b.data("rounding_ranges"); if ("object" == typeof d) { var e = k.binarySearch.call(b, d, a, function (a, b) { return a[b].range }, function (a, b, c) { return a < b[c].range ? c > 0 ? a >= b[c - 1].range ? 0 : -1 : 0 : 1 }); if (c = 1, e > -1) c = parseInt(d[e].value, 10); else { var f = d.length - 1; a >= d[f].range && (c = d[f].value) } } return c }, notify_mouse_up_implicit: function (a) { var b = this, c = l.get_current_min_value.call(b), d = l.get_current_max_value.call(b), e = !1; (b.data("beforestart_min") !== c || b.data("beforestart_max") !== d) && (e = !0, b.data("beforestart_min", c), b.data("beforestart_max", d)); var f = b.data("settings"); return f.user_mouseup_callback.call(b, l.get_current_min_value.call(b), l.get_current_max_value.call(b), a, e), b }, notify_changed_implicit: function (a, b, c) { var d = this, e = !1; ("init" === a || "refresh" === a) && (e = !0); var f = l.get_current_min_value.call(d), g = l.get_current_max_value.call(d); return e || (b = l.round_value_according_to_rounding.call(d, b), c = l.round_value_according_to_rounding.call(d, c)), (e || f !== b || g !== c) && (k.notify_changed_explicit.call(d, a, b, c, f, g), e = 1), e }, notify_changed_explicit: function (a, b, c, d, e) { var f = this, g = f.data("settings"); return f.data("aria_enabled") && k.updateAriaAttributes.call(f), g.value_changed_callback.call(f, a, d, e, b, c), f }, validate_params: function (b) { var c = this, d = c.data("range_min"), e = c.data("range_max"), f = c.data("cur_min"), g = c.data("lower-limit"), h = c.data("upper-limit"), i = k.haveLimits.call(c); "undefined" == typeof d && a.error("the data-range_min attribute was not defined"), "undefined" == typeof e && a.error("the data-range_max attribute was not defined"), "undefined" == typeof f && a.error("the data-cur_min attribute must be defined"), d > e && a.error("Invalid input parameter. must be min < max"), i && g > h && a.error("Invalid data-lower-limit or data-upper-limit"), 0 === c.find(b.left_grip_selector).length && a.error("Cannot find element pointed by left_grip_selector: " + b.left_grip_selector), "undefined" != typeof b.right_grip_selector && 0 === c.find(b.right_grip_selector).length && a.error("Cannot find element pointed by right_grip_selector: " + b.right_grip_selector), "undefined" != typeof b.value_bar_selector && 0 === c.find(b.value_bar_selector).length && a.error("Cannot find element pointed by value_bar_selector" + b.value_bar_selector) }, rangemap_0_to_n: function (a, b) { var c = this, d = c.data("range_min"), e = c.data("range_max"); return d >= a ? 0 : a >= e ? b : Math.floor((b * a - b * d) / (e - d)) }, inverse_rangemap_0_to_n: function (a, b) { var c = this, d = c.data("range_min"), e = c.data("range_max"); if (0 >= a) return d; if (a >= b) return e; var f = (e - d) * a / b; return f + d } }, l = { teardown: function () { var b = this; return b.removeData(), a(document).unbind("mousemove.nstSlider").unbind("mouseup.nstSlider"), b.parent().unbind("mousedown.nstSlider").unbind("touchstart.nstSlider").unbind("touchmove.nstSlider").unbind("touchend.nstSlider"), b.unbind("keydown.nstSlider").unbind("keyup.nstSlider"), b }, init: function (b) { var c = a.extend({ animating_css_class: "nst-animating", touch_tolerance_value_bar_y: 30, touch_tolerance_value_bar_x: 15, left_grip_selector: ".nst-slider-grip-left", right_grip_selector: void 0, highlight: void 0, rounding: void 0, value_bar_selector: void 0, crossable_handles: !0, value_changed_callback: function () { }, user_mouseup_callback: function () { }, user_drag_start_callback: function () { } }, b), d = a(document); return d.unbind("mouseup.nstSlider"), d.unbind("mousemove.nstSlider"), d.bind("mousemove.nstSlider", k.drag_move_func), d.bind("mouseup.nstSlider", k.drag_end_func), this.each(function () { var b = a(this), d = b.parent(); b.data("enabled", !0); var j = b.data("range_min"), m = b.data("range_max"), n = b.data("cur_min"), o = b.data("cur_max"); "undefined" == typeof o && (o = n), "" === j && (j = 0), "" === m && (m = 0), "" === n && (n = 0), "" === o && (o = 0), b.data("range_min", j), b.data("range_max", m), b.data("cur_min", n), b.data("cur_max", o), k.validate_params.call(b, c), b.data("settings", c), "undefined" != typeof c.rounding ? l.set_rounding.call(b, c.rounding) : "undefined" != typeof b.data("rounding") ? l.set_rounding.call(b, b.data("rounding")) : l.set_rounding.call(b, 1); var p = b.find(c.left_grip_selector)[0], q = a(p), r = a(b.find(c.right_grip_selector)[0]); "undefined" == typeof q.attr("tabindex") && q.attr("tabindex", 0); var s = !1; b.find(c.right_grip_selector).length > 0 && (s = !0, "undefined" == typeof r.attr("tabindex") && r.attr("tabindex", 0)), b.data("has_right_grip", s), b.data("aria_enabled") === !0 && (q.attr("role", "slider").attr("aria-disabled", "false"), s && r.attr("role", "slider").attr("aria-disabled", "false")), b.bind("keyup.nstSlider", function (a) { if (b.data("enabled")) { switch (a.which) { case 37: case 38: case 39: case 40: if (f === h) { var c, d, j, m = k.getSliderWidthPx.call(b); if (0 > g - i) { for (d = i; m >= d; d++) if (c = l.round_value_according_to_rounding.call(b, k.getSliderValuesAtPositionPx.call(b, d, d)[1]), c !== h) { j = d; break } } else for (d = i; d >= 0; d--) if (c = l.round_value_according_to_rounding.call(b, k.getSliderValuesAtPositionPx.call(b, d, d)[1]), c !== h) { j = d; break } e ? k.validateAndMoveGripsToPx.call(b, j, k.getRightGripPositionPx.call(b)) : k.validateAndMoveGripsToPx.call(b, k.getLeftGripPositionPx.call(b), j), k.notify_mouse_up_implicit.call(b, e) } } f = void 0, g = void 0, h = void 0, i = void 0 } }), b.bind("keydown.nstSlider", function (a) { if (b.data("enabled")) { var c = function (a, c) { var d = k.getLeftGripPositionPx.call(b), j = k.getRightGripPositionPx.call(b); switch ("undefined" == typeof f && (g = e ? d : j, f = e ? l.get_current_min_value.call(b) : l.get_current_max_value.call(b)), c.which) { case 37: case 40: e ? d-- : j--, c.preventDefault(); break; case 38: case 39: e ? d++ : j++, c.preventDefault() } i = e ? d : j, k.validateAndMoveGripsToPx.call(b, d, j), h = e ? l.get_current_min_value.call(b) : l.get_current_max_value.call(b) }; s && b.find(":focus").is(r) ? (e = !1, c.call(b, r, a)) : (e = !0, c.call(b, q, a)) } }); var t = k.getLeftGripWidth.call(b), u = s ? k.getRightGripWidth.call(b) : t; if (b.data("left_grip_width", t), b.data("right_grip_width", u), b.data("value_bar_selector", c.value_bar_selector), !s) { var v = o === m || o === j; k.setNakedBarDelta.call(b, v ? "stickToSides" : "middle", t) } j === m || n === o ? l.set_range.call(b, j, m) : k.set_position_from_val.call(b, b.data("cur_min"), b.data("cur_max")), k.notify_changed_implicit.call(b, "init"), b.data("beforestart_min", l.get_current_min_value.call(b)), b.data("beforestart_max", l.get_current_max_value.call(b)), b.bind("mousedown.nstSlider", function (a) { k.drag_start_func.call(b, a, c, q, r, !1) }), d.bind("touchstart.nstSlider", function (a) { k.drag_start_func_touch.call(b, a, c, q, r, !0) }), d.bind("touchend.nstSlider", function (a) { k.drag_end_func_touch.call(b, a) }), d.on("touchmove.nstSlider", function (a) { k.drag_move_func_touch.call(b, a) }); var w = b.data("histogram"); "undefined" != typeof w && l.set_step_histogram.call(b, w) }) }, get_range_min: function () { var a = this; return a.data("range_min") }, get_range_max: function () { var a = this; return a.data("range_max") }, get_current_min_value: function () { var b, c = a(this), d = l.get_range_min.call(c), e = l.get_range_max.call(c), f = c.data("cur_min"); if (b = d >= f ? d : l.round_value_according_to_rounding.call(c, f), k.haveLimits.call(c)) { if (d >= b) return c.data("lower-limit"); if (b >= e) return c.data("upper-limit") } else { if (d >= b) return d; if (b >= e) return e } return b }, get_current_max_value: function () { var b, c = a(this), d = l.get_range_min.call(c), e = l.get_range_max.call(c), f = c.data("cur_max"); if (b = f >= e ? e : l.round_value_according_to_rounding.call(c, f), k.haveLimits.call(c)) { if (b >= e) return c.data("upper-limit"); if (d >= b) return c.data("lower-limit") } else { if (b >= e) return e; if (d >= b) return d } return b }, is_handle_to_left_extreme: function () { var a = this; return k.haveLimits.call(a) ? a.data("lower-limit") === l.get_current_min_value.call(a) : l.get_range_min.call(a) === l.get_current_min_value.call(a) }, is_handle_to_right_extreme: function () { var a = this; return k.haveLimits.call(a) ? a.data("upper-limit") === l.get_current_max_value.call(a) : l.get_range_max.call(a) === l.get_current_max_value.call(a) }, refresh: function () { var a = this, b = a.data("last_step_histogram"); "undefined" != typeof b && l.set_step_histogram.call(a, b), k.set_position_from_val.call(a, l.get_current_min_value.call(a), l.get_current_max_value.call(a)); var c = a.data("highlightedRangeMin"); if ("number" == typeof c) { var d = a.data("highlightedRangeMax"); l.highlight_range.call(a, c, d) } return k.notify_changed_implicit.call(a, "refresh"), a }, disable: function () { var a = this, b = a.data("settings"); return a.data("enabled", !1).find(b.left_grip_selector).attr("aria-disabled", "true").end().find(b.right_grip_selector).attr("aria-disabled", "true"), a }, enable: function () { var a = this, b = a.data("settings"); return a.data("enabled", !0).find(b.left_grip_selector).attr("aria-disabled", "false").end().find(b.right_grip_selector).attr("aria-disabled", "false"), a }, is_enabled: function () { var a = this; return a.data("enabled") }, set_position: function (a, b) { var c = this, d = c.data("cur_min"), e = c.data("cur_max"); a > b ? k.set_position_from_val.call(c, b, a) : k.set_position_from_val.call(c, a, b), k.refresh_grips_style.call(c), k.notify_changed_implicit.call(c, "set_position", d, e), c.data("beforestart_min", a), c.data("beforestart_max", b) }, set_step_histogram: function (b) { var c = this; c.data("last_step_histogram", b), "undefined" == typeof b && (a.error("got an undefined histogram in set_step_histogram"), k.unset_step_histogram.call(c)); var d = k.getSliderWidthPx.call(c) - c.data("left_grip_width"), e = b.length; if (!(0 >= d)) { var f, g = 0; for (f = 0; e > f; f++) g += b[f]; if (0 === g) return l.unset_step_histogram.call(c), c; var h = parseFloat(g) / d; for (f = 0; e > f; f++) b[f] = b[f] / h; var i = [b[0]]; for (f = 1; e > f; f++) { var j = i[f - 1] + b[f]; i.push(j) } i.push(d); for (var m = [c.data("range_min")], n = 0, o = m[0], p = 0; d >= n;) { var q = parseInt(i.shift(), 10), r = k.inverse_rangemap_0_to_n.call(c, p + 1, e + 1); p++; var s = q - n, t = r - o; for (f = n; q > f; f++) { var u = o + t * (f - n + 1) / s; m.push(u), n++, o = u } if (n === d) break } m[m.length - 1] = c.data("range_max"); var v = function (a) { return m[parseInt(a, 10)] }, w = function (a) { var b = k.binarySearch.call(c, m, a, function (a, b) { return a[b] }, k.binarySearchValueToPxCompareFunc); return m[b] === a ? b : Math.abs(m[b - 1] - a) < Math.abs(m[b] - a) ? b - 1 : b }; return c.data("pixel_to_value_mapping", v), c.data("value_to_pixel_mapping", w), c } }, unset_step_histogram: function () { var a = this; return a.removeData("pixel_to_value_mapping"), a.removeData("value_to_pixel_mapping"), a.removeData("last_step_histogram"), a }, set_range: function (a, b) { var c = this, d = l.get_current_min_value.call(c), e = l.get_current_max_value.call(c); return c.data("range_min", a), c.data("range_max", b), k.set_position_from_val.call(c, d, e), k.notify_changed_implicit.call(c, "set_range", d, e), c }, highlight_range: function (b, c) { var d = this, e = d.data("settings"); "undefined" == typeof e.highlight && a.error('you cannot call highlight_range if you haven\' specified the "highlight" parameter in construction!'), b || (b = 0), c || (c = 0); var f = l.value_to_px.call(d, b), g = l.value_to_px.call(d, c), h = g - f + d.data("left_grip_width"), i = d.find(e.highlight.panel_selector); return i.css("left", f + "px"), i.css("width", h + "px"), d.data("highlightedRangeMin", b), d.data("highlightedRangeMax", c), k.refresh_grips_style.call(d), d }, set_rounding: function (b) { var c = this; "string" == typeof b && b.indexOf("{") > -1 && (b = a.parseJSON(b)), c.data("rounding", b); var d = []; if ("object" == typeof b) { var e; for (e in b) if (b.hasOwnProperty(e)) { var f = b[e]; d.push({ range: f, value: e }) } d.sort(function (a, b) { return a.range - b.range }), c.data("rounding_ranges", d) } else c.removeData("rounding_ranges"); return c }, get_rounding: function () { var a = this; return a.data("rounding") }, round_value_according_to_rounding: function (b) { var c = this, d = k.get_rounding_for_value.call(c, b); if (d > 0) { var e = b / d, f = parseInt(e, 10), g = e - f; g > .5 && f++; var h = f * d; return h } return a.error("rounding must be > 0, got " + d + " instead"), b }, value_to_px: function (a) { var b = this, c = b.data("value_to_pixel_mapping"); if ("undefined" != typeof c) return c(a); var d = k.getSliderWidthPx.call(b) - b.data("left_grip_width"); return k.rangemap_0_to_n.call(b, a, d) } }, m = "nstSlider"; a.fn[m] = function (b) { if (l[b]) { if (this.data("initialized") === !0) return l[b].apply(this, Array.prototype.slice.call(arguments, 1)); throw new Error("method " + b + " called on an uninitialized instance of " + m) } return "object" != typeof b && b ? void a.error("Cannot call method " + b) : (this.data("initialized", !0), l.init.apply(this, arguments)) }
}(jQuery);
//滑动块-end

/*数据源条件*/
(function ($) {
    EMW.UI.AddControl("ConditionEditor");

    EMW.UI.ConditionEditor = function (target, opts) {
        if (opts.addCls) {
            target.addClass(opts.addCls)
        }
        this.target = target;
        this.options = $.extend({}, $.fn.ConditionEditor.defaults, opts);
        this.Frame = Create(this);
        var events = ["OnLoad"];
        EMW.Event.On(this, events);
    };
    EMW.UI.ConditionEditor.prototype.GetCondition = function () {
        if (this.Frame && this.Frame.length) {
            var wind = this.Frame[0].contentWindow;
            return wind.GetConditions();
        }
    }
    EMW.UI.ConditionEditor.prototype.Refersh = function (opts) {
        if (this.Frame && this.Frame.length) {
            var frame = this.Frame[0];
            frame.params["param0"] = opts;
            frame.contentWindow.Refresh();
            return;
        }
    }
    EMW.UI.ConditionEditor.prototype.SetCondition = function (conds) {
        if (this.Frame && this.Frame.length) {
            var wind = this.Frame[0].contentWindow;
            return wind.SetCondition(conds);
        }
    }

    var OnLoad = function (o) {
        ShowHeader(this);
        InitEvents(this);
        this.OnLoad(new EMW.EventArgument(o));
    }

    var Create = function (editor) {
        var opts = editor.options;
        editor.target.addClass("cond-editor-panel");
        return AddIFrame(editor.target, {
            src: "/pages/Public/ConditionBuilder.html"
        }, opts, OnLoad.bind(editor));
    }

    var InitEvents = function (editor) {
        editor.toolPanel.on("click", ".tool-btn", editor, function (e) {
            var editor = e.data;
            var index = $(this).attr("data-index");
            if (index) {
                var tool = editor.Tools[index];
                if (tool && tool.OnClick) {
                    tool.OnClick.apply(this, [tool, e]);
                    return false;
                }
            }
        });
    }

    var ShowHeader = function (editor) {
        var header = editor.header = $("<div class='cond-editor-header'></div>");
        editor.target.prepend(header);

        editor.toolPanel = $("<div class='panel-tool'></div>");
        header.append(editor.toolPanel);

        var opts = editor.options;
        if (opts.title) {
            header.append("<h4 class='cond-editor-title'>" + opts.title + "</h4>");
        }

        if (!editor.Tools) {
            editor.Tools = [];
        }
        var frame = editor.Frame[0];
        var wind = frame.contentWindow;
        if (wind && wind.GetPanelTools) {
            editor.Tools = editor.Tools.concat(wind.GetPanelTools() || []);
        }
        var html = [];
        for (var i = 0; i < editor.Tools.length; i++) {
            var item = editor.Tools[i];
            html.push("<span data-index='" + i + "' class='tool-btn glyphicon icon-" + item.icon + " panel-tool-item' title='" + item.text + "' ></span>");
        }
        editor.toolPanel.prepend(html.join(""));
    }

    $.fn.ConditionEditor.defaults = {

    };

    EMW.UI.ConditionEditor.prototype.add_p = function (obj) {
        var p_box = $('<p id="input-unline"></p>');
        p_box.css({ 'transform-origin': event.offsetX + "px " + event.offsetY + "px" }).appendTo(obj);
        setTimeout(function () {
            remove_p(p_box.addClass('active'));
        }, 0)
    }
    function remove_p(box) {
        setTimeout(function () {
            box.remove()
        }, 350)
    }
})(jQuery);
