(function () {
    $.extend({
        addNamespace: function (name) {
            var names = name.split(".");
            var lastObj = window;
            for (var i = 0; i < names.length; i++) {
                var o = lastObj[names[i]];
                if (!o) {
                    o = {};
                    lastObj[names[i]] = o;
                }
                lastObj = o;
            }
            return lastObj;
        },
        logger: {
            log: function () {
                if (window && window.console) {
                    var args = arguments;
                    for (var i = 0; i < args.length; i++) {
                        console.log(args[i]);
                    }
                }
            },
            warn: function () {
                if (window && window.console) {
                    var args = arguments;
                    for (var i = 0; i < args.length; i++) {
                        console.warn(args[i]);
                    }
                }
            },
            error: function () {
                if (window && window.console) {
                    var args = arguments;
                    for (var i = 0; i < args.length; i++) {
                        console.error(args[i]);
                    }
                }
            }
        }
    });
    $.fn.onEnter = function (data, fn) {
        return this.off("keydown.emw").on("keydown.emw", function (e) {
            if (e.keyCode == 13) {
                return $(this).trigger("onEnter", e);
            }
        }).bind("onEnter", data, fn);
    }
})();
$.addNamespace("EMW.Const");
EMW.Const = {
    Json2Str: function (obj) {

        if (typeof obj == "object") {
            if (obj == undefined || obj == null) return "";
            return JSON.stringify(obj);
        }
        return obj;
    },
    Json2Str2: function (obj) {
        if (obj == undefined || obj == null) return "";
        return JSON.stringify(obj);
    },
    Date2Str: function (dt) {

        if (dt.valueOf) {
            return "\/Date(" + dt.valueOf() + ")\/";
        }
        return dt;
    },
    Str2Json: function (s) {
        if (s.substring(0, 1) != "{") {
            s = "{" + s + "}";
        }
        return (new Function("return " + s))();
    },
    Str2Json2: function (s) {
        return (new Function("return " + s))();
    },
    Str2XML: function (s) {
        //先转XML DOM，再转JQ对象
        var xmlDoc;
        if (!window.DOMParser) {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
            xmlDoc.loadXML(s);
        }
        else {
            var parser = new DOMParser();
            xmlDoc = parser.parseFromString(s, "text/xml");
        }
        return $(xmlDoc.documentElement);
    },
    InitHelp: function (wind, inited) {
        if (!top.GuideTool) {
            top.$.getScript("/Js/EMW/user-guide.js", function () {
                if (wind) {
                    top.GuideTool.init(wind, inited);
                }
                else {
                    inited();
                }
            });
            return;
        }
        if (wind) {
            top.GuideTool.init(wind, inited);
        }
        else {
            inited();
        }
    },
    Messager: {
        OnReceive: function (fn) {
            var messager = top.EMW.Net && top.EMW.Net.Messager;
            messager.OnReceive(fn);
        },
        OffReceive: function (fn) {
            var messager = top.EMW.Net && top.EMW.Net.Messager;
            messager.OffReceive(fn);
        },
        Send: function (message) {
            /// <summary>仅仅发送消息，不保存</summary>
            var messager = top.EMW.Net && top.EMW.Net.Messager;
            if (messager) {
                messager.Send(message);
            }
        }
    },EditFile:function(id){
        EMW.API.DocumentAPI.IsExistFile(id, function (result) {
            if (result) {
                var officeModal = $('<div class="editorModal" id="editor-modal">' +
                                        '<div class="modal-backdrop in"></div>' +
                                        '<div style="position:absolute;left:0px;top:0px;z-index:' + (EMW.Global.UI.Window.ZIndex++) + ';min-width:1000px;width:100%;height:100%;" id="editorDiaglog">' +
                                            '<iframe name="editorFrame" src="' + url + '"  style="border:0;width:100%;height:100%;"/>' +
                                        '</div>' +
                                    '</div>');
                officeModal.appendTo(top.$("body"));
            } else {
                Z.Show('系统找不到该文件！');
            }
        })
    },
    Settings: {
        MaxUploadFileLength: 1048576 * 30//1024*1204
    },
    PreviewFile: function (file) {
        var item = file;
        var url;
        if (item.Name.Contains('xlsx') || item.Name.Contains('xls')) {
            url = "/Pages/Editor/ExcelEditor.html?id=" + item.ID + "&title=" + encodeURIComponent(item.Name);
        }
        else if (item.Name.Contains('docx') || item.Name.Contains('doc')) {
            url = "/Pages/Editor/Editor.html?id=" + item.ID + "&title=" + encodeURIComponent(item.Name);
        }
        var width = top.$("body").width();
        var height = top.$("body").height();
        var officeModal = $('<div class="editorModal">' +
                                '<div class="modal-backdrop in"></div>' +
                                '<div style="position:absolute;left:0px;top:0px;z-index:1041;">' +
                                    '<iframe name="editorFrame" src="' + url + '" width="' + width + '" height="' + height + '"  style="border:0;"/>' +
                                '</div>' +
                            '</div>');
        officeModal.appendTo(top.$("body"));
    },
    Util: {
        HtmlEncode: function (str) {
            var s = "";
            if (str.length == 0) return "";
            s = str.replace(/&/g, "&gt;");
            s = s.replace(/</g, "&lt;");
            s = s.replace(/>/g, "&gt;");
            s = s.replace(/    /g, "&nbsp;");
            s = s.replace(/\'/g, "'");
            s = s.replace(/\"/g, "&quot;");
            s = s.replace(/\n/g, "<br>");
            return s;
        },
        HtmlDecode: function (str) {
            var s = "";
            if (str.length == 0) return "";
            s = str.replace(/&gt;/g, "&");
            s = s.replace(/&lt;/g, "<");
            s = s.replace(/&gt;/g, ">");
            s = s.replace(/&nbsp;/g, "    ");
            s = s.replace(/'/g, "\'");
            s = s.replace(/&quot;/g, "\"");
            s = s.replace(/<br>/g, "\n");
            return s;
        },
        FileLengthToString: function (length) {
            var l = "";
            if (length < 1024) {
                l = length + "字节";
            }
            else if (length < 1048576) {
                l = (length / 1024).toFixed(2) + "KB";
            }
            else if (length < 1073741824) {
                l = (length / 1048576).toFixed(2) + "MB";
            }
            else {
                l = (length / Math.pow(1024, 3)).toFixed(2) + "GB";
            }
            return l;
        },
        GetFileImage: function (exname) {
            switch (exname.toLowerCase()) {
                case ".pdf":
                    return "/Image/new/Adobe_Acrobat_Reader.png";
                case ".pptx":
                case ".ppt":
                    return "/Image/new/PPT.png";
                case ".doc":
                case ".docx":
                    return "/Image/new/Word.png";
                case ".xls":
                case ".xlsx":
                    return "/Image/new/Excel.png";
                case ".png":
                case ".jpg":
                    return "/Image/Chatter/img.png";
                case ".pdf":
                    return "/Image/Chatter/pdf.png";
                case ".txt":
                    return "/Image/Chatter/txt.png";
                case ".rar":
                case ".zip":
                    return "/Image/Chatter/rar.png";
                default:
                    return "/Image/Chatter/file.png";
            }
        },
        GetFileIcon: function (name) {
            var ext = name;
            if (name) {
                ext = name.substr(name.lastIndexOf("."));
            }
            return this.GetFileImage(ext);
        }, Now: function () {
            return new Date();
        },
        GetQueryString: function (name) {
            if (name) {
                var url = location.search; //获取url中"?"符后的字串
                if (url.indexOf("?") != -1) {
                    var str = url.substr(1);
                    strs = str.split("&");
                    var n = name.toLowerCase();
                    for (var i = 0; i < strs.length; i++) {
                        var kvs = strs[i].split("=");
                        if (kvs[0].toLowerCase() == n) {
                            return unescape(kvs[1]);
                        }
                    }
                }
            }
        },
        Download: function (fileID) {
            var id = Z.ToInt(fileID);
            if (id > 0) {
                var url = "/DownLoad/" + id;
                $('<iframe src="' + url + '"' + '" target="_blank" height="0" width="0" frameborder="0"></iframe>')
                    .load(function (e) {//如何判断错误？
                        //下载文件出错
                        Z.Show($(this.contentDocument.body).text() || "下载文件出错");
                        $(this).remove();
                    }).appendTo('body');
            }
            else {
                Z.Show("找不到该文件");
            }
        },
        AjaxDownload: function (url) {
            $('<iframe src="' + url + '"' + '" target="_blank" height="0" width="0" frameborder="0"></iframe>')
                .load(function (e) {//如何判断错误？
                    //下载文件出错
                    Z.Show($(this.contentDocument.body).text() || "下载文件出错");
                    $(this).remove();
                }).appendTo('body');
        }
    },
    encode: function (str) {
        return encodeURIComponent(str);
    },
    SaveCondition: function (xml, name, conds) {
        if (!conds) return;
        xml.push("<" + name + ">");
        EMW.Const.SaveConditionItem(xml, conds);
        xml.push("</" + name + ">");
    },
    SaveConditionItem: function (xml, conds) {
        if (!conds) return;
        for (var i = 0; i < conds.length; i++) {
            var cond = conds[i];
            if (cond.Conditions && (cond.Oper == "Or" || cond.Oper == "And")) {
                xml.push("<Item Oper=\"" + cond.Oper + "\">");
                EMW.Const.SaveConditionItem(xml, cond.Conditions);
                xml.push("</Item>");
            } else {
                xml.push("<Item Left=\"" + cond.Left + "\" Oper=\"" + cond.Oper + "\" Right=\"" + cond.Right + "\"  Desc=\"" + cond.Desc + "\">");

                EMW.Const.SaveConditionItem(xml, cond.Conditions);
                xml.push("</Item>");
            }
        }
    },
    ReadCondition: function (root) {
        if (!root) return;
        var items = [];
        var elems = $(root).children();
        if (!elems.length) return;
        for (var i = 0; i < elems.length; i++) {
            var child = $(elems[i]);
            var cond = {};
            var left = child.attr("Left");
            cond.Oper = child.attr("Oper");
            if (left) {
                cond.Left = left;
                cond.Right = child.attr("Right");
                cond.Desc = child.attr("Desc");
                if (!cond.Desc) {
                    cond.Desc = child.text();
                }
            }
            cond.Conditions = EMW.Const.ReadCondition(child);
            items.push(cond);
        }
        return items;
    },
    CookieHelper: {
        ///设置cookie
        setCookie: function (name, value, expireMinutes) {
            var ck = name + "=" + escape(value);
            if (expireMinutes) {
                var expireDate = new Date();
                expireDate.setTime(expireDate.getTime() + (expireMinutes * 60 * 1000));
                ck += "; expires=" + expireDate.toGMTString();
            }
            document.cookie = ck;
        },
        ///获取cookie值
        getCookie: function (name) {
            if (document.cookie.length > 0) {
                begin = document.cookie.indexOf(name + "=");
                if (begin != -1) {
                    begin += name.length + 1;
                    end = document.cookie.indexOf(";", begin);
                    if (end == -1) {
                        end = document.cookie.length;
                    }
                    return unescape(document.cookie.substring(begin, end));
                }
            }
            return "";
        },
        ///删除cookie
        delCookie: function (name) {
            if (this.getCookie(name)) {
                var date = new Date();
                date.setYear(1000);
                document.cookie = name + "=" + ";" + date.toGMTString();
            }
        }
    },
    Get: function (url, arg, callback) {//调用后台方法
        if (!url) return;

        var args = [];
        if ($.isPlainObject(arg)) {
            for (var key in arg) {
                if (arg[key])
                    args.push(key + "=" + EMW.Const.encode(EMW.Const.Json2Str(arg[key])));
            }
            url = url + "?" + args.join("&");
        } else if ($.isFunction(arg)) {
            callback = arg;
        } else if ($.isArray(arg)) {
            for (var i = 0; i < arg.length; i++) {
                args.push(EMW.Const.encode(EMW.Const.Json2Str(arg[i])));
            }
            url = url + "/" + args.join("/");
        }
        var options = {
            url: "/" + url,
            callBack: callback
        };
        return EMW.Const.Request(options);
    },
    Post: function (url, arg, callback) {//调用后台方法
        var args = [], argStr;
        if ($.isPlainObject(arg)) {
            for (var key in arg) {
                if (arg[key])
                    args.push(key + "=" + EMW.Const.encode(EMW.Const.Json2Str(arg[key])));
            }
            argStr = args.join("&");
        } else if (arg.length) {
            for (var i = 0; i < arg.length; i++) {
                args.push(EMW.Const.Json2Str2(arg[i]));
            }
            argStr = EMW.Const.Json2Str(args);
        } else {
            return;
        }
        var options = {
            url: "/" + url,
            data: argStr,
            callBack: callback
        };
        return EMW.Const.Request(options);
    },
    Request: function (options) {
        var cb = options.callBack;
        var async = $.isFunction(cb);
        var re = null;
        var isParseData = (options.isParseData === true);
        $.ajax(options.url, {
            data: options.data,
            type: options.type || 'post',
            async: async,
            dataType: 'json',
            statusCode: {
                404: function () {
                    //alert(404);
                }
            },
            success: function (result) {
                if (EMW.Const.RequestOver(result)) {
                    re = (isParseData === true ? ParseData(result) : result);
                    if ($.isFunction(cb)) {
                        cb(re);
                    }
                }
                else {
                    if ($.isFunction(cb)) {
                        cb(result);
                    }
                }
            },
            complete: function (xhr, ts) {
                if (ts != "success") {
                    $.logger.log("complete:", ts);
                }
            },
            error: function (xhr, ts, msg) {
                $.logger.log("error:", ts, msg);
                $.logger.error("URL:", this.url);
                $.logger.error("data:", this.data);
                EMW.Const.LastError = xhr.responseText;
                if ($.isFunction(cb)) {
                    cb();
                }
            }
        });
        if (async == false) {
            return re;
        }
    }, RequestOver: function (r) {
        if (r) {
            if (!r.Error) {
                return true;
            }
            else {
                switch (r.ErrorCode) {
                    case 1:
                        EMW.Const.Passport.OpenLoginWind();
                        break;
                    default:
                        alert(r.Error);
                        break;
                }
                return false;
            }
        }
        else {
            //alert("操作失败");
        }
        return false;
    }
}
var Z = {
    ToInt: function (o) {
        if (!o) return 0;
        return Z.SafeToInt(o);
    },
    V: function (o) {
        if (!o) return 0;
        return parseFloat(o);
    },
    Ceil: function (n) {
        return Math.ceil(n);
    },
    S: function (s) {
        return (s === undefined || s === null) ? String.Empty : s.toString();
    },
    F: function (val, format) {
        if (typeof val != "number") {
            val = Z.V(val);
        }
        return val.ToString(format || "0.00");
    },
    ToC: function (num) {

    },
    GArray: function (arr) {
        return arr.Distinct();
    },
    Join: function (arr, separator) {
        return arr.join(separator);
    },
    Days: function (d1, d2) {
        if (d1 instanceof Date && d2 instanceof Date) {
            var x = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());
            var y = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate());

            var span = y - x;
            span = ((((span / 1000) / 60) / 60) / 24);
            return span;
        }
        return 0;
    },
    LastDay: function (year, month) {
        var dt = new Date(year, month);
        return dt.GetLastDay();
    },
    Match: function (s, reg) {
        if (s) {
            return !!s.match(reg);
        }
        return false;
    },
    ParseData: function (obj) {
        if (obj.Code!=undefined) return obj;
        var data = {};
        data.MaxRow = obj.MaxRow;
        data.Rows = [];
        data.Columns = obj.Columns;
        for (var i = 0; i < obj.Rows.length; i++) {
            var row = {};
            for (var j = 0; j < obj.Columns.length; j++) {
                row[obj.Columns[j]] = obj.Rows[i][j];
            }
            data.Rows.push(row);
        }
        return data;
    },
    UnParseData: function (data) {
        var cols = data.Columns;
        var rows = data.Rows;
        if (cols && rows) {
            var rowDatas = [];
            for (var i = 0; i < rows.length; i++) {
                var rowData = rows[i];
                var arr = [];
                for (var j = 0; j < cols.length; j++) {
                    arr.push(rowData[cols[j]]);
                }
                rowDatas.push(arr);
            }
            return { Columns: cols, Rows: rowDatas, MaxRow: data.MaxRow };
        }
    },
    //type: 0 = 失败/错误提示；1 = 成功提示；2 = 必选提示；3 = 警告提示；4 = 选择提示；
    Show: function (s, callback, type) {
        var title_type = type == undefined ? 1 : type;
        if (typeof s == "string" || $.isNumeric(s)) {
            s = $("<div class='message-content type" + title_type + "'><div><div class='title'>" + ["错误", "提示", "提示", "警告", "确认"][title_type] + "</div><div>" + s + "</div></div></div>");
        }
        var opts = {
            content: s,
            title: ["错误", "提示", "提示", "警告", "确认"][title_type],
            width: 390,
            height: 'auto',
            showCloseBtn: false,
            isAlert: true,
            windCls: "prompt-box"
        }
        if (callback) {
            opts.title = '确认';
            opts.showCloseBtn = true;
            opts.OnOK = function () {
                callback(true);
            };
            opts.OnCancel = function () {
                callback(false);
            };
            setTimeout(function () {
                if (dialog && dialog.panel)
                    dialog.panel.find(">.modal-dialog>.modal-content>.modal-footer>.btn-Close").focus();
            }, 300);
        }
        else {
            setTimeout(function () {
                if (dialog && dialog.panel)
                    dialog.panel.find(">.modal-dialog>.modal-content>.modal-footer>.btn-OK").focus();
            }, 300);
        }

        var dialog = EMW.UI.Dialog(opts);

    },
    Error: function (msg) {
        Z.Show(msg, null, 0);
        return false;
    },
    Progress: function (s) {
        
    },
    Lock: function (s) {
        var htmls = ["<div style='color: white;position: absolute;top: 45%;left: 48%;'><div class='preloader'>",
            "<span></span><span></span><span></span><span></span></div>",
            "<span style='margin-left:30px;/*color:#4FA5E2;*/line-height: 20px;animation: top-img 1.5s infinite ease;",
            "-webkit-animation: top-img 1.5s infinite ease;'>" + s + "</span></div>"];
        return Z.__locker || (Z.__locker = top.EMW.Global.UI.Overlay({
            Content: htmls.join(""),
            closeOn: false,
            OnResize: function (e) {

            }
        }));
    },
    Unlock: function () {
        if (Z.__locker) {
            Z.__locker.Close()
            delete Z.__locker;
        }
    },
    ToDate: function (v) {
        if (!v) {
            return "";
        }
        if (v.indexOf("/Date") > -1) {//json格式
            return eval("new " + v.Replace("/"));
        }
        var dt = new Date(v);
        if (!$.isNumeric(dt.getDate())) return false;
        return dt;
    },
    Execute: function (sqls, callback) {

    },
    LoadData: function () {
        if (arguments.length == 0) return;
        var key = arguments[0], start, end, args, callback;
        for (var i = 1; i < arguments.length; i++) {
            var arg = arguments[i];
            if ($.isFunction(arg)) {
                callback = arg;
            } else if ($.isArray(arg)) {
                args = arg;
            } else if ($.isNumeric(arg)) {
                start == undefined ? start = arg : end = arg;
            }
        }
        if (!callback) {
            return EMW.API.UserData.Load(key, start, end, args);
        }
        EMW.API.UserData.Load(key, start, end, args, callback);
    },
    SafeToInt: function (o, df) {
        var x = o;
        if (typeof (x) === 'string') {
            x = x.Replace(",");
        }
        return parseInt(x) || df || 0;
    },
    OpenWindow: function (url, title, params, callback) {
        if (!url) {
            return;
        }
        if ($.isNumeric(url)) url = "/Page/" + url;
        var p = $.extend({ width: 800, height: "auto" }, params);
        var opts = $.extend({
            width: p.width,
            height: p.height,
            onClose: callback && function (e) {
                if ($.isFunction(callback)) {
                    callback(e);
                }
            }
        }, p);
        opts.url = url;
        opts.title = title || "新窗口";
        var wind = EMW.UI.Window(opts);
        wind.Arguments = params;
        return wind;
    },
    OpenDialog: function (cont, title, params, onok) {
        var isUrl = typeof cont === "string";
        var p = { width: 800, height: 600 };
        if ($.isFunction(params)) {
            onok = params;
        } else if (params) {
            $.extend(p, params);
        }
        var dia = EMW.UI.Dialog({
            width: p.width,
            height: p.height,
            title: typeof (title) == "string" ? title : "查看数据",
            content: isUrl ? null : cont,
            url: isUrl ? cont : null,
            OnOK: onok
        });
        dia.Arguments = params;
        return dia;
    }
    ,
    Elem: function (id) {
        return $("#" + id);
    },
    Hide: function (id) {
        if (typeof id == "string") {
            $("#" + id).hide();
        } else {
            $(id).hide();
        }
    },
    Display: function (id) {
        if (typeof id == "string") {
            $("#" + id).show();
        }
        else {
            $(id).show();
        }
    },
    ShowGrid: function (id, param, onok) {
        var url = id;
        if ($.isNumeric(id)) url = "/page/" + id;
        Z.OpenDialog(url,"", param, onok || param);
    },
    AddDataFromGrid: function (rept, gridIDOrUrl, fields) {

    },
    ReadExcel: function (fn,isallsheet) {
        var dia = EMW.UI.Dialog({
            url: "/Pages/Talker/uploadFile.html",
            showHeader: false,
            width: 720,
            height: 485,
            OnOK: function (x) {
                if (!x) return;
                var file = x[0];
                if (!file) return;

                EMW.API.DocumentAPI.ReadExcel(file.ID, true, isallsheet || false, function (data) {
                    if (fn) {
                        fn(EMW.Const.Str2Json2(data));
                    }
                });
            }
        });

    }, Refresh: function (pageid,params) {
        if ($.isNumeric(pageid)) pageid = "/Page/" + pageid;
        var win = GetParam(0);
        win.Arguments = params;
        window.location.href = pageid;
       
    },
    ExportData: function () {

    },
    Export: function (name, data,callback) {//DataTable,fields
        data = EMW.Const.Json2Str(data);
        EMW.API.UserData.SaveExcel2(name, data, function (x) {
            if (!x) {
                return callback&&callback();
            }
            window.open("/resource/" + x);
            callback && callback(x);
        });
    },
    ExportTemplate: function (name, data,Sheets, callback) {
        data = EMW.Const.Json2Str(data);
        Sheets = EMW.Const.Json2Str(Sheets);
        EMW.API.UserData.SaveExcelSheets(name, data, Sheets, function (x) {
            if (!x) {
                return callback && callback();
            }
            window.open("/resource/" + x);
            callback && callback(x);
        });
    },
    FormatCondition: function (cond, oper, str) {
        if (!cond) return "";
        oper = oper || "And";
        str = str || [];
        for (var i = 0; i < cond.length; i++) {
            var item = cond[i];
            if (item.Conditions) {
                if (item.Left) {
                    str.push(item.Desc);
                    str.push("(");
                    Z.FormatCondition(item.Conditions, item.Oper, str);
                    str.push(")");
                } else {
                    Z.FormatCondition(item.Conditions, item.Oper, str);
                }

            } else {
                str.push(item.Desc);
            }
            if (i != cond.length - 1) {
                str.push(" " + oper + " ");
            }
        }
        return str.join("");
    },
    When: function (funs) {
        if (arguments.length > 0) {
            var defs = [];
            for (var i = 0; i < arguments.length - 1; i++) {
                (function (fn, def) {
                    defs.push(def);
                    fn(function (r) {
                        def.resolve(r);
                    });
                })(arguments[i], $.Deferred());
            }
            var done = arguments[arguments.length - 1];
            $.when.apply($, defs).done(function (r) {
                done.apply(this, arguments);
            });
        }
    },
    CreateUserImage: function (users) {
        if (!$.isArray(users)) users = [users];
        var html = [];
        for (var i = 0; i < users.length; i++) {
            var user = users[i];
            var img = user.Image || "/Image/custom.png";
            html.push('<div class="user-image" > <img src="/Resources/' + EMW.Global.User.CompanyCode + "/UserImage/" + img + '" alt="' + user.Name + '"> </div>');
        }
        return html.join("");
    },
    NumChars: ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖", "", "拾", "佰", "仟", "", "万", "亿", "元", "角", "分", "整"],
    ToC: function (d) {
        //var isminus=false;
        if (d <= 0) {
            return "";
        }
        var d1 = (d * 100 - Math.floor(d) * 100);
        var d2 = Math.floor(d);
        var str = "";
        var num = d2.ToString();
        var isAddZero = false;
        for (var i = 0; i < num.length; i++) {
            var c = num[num.length - 1 - i];
            if (c == '0') {
                if (isAddZero) {
                    str = Z.NumChars[0] + str;
                    isAddZero = false;
                }
                if (i > 0 && i % 4 == 0) {
                    var isadd = false;
                    for (var j = 0; j < 4; j++) {
                        if (num[num.length - i - 1 - j] != '0') {
                            isadd = true;
                            break;
                        }
                    }
                    if (isadd) str = Z.NumChars[i / 4 + 14] + str;
                }
                continue;
            }
            isAddZero = true;
            str = Z.NumChars[c] + Z.NumChars[i % 4 + 10] + (i % 4 == 0 ? Z.NumChars[i / 4 + 14] : "") + str;

        }
        str = str + Z.NumChars[17];
        if (d1 == 0) return str + Z.NumChars[20];
        var d3 = parseInt(d1 / 10);
        var d4 = parseInt(d1 % 10);
        if (d3 != 0) { str += Z.NumChars[d3] + Z.NumChars[18]; }
        if (d4 != 0) str += Z.NumChars[d4] + Z.NumChars[19];
        return str;
    },
    ToE: function (d) {
        if (d <= 0) return "";
        var arr1 = ["", " THOUSAND,", " MILLION,", " BILLION,"];
        var arr2 = ["ZERO", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", "SIXTEEN", "SEVENTEEN", "EIGHTEEN", "NINETEEN"];
        var arr3 = ["TWENTY", "THIRTY", "FORTY", "FIFTY", "SIXTY", "SEVENTY", "EIGHTY", "NINETY"];
        var toe2 = function (num) {
            var result = "";
            var h = Math.floor(num / 100);
            var s = Math.floor((num % 100));
            var g = (num % 10);
            if (h > 0) {
                result = arr2[h] + " HUNDRED";
            }
            if (s == 0 && g == 0) return result;
            if (h > 0) result = result + " AND ";
            if (s > 0) {
                if (s < 20)

                    return result + arr2[s];
                else {
                    result += arr3[parseInt(s / 10) - 2];
                }
            }
            if (g == 0) return result;
            return result + "-" + arr2[g];
        }
        var d1 = (d * 100 - Math.floor(d) * 100);
        var d2 = Math.floor(d);
        var str = "";
        var index = 0;
        while (d2 > 0) {
            if (d2 % 1000 > 0) {
                str = toe2(d2 % 1000) + arr1[index] + str;

            }
            d2 = Math.floor(d2 / 1000); index++;
        }
        if (str[str.length - 1] == ",") str = str.substring(0, str.length - 1);
        if (d1 > 0) {
            return str + " CENTS " + toe2(d1);
        }
        return str;
    },
    //说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为 精确的除法结果。
    //调用：acc(arg1,arg2)
    //返回值：arg1除以arg2的精确结果
    AccDiv: function (arg1, arg2) {
        var t1 = 0, t2 = 0, r1, r2;
        try { t1 = arg1.toString().split(".")[1].length } catch (e) { }
        try { t2 = arg2.toString().split(".")[1].length } catch (e) { }
        with (Math) {
            r1 = Number(arg1.toString().replace(".", ""))
            r2 = Number(arg2.toString().replace(".", ""))
            return (r1 / r2) * pow(10, t2 - t1);
        }
    },
    //说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为 精确的乘法结果。
    //调用：accMul(arg1,arg2)
    //返回值：arg1乘以arg2的精确结果
    AccMul: function (arg1, arg2) {
        var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
        try { m += s1.split(".")[1].length } catch (e) { }
        try { m += s2.split(".")[1].length } catch (e) { }
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
    }

};

Array.prototype.Contains = function (o) {
    var len = this.length;
    for (var i = 0; i < len; i++) {
        if (typeof o == 'function') {
            if (o(this[i])) {
                return true;
            }
        }
        else {
            if (this[i] === o) {
                return true;
            }
        }
    }
    return false;
}

Array.prototype.IndexOf = function (o) {
    var len = this.length;
    for (var i = 0; i < len; i++) {
        if (this[i] === o) {
            return i;
        }
    }
    return -1;
}

Array.prototype.Count = function (o) {
    var len = this.length;
    if (typeof o == 'function') {
        var c = 0;
        for (var i = 0; i < len; i++) {
            if (o(this[i])) {
                c++;
            }
        }
        return c;
    }
    if (typeof o != 'undefined') {
        var c = 0;
        for (var i = 0; i < len; i++) {
            if (this[i] === o) {
                c++;
            }
        }
        return c;
    }
    return len;
}

Array.prototype.Find = function (fn) {
    var len = this.length;
    if (typeof fn == 'function') {
        var arr = [];
        for (var i = 0; i < len; i++) {
            var o = this[i];
            if (fn(o)) {
                arr.push(o);
            }
        }
        return arr;
    }
    return this;
}

Array.prototype.Where = Array.prototype.Find;

Array.prototype.Exist = function (fn) {
    var len = this.length;
    var isExist = false;
    if (typeof fn == 'function') {
        for (var i = 0; i < len; i++) {
            var o = this[i];
            if (fn(o)) {
                isExist = true;
                break;
            }
        }
    }
    return isExist;
}

Array.prototype.First = function (fn) {
    var len = this.length;
    if (typeof fn != 'function') {
        if (len > 0) {
            return this[0];
        }
    }
    for (var i = 0; i < len; i++) {
        var o = this[i];
        if (fn(o)) {
            return o;
        }
    }
    return null;
}

Array.prototype.Remove = function (o) {
    var i = this.IndexOf(o);
    if (i > -1) {
        this.splice(i, 1);
    }
    return this;
}

Array.prototype.RemoveAll = function (o) {
    var len = this.length;
    for (var i = 0; i < len; i++) {
        if (this[i] == o) {
            this.splice(i, 1);
            i--;
            len--;
        }
    }
    return this;
}

Array.prototype.RemoveWhile = function (fn) {
    var len = this.length;
    for (var i = 0; i < len; i++) {
        if (fn(this[i]) === true) {
            this.splice(i, 1);
            i--;
            len--;
        }
    }
    return this;
}

Array.prototype.RemoveRange = function (start, end) {
    this.splice(start, end - start);
    return this;
}

Array.prototype.Clear = function () {
    this.splice(0, this.length);
    return this;
}

Array.prototype.Select = function (converter, filter) {
    var len = this.length;
    if (typeof converter == 'function') {
        var arr = [];
        for (var i = 0; i < len; i++) {
            var o = this[i];
            if (typeof filter != 'function' || filter(o)) {
                arr.push(converter(o));
            }
        }
        return arr;
    }
    return this;
}

Array.prototype.RemoveAt = function (index) {
    if (index < this.length) {
        this.splice(index, 1);
        return true;
    }
    return false;
}
Array.prototype.Insert = function (index, o) {
    if (index <= this.length) {
        this.splice(index, 0, o);
        return this;
    }
    return false;
}

Array.prototype.MoveUp = function (o) {

}

Array.prototype.OrderBy = function (fn) {
    /// <summary>升序(小->大)</summary>
    var list = new Array().concat(this);
    var n = this.length;
    if (n > 1) {
        for (var i = 0; i < n; i++) {
            var flag = false;
            for (var j = 0; j < n - i - 1; j++) {
                var v1 = list[j];
                var v2 = list[j + 1];
                if (typeof fn == 'function') {
                    v1 = fn(v1);
                    v2 = fn(v2);
                }
                if (v2 < v1) {
                    var temp = list[j];
                    list[j] = list[j + 1];
                    list[j + 1] = temp;
                    flag = true;
                }
            }
            if (!flag)
                break;
        }
    }
    return list;
}

Array.prototype.OrderByDesc = function (fn) {
    /// <summary>降序(大->小)</summary>
    var list = new Array().concat(this);
    var n = this.length;
    if (n > 1) {
        for (var i = 0; i < n; i++) {
            var flag = false;
            for (var j = 0; j < n - i - 1; j++) {
                var v1 = list[j];
                var v2 = list[j + 1];
                if (typeof fn == 'function') {
                    v1 = fn(v1);
                    v2 = fn(v2);
                }
                if (v2 > v1) {
                    var temp = list[j];
                    list[j] = list[j + 1];
                    list[j + 1] = temp;
                    flag = true;
                }
            }
            if (!flag)
                break;
        }
    }
    return list;
}

Array.prototype.GroupBy = function (fn) {
    var results = [];
    var n = this.length;
    if (n > 0 && $.isFunction(fn)) {
        for (var i = 0; i < n; i++) {
            var it = this[i];
            var key = fn(it);
            var g = results.First(function (o) { return o.Key === key; });
            if (!g) {
                g = { Key: key, Items: [] };
                results.push(g);
            }
            g.Items.push(it);
        }
    }
    return results;
}

Array.prototype.Max = function (fn, converter) {
    var len = this.length;
    if (len > 0) {
        if (typeof fn == 'function') {
            var temp = fn.call(this, this[0]);
            var result = temp;
            if ($.isFunction(converter)) {
                result = converter.call(this, this[0]);
            }
            for (var i = 1; i < len; i++) {
                var next = fn.call(this, this[i]);
                var nextResult = next;
                temp = ((temp > next) ? temp : next);
                if ($.isFunction(converter)) {
                    nextResult = converter.call(this, this[i]);
                }
                result = ((temp > next) ? result : nextResult);
            }
            return result;
        }
        if (typeof fn == 'undefined') {
            return this.Max(function (o) { return o; });
        }
    }
}

Array.prototype.Min = function (fn, converter) {
    var len = this.length;
    if (len > 0) {
        if (typeof fn == 'function') {
            var temp = fn.call(this, this[0]);
            var result = temp;
            if ($.isFunction(converter)) {
                result = converter.call(this, this[0]);
            }
            for (var i = 1; i < len; i++) {
                var next = fn.call(this, this[i]);
                var nextResult = next;
                temp = ((temp < next) ? temp : next);
                if ($.isFunction(converter)) {
                    nextResult = converter.call(this, this[i]);
                }
                result = ((temp < next) ? result : nextResult);
            }
            return result;
        }
        if (typeof fn == 'undefined') {
            return this.Min(function (o) { return o; });
        }
    }
}

Array.prototype.Sum = function (fn) {
    var len = this.length;
    if (len > 0) {
        if (typeof fn == 'function') {
            var sum = fn.call(this, this[0]);
            for (var i = 1; i < len; i++) {
                sum = (sum + fn.call(this, this[i]));
            }
            return sum;
        }
        if (typeof fn == 'undefined') {
            return this.Sum(function (o) { return o; });
        }
    }
    return 0;
}
Array.prototype.Average = function (fn) {
    var len = this.length;
    if (len > 0) {
        var sum = this.Sum(fn);
        return sum / len;
    }
    return 0;
}
Array.prototype.Distinct = function (fn) {
    var len = this.length;
    if (len > 0) {
        var results = [];
        if (typeof fn == 'function') {
            for (var i = 1; i < len; i++) {
                var item = fn.call(this, this[i]);
                if (!results.Contains(item)) {
                    results.push(item);
                }
            }
            return results;
        }
        if (typeof fn == 'undefined') {
            return this.Distinct(function (o) { return o; });
        }
    }
    return this;
}

Array.prototype.AddOrUpdate = function (o, comparer) {
    var isUpdated = false;
    for (var i = 0; i < this.length; i++) {
        var x = this[i];
        if (($.isFunction(comparer) && comparer(x)) || (comparer === undefined && x === o)) {
            this[i] = o;
            isUpdated = true;
            break;
        }
    }
    if (!isUpdated) {
        this.push(o);
    }
}

Array.Create = function (length, defValue) {
    var len = length || 0;
    var arr = new Array(len);
    if (defValue !== undefined) {
        for (var i = 0; i < arr.length; i++) {
            arr[i] = defValue;
        }
    }
    return arr;
}
Array.prototype.Take = function (start, end) {
    var arr = [];
    if (start >= 0 && end >= start && this.length > start) {
        for (var i = start; i < end && i < this.length; i++) {
            arr.push(this[i]);
        }
    }
    return arr;
}
Array.prototype.Each = function (fn) {
    if (typeof (fn) != "function") return;
    for (var i = 0; i < this.length; i++) {
        fn.apply(this[i], [this[i], i]);
    }
}
Array.prototype.Add = function (items) {
    if (!$.isArray(items)) items = [items];
    for (var i = 0; i < items.length; i++) {
        this.push(items[i]);
    }
}

String.Empty = "";

String.Concat = function (s) {
    var arr = [];
    if (arguments && arguments.length > 0) {
        for (var i = 0; i < arguments.length; i++) {
            arr.push(arguments[i]);
        }
    }
    return arr.join(String.Empty);
}
String.prototype.Equals = function (s, ignoreCase) {
    var ss = s;
    var _this = this;
    if (ignoreCase) {
        ss = ss.toLowerCase()
        _this = _this.toLowerCase();
    }
    return ss == _this;
}

String.Join = function (separator, strs) {
    if (arguments && arguments.length > 1) {
        var arr = [];
        for (var i = 1; i < arguments.length; i++) {
            arr.push(arguments[i]);
        }
        return arr.join(separator);
    }
    return String.Empty;
}
String.prototype.Contains = function (s, ignoreCase) {
    if (!ignoreCase) {
        return this.indexOf(s) > -1;
    }
    var ss = this.toLowerCase();
    s = s.toLowerCase();
    return ss.indexOf(s) > -1;
}

String.prototype.Split = function (separator) {
    if (!separator) {
        return [this];
    }
    var separators = [];
    if (separator instanceof String) {
        separators.push(arr);
    }
    if (separator instanceof Array) {
        separators = separator;
    }

    var temp = this;
    for (var i = 0; i < separators.length; i++) {
        var sep = separators[i];
        if (sep != ",") {
            temp = temp.Replace(sep, ",");
        }
    }
    return temp.split(",");
}

String.prototype.EndsWith = function (s, ignoreCase) {
    if (s) {
        var len = s.length;
        if (len == 0) {
            return true;
        }
        if (this.length >= len) {
            while (len > 0) {
                len--;
                var c1 = this.charAt(this.length - (s.length - len));
                var c2 = s.charAt(len);
                if (ignoreCase) {
                    c1 = c1.toString().toLowerCase();
                    c2 = c2.toString().toLowerCase();
                }
                if (c1 != c2) {
                    return false;
                }
            }
            return true;
        }
    }
    return false;
}

String.prototype.Replace = function (oldValue, newValue) {
    return this.replace(new RegExp(oldValue, "g"), newValue || String.Empty);
}

String.prototype.TrimHelper = function (chars, trimType) {
    var trimChars = [];
    if (chars && chars.length > 0) {
        for (var i = 0; i < chars.length; i++) {
            trimChars.push(chars[i]);
        }
    }
    var end = this.length - 1;
    var start = 0;
    if (trimType != 1) {
        start = 0;
        while (start < this.length) {
            var ch = this.charAt(start);
            if (trimChars != null && trimChars.length > 0) {
                var index = 0;
                while (index < trimChars.length) {
                    if (trimChars[index] == ch) {
                        break;
                    }
                    index++;
                }
                if (index == trimChars.length) {
                    break;
                }
                start++;
            }
            else {
                if (ch != ' ') {
                    break;
                }
                start++;
            }
        }
    }
    if (trimType != 0) {
        end = this.length - 1;
        while (end >= start) {
            var ch2 = this.charAt(end);
            if (trimChars != null && trimChars.length > 0) {
                var index = 0;
                while (index < trimChars.length) {
                    if (trimChars[index] == ch2) {
                        break;
                    }
                    index++;
                }
                if (index == trimChars.length) {
                    break;
                }
                end--;
            }
            else {
                if (ch2 != ' ') {
                    break;
                }
                end--;
            }
        }
    }
    return this.slice(start, end + 1);
}

String.prototype.Trim = function (chars) {
    return this.TrimHelper(arguments, 2);
}

String.prototype.TrimStart = function (chars) {
    return this.TrimHelper(arguments, 0);
}

String.prototype.TrimEnd = function (chars) {
    return this.TrimHelper(arguments, 1);
}
String.prototype.isNumber = function () {
    var s = this.Trim();
    return (s.search(/^[+-]?[0-9.]*$/) >= 0);
}
Date.prototype.ToDateString = function () {
    //return EMW.Const.DateTimeFormatter.ToShortDateString(this);
    return this.ToString("yyyy-MM-dd");
}

Date.prototype.ToDateTimeString = function () {
    //return EMW.Const.DateTimeFormatter.ToShortDateTimeString(this);
    return this.ToString("yyyy-MM-dd hh:mm");
}

Date.prototype.ToString = function (format) {
    if (format) {
        var FillZero = function (n, len) {
            var l = Z.SafeToInt(len, 1);
            var str = n + String.Empty;
            while (str.length < l) {
                str = "0" + str;
            }
            return str;
        }

        var chinaNums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
        var chinaMonths = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
        var theDates = ['一', '二', '三', '四', '五', '六', '日']

        var year = this.getFullYear();

        if (isNaN(year)) {
            return String.Empty;
        }

        var syear = FillZero(year, 4);
        var month = this.getMonth();
        var day = this.getDate();
        var hour = this.getHours();
        var minute = this.getMinutes();
        var sec = this.getSeconds();
        var msec = this.getMilliseconds();
        var arr = [];
        var temp = String.Empty;
        for (var i = 0; i < format.length; i++) {
            var c = format.charAt(i);
            //小写
            var cc = c.toString().toLowerCase();
            var next = format.charAt(i + 1) || String.Empty;
            //小写
            var next2 = next.toString().toLowerCase();
            switch (c) {
                case 'Y':
                    temp += c;
                    if (next != 'Y') {
                        if (temp == 'Y' || temp == 'YY') {//一、二个y，后两位15年
                            var sy = syear.substr(2);
                            var y = Z.SafeToInt(sy);
                            var y1 = chinaNums[Z.SafeToInt(sy.charAt(0))];
                            var y2 = chinaNums[Z.SafeToInt(sy.charAt(1))];
                            if (temp == 'Y' && y < 10) {
                                arr.push(y1);
                            }
                            else {
                                arr.push(y1);
                                arr.push(y2);
                            }
                        }
                        else {
                            for (var j = 0; j < syear.length; j++) {
                                var sy = chinaNums[Z.SafeToInt(syear.charAt(j))];
                                arr.push(sy);
                            }
                        }
                        arr.push("年");
                        temp = String.Empty;
                    }
                    break;
                case 'y':
                    temp += c;
                    if (next != 'y') {
                        if (temp == 'y' || temp == 'yy') {//一、二个y，后两位15年
                            arr.push(syear.substr(2));
                        }
                        else {
                            arr.push(syear);
                        }
                        temp = String.Empty;
                    }
                    break;
                case 'M': //Month
                    temp += c;
                    if (next != 'M') {
                        var m = month + 1;
                        if (temp == 'M') {
                            arr.push(m);
                        }
                        else if (temp == 'MM') {
                            arr.push(FillZero(m, 2));
                        }
                        else {
                            arr.push(chinaMonths[month]);
                        }
                        temp = String.Empty;
                    }
                    break;
                case 'd': //Day
                    temp += c;
                    if (next != 'd') {
                        var d = day;
                        if (temp == 'd') {
                            arr.push(d);
                        }
                        else if (temp == 'dd') {
                            arr.push(FillZero(d, 2));
                        }
                        else if (temp == 'ddd') {
                            arr.push('周' + theDates[this.getDay() - 1]);
                        }
                        else {
                            arr.push('星期' + theDates[this.getDay() - 1]);
                        }
                        temp = String.Empty;
                    }
                    break;
                case 'h':
                case 'H': //Hour
                    temp += cc;
                    if (next2 != 'h') {
                        if (temp == 'h') {//一个h
                            arr.push(hour);
                        }
                        else {
                            arr.push(FillZero(hour, 2));
                        }
                        temp = String.Empty;
                    }
                    break;
                case 'm': //Minute
                    temp += cc;
                    if (next != 'm') {
                        if (temp == 'm') {//一个m
                            arr.push(minute);
                        }
                        else {
                            arr.push(FillZero(minute, 2));
                        }
                        temp = String.Empty;
                    }
                    break;
                case 's': //second
                    temp += cc;
                    if (next != 's') {
                        if (temp == 's') {//一个s
                            arr.push(sec);
                        }
                        else {
                            arr.push(FillZero(sec, 2));
                        }
                        temp = String.Empty;
                    }
                    break;
                default:
                    arr.push(c);
                    temp = String.Empty;
            }
        }
        return arr.join(String.Empty);
    }
    return this.ToString("yyyy-MM-dd hh:mm:ss");
}

Date.prototype.ToShortDateString = function () {
    return this.ToDateString();
}

Date.prototype.ToLongDateString = function () {
    return this.ToString("yyyy年MM月dd日");
}

Date.prototype.AddMinutes = function (m) {
    this.setMinutes(this.getMinutes() + m);
    return this;
}

Date.prototype.AddHours = function (h) {
    this.setHours(this.getHours() + h);
    return this;
}

Date.prototype.AddDays = function (d) {
    this.setDate(this.getDate() + d);
    return this;
}

Date.prototype.AddMonths = function (m) {
    this.setMonth(this.getMonth() + m);
    return this;
}
Date.prototype.AddYears = function (y) {
    this.setFullYear(this.getFullYear() + y);
    return this;
}
Date.prototype.GetLastDay = function () {
    var dt = new Date(this.getFullYear(), this.getMonth() + 1, 1);

    return dt.AddDays(-1).getDate();
}
//format:#,0.00  ;0.00 ;000
Number.prototype.ToString = function (format) {
    if (format) {

        if (format.indexOf("#,") == -1 && format.indexOf(".") == -1) {
            var rd = format.length;
            return Helper.FillZero(this, rd);
        }

        var formats = format.split(".");

        var rc = formats.length == 2 ? formats[1].length : 0; //小数位

        var num = this.Round(rc);

        var str = num.toString();
        var strs = str.split(".");
        var str1 = strs[0];
        var str2 = String.Empty;
        //补充小数位数（补零）
        if (rc > 0) {
            if (strs.length == 2) {
                str2 = strs[1];
            }
            var zeroCount = rc - str2.length;
            while (zeroCount-- > 0) {
                str2 = str2 + "0";
            }
            str = str1 + "." + str2;
        }
        var ft = formats[0];
        //货币类型，补充“,”号
        if (ft == "#,0") {
            var results = str1;
            if (str1.length > 3) {
                var stack = [];
                var len = str1.length; //小数点前字符串长度
                for (var i = 0; i < len; i++) {
                    var ch = str1.charAt(i);
                    stack.push(ch);
                    var c = len - i - 1; //倒数第几个字符
                    if ((c % 3) == 0 && c != 0 && c != len) {//每3位补一个“,”                    
                        if (ch != '-') {//负数
                            stack.push(",");
                        }
                    }
                }
                results = stack.join(String.Empty);
            }
            if (rc > 0) {
                results = results + "." + str2;
            }
            return results;
        }
        return str;
    }
    return this.toString();
}

Number.prototype.Round = function (e) {
    var t = 1;
    for (; e > 0; t *= 10, e--);
    for (; e < 0; t /= 10, e++);
    return Math.round(this * t) / t;
}
Number.prototype.Add = function (arg) {
    var r1, r2, m, c;
    var arg2 = this;
    if (arg == null)
        arg = 0.0;
    if (arg2 == null)
        arg2 = 0.0;
    try { r1 = arg.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2))
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            arg = Number(arg.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
        }
        else {
            arg = Number(arg.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
        }
    }
    else {
        arg = Number(arg.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg + arg2) / m
}

function GetParam(index) {
    /// <summary>获取参数</summary>
    /// <param name="index" type="int">索引</param>
    if (frameElement && frameElement.params) {
        return frameElement.params["param" + index];
    }
    return null;
}
function SetParam(index,val) {
    if (frameElement && frameElement.params) {
        frameElement.params["param" + index] = val;
    }
}
function GetWindow() {
    return GetParam(0);
}
function Close(closeType, returnValue) {
    GetWindow().Close(closeType, returnValue);
}
function OnBeforeOK(callback) {
    var win = GetWindow();
    if (win) {
        (win.options || win).OnBeforeOK = callback;
    }
}
function SetWindowTitle(title) {
    var wind = GetWindow();
    if (wind && wind.SetTitle) {
        wind.SetTitle(title);
    }
}
//获取窗口参数
function GetArgument(name) {
    /// <summary>获取(窗口)参数</summary>
    /// <param name="name" type="String">参数名</param>
    var wind = GetWindow();
    var val = null;
    if (wind) {
        val = wind[name];
        if (!val && wind.Arguments) {
            return wind.Arguments[name];
        }
    }
    return val;
}
//获取地址栏参数
function GetUrlArgument(name) {
    var url = location.href.replace(/([^\?|&]*)=/g, function (rg) { return (rg || "").toLowerCase() });
    var val = new RegExp(name.toLowerCase() + "=([^&]*)").exec(url);
    return val && val[1] || "";
}
//根据给定的url获取url上的参数
function GetUrlArg(url, name) {
    var url = url.replace(/([^\?|&]*)=/g, function (rg) { return (rg || "").toLowerCase() });
    var val = new RegExp(name.toLowerCase() + "=([^&]*)").exec(url);
    return val && val[1] || "";
}
function Inherits(ctor, superCtor) {
    ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
}
function getFPLX(sfpdm) {
    var a = sfpdm;
    var b;
    var c = "99";

    if (a.length == 12) {
        b = a.substr(7, 1);
        if (c == "99") {  //增加判断，判断是否为新版电子票
            if (a.substr(0, 1) == "0" && a.substr(10, 2) == "11") {
                c = "10";
            }
            if (a.substr(0, 1) == "0" && (a.substr(10, 2) == "06" || a.substr(10, 2) == "07")) {  //判断是否为卷式发票  第1位为0且第11-12位为06或07
                c = "11";
            }
        }
        if (c == "99") { //如果还是99，且第8位是2，则是机动车发票
            if (b == "2" && a.substr(0, 1) != "0") {
                c = "03";
            }
            else {
                c = "10";
            }
        }
    }
    else if (a.length == 10) {
        b = a.substr(7, 1);
        if (b == "1" || b == "5") {
            c = "01";
        }
        else if (b == "6" || b == "3") {
            c = "04";
        }
        else if (b == "7" || b == "2") {
            c = "02";
        }
    }
    if (c == "99")
        c = "";
    return c;
}

function getFPDQ(sfpdm) {
    var dq = "";

    var citys = [["1100", "北京"], ["1200", "天津"], ["1300", "河北"], ["1400", "山西"], ["1500", "内蒙古"],
                                     ["2100", "辽宁"],
                                     ["2102", "大连"],
                                     ["2200", "吉林"],
                                     ["2300", "黑龙江"],
                                     ["3100", "上海"],
                                     ["3200", "江苏"],
                                     ["3300", "浙江"],
                                     ["3302", "宁波"],
                                     ["3400", "安徽"],
                                     ["3500", "福建"],
                                     ["3502", "厦门"],
                                     ["3600", "江西"],
                                     ["3700", "山东"],
                                     ["3702", "青岛"],
                                     ["4100", "河南"],
                                     ["4200", "湖北"],
                                     ["4300", "湖南"],
                                     ["4400", "广东"],
                                     ["4403", "深圳"],
                                     ["4500", "广西"],
                                     ["4600", "海南"],
                                     ["5000", "重庆"],
                                     ["5100", "四川"],
                                     ["5200", "贵州"],
                                     ["5300", "云南"],
                                     ["5400", "西藏"],
                                     ["6100", "陕西"],
                                     ["6200", "甘肃"],
                                     ["6300", "青海"],
                                     ["6400", "宁夏"],
                                     ["6500", "新疆"]];
    if (sfpdm.length == 12) {
        sfpdm = sfpdm.substr(1, 5);
    }
    else {
        sfpdm = sfpdm.substr(0, 4);
    }
    if (sfpdm != "2102" && sfpdm != "3302" && sfpdm != "3502" && sfpdm != "3702" && sfpdm != "4403") {
        sfpdm = sfpdm.substr(0, 2) + "00";
    }
    for (var i = 0; i < citys.length; i++) {
        if (sfpdm == citys[i][0]) {
            dq = citys[i][1];
            break;
        }
    }

    return dq;
}

function getFPLXName(sfplx) {
    var fpmc = "";
    if (sfplx == "01") {
        fpmc = "增值税专用发票";
    }
    else if (sfplx == "02") {
        fpmc = "增值税专用发票";
    }
    else if (sfplx == "03") {
        fpmc = "机动车电子发票";
    }
    else if (sfplx == "04") {
        fpmc = "增值税普通发票";
    }
    else if (sfplx == "10") {
        fpmc = "增值税电子普通发票";
    }
    else if (sfplx == "11") {
        fpmc = "增值税普通发票(卷票)";
    }
    return fpmc;
}
function smalltoBIG(n) {
    var fraction = ['角', '分'];
    var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    var unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
    var head = n < 0 ? '欠' : '';
    n = Math.abs(n);

    var s = '';

    for (var i = 0; i < fraction.length; i++) {
        s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
    }
    s = s || '整';
    n = Math.floor(n);

    for (var i = 0; i < unit[0].length && n > 0; i++) {
        var p = '';
        for (var j = 0; j < unit[1].length && n > 0; j++) {
            p = digit[n % 10] + unit[1][j] + p;
            n = Math.floor(n / 10);
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
    }
    return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
}