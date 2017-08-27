
/// <reference path="../EMW/ui.js" />


function GridControl() {
    this.Columns = [];
    this.Searchers = [];
    this.Tools = [];
    this.ColumnTools = [];
    this.Element = null;
    this.Views = [];
    this.Charts = [];
    this.ChartNavigations = [];
    this.QuickSearchs = [];
    this.ShowActionPanel = true;
    this.ShowTools = true;
    this.PageSize = 10;
    this.PageIndex = 1;
    this.GridType = 0;
    this.Data = {};
    this.AutoHeight = false;
    this.ShowType = 0;//0全部显示 1只显示列表 2图表
    this.Container;
    $(this.CheckWindow.bind(this));
}
GridControl.prototype.Init = function (parent) {
    if (this.__isinit) return;
    this.__isinit = true;
    this.OnEvent("Init");
    if (!parent) {
        if (this.Container)
            parent = $(this.Container);
        else
            parent = $("<div class='grid-container'></div>").appendTo(document.body);
        this.InitQuickSearch(parent);

    }
    parent = parent || document.body;
    this.InitActionPanel();
    if (this.ShowType != 2)
        this.InitGrid(parent);
    else {
        this.OnlyShowChart(parent);
    }
}
GridControl.prototype.CheckWindow = function () {
    var win = GetWindow();
    if (win) {
        this.Container = win;
        this.Init();
        OnBeforeOK(function () {
            return this.GetSelectedRows();
        }.bind(this));
    }
}
GridControl.prototype.InitGrid = function (parent, reinit) {
    var height = parent.height();
    if (!height) {
        return window.setTimeout(this.InitGrid.bind(this, parent), 100);
    }
    this.Element = $("<div></div>").appendTo(parent);
    var cols = [];
    var opts = {
        height: height,
        pagination: true,
        type: this.GridType,
        sortable: true, resizable: true,
        pageSize: this.PageSize || 100
    }
    var bindCell = this.BindCell.bind(this);
    var showMenuHandler = this.ShowColumnMenu.bind(this);
    var columns = reinit ? this.Columns : this.UseSetting();
    var groupColumn;
    var frozenCols = [];
    for (var i = 0; i < columns.length; i++) {
        var col = columns[i];
        col.Page = this;
        var gridCol = {
            title: col.Name,
            width: col.Width,
            field: col.ID,
            allowSort: col.AllowSort,
            orderBy: col.OrderBy,
            visible: col.State != 3,
            rowspan: col.IsRowSpan == true,
            Formatter: col.FormatColumn.bind(col),
            OnClick: col.ClickColumn && col.ClickColumn.bind(col),
            OnRenderCell: bindCell, groupHeader: col.Group || "",
            OnShowMenu: showMenuHandler
        }
        if (col.IsFrozen) {
            this.AddToColumn(frozenCols, gridCol);
        }
        else if (col.IsHidden) {
            //隐藏列，不加入进去
        }
        else {
            this.AddToColumn(cols, gridCol);
        }

        if (col.Stat) {
            this._IsLoadStat = true;
            opts.footer = true;
        }
        if (col.ID == this.GroupField) {//分组的列
            groupColumn = col;
        }
        if (col instanceof ImageColumn) {
            gridCol.type = "image";
        }
        if (this.ColumnTools && this.ColumnTools.length) {
            if (col instanceof OperationColumn) {
                gridCol.tools = [];
                for (var j = 0; j < this.ColumnTools.length; j++) {
                    var tool = this.ColumnTools[j];
                    tool.Page = this;
                    if (tool.Column == col.ID) {
                        gridCol.tools.push({
                            icon: tool.Icon, text: tool.Name, desc: tool.Memo, showType: tool.ShowType, tool: tool, OnClick: ToolClick
                        });
                    }
                }
            }
        }
    }
    opts.columns = cols;
    if (frozenCols.length) opts.frozenColumns = frozenCols;
    if (cols.length > 1) {
        opts.columnGroupHeaderRender = function (columns, cell, index) {
            var col = columns[0];
            cell.html(col.groupHeader)
        }
        opts.isGroupHeader = function (groupCols, groupIndex, isfrozen) {
            if (groupCols && groupCols.length) {
                return !!groupCols[0].groupHeader;
            }
            return false;
        }
    }
    if (this.GridType == 1) {
        opts.treeField = this.ParentField;//作为父子关系的字段
        opts.parentField = this.SubField;//指向父级的字段
        opts.expandField = this.ExpandField || "ID";//树节点展开的字段
        opts.topValue = this.RootValue;//根值
        opts.expandLevel = this.ExpandLevel;//展开子级数
    }
    else if (this.GridType == 2) {
        opts.groupField = this.GroupField;
        if (groupColumn && groupColumn.FormatFun) {
            opts.HeaderFormatter = function (g) {
                return groupColumn.FormatFun.apply(groupColumn, [g.Key, g, groupColumn]);
            };
        }
    }
    this.DataGrid = this.Element.DataGrid(opts);
    var settingChange = this.OnGridSettingChanged.bind(this);
    this.DataGrid.OnDblClickRow(this.OnDblClickRow.bind(this)).OnDrop(settingChange).OnColumnChanged(settingChange);
    this.DataGrid.OnSelect(this.OnRowSelected.bind(this)).OnBeforeRowBind(this.RowBind.bind(this)).OnRowBinded(
    this.OnEvent.bind(this, "RowBind"));
    this.DataGrid.OnPageChange(this.PageChanged.bind(this));
    this.DataGrid.OnPageSizeChanged(this.PageSizeChanged.bind(this));
    this.DataGrid.OnSort(this.OnSort.bind(this));
    window.onresize = function () {
        var height = parent.height() - parent.find(".grid-title").height() - 20;
        this.DataGrid.Resize({ height: height });
    }.bind(this);
    this.Element = this.DataGrid.panel;

    this.LoadData();
    this.InitChart();
    this.OnEvent("Load");
}
GridControl.prototype.UseSetting = function () {
    if (!this.Setting) return this.Columns;
    var ary = [];
    if (this.Setting.FrozenColumns) {
        for (var i = 0; i < this.Setting.FrozenColumns.length; i++) {
            var col = this.GetColumnByID(this.Setting.FrozenColumns[i].ID);
            if (!col) continue;
            col.Width = this.Setting.FrozenColumns[i].Width || col.Width;
            col.IsFrozen = true;
            ary.push(col);
        }
    }
    for (var i = 0; i < this.Setting.Columns.length; i++) {
        var col = this.GetColumnByID(this.Setting.Columns[i].ID);
        if (!col) continue;
        col.Width = this.Setting.Columns[i].Width || col.Width;
        ary.push(col);
    }
    if (this.Setting.SortColumn) {
        this.SortColumn = this.GetColumnByID(this.Setting.SortColumn.ID);
        this.SortColumn && (this.SortColumn.OrderBy = this.Setting.SortColumn.OrderBy);
    }
    return ary;
}
GridControl.prototype.GetColumnByID = function (id) {
    for (var i = 0; i < this.Columns.length; i++) {
        if (this.Columns[i].ID == id) return this.Columns[i];
    }

}
GridControl.prototype.OnGridSettingChanged = function () {
    if (this.SettingSaveTimer) {
        return;
    }
    this.SettingSaveTimer = window.setTimeout(this.SavePageSetting.bind(this), 1000);
}
GridControl.prototype.SavePageSetting = function () {
    var grid = this.DataGrid.options;
    var obj = {};
    obj.FrozenColumns = this.GetColumnsSetting(grid.frozenColumns);
    obj.Columns = this.GetColumnsSetting(grid.columns)
    if (this.SortColumn) {
        obj.SortColumn = {
            ID: this.SortColumn.ID,
            OrderBy: this.SortColumn.OrderBy
        };
    }
    this.SettingSaveTimer = null;
}
GridControl.prototype.GetColumnsSetting = function (cols) {
    if (!cols) return;
    var ary = [];
    for (var i = 0; i < cols.length; i++) {
        for (var j = 0; j < cols[i].length; j++) {
            ary.push({
                ID: cols[i][j].field,
                Width: cols[i][j].width
            });
        }

    }
    return ary;
}
GridControl.prototype.AddToColumn = function (cols, col) {
    if (cols.length) {
        for (var i = 0; i < cols.length; i++) {
            var group = cols[i][0].groupHeader;
            if (group == col.groupHeader) {

                return cols[i].push(col);
            }
        }

    }
    cols.push([col]);
}
GridControl.prototype.ReInit = function () {
    var parent = this.Element.parent();
    this.Element.remove();
    if (this.ShowType != 2) {
        this.InitGrid(parent, true);

    }
}
GridControl.prototype.ShowColumnMenu = function (col) {
    var ary = [];
    var column = this.GetColumnByID(col.field);
    if (!column) return;
    this.EditColumn = column;
    var columnClick = this.ColumnClick.bind(this);
    if (!(column instanceof OperationColumn || column instanceof ImageColumn)) {
        if (column.OrderBy) {
            ary.push({ text: "取消排序", icon: "action_trending_flat", OnClick: columnClick, command: "cancelsort" });
        }
        if (!column.OrderBy || column.OrderBy == "ASC") {
            ary.push({ text: "降序排列", icon: "action_trending_down", OnClick: columnClick, command: "sort", OrderBy: "DESC" });
        }
        if (!column.OrderBy || column.OrderBy == "DESC") {
            ary.push({ text: "升序排列", icon: "action_trending_up", OnClick: columnClick, command: "sort", OrderBy: "ASC" });
        }
        if (column.IsFrozen) {
            ary.push({ text: "取消冻结", icon: "action_settings_ethernet", OnClick: columnClick, command: "cancelforzen" });
        }
        else {
            ary.push({ text: "冻结列", icon: "editor_format_indent_decrease", OnClick: columnClick, command: "forzen" });
        }
    }
    return ary;
}

GridControl.prototype.ColumnClick = function (tool) {
    this.DataGrid.HideColumnMenu();
    if (!this.EditColumn) return;
    switch (tool.command) {
        case "cancelsort":
            if (this.SortColumn) {
                this.SortColumn.OrderBy = null;
                this.SortColumn = null;
                this.Refresh();
            }
            break;
        case "sort":
            this.SortColumn = this.EditColumn;
            this.EditColumn.OrderBy = tool.OrderBy;
            this.Refresh();
            break;
        case "cancelforzen":
            this.EditColumn.IsFrozen = false;
            this.ReInit();
            break;
        case "forzen":
            this.EditColumn.IsFrozen = true;
            this.ReInit();
            break;
        case "hide":
            this.EditColumn.IsHidden = true;
            this.ReInit();
            //this.EditColumn.SetState(ElementStates.Hidden);
            break;
        case "groupBy":
            if (this.GridType == 2 && !this._GroupField) {
                this._GroupField = this.GroupField;
            }
            if (this._GridType == undefined) {
                this._GridType = this.GridType;
            }
            this.EditColumn.IsGroupBy = true;
            this.GroupField = this.EditColumn.ID;
            this.GridType = 2;
            this.ReInit();
            return;
        case "cancelGroupBy":
            if (this.GridType == 2) {
                this.GroupField = this._GroupField;
            }
            this.GridType = this._GridType;
            this.EditColumn.IsGroupBy = false;
            this.ReInit();
            return;
    }
    this.OnGridSettingChanged();
}
GridControl.prototype.BindCell = function (row, col, td) {
    if (!row.__Cells) row.__Cells = {};
    row.__Cells[col.field] = td;
}
GridControl.prototype.OnSort = function (col) {
    if (!col.allowSort) return;
    for (var i = 0; i < this.Columns.length; i++) {
        if (this.Columns[i].ID == col.field) {
            this.SortColumn = this.Columns[i];
            this.SortColumn.OrderBy = col.orderBy;
            break;
        }
    }
    this.OnGridSettingChanged();
    if (!this.SortColumn) return;
    this.LoadData(false);
}
GridControl.prototype.OnRowSelected = function (row) {
    var rowData = row.Data.RowData;
    this.SetCurRow(rowData);
    this.OnEvent("RowSelect");
}
GridControl.prototype.SetCurRow = function (rowData) {
    for (var i = 0; i < this.Columns.length; i++) {
        var col = this.Columns[i];
        col.Value(rowData[col.ID]);
    }
    this.CurRow = rowData;
}

GridControl.prototype.RowBind = function (grid, row) {
    var rowData = row.RowData;
    this.SetCurRow(rowData);
}
GridControl.prototype.SelectByID = function (id) {
    this.DataGrid.SelectRowByID(id, true);
}
GridControl.prototype.ClearData = function () {
    this.DataGrid.BindData([]);
}
GridControl.prototype.InitQuickSearch = function (parent) {
    if (!this.QuickSearchs.length) return;
    $("<div class='grid-title'>用户列表<span class='title-search'> = </span></div>").appendTo('.grid-container');
    $('.title-search').click(this.ShowQuickSearchPanel.bind(this));
}
GridControl.prototype.ShowQuickSearchPanel = function () {
    this.QuickSearchPanel && (this.QuickSearchPanel = null);
    if (!this.QuickSearchPanel) {
        this.QuickSearchPanel = $("<div class='quicksearch-panel'><div class='inputsearch'><input type='Text' placeholder='Search' /></div><button  class='search-button'>Submit</button></div>");
        for (var i = 0; i < this.QuickSearchs.length; i++) {
            this.QuickSearchs[i].Page = this;
            this.QuickSearchs[i].Create(this.QuickSearchPanel);
        }
    }
    EMW.UI.RightPanel.Show({
        Title: "Filter Search",
        Content: this.QuickSearchPanel,
        Width: 400
    });
    return false;
}

GridControl.prototype.OnDblClickRow = function (row) {
    var rowData = row.Data.RowData;
    this.SetCurRow(rowData);
    this.OnEvent("DblClickRowed");
}
GridControl.prototype.PageChanged = function (arg) {
    var data = arg.Data;
    this.PageIndex = data.PageIndex;
    this.DataGrid.RefreshPager({ pageIndex: this.PageIndex, pageCount: this.DataGrid.options.pageCount });
    this.LoadData(true);
}
GridControl.prototype.PageSizeChanged = function (arg) {
    this.PageSize = arg.Data;
    this.PageIndex = 1;
    //this.DataGrid.RefreshPager({ pageIndex: 1, pageCount: this.PageCount });
    this.LoadData(true);
}
GridControl.prototype.GetTools = function () {
    var ary = [];
    var child = {};
    for (var i = 0; i < this.Tools.length; i++) {
        var tool = this.Tools[i];
        tool.Page = this;
        if (tool.State == 3) {
            continue;
        }
        var toolItem = {
            icon: tool.Icon || "edit", text: tool.Name, desc: tool.Memo,
            tool: tool, OnClick: ToolClick
        };
        if (tool.ParentTool) {
            var children = child[tool.ParentTool] || [];
            children.push(toolItem);
            child[tool.ParentTool] = children;
        } else {
            ary.push(toolItem);
        }
    }
    for (var i = 0; i < ary.length; i++) {
        var children = child[ary[i].tool.ID];
        if (children) ary[i].menu = { items: children };
    }
    return ary;
}
GridControl.prototype.GetFormPage = function () {
    if (!this.Tools) return;
    var obj = {};
    for (var i = 0; i < this.Tools.length; i++) {
        var tool = this.Tools[i];
        if (!tool) continue;
        obj[tool.ToolType] = tool.PageID;
    }
    return obj.Edit || obj.Create || 0;
}


GridControl.prototype.InitActionPanel = function () {
    if (!this.ShowActionPanel) return;
    var div = $(".SearchPanel");
    if (this.Tools.length) {
        var ary = this.GetTools();
        if (this.Container) {
            this.Container.ShowTools(ary);
        } else {
            if (window.top.innerWidth > 768) {
                var sec = $('<div class="section"><div class="section-header"><span class="glyphicon section-icon"></span><span class="section-title">快捷操作</span></div><div class="section-body"><div class="tool-bar"></div></div></div>').appendTo(div);
            } else {
                var sec = $('<div class="section"><span class="section-header icon-navigation_more_vert"></span><div class="section-body"><div class="tool-bar"></div></div></div>').appendTo(div);
            }
            sec.Section();
            this.ToolBar = sec.find(".tool-bar").ToolBar({
                display: "tool-vertical",
                items: ary
            });
        }

    }
    //$('<div class="search-box"><span class="glyphicon glyphicon-search search-icon"></span><input class="text-box" placeholder="搜索" /></div>').appendTo(div).SearchBox().OnSearch(this.Search.bind(this));
    if (this.Views.length) {
        this.Views.Insert(0, {
            ID: 0,
            Name: '默认视图',
            Icon: "eye-open"
        });
        var sec = $('<div class="section"><div class="section-header"><span class="glyphicon section-icon"></span><span class="section-title">视图</span></div><div class="section-body"><div class="tree"></div></div></div></div>').appendTo(div);
        sec.Section();
        this.ViewTree = sec.find(".tree").Tree({
            data: this.Views,
            parse: {
                text: "Name", icon: "Icon"
            }
        });
        this.ViewTree.SelectItem(_control.ViewTree.Element.find(".tree-item:first"));
        this.ViewTree.OnSelected(this.ViewChanged.bind(this));
    }

    if (this.Searchers.length) {
        var sec = $('<div class="section"><div class="section-body"><div class="grid-search-panel"></div></div></div></div>').appendTo(div);
        sec.Section();
        var panel = sec.find(".grid-search-panel");
        var values = GetArgument("Values");
        for (var i = 0; i < this.Searchers.length; i++) {
            var sea = this.Searchers[i];
            if (values) {
                var v = values[sea.ID];
                if (v != undefined) {
                    sea.DefaultValue = v;
                    if (sea.IsSearcher) {
                        sea.CurRow = {};
                        sea.CurRow[sea.TextColumn] = values["T_" + sea.ID];
                        sea.CurRow[sea.ValueColumn] = v;
                    }
                }
            }
            this.AppendSearcher(sea, panel);
        }

        $('<button class="btn btn-default btn-sm grid-search-btn" type="button"><span class="glyphicon glyphicon-search"></span> 搜索</button>')
            .on("click", this.Search.bind(this)).appendTo(panel);
    }
    this.Page && this.Page.SetActionPanel(this.Name, div);

}
GridControl.prototype.OnlyShowChart = function (parent) {
    if (!this.ChartPanel) {
        this.InitChartPanel();
        this.ChartPanel.appendTo(parent);
    }
}
GridControl.prototype.InitChart = function () {
    if (this.Charts && this.Charts.length) {

        $('<span class="glyphicon icon-image_dehaze chart-icon"></span>').appendTo(this.Element.show())
        .click(function () {
            if (window.top.innerWidth <= 768) { this.Element[0].parentNode.classList.add('active') }
            if (!this.ChartPanel) {
                this.InitChartPanel();
            }
            if (this.ChartPanel) {
                EMW.UI.RightPanel.Show({
                    Title: "图表",
                    Content: this.ChartPanel
                });
                return false;
            }
        }.bind(this));
    }
}
GridControl.prototype.InitChartPanel = function () {
    if (this.Charts && this.Charts.length) {
        var _this = this;

        var propertyContent = $("<div class='grid-property-panel'></div>");

        // this.ChartPanel = propertyContent;



        var chartListPanel = $("<div class='chart-list'></div>");
        propertyContent.append(chartListPanel);
        var inpt = $("<input/>").appendTo(chartListPanel);

        var combox = inpt.Combobox({
            Items: this.Charts,
            valueField: 'ID',
            textField: 'Name'
        });
        this.ChartSelector = combox;
        combox.SetValue(this.SelectedChart || this.Charts[0].ID, false);

        combox.OnChanged(function (a) {
            _this.ChartNavigations = [];
            _this.DisplayChart(a.Data);
        });


        var chartNavigation = $("<div></div>").addClass("chart-nav");
        propertyContent.append(chartNavigation);
        chartNavigation.on("click", ">a", this.OnClickChartNav.bind(this));

        var chartPanel = $("<div class='grid-chart-panel'></div>");
        propertyContent.append(chartPanel);

        $.getScript("/JS/Echarts/echarts.js", function () {
            $.getScript("/JS/Echarts/theme/shine.js", function () {
                _this.ChartObj = echarts.init(chartPanel[0], "shine");

                _this.ChartObj.on("click", function (params) {
                    _this.OnClickChartSerice(params)
                    return false;
                });
                //if (isOnlyChart) {
                //    _this.ChartObj.on("dblclick", function (params) {
                //        _this.OnDBClickChartSerice(params);
                //        return false;
                //    });
                //}
                var item = combox.GetSelected();
                _this.DisplayChart(item);
            });
        });

        propertyContent.on("click", function (e) {

            var $target = $(e.target);
            if ($target.closest(".grid-chart-menu").length > 0) {
                return;
            }
            if (_this.$ChartMenu && !selectedSerice) {
                _this.$ChartMenu.hide();
            }
            selectedSerice = false;
        });
        this.InitChartMenu(propertyContent);
        this.ChartPanel = propertyContent;
    }
}

var lastSelectSerice, selectedSerice;
GridControl.prototype.OnClickChartSerice = function (params) {
    var obj = $.isArray(params) ? params[0] : params;
    var e = obj.event;
    var point = { X: e.offsetX - (this.$ChartMenu.width() / 2), Y: e.offsetY - 5 };

    var mtop = Z.ToInt(this.ChartPanel.find(">.grid-chart-panel").css("margin-top"));

    this.$ChartMenu.show().css({ left: point.X, top: point.Y + mtop });

    lastSelectSerice = obj;
    selectedSerice = true;

    this.PageIndex = 1;

    if (this.ChartNavigations.length < 2) {
        this.ChartNavigations = [];
        var selectChart = this.ChartSelector.GetSelected();
        var chartItem = $.extend({}, selectChart);
        chartItem.LegendValue = obj.data.seriesItem.Value;
        this.ChartNavigations.push(chartItem);
    }
    var chartItem = this.ChartNavigations[this.ChartNavigations.length - 1];
    chartItem.Value = obj.name;

    var clearLink = this.ChartPanel.find(">.clear-chart-condition");
    if (clearLink.length == 0) {
        clearLink = $("<div class='clear-chart-condition'><span class=\"glyphicon glyphicon-repeat\"></span> 全部</div>");
        this.ChartPanel.find(">.chart-nav").before(clearLink);
        clearLink.on("click", this, function (e) {
            var _this = e.data;
            _this.ChartNavigations = [];
            _this.LoadData();
            $(this).hide();
        });
    }
    clearLink.show();

    var state = this.GetViewState();
    PageRequest(this, "loaddata", state, this.BindData.bind(this));

    return false;
}

GridControl.prototype.OnDBClickChartSerice = function (params) {

}

GridControl.prototype.OnClickChartNav = function (e) {
    var $this = $(e.target);
    var _this = this;
    if (!$this.is(":last-child")) {
        var chartItem = $this.data("ChartItem");
        var nextAll = $this.nextAll().each(function () {
            if ($(this).is("a")) {
                var item = $(this).data("ChartItem");
                _this.ChartNavigations.Remove(item);
            }
        });
        nextAll.remove();
        if ($this.is(":first-child")) {
            $this.parent().empty();
            _this.ChartNavigations = [];
        }
        this.DisplayChart(chartItem);
    }
}

GridControl.prototype.InitChartMenu = function (jq) {
    var menuPanel = $("<div></div>").addClass("grid-chart-menu");
    jq.append(menuPanel);
    var fieldSelector = $("<div></div>").addClass("field-selector");
    menuPanel.append(fieldSelector);
    var input = $("<input />").appendTo(fieldSelector);
    var cols = this.Columns;

    this.ChartFieldSelector = input.Combobox({
        valueField: 'ID',
        textField: 'Name',
        Items: cols
    });


    var chartBar = $("<div></div>").addClass("chart-toolbar");
    menuPanel.append(chartBar);

    chartBar.append("<a href=\"javascript:void(0);\" title='柱状图' class=\"chart-bar-button\" data-type=\"" + ChartTypes.Column + "\"><span class=\"glyphicon glyphicon-stats\"></span></a>");
    chartBar.append("<a href=\"javascript:void(0);\" title='条形图' class=\"chart-bar-button\" data-type=\"" + ChartTypes.Bar + "\"><span class=\"glyphicon glyphicon-align-left\"></span></a>");
    chartBar.append("<a href=\"javascript:void(0);\" title='曲线图' class=\"chart-bar-button\" data-type=\"" + ChartTypes.Line + "\"><span class=\"glyphicon glyphicon-random\"></span></a>");
    chartBar.append("<a href=\"javascript:void(0);\" title='饼图' class=\"chart-bar-button\" data-type=\"" + ChartTypes.Pie + "\"><span class=\"glyphicon glyphicon-cd\"></span></a>");
    chartBar.append("<a href=\"javascript:void(0);\" title='漏斗图' class=\"chart-bar-button\" data-type=\"" + ChartTypes.Funnel + "\"><span class=\"glyphicon glyphicon-filter\"></span></a>");
    chartBar.append("<a href=\"javascript:void(0);\" title='往下钻取' class=\"chart-bar-button\" data-type=\"go\"><span class=\"glyphicon glyphicon-circle-arrow-right\"></span></a>");

    var selectedChart = this.ChartSelector.GetSelected();
    var selectedType = 0;
    if (selectedChart) {
        selectedType = selectedChart.ChartType;
        chartBar.find(">a[data-type='" + selectedType + "']").addClass("checked");
    }
    menuPanel.on("click", ">.chart-toolbar>.chart-bar-button", this.OnMenuBtnClick.bind(this));

    this.$ChartMenu = menuPanel;
}

GridControl.prototype.OnMenuBtnClick = function (e) {
    var $this = $(e.target).closest(".chart-bar-button");
    var type = $this.attr("data-type");
    if (type == "go") { //往下钻取
        var fieldCmb = this.ChartFieldSelector;
        var col = fieldCmb.GetSelected();
        if (col && lastSelectSerice) {

            var chartItem = this.ChartSelector.GetSelected(); //最原始的图表设置
            var chartOption = this.ChartObj.getOption();
            var val = lastSelectSerice.name;
            var navs = this.ChartNavigations;
            var lastChartItem = navs[navs.length - 1];
            lastChartItem.Value = val;

            var cateText = ChartProccesor.GetSericesText(chartOption, lastSelectSerice);

            var chartType = Z.ToInt($this.siblings(".checked").attr("data-type"));
            var newChartItem = {
                ChartType: chartType,
                CountType: chartItem.CountType,
                Text: String.Concat(col.Name, "(", cateText, ")"),
                Name: col.Name,
                ID: col.ID
            };
            navs.push(newChartItem);
            this.DisplayChart(newChartItem);

            if (navs.length == 2) {
                this.AddChartNav(lastChartItem);
            }
            this.AddChartNav(newChartItem);
        }
        this.$ChartMenu.hide();
    }
    else {
        $this.addClass("checked").siblings().removeClass("checked");
    }
}
GridControl.prototype.On = function (evt, func) {
    new PageRule(this, evt).Exec = func;
}
GridControl.prototype.AddChartNav = function (chartItem) {
    var $nav = this.ChartPanel.find(">.chart-nav");
    if ($nav.children().length > 0) {
        $nav.append("<span>></span>");
    }
    var a = $("<a></a>").html(chartItem.Text).attr("href", "javascript:void(0);");
    a.data("ChartItem", chartItem);
    $nav.append(a);
}

GridControl.prototype.DisplayChart = function (chart) {
    if (chart && this.ChartObj) {
        var myChart = this.ChartObj;
        myChart.clear();
        myChart.showLoading();
        var state = this.GetViewState();
        state.ChartNavigations = this.ChartNavigations;
        state.SelectedChart = this.ChartSelector.GetSelected();

        PageRequest(this, "loadchartdata", state, function (data) {
            var opts = ChartProccesor.GetChartOption(chart, data);
            if (typeof (opts) != 'string') {
                myChart.setOption(opts);
            }
            else {

            }

            myChart.hideLoading();
        });
    }
}
GridControl.prototype.ResizeChart = function () {
    if (this.ChartObj) {
        this.ChartObj.resize();
    }
}

var ChartTypes = {
    Column: 0, //柱状图
    Bar: 1, //条形图
    Line: 2, //折线图
    Pie: 3, //饼图
    Ring: 4, //环状图
    Funnel: 5, //漏斗图
    Radar: 6 //雷达(面积)图
}

var ChartProccesor = window.ChartProccesor || {};
(function () {
    ChartProccesor.GetChartOption = function (chartItem, rows) {
        switch (chartItem.ChartType) {
            case ChartTypes.Funnel:
            case ChartTypes.Pie:
            case ChartTypes.Ring:
                return GetPieChartOption(chartItem, rows);
            case ChartTypes.Bar: //条形
            case ChartTypes.Line: //曲线
            default: //column
                return GetAxisChartOption(chartItem, rows);
        }
    };
    var GetAxisChartOption = function (chartItem, series) {
        //坐标系
        var chartOpt = {
            grid: {
                backgroundColor: "#123",
                width: '80%',
                height: '70%',
                top: 'middle',
                left: 'center'
            },
            tooltip:
            {
                show: true,
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: function (params, ticket, callback) {
                    var xAxis = chartOpt.xAxis[0];
                    var yAxis = chartOpt.yAxis[0];
                    var arr = $.isArray(params) ? params : [params];
                    var cateData = (xAxis.type == 'category' ? xAxis : yAxis).data;
                    var obj = arr[0];
                    var txt = cateData.First(function (x) { return x.value == obj.name; }).text;//分组数据(文本);
                    var str = txt;
                    for (var x = 0; x < arr.length; x++) {
                        obj = arr[x];
                        var val = obj.name;
                        str += ("<br/>" + obj.seriesName + ":" + obj.value);
                    }
                    return str;
                }
            }
            //, color: ["#87cefa", "red"]
        };
        if (series.length > 1) {
            chartOpt.tooltip.trigger = 'axis';
        }
        chartOpt.legend = {
            data: []
        };
        if (series) {
            chartOpt.series = [];
            for (var z = 0; z < series.length; z++) {
                var seriesSetting = series[z];
                chartOpt.legend.data.push(seriesSetting.Name);
                var category = {
                    type: "category",
                    data: [],
                    axisLabel: {
                        formatter: function (val) {
                            var it = category.data.First(function (x) { return x.value == val; });
                            return it ? it.text : "";
                        }
                        //, interval: 0//标签显示挑选间隔，默认为'auto'，可选为：'auto'（自动隐藏显示不下的） | 0（全部显示） | {number}（用户指定选择间隔）
                    }
                };
                var seriesItem = {
                    name: seriesSetting.Name,
                    type: "bar",
                    data: []
                };
                var rows = seriesSetting.Data;
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    category.data.push({ value: row.X, text: GetChartText(row.X, row) });
                    seriesItem.data.push({ value: row.Y, seriesItem: seriesSetting });
                }

                var valData = {
                    type: "value"
                };
                switch (chartItem.ChartType) {
                    case ChartTypes.Bar: //条形
                        chartOpt.xAxis = [valData];
                        chartOpt.yAxis = [category];
                        break;
                    case ChartTypes.Line: //曲线
                        chartOpt.xAxis = [category];
                        chartOpt.yAxis = [valData];
                        seriesItem.type = "line";
                        break;
                    default: //column
                        chartOpt.xAxis = [category];
                        chartOpt.yAxis = [valData];
                        break;
                }
                chartOpt.series.push(seriesItem);
            }
        }
        return chartOpt;
    }
    var GetPieChartOption = function (chartItem, series) {
        //饼图系
        var chartOpt = {
            series: [],
            tooltip:
            {
                show: false,
                formatter: function (params, ticket, callback) {
                    var obj = $.isArray(params) ? params[0] : params;
                    var val = obj.name;
                    var txt = obj.data.text;
                    return series.length == 1 ? String.Concat(obj.seriesName, "<br/>", txt, ":", obj.value) : String.Concat(txt, "<br/>", obj.seriesName, ":", obj.value)
                }
            }
        };

        chartOpt.legend = {
            orient: "horizontal",//'vertical',
            left: 'left',
            data: [],
            formatter: function (name) {
                var opts = chartOpt;
                var legendData = opts.legend.data;
                var txt = legendData.First(function (o) { return o.name == name; }).text;
                return txt;
            }
        };
        if (series) {
            var total = 80, range = (total / series.length) * 0.4, width = (total / series.length) * 0.6;
            var r1 = 0, r2 = 30;//内外半径
            for (var z = 0; z < series.length; z++) {
                var seriesData = series[z];
                if (series.length == 1) {
                    r1 = 0;
                    r2 = total;
                    if (chartItem.ChartType == ChartTypes.Ring) {
                        r1 = 45;
                        r2 = 75;
                    }
                }
                else {
                    if (z != 0) {
                        r1 = r2 + range;
                        r2 = r1 + width;
                    }
                }
                var seriesItem = {
                    name: seriesData.Name,
                    type: "pie",
                    radius: [r1 + "%", r2 + '%'],
                    center: ['50%', '55%'],
                    data: [],
                    label: {
                        normal: {
                            show: false,
                            position: 'outside',
                            formatter: function (params) {
                                var obj = $.isArray(params) ? params[0] : params;
                                return String.Concat(obj.data.text, ":", obj.data.value);
                            }
                        },
                        emphasis: {//鼠标移上去时
                            show: false,
                            formatter: function (params) {
                                var obj = $.isArray(params) ? params[0] : params;
                                return String.Concat(obj.data.text, ":", obj.data.value);
                            }
                        }
                    }
                };
                var rows = seriesData.Data;
                var legendMap = {};
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    if (row.X && row.Y) {
                        var o = {
                            value: row.Y,
                            text: GetChartText(row.X, row),
                            name: row.X,
                            seriesItem: seriesData
                        };
                        seriesItem.data.push(o);
                        if (!legendMap[row.X]) {
                            var cateItem = $.extend({}, o);
                            cateItem.value = row.X;
                            chartOpt.legend.data.push(cateItem);
                            legendMap[row.X] = true;
                        }
                    }
                }
                switch (chartItem.ChartType) {
                    case ChartTypes.Funnel: //条形
                        seriesItem.type = "funnel";
                        break;
                    case ChartTypes.Pie: //曲线
                        seriesItem.type = "pie";
                        break;
                    default: //column
                        break;
                }
                chartOpt.series.push(seriesItem);
            }
        }
        return chartOpt;
    }
    var GetChartText = function (value, rows) {
        var row = $.isArray(rows) ? rows.First(function (row) { return row["X"] == value; }) : rows;
        if (row) {
            return row["T"] || value;
        }
    }
    var GetCategoryData = function (opts, seriesIndex) {
        var xAxis = opts.xAxis[seriesIndex];
        var yAxis = opts.yAxis[seriesIndex];
        return (xAxis.type == 'category' ? xAxis : yAxis).data;
    }
    ChartProccesor.GetSericesText = function (opts, obj) {
        var serices = opts.series[obj.seriesIndex];
        switch (serices.type) {
            case "pie":
            case "funnel":
                return obj.data.text;
            default:
                var cateData = GetCategoryData(opts, obj.seriesIndex);
                return cateData.First(function (x) { return x.value == obj.name; }).text;
        }
    }
})();

GridControl.prototype.ViewChanged = function (o) {
    this.SelectedView = o.data;
    this.PageIndex = 1;
    this.LoadData();
}

GridControl.prototype.AppendSearcher = function (sear, panel) {
    panel = panel || $(".grid-search-panel");
    sear.Title = sear.Title || sear.Name;
    sear.Page = this;
    var elem = sear.Build(panel);
    var type = sear.constructor.name;
    switch (type) {
        case "TextBox":
            elem.on("keyup", this, function (e) {
                if (e.keyCode == 13) {
                    var grid = e.data;
                    grid.Search();
                }
            });
            break;
    }
    sear.Element = elem;
}

GridControl.prototype.GetState = function () {
    var obj = {};
    obj.Selected = [];
    var rows = this.DataGrid.GetSelectedRows();
    for (var i = 0; i < rows.length; i++) {
        obj.Selected.push(rows[i]["ID"]);
    }
    obj.View = this.SelectedView && this.SelectedView.ID;
    obj.Searcher = {};
    for (var i = 0; i < this.Searchers.length; i++) {
        var sea = this.Searchers[i];
        obj.Searcher[sea.ID] = sea.Value();
    }
    return obj;
}
GridControl.prototype.BindData = function (data) {
    this.OnEvent("DataLoad");
    var d = {
        Columns: [],
        Rows: data.Data,
        MaxRow: data.MaxRow
    };
    for (var a in data.Data[0]) {
        d.Columns.push(a);
    }
    data = d;
    this.Data = data;
    var footRow = null;
    this.DataGrid.BindDataByDataTable(data);
    this.DataGrid.BindFooter(footRow);
    if (this.PageIndex == 1) {
        var count = Math.ceil(data.MaxRow / this.PageSize);
        this.DataGrid.RefreshPager({
            pageCount: count,
            pageIndex: 1
        });
        this.DataGrid.ShowDataCount(data.MaxRow);
    }
    //if (this.SelectedIDS) {
    //    this.DataGrid.SelectRowByID(this.SelectedIDS, true);
    //    this.SelectedIDS = null;
    //}
    this.OnEvent("DataBind");

}
GridControl.prototype.CreateFooterRow = function (data) {
    if (!data) return;
    if (data.Rows && data.Rows.length) {
        var last = data.Rows[data.Rows.length - 1];
        if (last[0] == -1) { //统计列
            var arr = data.Rows.splice(data.Rows.length - 1, 1)[0];
            var cols = data.Columns;
            var row = {};
            for (var j = 0; j < cols.length; j++) {
                row[cols[j]] = arr[j];
            }
            return row;
        }
    }

}
GridControl.prototype.GetViewState = function (isPageChange) {
    return {
        PageSize: this.PageSize,
        PageIndex: this.PageIndex,
        SearcherValues: this.GetSearchValues(),
        OrderBy: (this.SortColumn && this.SortColumn.OrderBy) || "DESC",
        SortColumn: (this.SortColumn && this.SortColumn.ID) || ""
    };
}
GridControl.prototype.GetQuickSearch = function () {
    if (!this.QuickSearchs || !this.QuickSearchs.length) return;
    var ary = {};
    for (var i = 0; i < this.QuickSearchs.length; i++) {
        this.QuickSearchs[i].GetSearch(ary);

    }
    return ary;
}
GridControl.prototype.LoadData = function (isPageChange) {
    var state = this.GetViewState(isPageChange);
    if (this.NoLoadData && !isPageChange) {
        if (!state.SearcherValues && !state.SelectedView && !state.QuickSearchs) return;
    }

    this.OnEvent("BeforeDataLoad");
    PageRequest(this, "GetModels", state, this.BindData.bind(this));
    if (!isPageChange && this.ChartSelector) {
        this.DisplayChart(this.ChartSelector.GetSelected());
    }
}
GridControl.prototype.ExportData = function (params) {
    PageRequest(this, "export" + params, this.GetViewState(), function (filename) {
        if (!filename) {
            Z.Error("导出数据失败");
            return;
        }
        EMW.Const.Util.AjaxDownload("/ExportFile/DownloadFile?fileName=" + filename);
    });
}
GridControl.prototype.GetSearchValues = function () {
    if (this.Searchers.length) {
        var searchValues = {};
        var isVal = false;
        for (var i = 0; i < this.Searchers.length; i++) {
            var ser = this.Searchers[i];
            var val = ser.Value();
            if (val) {
                searchValues[ser.ID] = val;
                isVal = true;
            }
        }
        if (!isVal) return null;
    }
    return searchValues;
}
GridControl.prototype.Search = function () {
    this.PageIndex = 1;
    this.Refresh();
}
GridControl.prototype.GetSelectedRows = function () {
    return this.DataGrid.GetSelectedRows();
}
GridControl.prototype.GetRows = function () {
    return this.DataGrid.GetRows();
}
GridControl.prototype.Refresh = function (isSelected) {
    if (!isSelected) {
        var rows = this.GetSelectedRows();
        this.SelectedIDS = [];
        if (rows && rows.length) {
            for (var i = 0; i < rows.length; i++) {
                this.SelectedIDS.push(rows[i].ID);
            }
        }
    }
    this.LoadData();
}
GridControl.prototype.OnEvent = function (evt) {
    //console.log(this.ID + ":" + evt +" "+ this.IsStopRule);
    if (this.IsStopRule) return;
    var ary = this["On" + evt];
    if (!ary) return;
    for (var i = 0; i < ary.length; i++) {
        if (ary[i].Exec(this) == false) return false;
    }
}
GridControl.prototype.Request = function (type, saveData, cb) {
    PageRequest(this, type, saveData, cb);
}
GridControl.prototype.OnServerEvent = function (elem, event, callback) {
    var rows = this.GetSelectedRows();
    var ids = [];
    for (var i = 0; i < rows.length; i++) {
        rows[i].ID && ids.push(rows[i].ID);
    }
    this.Request("event?elem=" + elem.ID + "&event=" + event, "select=" + ids.join(","), callback);
}

GridControl.prototype.SetRowStyle = function (css, indexOrRow) {
    var row = this.CurRow;
    if (indexOrRow != undefined) {
        if ($.isNumeric(indexOrRow)) row = this.Rows[indexOrRow];
        else row = indexOrRow;
    }
    if (!row.__Cells) return;
    var rowData = row.__Cells[this.Columns[0].ID].parent().data("data");
    rowData.Tr1.css(css);
    rowData.Tr2.css(css);
}
GridControl.prototype.SetColumnStyle = function (css, elem, rowIndex) {
    if (!elem) return;
    if (rowIndex != undefined) {
        var row = this.CurRow;
        if ($.isNumeric(rowIndex)) {
            row = this.Rows[rowIndex];
        } else {
            row = rowIndex;
        }
        if (row.__Cells) {
            row.__Cells[elem.ID].css(css);
        }
    } else {
        var cells = this.CurRow.__Cells;
        if (cells) {
            cells[elem.ID].css(css);
        }
    }
}
Z.Resource = function () {
    if (arguments.length == 0) return;
    var key = arguments[0], start, end, args, callback;
    for (var i = 1; i < arguments.length; i++) {
        var arg = arguments[i];
        if ($.isFunction(arg)) {
            callback = arg;
        } else if ($.isPlainObject(arg)) {
            args = arg;
        } else if ($.isNumeric(arg)) {
            start == undefined ? start = arg : end = arg;
        }
    }
    var page = { ID: 0 };
    var type = [];
    if (start)
        type.push("s=" + start);
    if (end)
        type.push("e=" + end);
    for (var item in args) {
        type.push(item + "=" + EMW.Const.encode(args[item]));
    }
    if (callback) {
        PageRequest(page, "resource?key=" + key, type.join("&"), function (x) {
            if (!x) return callback({ Rows: [] });
            x = Z.ParseData(x);
            callback(x);
        });
    } else {
        return PageRequest(page, type.join("&"), null);
    }

}

function ToolClick(item) {
    item.tool.Click(item);
}
function PageRequest(page, getdata, postdata, callback) {
    var url = page.url;

    if ($.isFunction(postdata)) callback = postdata;
    var options = {
        url: url,
        data: postdata,
        callBack: callback
    };
    return EMW.Const.Request(options);
}
function FormControl() {
    this.Elements = [];
    this.Tools = [];
    this.Name = "表单";
    this.RecordID = 0;
    this.ShowToolBar = true;
    this.ShowSaveAndClose = true;
    this.ShowSaveAndNew = false;
    this.ShowCopy = false;
    this.ShowMove = false;
    this.ShowSave = true;
    this.IsChanged = false;
    this.DescptionControl = null;
    this.ArgumentValues = GetArgument("Values");
    window.setTimeout(this.Init.bind(this), 100);
}
FormControl.prototype.On = GridControl.prototype.On;
FormControl.prototype.OnServerEvent = GridControl.prototype.OnServerEvent;
FormControl.prototype.Init = function (parent) {
    if (this.__isinit) return;
    this.__isinit = true;
    this.SetTitle(this.Name);
    console.log(this.VerifyTime);
    parent = parent || document.body;
    if (this.Flow) {
        this.Flow = new Flow(this.Flow);
        this.Flow.Page = this;
        this.Flow.AddTools(this.Tools);
    }
    this.InitToolBar(parent);

    this.Element = this.Container ? $(this.Container) : $(".form_content");
    if (this.Element.length == 0)
        this.Element = $("<div class='form_content'></div>").appendTo(parent);

    if (this.Navigation) {
        this.Navigation.Page = this;
        if (window.top.innerWidth > 768) this.Navigation.Build(parent);
    }
    this.Build();
    this.Element.keydown(this.KeyDown.bind(this));

    this.OnEvent("Load");
}
FormControl.prototype.KeyDown = function (e) {
    switch (e.keyCode) {
        case 13:
        case 9:
            this.ToNext();
            break;
    }
}
FormControl.prototype.ToNext = function () {
    console.log(this.Element.find(":focus"));
}
FormControl.prototype.GetTools = function (func) {
    var ary = [];
    func = func || this.Click.bind(this);
    var toolIndex = 0;
    if (!this.ReadOnly) {
        if (window.top.innerWidth > 768) {
            if (this.ShowSave) ary.push({ command: "save", icon: "content_save", text: "保存", desc: "保存数据", OnClick: func });
            if (this.ShowSaveAndClose) ary.push({ command: "saveandclose", icon: "save_close", text: "保存并关闭", desc: "保存数据，成功后关闭窗口", OnClick: func });
            if (this.ShowSaveAndNew) ary.push({ command: "saveandnew", icon: "content_save", text: "保存并新建", desc: "保存数据，成功后继续新建", OnClick: func });
        } else {
            if (this.ShowSaveAndClose) ary.push({
                command: "saveandclose", icon: "save_close", text: "保存并关闭", desc: "保存数据，成功后关闭窗口", OnClick: func
            });
        }
    }

    for (var i = 0; i < this.Tools.length; i++) {
        var tool = this.Tools[i];
        tool.Page = this;
        tool.ToolIndex = ary.length;
        if (tool.DisplayMoment) {
            if (tool.DisplayMoment == 1 && this.RecordID) continue;
            if (tool.DisplayMoment == 2 && !this.RecordID) continue;
        }
        ary.push({
            icon: tool.Icon || "save", text: tool.Name, desc: tool.Memo, tool: tool, OnClick: func
        });
    }
    if (this.Flow) {
        ary.push({
            icon: "navigation_menu", command: "flow", text: "流程", desc: "显示流程记录", tool: tool, OnClick: func
        });
    }
    return ary;
}
FormControl.prototype.InitToolBar = function (parent) {
    if (!this.ShowToolBar) {
        return;
    }
    var func = this.Click.bind(this);
    var ary = this.GetTools(func);
    if (this.ShowMove) {
        ary.push({ icon: "av_skip_previous", command: "move", text: "查看/修改第一条数据", dir: -2, OnClick: func });
        ary.push({ icon: "hardware_keyboard_arrow_left", command: "move", text: "查看/修改前一条数据", dir: -1, OnClick: func });
        ary.push({ icon: "hardware_keyboard_arrow_right", command: "move", text: "查看/修改后一条数据", dir: 1, OnClick: func });
        ary.push({ icon: "av_skip_next", command: "move", text: "查看/修改最后一条数据", dir: 2, OnClick: func });
    }
    if (this.AllowTalker && this.RecordID) {
        ary.push({ icon: "communication_chat", text: "讨论", OnClick: func, command: 'talker' });
    }
    var win = GetWindow();
    if (win) {
        win.ShowTools(ary);
        OnBeforeOK(function () {
            this.Save(function () {
                var data = this.FormData();
                window.Close(true, data);
            }.bind(this));
            return false;
        }.bind(this));
    }
}
FormControl.prototype.SetTitle = function (title) {
    var win = GetWindow();
    if (win) win.SetTitle(title);
}
FormControl.prototype.Click = function (tool) {
    var cmd = tool.command;
    switch (cmd) {
        case "save":
            this.Save();
            break;
        case 'saveandclose':
            this.Save(Close);
            break;
        case "saveandnew":
            this.Save(null, true);
            break;
        case "flow":
            this.Flow && this.Flow.ShowFlowInfo();
            break;
        case "talker":
            this.OpenTalker();
            break;
        case "move":
            this.MoveData(tool.dir);
            break;
        default:
            tool.tool && tool.tool.Click();
            break;
    }
}
FormControl.prototype.MoveData = function (dir) {
    var win = GetWindow();
    if (win) {
        win = win.OpenerWindow;
        if (win && win._control && win._control.MoveSelect) {
            win._control.MoveSelect(dir);
        }
    }
}
FormControl.prototype.OpenTalker = function () {
    var win = EMW.UI.Window({
        url: "/pages/talker/main.html",
        title: this.Name,
        width: 600,
        height: GetWindow().options.height
    });
    win.RecordID = this.RecordID;
    win.UserNoteType = 6;
    win.DataHandler = this;
}
FormControl.prototype.FormData = function () {
    var data = {};
    data.RecordID = this.RecordID || 0;
    data.VerifyTime = this.VerifyTime || 0;
    for (var i = 0; i < this.Elements.length; i++) {
        if (this.Elements[i].Save(data) == false) return false;
    }
    return data;
}
FormControl.prototype.Save = function (handler, isnew) {
    if (this.Saving) return;
    this.Saving = true;
    window.setTimeout(function () { this.Saving = false; }.bind(this), 3000);

    if (this.OnEvent("BeforeSave") == false)
        return;

    var data = this.FormData();
    if (!data)
        return;
    var action = isnew ? "save?newdata=1" : "save";
    PageRequest(this, action, data, this.SaveOver.bind(this, handler));
}
FormControl.prototype.SaveOver = function (handler, r) {
    if (r.Code <= 0) {
        return Z.Error(r.Message || "保存失败。");
    }
    if (!this.RecordID) {
        this.RecordID = r.Code;
    }
    this.OnEvent("EndSave");
    var newForm = this.ReInit(r.Result);
    this.Refresh();
    if (handler) {
        return handler(newForm);
    } else {
        Z.Show(r.Message || "保存成功");
    }
}
FormControl.prototype.ReInit = function (code) {

    var parent = this.Element.parent();
    parent.children(".form_content").remove();
    //parent.empty();
    var obj = eval(code);
    if (!obj) return;
    obj.Init(parent);
    return obj;
}
FormControl.prototype.Refresh = function (refreshParent) {
    //window.location.href = "/page/" + this.ID + "?rid=" + this.RecordID;
    var win = GetWindow();
    if (win) {
        win = win.OpenerWindow;
        if (win && win._control && win._control.Refresh) win._control.Refresh();
    }
}
FormControl.prototype.Build = function () {
    for (var i = 0; i < this.Elements.length; i++) {
        this.Elements[i].Build(this.Element);
    }
}
FormControl.prototype.AddElement = function (p, e) {
    if (!p.Elements) p.Elements = [];
    e.Parent = p;
    e.Page = this;
    if (this.ReadOnly && (!e.State || e.State < 2)) e.State = ElementStates.ReadOnly;
    else {
        if (p.State && !e.State) {
            e.State = p.State;
        }
    }
    if (this.ArgumentValues) {
        var v = this.ArgumentValues[e.ID];
        if (v) {
            e.DefaultValue = v;
            if (e.IsSearcher) {
                e.CurRow = {};
                e.CurRow[e.TextColumn] = this.ArgumentValues["T_" + e.ID];
                e.CurRow[e.ValueColumn] = v;
            }
        }
    }
    p.Elements.push(e);
}
FormControl.prototype.Request = function (type, saveData, cb) {
    var data = saveData;
    if (saveData == true) {
        saveData = this.FormData();
        if (saveData == false) {
            return;
        }
    }
    else if (saveData == false) saveData = null;
    PageRequest(this, type, saveData, cb);
}
FormControl.prototype.OnEvent = GridControl.prototype.OnEvent;
function IsNull(v) {
    return v === "" || v === undefined || v === null;
}
var ElementStates = {
    NoSet: 0, Normal: 1, ReadOnly: 2, Hidden: 3
};
function TextBox() {
    this.ID = null;
    this.Element = null;
    this.Page = null;
    this._Value = "";
    this.IsAllowWrap = false;
}
TextBox.prototype.IsAllowNull = true;
TextBox.prototype.Build = function (parent) {
    if (this.Element) {
        this.Element.remove();
    }
    if (!this.Page.RecordID) this._Value = this.DefaultValue;
    if (this.IsAllowWrap) {
        this.Element = $("<div " + (this.State == ElementStates.Hidden ? "style='display:none'" : "") + "  class='section-item '><div class='title'>" + this.Title
           + (this.IsAllowNull ? "" : "<span class='notnull'>*</span>") + "</div><div class='input" + (this.State == ElementStates.ReadOnly ? " readonly" : "") + "'><textarea "
           + (this.State == ElementStates.ReadOnly ? "readonly" : "") + " type='text' class='text-box'/></textarea></div>");
        this.Input = this.Element.find("textarea");
        if (this.Height) this.Input.height(this.Height);
    } else {
        this.Element = $("<div " + (this.State == ElementStates.Hidden ? "style='display:none'" : "") + "  class='section-item'><div class='title'>" + this.Title
           + (this.IsAllowNull ? "" : "<span class='notnull'>*</span>") + "</div><div class='input" + (this.State == ElementStates.ReadOnly ? " readonly" : "") + "'><input "
           + (this.State == ElementStates.ReadOnly ? "readonly" : "") + " type='text' class='text-box'/></div></div>");
        this.Input = this.Element.find("input");
    }

    this.BindEvent();
    if (this._Value != undefined) this.Input.val(this.Formatter());
    parent.append(this.Element);

    return this.Element;
}
TextBox.prototype.SetTitle = function (text) {
    this.Title = text;
    if (this.IsRepeat) {
        this.Parent.SetColumnHeader(this);
    } else {
        this.Element.find(".title").html(text + (this.IsAllowNull ? "" : "<span class='notnull'>*</span>"));
    }

}
TextBox.prototype.BindEvent = function () {
    this.Input.blur(this.FocusChange.bind(this, false));
    this.Input.focus(this.FocusChange.bind(this, true));
    this.Input.keyup(this.InputEvent.bind(this));
}
TextBox.prototype.FocusChange = function (isin) {
    if (isin) {
        if (this.Format)
            this.Input.val(this._Value);
        this.OnEvent("Focus");
    } else if (!isin) {

        if (this.Format)
            this.Input.val(this.Formatter());
        this.OnEvent("Blur");
    }
}
TextBox.prototype.SetState = function (state) {
    if (state == this.State) return;
    this.State = state;
    if (this.IsRepeat) this.Parent.SaveState(this);
    if (!this.Element) return;
    switch (state) {
        case 1:
            this.Input.removeProp("readonly");
            this.Element.show();
            break;
        case 2:
            this.Input.prop("readonly", true);
            this.Element.show();
            break;
        case 3:
            this.Element.hide();
            break;
    }
}
TextBox.prototype.BuildForRepeat = function (td) {
    this.Element = $("<input type='text' class='text-box'>");
    this.Input = this.Element;
    this.BindEvent();
    if (this._Value != undefined) this.Input.val(this._Value);
    td.html(this.Element);
}
TextBox.prototype.Formatter = function () {
    if (!this.Format) return this._Value;
    if (!this._Value) return this._Value;
    switch (this.DBType) {
        case 2:
            return parseInt(this._Value).ToString(this.Format);
        case 3:
        case 5:
            return parseFloat(this._Value).ToString(this.Format);
        case 4:
            return Z.ToDate(this._Value).ToString(this.Format);

    } return this._Value;
}
TextBox.prototype.Value = function (v) {
    if (arguments.length) {
        if (this._Value != v) {
            if (this.DBType == 2 || this.DBType == 3 || this.DBType == 5) {
                if (v == null || v == undefined || v.toString() == "NaN") v = "";
            }
            this._Value = v;
            if (this.Element) this.Input.val(this.Formatter());
            else if (this.IsRepeat) this.Parent.UpdateColumn(this);
            this.OnEvent("Change");
        }
    }
    return this._Value;
}
TextBox.prototype.InputEvent = function () {
    this._Value = this.Input.val();
    if (this.IsRepeat) {
        this.Parent.CurRow[this.ID] = this._Value;
    }
    this.OnEvent("Change");
}
TextBox.prototype.OnEvent = FormControl.prototype.OnEvent;
TextBox.prototype.Check = function (v) {
    if (IsNull(v) && !this.IsAllowNull) {
        return Z.Error(this.Title + "不能为空。");
    }
    //各种检测
    return true;
}
TextBox.prototype.Save = function (ds) {
    var v = this.Value();
    if (!this.Check(v)) {
        return false;
    }
    ds[this.ID] = v;
}
TextBox.prototype.StopRule = function (isstop) {
    this.IsStopRule = isstop;
}


function Label() {
    this.ID = null;
    this.Element = null;
    this._Value = "";
}
Inherits(Label, TextBox);
Label.prototype.FormatColumn = function (val) {
    if (!this._Value) return this._Value;
    return this._Value;
}
Label.prototype.Value = function (v) {
    if (arguments.length) {
        if (this.Element) {
            this.Input.val(v)
        } else {
            this._Value = v;
        }
    } else {
        return this.Element ? this.Input.val() : this._Value;
    }
}

Label.prototype.Build = function (parent) {
    this.Element = $("<div class='section-item'><span class='section-label'>" + this.Title + "</span><div>").appendTo(parent);
    return this.Element;
}
Label.prototype.Save = function () {

}
function LabelColumn() {

}
Inherits(LabelColumn, Label);
LabelColumn.prototype.FormatColumn = function (val) {
    if (this.FormatFun) {
        return this.FormatFun.apply(this, $.makeArray(arguments));
    }
    return this._Value;
}
LabelColumn.prototype.SetState = function (state) {
    if (state == this.State) return;
    this.State = state;
    if (this.State == ElementStates.Hidden) {
        $(".datagrid-cell-" + this.ID).hide();
    } else {
        $(".datagrid-cell-" + this.ID).show();
    }
}
LabelColumn.prototype.Value = function (v) {
    if (arguments.length) {
        this._Value = v;
    } else {
        if (this._Value) {
            if (this.DBType == 2 || this.DBType == 3 || this.DBType == 5) {
                return this._Value.replace(/,/g, "");
            }
            return this._Value;
        }
        return this._Value;
    }
}

function LinkColumn() {

}
Inherits(LinkColumn, LabelColumn);
LinkColumn.prototype.FormatColumn = function (val) {
    if (this.FormatFun) {
        return this.FormatFun.apply(this, $.makeArray(arguments));
    }
    if (!this._Value) return this._Value;
    return "<a href='javascript:void(0);'>" + this._Value + "</a>";
}
LinkColumn.prototype.ClickColumn = function () {
    if (this.OnEvent("Click") == false) return;
    if (!this.PageID) return;
    var dia = EMW.UI.Window({
        url: "/page/" + this.PageID,
        title: "页面",
        height: 600,
        width: 800
    });
}
function SearcherColumn() {

}
Inherits(SearcherColumn, LabelColumn);
SearcherColumn.prototype.Text = function () {
    return this.Page.CurRow["T_" + this.ID];
}
SearcherColumn.prototype.FormatColumn = function (val, rowdata, col) {
    if (this.FormatFun) {
        return this.FormatFun.apply(this, $.makeArray(arguments));
    }
    if (!this._Value) return this._Value;
    var text = rowdata["T_" + this.ID] || "";
    return "<div class='searcher-column'><span class='glyphicon glyphicon-" + (this.Icon || "")
        + " searcher-icon'></span><a href='javascript:void(0);'>" + text + "</a></div> ";
}
SearcherColumn.prototype.ClickColumn = function () {
    if (this.OnEvent("Click") == false) return;
    if (!this.FormID) {
        return;
    }
    var dia = EMW.UI.Window({
        url: "/page/" + this.FormID + "?rid=" + this.Value(),
        title: "表单",
        height: 600,
        width: 800
    });
}

function OperationColumn() {

}
Inherits(OperationColumn, LabelColumn);
OperationColumn.prototype.FormatColumn = function (val) {
    if (this.FormatFun) {
        return this.FormatFun.apply(this, $.makeArray(arguments));
    }
    if (!this._Value) return this._Value;
    return "<a href='javascript:void(0);'>" + this._Value + "</a>";
}
OperationColumn.prototype.ClickColumn = function () {
    if (this.OnEvent("Click") == false) return;
    if (!this.PageID) return;

}

function ImageColumn() {

}
Inherits(ImageColumn, LabelColumn);
ImageColumn.prototype.FormatColumn = function (val) {
    if (this.FormatFun) {
        return this.FormatFun.apply(this, $.makeArray(arguments));
    }
    if (!this._Value) return this._Value;
    return "<img src='" + this._Value + "'/>";
}
ImageColumn.prototype.ClickColumn = function () {
    if (this.OnEvent("Click") == false) return;
    if (!this.PageID) return;

}

function DropDownList() {
    this.ID = null;
    this.Element = null;
    this._Value = "";
}
Inherits(DropDownList, TextBox);
DropDownList.prototype.Build = function (parent) {
    this.Element = $("<div " + (this.State == ElementStates.Hidden ? "style='display:none'" : "") + " class='section-item'><div class='title'>" + this.Title
+ (this.IsAllowNull ? "" : "<span class='notnull'>*</span>") + "</div><div class='input" + (this.State == ElementStates.ReadOnly ? " readonly" : "") + "'><input type='text'" + " placeholder=" + this.Title + " class='text-box'/></div></div>").appendTo(parent);
    this.Input = this.Element.find("input");
    /*this.Element = $("<div " + (this.State == ElementStates.Hidden ? "style='display:none'" : "") + " class='section-item'>" 
    + "<div class='input'><input" + "placeholder=" + this.Title + (this.IsAllowNull ? "" : "*") + "type='text' class='text-box'/></div></div>").appendTo(parent);
    this.Input = this.Element.find("input");*/

    this.Combobox = this.Input.Combobox({
        Items: this.SelectItems,
        disabled: this.State == ElementStates.ReadOnly,
        multiple: this.AllowMulti,
    }).OnChanged(this.OnValueChanged.bind(this));
    if (!this.Page.RecordID) this._Value = this.DefaultValue;
    if (this._Value != undefined) this.Combobox.SetValue(this._Value, true);

    this.OnEvent("Init");

    return this.Element;
}
DropDownList.prototype.AddItem = function (o) {
    this.Combobox.AddItem(o);
}

DropDownList.prototype.Clear = function (o) {
    this.Combobox.Clear(o);
}
DropDownList.prototype.OnValueChanged = function (e) {
    var d = e.Data;
    if (d) {
        if (this.multiple) {
            var val = this._Value;
            if (this.Combobox.options.IsSet) {
                if (val.toString().indexOf(this.Combobox.options.separator) <= -1)
                { str = ""; } else {
                    var aa = val.split(this.Combobox.options.separator), str = "";
                    for (var i = 0; i < aa.length; i++) {
                        if (aa[i] == d.Value) continue;
                        str = str.concat(aa[i] + this.Combobox.options.separator)
                    }
                    str = str.substr(0, str.length - 1);
                }
                this._Value = str;
                return;
            }
            if (!this._Value) {
                this._Value = "";
                this._Value = d.Value;
            } else {
                this._Value = val.toString().concat(this.Combobox.options.separator + d.Value);
            }
        } else {
            this._Value = d.Value;
        }
    } else {
        this._Value = null;
    }
    this.OnEvent("Change");
}
DropDownList.prototype.BindData = function (data) {
    this.Combobox.BindData(data);
}

DropDownList.prototype.BuildForRepeat = function (td) {
    this.Element = $("<input type='text' class='text-box'/>");
    this.Input = this.Element;
    td.html(this.Element);
    this.Combobox = this.Input.Combobox({
        Items: this.SelectItems
    }).OnChanged(this.OnValueChanged.bind(this));
    if (this._Value != undefined) this.Combobox.SetValue(this._Value, true);
}
DropDownList.prototype.SetState = function (state) {
    if (state == this.State) return;
    this.State = state;
    if (this.IsRepeat) this.Parent.SaveState(this);
    if (!this.Element) return;
    switch (state) {
        case 1:
            this.Combobox.Enable();
            this.Element.show();
            break;
        case 2:
            this.Combobox.Disable();
            this.Element.show();
            break;
        case 3:
            this.Element.hide();
            break;
    }
}
DropDownList.prototype.Formatter = function (v) {
    if (v == undefined) return "";
    for (var i = 0; i < this.SelectItems.length; i++) {
        var item = this.SelectItems[i];
        if (item.Value == v) return item.Text;
    }
    return v;
}
DropDownList.prototype.Value = function (v) {
    if (arguments.length) {
        if (this._Value == v) return;
        this._Value = v;
        if (this.Element) {
            this.Combobox.SetValue(v, true);
        } else if (this.IsRepeat) {
            this.Parent.UpdateColumn(this);
        }
        this.OnEvent("Change");
    } else {
        return this._Value;
    }
}
DropDownList.prototype.Text = function () {
    if (this.Combobox)
        return this.Combobox.GetText();
    var val = this._Value;
    if (val == undefined || val == null) return "";
    for (var i = 0; i < this.SelectItems.length; i++) {
        var item = this.SelectItems[i];
        if (item.Value == val) return item.Text;
    }
    return "";
}

function Section() {
    this.Elements = [];
    this.Columns = 3;
    this.Layout = "TB";
    this.IsHeader = true;
}
Inherits(Section, TextBox);
Section.prototype.Build = function (parent) {
    this.Element = $('<div ' + (this.State == ElementStates.Hidden ? "style='display:none'" : "") + ' class="form-section formlayout-' + this.Layout + '" id="' + this.ID + '"><div class="section-header"><span class="glyphicon section-icon"></span><span class="section-title">' + this.Title
        + '</span></div><div class="section-body"></div></div>');
    this.Element.Section();
    if (!this.IsHeader) {
        this.Element.find(".section-header").hide();
    }
    this.Content = this.Element.find(".section-body");
    parent.append(this.Element);
    for (var i = 0; i < this.Elements.length; i++) {
        var child = this.Elements[i].Build(this.Content);
        var colspan = this.Elements[i].Colspan || 1;
        if (colspan == 2) {
            child.attr("style", (child.attr("style") || "") + ";width:" + (96.8 / this.Columns * colspan) + "%");
        } else {
            child.attr("style", (child.attr("style") || "") + ";width:" + (95 / this.Columns * colspan) + "%");
        };
    }
    if (this.State == ElementStates.Hidden) this.Page.Navigation && this.Page.Navigation.SetItemVisible(this);
    return this.Element;
}
Section.prototype.Save = function (ds) {
    for (var i = 0; i < this.Elements.length; i++) {
        if (this.Elements[i].Save(ds) == false) return false;
    }
}
Section.prototype.SetItemsState = function (state) {
    for (var i = 0; i < this.Elements.length; i++) {
        this.Elements[i].SetState(state);
    }
}
Section.prototype.SetState = function (state) {
    if (state == this.State) return;
    this.State = state;
    this.SetItemsState(state);
    switch (state) {
        case 1:
            this.Element.show();
            break;
        case 2:
            this.Element.show();
            break;
        case 3:
            this.Element.hide();
            break;
    }
    this.Page.Navigation && this.Page.Navigation.SetItemVisible(this);
}

function CheckBox() {
    this.IsSingleCheck = false;
    this.SPLITER = ",";
    this.InputType = "checkbox";
    this._Value = "";
}
Inherits(CheckBox, TextBox);
CheckBox.prototype.Build = function (parent) {
    var html = ["<div " + (this.State == ElementStates.Hidden ? "style='display:none'" : "") + " class='section-item'><div class='title'>"];
    html.push(this.Title);
    html.push(this.IsAllowNull ? "" : "<span class='notnull'>*</span>");
    var val = this.Page.RecordID ? this._Value : this.DefaultValue;
    html.push("</div><div class='input'> ");
    if (this.SelectItems) {
        for (var i = 0; i < this.SelectItems.length; i++) {
            html.push("<label>");
            html.push("<input name='" + this.ID + "'  " + ((val & this.SelectItems[i].Value) == this.SelectItems[i].Value ? "checked" : "") +
                 (this.State == ElementStates.ReadOnly ? " disabled " : "") + "  type='" + this.InputType + "' value='" + this.SelectItems[i].Value + "'/>");
            html.push(this.SelectItems[i].Text);
            html.push("</label>");
        }
    }
    html.push("</div>");
    this.Element = $(html.join("")).appendTo(parent);
    this.Element.on("click", "input", this.ClickChange.bind(this));

    return this.Element;
}
CheckBox.prototype.ClickChange = function (e) {
    var elem = $(e.target);
    if (elem.is("label")) {
        elem = elem.find("input");
    }
    var val = $(elem).val();
    if (!val) return;
    this._Value = (this._Value || 0) | val;
    this.OnEvent("Change");
}
CheckBox.prototype.BuildForRepeat = function (td) {
    var html = ["<DIV  class='form-checkbok-repeat' style='width:" + td.width() + "px;'>"];
    if (this.SelectItems) {
        var val = this._Value;
        for (var i = 0; i < this.SelectItems.length; i++) {
            html.push("<label>");
            html.push("<input name='" + this.ID + "' type='" + this.InputType + "' " + ((val & this.SelectItems[i].Value) == this.SelectItems[i].Value ? "checked" : "") + " value='" + this.SelectItems[i].Value + "'/>");
            html.push(this.SelectItems[i].Text);
            html.push("</label>");
        }
    }
    html.push("</div>");
    td.empty();
    this.Element = $(html.join("")).appendTo(document.body);
    this.Element.position({
        at: "left top",
        my: "left top",
        of: td
    });

    this.Element.click(this.ClickChange.bind(this));
}
CheckBox.prototype.EndEdit = function () {
    this.Element.remove();
}
CheckBox.prototype.Formatter = function (v) {
    if (!this._Value) return "";
    var val = [];
    for (var i = 0; i < this.SelectItems.length; i++) {
        var item = this.SelectItems[i];
        if (this.IsSingleCheck && item.Value == this._Value) {
            return item.Text;
        } else if ((item.Value & this._Value) == item.Value) {
            val.push(item.Text);
        }
    }
    return val.join(",");
}
CheckBox.prototype.SetState = function (state) {
    if (state == this.State) return;
    this.State = state;
    if (this.IsRepeat) this.Parent.SaveState(this);
    if (!this.Element) return;
    switch (state) {
        case 1:
            this.Element.show();
            this.Element.find("input").removeProp("disabled");
            break;
        case 2:
            this.Element.show();
            this.Element.find("input").prop("disabled", true);
            break;
        case 3:
            this.Element.hide();
            break;
    }
}
CheckBox.prototype.Value = function (v) {
    if (arguments.length) {
        if (this.Element) {
            this.SetValue(arguments[0]);
        } else {
            this._Value = arguments[0];
            if (this.IsRepeat) this.Parent.UpdateColumn(this);
        }
    } else {
        return this.Element ? this.GetValue() : this._Value;
    }
}
CheckBox.prototype.SetValue = function (v) {
    v = v || 0;
    var isChanged = false;
    var chks = this.Element.find("input");
    for (var i = 0; i < chks.length; i++) {
        var chk = $(chks[i]);
        var value = Z.ToInt(chk.val());
        if ((this.IsSingleCheck && value == v) || (!this.IsSingleCheck && ((v & value) == value))) {
            if (!chk.is(":checked")) {
                isChanged = true;
                chk.prop("checked", true);
            }
        }
        else {
            if (chk.is(":checked") == true) {
                isChanged = true;
                chk.prop("checked", false);
            }
        }
    }

    isChanged && this.OnEvent("Change");
}
CheckBox.prototype.GetValue = function () {
    var vs = 0;
    var chks = this.Element.find("input:checked");
    for (var i = 0; i < chks.length; i++) {
        var item = $(chks[i]);
        var v = Z.ToInt(item.val());
        if (this.IsSingleCheck) {
            return v;
        }
        vs += v;
    }
    return vs ? vs : undefined;
}
CheckBox.prototype.IsHas = function (v) {
    var value = this.Value() || 0;
    return (value & v) == v;
}

function RadioButton() {
    this.IsSingleCheck = true;
    this.SPLITER = ",";
    this.InputType = "radio";
}
Inherits(RadioButton, CheckBox);


function Searcher() {
    this.Columns = [];
    this.Parameters = {};
    this.PanelWidth = 0;
    this._Value = "";
}
Inherits(Searcher, TextBox);
Searcher.prototype.Build = function (parent) {
    this.Element = $("<div " + (this.State == ElementStates.Hidden ? "style='display:none'" : "") + " class='section-item'><div class='title'>" + this.Title
    + (this.IsAllowNull ? "" : "<span class='notnull'>*</span>") + "</div><div class='input" + (this.State == ElementStates.ReadOnly ? " readonly" : "") + "'><input type='text'   class='text-box'></div></div>");

    parent.append(this.Element);
    this.Searcher = this.Element.find("input").Searcher({
        dataKey: this.SearchKey,
        textField: this.TextColumn,
        valueField: this.ValueColumn,
        columns: [this.Columns],
        disabled: this.State == 2,
        panelWidth: this.PanelWidth,
        multiple: this.AllowMulti
    }).OnShowPanel(this.LoadData.bind(this)).OnChanged(this.Changed.bind(this))
    .OnBeforeSelect(this.OnBeforeChanged.bind(this))
    .OnCreateGrid(this.OnCreateGrid.bind(this));
    if (!this.Page.RecordID) {
        this._Value = this.DefaultValue;
        if (this.CurRow) {
            this._Text = this.CurRow[this.TextColumn];
        }
    }
    if (this._Value != undefined && !this.CurRow) {
        this.CurRow = {};
        this.CurRow[this.ValueColumn] = this._Value;
        this.CurRow[this.TextColumn] = this._Text;
    }
    if (this.CurRow) {
        this.Searcher.SetRow(this.CurRow, true);
    }
    return this.Element;
}
Searcher.prototype.IsSearcher = true;
Searcher.prototype.OnBeforeChanged = function (e) {
    var r = this.OnEvent("BeforeChange");
    if (r == false) e.IsStop = true;
}
Searcher.prototype.OnCreateGrid = function (arg) {
    if (this.RelPageID) {
        var grid = arg.Data;
        if (grid && grid.panel) {
            var panel = grid.panel.find(">.datagrid-pager");
            var icon = $("<span title='添加数据' class=\"searcher-add glyphicon icon-action_note_add\"></span>");
            panel.prepend(icon);
            icon.click(this.OnOpenPage.bind(this));
        }
    }
}
Searcher.prototype.OnOpenPage = function () {
    var pid = this.RelPageID;
    if (!pid) return false;
    var url = [];
    url.push("/Page/");
    url.push(pid);
    url.push("?");
    var rid = this.Page.RecordID;
    if (rid) {
        url.push("rid=");
        url.push(rid);
    }
    if (this.Page.TID) {
        url.push("&tid=");
        url.push(this.Page.TID);
    }
    if (this.Page.MainTable) {
        url.push("&mtid=");
        url.push(this.Page.MainTable);
    }
    if (this.Page.MainRecord) {
        url.push("&mrid=");
        url.push(this.Page.MainRecord);
    }
    this.Searcher.HideDropPanel();
    var dia = EMW.UI.Window({
        url: url.join(""),
        title: this.RelPageName,
        height: "auto",
        width: 800,
        OnClose: (function () {
            this.IsLoadData = false;
            this.SearcherData = null;
        }).bind(this)
    });
}
Searcher.prototype.Changed = function (e) {
    var cr = this.CurRow;
    this.CurRow = this.Searcher.GetSelected();
    if (this.CurRow) {
        var newVal = this.CurRow[this.ValueColumn];
        var newText = this.CurRow[this.TextColumn];
        if (this.Searcher.combo.options.changCru) {
            var nVal = "", nText = "";
            if (this._Value.toString().indexOf(",") <= -1) {
                nVal = "";
                nText = "";
            } else {
                var crVal = this._Value.split(",");
                var crText = this._Text.split(",");
                for (var i = 0; i < crVal.length; i++) {
                    if (crVal[i] != newVal) {
                        nVal = nVal.concat(crVal[i] + ",");
                        nText = nText.concat(crText[i] + ",");
                    }
                }
                nVal = nVal.substr(0, nVal.length - 1);
                nText = nText.substr(0, nText.length - 1);
            }
            this._Value = nVal;
            this._Text = nText;

            this.Searcher.combo.options.changCru = false;
        } else {
            if (this.AllowMulti && cr) {
                var newVal = this.CurRow[this.ValueColumn];
                var newText = this.CurRow[this.TextColumn];
                this._Value = this._Value.toString().concat("," + newVal)
                this._Text = this._Text.concat("," + newText)
            } else {
                this._Value = this.CurRow[this.ValueColumn];
                this._Text = this.CurRow[this.TextColumn];
            }
        }
    } else {
        this._Value = "";
        this._Text = "";
    }
    this.OnEvent("Change");
}
Searcher.prototype.Formatter = function (v) {
    if (v == undefined) return "";
    return this._Text;
}
Searcher.prototype.GetColumnValue = function (name) {
    if (!this.CurRow) return;
    return this.CurRow[name];
}
Searcher.prototype.LoadData = function (sea, arg) {
    this.OnEvent("BeforeLoad");
    if (this.IsLoadData) return;
    if (this.SearcherData) {
        this.Searcher.BindData(this.SearcherData);
        this.IsLoadData = true;
        return;
    }
    this.IsLoadData = true;
    this.Searcher.BindData([]);
    var url = "searcher?elem=" + this.ID;
    for (var item in this.Parameters) {
        url += "&" + item + "=" + EMW.Const.encode(this.Parameters[item]);
    }
    PageRequest(this.Page, url, null, function (data) {
        this.SearcherData = data ? Z.ParseData(data).Rows : [];
        this.Searcher.BindData(this.SearcherData);
    }.bind(this));
}
Searcher.prototype.SetDefault = function (v, text) {
    //设置默认选中的行，不触发更改事件
    var row = this.GetRowByValue(v);
    if (!row) {
        row = {};
        row[this.ValueColumn] = v;
        row[this.TextColumn] = text;
    }
    this._Value = v;
    this._Text = text;
    this.CurRow = row;
    if (this.Element) {
        this.Searcher.SetRow(row, true);
    } else if (this.Parent) {
        this.Parent.UpdateColumn(this);
    }
}
Searcher.prototype.As = function (elem) {
    this.CurRow = elem.CurRow;
    this._Value = elem._Value;
    this._Text = elem._Text;
    if (this.Parent) {
        this.Parent.UpdateColumn(this);
    }
    this.OnEvent("Change");
}
Searcher.prototype.SetState = function (state) {
    if (state == this.State) return;
    this.State = state;
    if (this.IsRepeat) this.Parent.SaveState(this);
    if (!this.Element) return;
    switch (state) {
        case 1:
            this.Element.show();
            this.Searcher.Enable();
            break;
        case 2:
            this.Element.show();
            this.Searcher.Disable();
            break;
        case 3:
            this.Element.hide();
            break;
    }
}
Searcher.prototype.FormatColumn = function (val, row, col) {
    if (!val) return "";
    var format = col.format;
    if (!format) return val;
    if (format.dbtype) {
        switch (format.dbtype) {
            case 4:
                this._Value = Z.ToDate(val).ToString(format.format);
                return this._Value;
                break;
            case 3:
            case 5:
                return parseFloat(val).ToString(format.format);
                break;
        }
    } else {
        if (format.mul) {
            var vs = [];
            val == parseInt(val);
            for (var item in format) {
                var v = parseInt(item);
                if ((v & val) == v) {
                    vs.push(format[v]);
                }
            }
            return vs.join();
        } else {
            return format[val] || "";
        }
    }
    return val;
}
Searcher.prototype.AddColumn = function (title, width, format) {
    var col = {
        title: title, field: title, width: width, Formatter: this.FormatColumn, format: format
    };
    this.Columns.push(col);
    this.PanelWidth += width;
}
Searcher.prototype.Text = function () {
    if (!arguments.length)
        return this._Text;

}
Searcher.prototype.GetRowByValue = function (v) {
    if (!this.SearcherData) return null;
    for (var i = 0; i < this.SearcherData.length; i++) {
        var row = this.SearcherData[i];
        if (row[this.ValueColumn] == this._Value) {
            return row;
        }
    }
}
Searcher.prototype.SetValue = function (v) {
    if (this._Value == v) return;
    this._Value = v;
    if (IsNull(v)) {
        this._Text = v;
        this.Element && this.Searcher.SetRow(null);
    } else {
        if (!this.SearcherData) {
            var url = "searcher?elem=" + this.ID;
            for (var item in this.Parameters) {
                url += "&" + item + "=" + EMW.Const.encode(this.Parameters[item]);
            }
            var dt = PageRequest(this.Page, url, null);
            this.SearcherData = dt ? Z.ParseData(dt).Rows : [];
        }
        this.CurRow = this.GetRowByValue(this._Value);
        if (this.CurRow)
            this._Text = this.CurRow[this.TextColumn];
        else {
            this._Text = "";
            this._Value = "";
        }
        this.Element && this.Searcher.SetRow(this.CurRow);
    }
    if (this.IsRepeat) this.Parent.UpdateColumn(this);
    this.OnEvent("Change");
}
Searcher.prototype.Value = function () {

    if (arguments.length) {
        this.SetValue(arguments[0]);
    } else {
        return this._Value;
    }
}
Searcher.prototype.BuildForRepeat = function (td) {
    this.Element = $("<input type='text' class='text-box'/>");
    td.html(this.Element);
    this.Searcher = this.Element.Searcher({
        dataKey: this.SearchKey,
        textField: this.TextColumn,
        valueField: this.ValueColumn,
        columns: [this.Columns],
        panelWidth: this.PanelWidth
    }).OnShowPanel(this.LoadData.bind(this)).OnChanged(this.Changed.bind(this))
     .OnBeforeSelect(this.OnBeforeChanged.bind(this));

    if (this._Value != undefined) this.SetDefault(this._Value, this._Text);
    this.IsLoadData = false;
}
Searcher.prototype.Save = function (ds) {
    var v = this.Value();
    if (!this.Check(v)) {
        return false;
    }
    ds[this.ID] = v;
    ds["t_" + this.ID] = this.Text();
}
Searcher.prototype.SetPar = function (name, value) {
    if (this.Parameters[name] == value) return;
    this.Parameters[name] = value ? value.toString() : "";
    this.IsLoadData = false;
    this.SearcherData = null;
}

function DateTimer() {
    this._Value = "";

}
Inherits(DateTimer, TextBox);
DateTimer.prototype.Build = function (parent) {
    this.Element = $("<div " + (this.State == ElementStates.Hidden ? "style='display:none'" : "") + " class='section-item'><div class='title'>" + this.Title
           + (this.IsAllowNull ? "" : "<span class='notnull'>*</span>") +
           "</div><div class='input searcher-datetimer" + (this.State == ElementStates.ReadOnly ? " readonly" : "")
           + "'><input type='text' " + ((this.State == ElementStates.ReadOnly ? "readonly data-disabled='true'" : "")) + " class='text-box' data-date-format='yyyy-mm-dd hh:ii' readonly onclick='WdatePicker({ dateFmt: \"yyyy-MM-dd\" })' /> <span class='glyphicon glyphicon-calendar datetimer-icon'></span></div></div>");

    this.Input = this.Element.find("input");
    parent.append(this.Element);
    this.InitPicker();
    if (!this.Page.RecordID) this._Value = this.DefaultValue;
    if (this._Value != undefined) this.Input.val(this.Formatter(this._Value));
    this.SetIcon(true);
    this.Input.change(this.ValueChanged.bind(this));
    return this.Element;
}
DateTimer.prototype.InitPicker = function () {
    // EMW.Global.DateTimer.Init(this.Input, this.DateOnly ? 1 : 2);
    //this.Input.bind("click", WdatePicker({ dateFmt: 'yyyy-MM-dd' }))
}
DateTimer.prototype.BuildForRepeat = function (td) {
    this.Element = $("<div class='searcher-datetimer'><input type='text' class='text-box' data-date-format='yyyy-mm-dd hh:ii' readonly /><span class='glyphicon glyphicon-calendar datetimer-icon'></span></div></div>");

    this.Input = this.Element.find("input");
    td.html(this.Element);
    this.InitPicker();
    this.Input.change(this.ValueChanged.bind(this));
    if (this._Value != undefined) this.Input.val(this.Formatter(this._Value));
}
DateTimer.prototype.ValueChanged = function () {
    this.Value(this.Input.val());
}
DateTimer.prototype.SetState = function (state) {
    if (state == this.State) return;
    this.State = state;
    if (this.IsRepeat) this.Parent.SaveState(this);
    if (!this.Element) return;
    switch (state) {
        case 1:
            this.Element.show();
            this.Element.find(".input").removeClass("readonly");
            this.Input.removeAttr("data-disabled");
            break;
        case 2:
            this.Element.show();
            this.Element.find(".input").addClass("readonly");
            this.Input.attr("data-disabled", "true");
            break;
        case 3:
            this.Element.hide();
            break;
    }
}
DateTimer.prototype.SetIcon = function (isInit) {
    if (this.State != ElementStates.ReadOnly || this.State != ElementStates.Hidden) {
        var icon = this.Element.find(".datetimer-icon");
        icon.removeClass("glyphicon-calendar icon-content_clear");
        icon.addClass(this._Value ? "icon-content_clear" : "glyphicon-calendar");
        if (isInit) {
            icon.click(this, function (e) {
                var _this = e.data;
                _this.Value("");
                return false;
            });
        }
    }
}
DateTimer.prototype.Value = function (v) {
    if (arguments.length) {
        var v = arguments[0];
        if (v == this._Value) return;
        //if (v && v[0] == '/') v = Z.ToDate(v);
        this._Value = v;
        if (this.Element) {
            this.SetIcon();
            this.Input.val(v);
        } else {
            this.Parent.UpdateColumn(this);
        }
        this.OnEvent("Change");
    } else {
        return this._Value;
    }
}
DateTimer.prototype.Formatter = function (v) {
    if (!v) return "";
    v = Z.ToDate(v);
    if (this.DateOnly) {
        return v.ToString("yyyy-MM-dd");
    }
    return v.ToString("yyyy-MM-dd hh:mm");
}
function TimeSelector() {
    this.SelectItems = [];
    for (var i = 0; i < 24; i++) {
        var time = (i < 10 ? ("0" + i) : i) + ":00";

        this.SelectItems.push({
            Text: time, Value: time
        });
        time = (i < 10 ? ("0" + i) : i) + ":30";
        this.SelectItems.push({
            Text: time, Value: time
        });
    }
}
Inherits(TimeSelector, DropDownList);


function RepeatTable() {
    this.Tools = [];
    this.Rows = [];
    this.CurRow = {};//当前行
    this.PageSize = 0;
    this.PageIndex = 1;
    this.IsShowColumnMenu = false;
    this.IsHeader = true;
}
RepeatTable.prototype.OnEvent = TextBox.prototype.OnEvent;
RepeatTable.prototype.AddTool = function (tool) {
    tool.Parent = this;
    this.Tools.push({
        icon: tool.Icon || "edit", text: tool.Name, desc: tool.Memo,
        tool: tool
    });
}
RepeatTable.prototype.ShowColumnMenu = function (col) {
    var ary = [];
    var column = col.Control;
    if (!column) return;
    this.EditColumn = column;
    var columnClick = this.ColumnClick.bind(this);
    if (column.OrderBy) {
        ary.push({ text: "取消排序", icon: "action_trending_flat", OnClick: columnClick, command: "cancelsort" });
    }
    if (!column.OrderBy || column.OrderBy == "ASC")
        ary.push({ text: "降序排列", icon: "action_trending_down", OnClick: columnClick, command: "sort", OrderBy: "DESC" });
    if (!column.OrderBy || column.OrderBy == "DESC")
        ary.push({ text: "升序排列", icon: "action_trending_up", OnClick: columnClick, command: "sort", OrderBy: "ASC" });
    if (column.IsFrozen) {
        ary.push({ text: "取消冻结", icon: "action_settings_ethernet", OnClick: columnClick, command: "cancelforzen" });
    } else {
        ary.push({ text: "冻结列", icon: "editor_format_indent_decrease", OnClick: columnClick, command: "forzen" });
    }
    ary.push({ text: "隐藏列", icon: "editor_border_clear", OnClick: columnClick, command: "hide" });

    return ary;
}
RepeatTable.prototype.ColumnClick = function (tool) {
    this.DataGrid.HideColumnMenu();
    if (!this.EditColumn) return;
    switch (tool.command) {
        case "cancelsort":
            if (this.SortColumn) {
                this.SortColumn.OrderBy = null;
                this.SortColumn = null;
                this.Refresh();
            }
            break;
        case "sort":
            this.SortColumn = this.EditColumn;
            this.EditColumn.OrderBy = tool.OrderBy;
            this.Refresh();
            break;
        case "cancelforzen":
            this.EditColumn.IsFrozen = false;
            this.ReInit();
            break;
        case "forzen":
            this.EditColumn.IsFrozen = true;
            this.ReInit();
            break;
        case "hide":
            this.EditColumn.SetState(ElementStates.Hidden);

            break;
    }
    this.OnGridSettingChanged();
}
RepeatTable.prototype.OnGridSettingChanged = function () {
    if (this.SettingSaveTimer) {
        return;
    }
    this.SettingSaveTimer = window.setTimeout(this.SavePageSetting.bind(this), 1000);
}
RepeatTable.prototype.SavePageSetting = function () {
    var grid = this.DataGrid.options;
    var obj = {};
    obj.FrozenColumns = this.GetColumnsSetting(grid.frozenColumns);
    obj.Columns = this.GetColumnsSetting(grid.columns)
    if (this.SortColumn) {
        obj.SortColumn = {
            ID: this.SortColumn.ID,
            OrderBy: this.SortColumn.OrderBy
        };
    }
    this.SettingSaveTimer = null;
}
RepeatTable.prototype.ReInit = function () {
    var elem = this.Element.find(".emw-datagrid");
    var par = elem.parent();
    elem.remove();
    par.append('<div class="grid" ></div>');
    this.InitGrid();
    this.DataGrid.BindData(this.GetCurPageData());
}
RepeatTable.prototype.AddToColumn = GridControl.prototype.AddToColumn;
RepeatTable.prototype.GetColumnsSetting = GridControl.prototype.GetColumnsSetting;
RepeatTable.prototype.InitGrid = function () {
    var cols = [], frozenCols = [];
    var bindCell = this.BindCell.bind(this);
    var showMenuHandler = this.IsShowColumnMenu ? this.ShowColumnMenu.bind(this) : null;
    for (var i = 0; i < this.Elements.length; i++) {
        var item = this.Elements[i];
        item.IsRepeat = true;
        item.DefaultState = item.State || ElementStates.NoSet;
        var col = {
            title: item.IsAllowNull ? item.Title : (item.Title + "<span class='notnull'>*</span>"),
            width: item.Width,
            field: item.ID,
            Control: item,
            visible: item.State != 3,
            Formatter: item.Formatter && item.Formatter.bind(item),
            OnRenderCell: bindCell,
            OnShowMenu: showMenuHandler
        };
        item.Column = col;
        if (item.IsFrozen) {
            this.AddToColumn(frozenCols, col);
        } else {
            this.AddToColumn(cols, col);
        }

    }

    var settingChange = this.OnGridSettingChanged.bind(this);
    this.DataGrid = this.Element.find(".grid").DataGrid({
        columns: cols,
        frozenColumns: frozenCols.length ? frozenCols : null,
        autoHeight: true,
        pagination: !!this.PageSize,
        rowHeader: this.ShowRowNumber, resizable: true, sortable: true,
        OnBeginEdit: this.Edit.bind(this),
        OnEndEdit: this.EndEdit.bind(this)
    }).OnBeforeRowBind(this.BeforeRowBind.bind(this))
       .OnRowBinded(this.RowBind.bind(this))
   .OnSelect(this.SelectedRow.bind(this)).OnDrop(settingChange).OnColumnChanged(settingChange).
    OnUnSelect(this.UnSelectedRow.bind(this));

    if (this.PageSize) {
        this.DataGrid.OnPageChange(this.PageChanged.bind(this));
    }
}
//重复表查询检索事件
RepeatTable.prototype.SearchRT = function () {
    if (this.SearchBox && this.SearchBox.length > 0) {
        this.Refresh();
    }
}
//重复表查询初始化控件
RepeatTable.prototype.RPSearchInitt = function (x) {
    if (x) {
        var Panel = this.Element.find(".grid-Search");
        $('<button class="btn btn-default btn-sm grid-search-btn" type="button"><span class="glyphicon glyphicon-search"></span>搜索</button>').bind("click", this.SearchRT.bind(this)).appendTo(Panel);
        var SearchBoxList = x.split("@@");
        this.SearchBox = [];
        for (var i = 0; i < SearchBoxList.length; i++) {
            var e = $('<div class="Search-item"><lable>' + SearchBoxList[i].split(';')[0] + '</lable><input type="text" class="text-box" name=' + SearchBoxList[i].split(';')[1] + ' /></div>').appendTo(Panel);
            this.SearchBox.push(e.find("input"));
        }
    }
}
RepeatTable.prototype.UseSetting = function () {
    if (this.Page.Setting) {
        this.Setting = this.Page.Setting[this.ID];
    }
    if (!this.Setting) return this.Elements;
    if (this.Setting.FrozenColumns) {
        for (var i = 0; i < this.Setting.FrozenColumns.length; i++) {
            var col = this.GetElementByID(this.Setting.FrozenColumns[i].ID);
            if (!col) continue;
            col.Width = this.Setting.FrozenColumns[i].Width || col.Width;
            col.IsFrozen = true;
        }
    }
    for (var i = 0; i < this.Setting.Columns.length; i++) {
        var col = this.GetElementByID(this.Setting.Columns[i].ID);
        if (!col) continue;
        col.Width = this.Setting.Columns[i].Width || col.Width;
    }
    if (this.Setting.SortColumn) {
        this.SortColumn = this.GetElementByID(this.Setting.SortColumn.ID);
        this.SortColumn && (this.SortColumn.OrderBy = this.Setting.SortColumn.OrderBy);
    }
    return this.Elements;
}
RepeatTable.prototype.GetElementByID = function (id) {
    for (var i = 0; i < this.Elements.length; i++) {
        if (this.Elements[i].ID == id) return this.Elements[i];
    }

}
RepeatTable.prototype.Build = function (parent) {

    this.OnEvent("Init");
    this.Element = $('<div ' + (this.State == ElementStates.Hidden ? "style='display:none'" : "") + ' class="form-section" id="' + this.ID + '"><div class="section-header"><span class="glyphicon section-icon"></span><span class="section-title">' + this.Title
+ '</span></div><div class="section-body"><div class="toolbar"></div><div class="grid-Search" style="display:none;"></div><div class="grid" ></div></div></div>').appendTo(parent);;
    this.Element.Section();
    if (!this.IsHeader)
        this.Element.find(".section-header").hide();
    this.Elements = this.UseSetting();
    this.InitGrid(parent);
    this.Element.find(".toolbar").ToolBar({
        display: "tool-normal",
        items: this.Tools
    }).OnClick(this.ToolClick.bind(this));
    for (var i = 0; i < this.Tools.length; i++) {
        var tool = this.Tools[i];
        tool.tool.Page = this.Page;
        tool.tool.Init(tool.__target);
        if (tool.tool.ToolType == "RPSearch") {
            this.RPSearchInitt(tool.tool.RPSearch);
        }
    }
    if (this.State == ElementStates.ReadOnly) this.Element.find(".toolbar").hide();

    if (this.Data) {
        var data = Z.ParseData(this.Data);
        this.Rows = data.Rows;
        this.DataGrid.BindData(this.GetCurPageData());
        if (this.PageSize) {
            var count = Math.ceil(this.Data.MaxRow / this.PageSize);
            this.DataGrid.RefreshPager({
                pageCount: count,
                pageIndex: 1
            });
        }
        this.Data = null;
    }

    if (this.State == ElementStates.Hidden) this.Page.Navigation && this.Page.Navigation.SetItemVisible(this);
    this.OnEvent("Load");
}
RepeatTable.prototype.GetCurPageData = function () {
    this.Element.find('.datagrid-pager .gridpage-list').hide(); //2017/6/20 隐藏PageSize选择组件
    if (!this.PageSize) return this.Rows;
    var s = (this.PageIndex - 1) * this.PageSize;
    var e = this.PageIndex * this.PageSize;
    var ary = [];
    for (var i = s; i < e; i++) {
        if (this.Rows[i])
            ary.push(this.Rows[i]);
    }
    return ary;
}
RepeatTable.prototype.PageChanged = function (arg) {
    var data = arg.Data;
    this.PageIndex = data.PageIndex;
    this.DataGrid.BindData(this.GetCurPageData());
}
RepeatTable.prototype.Refresh = function () {
    var paras = [];
    paras.push("elem=" + this.ID);
    paras.push("rid=" + this.Page.RecordID);
    if (this.SortColumn) {
        paras.push("sort=" + this.SortColumn.ID);
        paras.push("orderby=" + this.SortColumn.OrderBy);
    }
    this.Page.Request("repeatdata?" + paras.join("&"), false, function (x) {
        if (this.SearchBox && this.SearchBox.length > 0 && x) {
            var MaxRow = 0;
            var newRow = [];
            for (var i = 0; i < x.Rows.length; i++) {
                if (function () {
                   for (var y = 0; y < this.SearchBox.length; y++) {
                    var index = x.Columns.indexOf(this.SearchBox[y].attr("name"));
                    var Tindex = x.Columns.indexOf("T_" + this.SearchBox[y].attr("name"));
                    if (this.SearchBox[y].val() != "")
                      if (x.Rows[i][index] != this.SearchBox[y].val())
                         if (Tindex == -1 || x.Rows[i][Tindex] != this.SearchBox[y].val())
                          return false;
                }
                    return true;
                }.bind(this)()) {
                    MaxRow++;
                    newRow.push(x.Rows[i]);
                }
            }
            x.MaxRow = MaxRow;
            x.Rows = newRow;
        }
        this.DataGrid.BindDataByDataTable(x);
        this.Rows = this.DataGrid.GetRows();
    }.bind(this));
}
RepeatTable.prototype.SelectedRow = function (row) {
    var rowData = row.Data.RowData;
    this.SetCurRow(rowData);
    this.OnEvent("RowSelected");
}
RepeatTable.prototype.UnSelectedRow = function (row) {
    var rowData = new EMW.EventArgument(row).Data.RowData;
    this.SetCurRow(rowData);
    this.OnEvent("unRowSelected");
}
RepeatTable.prototype.BindData = function (data) {
    this.Rows = data;
    this.DataGrid.BindData(data);
}
RepeatTable.prototype.BindCell = function (row, col, td) {
    if (!row.__Cells) row.__Cells = {};
    row.__Cells[col.field] = td;
}
RepeatTable.prototype.GetCell = function (item) {
    var row = this.CurRow;
    if (!row.__Cells) row.__Cells = {};
    return row.__Cells[item.ID];
}
RepeatTable.prototype.SaveState = function (item) {
    var row = this.CurRow;
    if (!row.__State) row.__State = {};
    row.__State[item.ID] = item.State;
}
RepeatTable.prototype.SetState = function (state) {
    if (this.State == state) return;
    this.State = state;
    this.EndEdit();
    switch (state) {
        case 1:
            this.Element.show();
            this.Element.find(".toolbar").show();
            break;
        case 2:
            this.Element.show();
            this.Element.find(".toolbar").hide();
            break;
        case 3:
            this.Element.hide();
            break;
    }
    this.Page.Navigation && this.Page.Navigation.SetItemVisible(this);
}
RepeatTable.prototype.GetState = function (item) {
    var row = this.CurRow;
    if (!row.__State) row.__State = {};
    return row.__State[item.ID] || item.DefaultState;
}
RepeatTable.prototype.BeforeRowBind = function (grid, row) {
    var data = row.RowData;
    this.SetCurRow(data);
}
RepeatTable.prototype.RowBind = function (grid, row) {
    this.OnEvent("RowBind");
}
RepeatTable.prototype.Edit = function (col, row, td) {
    var con = col.Control;
    if (this.State == ElementStates.ReadOnly || !con || this.GetState(con) == ElementStates.ReadOnly || td.attr("State") == ElementStates.ReadOnly) return;
    this.SetCurRow(row);
    con.BuildForRepeat(td);
    this.EditElement = con;
}
RepeatTable.prototype.EndEdit = function () {
    if (!this.EditElement) return;
    var field = this.EditElement.ID;
    this.CurRow[field] = this.EditElement.Value();
    if (this.EditElement.IsSearcher) {
        this.CurRow["T_" + field] = this.EditElement.Text();
    }
    this.EditElement.EndEdit && this.EditElement.EndEdit();
    this.EditElement.Element = null;
    this.EditElement = null;
}
RepeatTable.prototype.SetColumnHeader = function (column) {
    var elem = this.Element.find(".view-header>.datagrid-table>tbody>tr>td[field='" + column.ID + "']>.datagrid-cell");
    if (!elem.length) return;
    var span = elem.find("span");
    elem.html(column.Title).append(span);;
}
RepeatTable.prototype.UpdateColumn = function (item) {
    this.CurRow[item.ID] = item._Value;
    if (item.IsSearcher) {
        this.CurRow["T_" + item.ID] = item._Text;
    }
    var td = this.GetCell(item);
    if (!td) return;
    if (item != this.EditElement)
        this.DataGrid.viewer.renderCell(this.CurRow, item.Column, td);
}
RepeatTable.prototype.ToolClick = function (item) {
    var tool = item.tool;
    var func = this["Tool" + tool.ToolType];
    if (func) {
        if (tool.OnBeforeClick() == false) return false;
        func.apply(this, [tool]);
    }
    else tool.Click();
}
RepeatTable.prototype.SetCurRow = function (row) {
    if (row == this.CurRow) return;
    this.CurRow = row;
    for (var i = 0; i < this.Elements.length; i++) {
        var item = this.Elements[i];
        item._Value = row[this.Elements[i].ID];
        if (item.IsSearcher) {
            item._Text = row["T_" + this.Elements[i].ID];
        }
    }
}
RepeatTable.prototype.SetColumnState = function (col, state) {
    if (!col) return;
    if (state == col.DefaultState) return;
    col.DefaultState = state;
    switch (state) {
        case 1:
        case 2:
            this.Element.find(".datagrid-cell-" + col.ID).show();
            col.Column.visible = true;
            break;
        case 3:
            this.Element.find(".datagrid-cell-" + col.ID).hide();
            col.Column.visible = false;
            break;
    }

}
RepeatTable.prototype.AddRow = function (row) {
    this.DataGrid.EndEdit();
    row = row || {};
    for (var i = 0; i < this.Elements.length; i++) {
        var item = this.Elements[i];
        var v = row[item.ID];
        if (v == undefined && item.DefaultValue != undefined) {
            row[item.ID] = item.DefaultValue;
            if (item.IsSearcher && item.CurRow) {
                row["T_" + item.ID] = item.CurRow[item.TextColumn];
            }
        }
    }
    this.Rows.push(row);
    this.DataGrid.options._data = this.Rows;
    this.SetCurRow(row);
    if (this.PageSize && this.PageSize * this.PageIndex < this.Rows.length) {

        var count = Math.ceil(this.Rows.length / this.PageSize);
        this.PageIndex = count;
        this.DataGrid.BindData(this.GetCurPageData());
        this.DataGrid.RefreshPager({
            pageCount: count,
            pageIndex: this.PageIndex
        });
    } else {
        this.DataGrid.AppendRow(row);
    }
    this.OnEvent("AddRow");
    return row;
}
RepeatTable.prototype.ToolCreate = function (tool) {
    if (tool.PageID) return tool.Click();
    this.AddRow();
}
RepeatTable.prototype.ToolDelete = function (tool) {
    var rows = this.DataGrid.GetSelectedRows();
    if (!rows || !rows.length) return;
    $ace.confirm("是否确认删除选中的" + rows.length + "条数据？", function (x) {
        this.DeleteRows(rows);
    }.bind(this));
}
RepeatTable.prototype.ToolRPSearch = function () {
    this.Element.find(".grid-Search").slideToggle();
}
RepeatTable.prototype.Clear = function () {
    var rows = this.Rows;
    this.DeleteRows(rows);
}
RepeatTable.prototype.DeleteRows = function (rows) {
    if (!this.DeleteRecord) this.DeleteRecord = [];
    this.DataGrid.EndEdit();
    if (!rows || rows == this.Rows) {
        rows = [];
        for (var i = 0; i < this.Rows.length; i++) {
            rows.push(this.Rows[i]);
        }
    }
    else if (!$.isArray(rows)) rows = [rows];

    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var id = parseInt(row["ID"]);
        if (id) this.DeleteRecord.push(id);
        this.Rows.Remove(row);
        if (!row.__Cells) continue;
        var rowData = row.__Cells[this.Elements[0].ID].parent().data("data");
        if (!rowData) continue;
        rowData.Tr1.remove();
        rowData.Tr2.remove();
    }
    this.DataGrid.RefreshNumber();
    var newIndex = Math.ceil(this.Rows.length / this.PageSize);
    this.PageIndex = newIndex;
    this.DataGrid.RefreshPager({
        pageCount: newIndex,
        pageIndex: newIndex
    });
    var o = {
        PageIndex: this.PageIndex
    }
    var arg = new EMW.EventArgument(o);
    this.DataGrid.OnPageChange(arg);
    this.OnEvent("RemoveRow");
}
RepeatTable.prototype.Save = function (data) {
    if (this.SaveMode == 1) return;
    this.DataGrid.EndEdit();
    var ary = [];
    for (var i = 0; i < this.Rows.length; i++) {
        var obj = {}, row = this.Rows[i];
        obj.ID = row.ID || 0;
        this.SetCurRow(row);
        for (var j = 0; j < this.Elements.length; j++) {
            var item = this.Elements[j];
            if (item.Check(item._Value) == false) {
                return false;
            }
            obj[item.ID] = item.Value();
            if (item.IsSearcher) {
                obj["t_" + item.ID] = item.Text();
            }
        }
        ary.push(obj);
    }
    data[this.ID] = ary;
    if (this.DeleteRecord && this.DeleteRecord.length) {
        data[this.ID + "_delete"] = this.DeleteRecord.join(",");
    }
}
RepeatTable.prototype.Sum = function (item) {
    var sum = 0;
    for (var i = 0; i < this.Rows.length; i++) {
        var tnum = this.Rows[i][item.ID];
        if (tnum == '' || tnum == undefined) {
            tnum = 0;
        }
        sum += parseFloat(tnum);
    }
    return sum;
}
RepeatTable.prototype.Join = function (item, split) {
    var ary = [];
    for (var i = 0; i < this.Rows.length; i++) {
        ary.push(this.Rows[i][item.ID] || 0);
    }
    return ary.join(split || ",");
}
RepeatTable.prototype.Value = function (item, val) {
    var currow = this.CurRow;
    for (var i = 0; i < this.Rows.length; i++) {
        this.SetCurRow(this.Rows[i]);
        item.Value(val);
    }
    this.SetCurRow(currow);

}
RepeatTable.prototype.SetRowStyle = function (css, indexOrRow) {
    var row = this.CurRow;
    if (indexOrRow != undefined) {
        if ($.isNumeric(indexOrRow)) row = this.Rows[indexOrRow];
        else if ($.isArray(indexOrRow)) {
            for (var i = 0; i < indexOrRow.length; i++) {
                this.SetRowStyle(css, indexOrRow[i]);
            }
            return;
        }
        else row = indexOrRow;
    }
    if (!row.__Cells) return;
    var rowData = row.__Cells[this.Elements[0].ID].parent().data("data");
    rowData.Tr1.css(css);
    rowData.Tr2.css(css);
}
RepeatTable.prototype.SetColumnStyle = function (css, elem, rowIndex) {
    if (!elem) return;
    if (rowIndex != undefined) {
        var row = this.CurRow;
        if ($.isNumeric(rowIndex)) {
            row = this.Rows[rowIndex];
        } else {
            row = rowIndex;
        }
        if (row._Cells) {
            row._Cells[elem.ID].css(css);
        }
    } else {
        for (var i = 0; i < this.Rows.length; i++) {
            var cells = this.Rows[i]._Cells;
            if (cells) {
                cells[elem.ID].css(css);
            }
        }
    }
}
RepeatTable.prototype.SaveEditor = function () {
    if (this.EditElement) {
        var field = this.EditElement.ID;
        this.CurRow[field] = this.EditElement.Value();
        if (this.EditElement.IsSearcher) {
            this.CurRow["T_" + field] = this.EditElement.Text();
        }
    }
}
RepeatTable.prototype.GetRows = function (func, nocur) {
    this.SaveEditor();
    if (!func && !nocur) return this.Rows;
    var rows = [];
    var curRow = this.CurRow;
    for (var i = 0; i < this.Rows.length; i++) {
        var row = this.Rows[i];
        if (nocur && curRow == row) continue;
        this.SetCurRow(row);
        if (!func || func(row) == true) {
            rows.push(row);
        }
    }
    if (curRow != this.CurRow) {
        this.SetCurRow(curRow);
    }
    return rows;
}
RepeatTable.prototype.Each = function (func1, func2) {
    if (!func1) return;
    this.SaveEditor();
    var curRow = this.CurRow;
    for (var i = 0; i < this.Rows.length; i++) {
        var row = this.Rows[i];
        this.SetCurRow(row);
        if (!func2 || func2(row) != false) {
            func1(row);
        }
    }
    if (curRow != this.CurRow) {
        this.SetCurRow(curRow);
    }
}
RepeatTable.prototype.GetSelectedRows = function () {
    return this.DataGrid.GetSelectedRows();
}
RepeatTable.prototype.SelectedRows = function (func) {
    var rows = this.DataGrid.GetSelectedRows();
    if (!rows || !rows.length || !func) return;
    this.SaveEditor();
    var curRow = this.CurRow;
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        this.SetCurRow(row);
        func(row);
    }
    if (curRow != this.CurRow) {
        this.SetCurRow(curRow);
    }
    return rows;
}
RepeatTable.prototype.SetRowState = function (State, index, Col) {
    var row = this.CurRow;
    if (index != undefined) {
        if ($.isNumeric(index)) row = this.Rows[index];
    }
    if (Col) {
        row.__Cells[Col].attr("State", State);
        return
    }
    for (var id in row.__Cells) {
        if (id && row.__Cells[id])
            row.__Cells[id].attr("State", State);
    }
}

function PageTool(obj) {
    this.ID = null;
    this.Element = null;
    this.Icon = "share-alt";
    if (obj) {
        $.extend(this, obj);
    }
}
PageTool.prototype.GetRecord = function () {
    if (!this.SelectType) return "";
    if (this.Page.RecordID) return this.Page.RecordID;
    var rows = this.Page.GetSelectedRows();
    if (!rows || !rows.length) {
        if (this.SelectType > 0) {
            return Z.Error("你需要选择一条记录");
        }
        return "";
    }
    if (rows.length > 1 && this.SelectType == 1) {
        return Z.Error("你只能选择一条记录");
    }
    if (this.SelectType != 2) return rows[0].ID;
    var ids = [];
    for (var i = 0; i < rows.length; i++) {
        ids.push(rows[i].ID);
    }
    return ids.join(",");
}
PageTool.prototype.OnEvent = TextBox.prototype.OnEvent;
PageTool.prototype.OnBeforeClick = function () {
    return this.OnEvent("Click");
}
PageTool.prototype.Click = function () {
    if (this.State == ElementStates.ReadOnly) return;
    if (this.LineID) {
        this.Page.Request("LineUser?flowid=" + this.FlowID + "&id=" + this.LineID, false, this.ProcessFlow.bind(this));
        return;
    }
    var func = this["Command" + this.ToolType];
    if (this.OnBeforeClick() == false) return;
    if (this.ServerEvent) {
        this.Page.OnServerEvent(this, "Click", function (x) {
            if (x.Code) {
                if (func) func.apply(this);
            } else {
                Z.Error(x.Message);
            }
        });
    } else {
        if (func) func.apply(this);
    }

}
PageTool.prototype.Init = function (elem) {
    this.Element = elem;
    this.SetState(this.State);
}
PageTool.prototype.GetElement = function () {
    if (this.Element) return this.Element;
    var win = GetWindow();
    if (!win) return;
    return $(win.panel.find(".panel-tool").children()[this.ToolIndex]);

}
PageTool.prototype.SetState = function (state) {
    if (state == this.State) return;
    this.State == state;
    var elem = this.GetElement();
    if (!elem) return;
    switch (state) {
        case 1:
        case 2:
            elem.show();
            break;
        case 3:
            elem.hide();
            break;
    }
}
PageTool.prototype.BuildURL = function () {
    var pid = this.PageID;
    if (!pid) return false;
    var url = [];
    url.push("/Page/");
    url.push(pid);
    url.push("?");
    var rid = this.GetRecord();
    if (rid === false) return false;
    if (rid) {
        url.push("rid=");
        url.push(rid);
    }
    if (this.Page.TID) {
        url.push("&tid=");
        url.push(this.Page.TID);
    }
    if (this.Page.MainTable) {
        url.push("&mtid=");
        url.push(this.Page.MainTable);
    }
    if (this.Page.MainRecord) {
        url.push("&mrid=");
        url.push(this.Page.MainRecord);
    }
    return url.join("");

}
PageTool.prototype.CommandCreate = function () {
    var url = this.BuildURL();
    if (url === false) return;
    var dia = EMW.UI.Window({
        url: url,
        title: "表单",
        height: "auto",
        width: 900
    });
}
PageTool.prototype.CommandOpen = function () {
    console.log(this);
    var url = this.BuildURL();
    if (url === false) return;
    var dia = EMW.UI.Window({
        url: url,
        title: "查看",
        height: "auto",
        width: 900
    });
}
PageTool.prototype.CommandRPSearch = function () {
    console.log(this);
}
PageTool.prototype.CommandSendMessage = function () {
    if (this.GetRecord() != "") {
        var dia = EMW.UI.Window({
            url: "/pages/public/UserSendMail.html",
            title: "发送邮件",
            height: "auto",
            width: 1000
        });
        dia.mid = this.PageID;
        dia.rid = this.GetRecord();
    }
}
PageTool.prototype.CommandExport = function () {

    var dia = EMW.UI.Window({
        url: "/pages/public/DataListExport.html?pageId=" + this.Page.ID,
        title: "导出",
        height: 400,
        width: 550
    });
    dia.GridControl = this.Page;
}
PageTool.prototype.CommandEdit = function () {
    var url = this.BuildURL();
    if (url === false) return;
    var dia = EMW.UI.Window({
        url: url,
        title: "表单",
        height: "auto",
        width: 900
    });
}
PageTool.prototype.CommandView = function () {
    if (!this.PageID) return;
    var id = this.GetRecord();
    if (id === false) return;
    if (window.top.innerHeight > 768) { var WinWidth = 900 } else { var WinWidth = window.top.innerWidth }
    var dia = EMW.UI.Window({
        url: "/page/" + this.PageID + "?view=1&rid=" + id,
        title: "表单",
        height: "auto",
        width: WinWidth
    });
}
PageTool.prototype.CommandImport = function () {
    var dia = EMW.UI.Window({
        url: "/Pages/public/DataImport.html",
        title: "数据导入",
        height: "auto",
        width: 900
    });
    if (this.Page) {
        dia.TableID = this.Page.TID;
        dia.ParentPage = this.Page;
    }
}
PageTool.prototype.CommandEvent = function () {
    var id = this.GetRecord();
    if (id === false) return;
    var dia = new EMW.UI.Window({
        url: "/Pages/Event/EventList.html",
        title: "事件列表",
        height: "auto",
        width: 900
    });
    dia.RID = id;
    dia.TID = this.Page.TID;
}
PageTool.prototype.CommandFlowHistory = function () {
    var id = this.GetRecord();
    if (id === false) return;
    var dia = EMW.UI.Window({
        url: "/Pages/Flow/FlowHistory.html?rid=" + id,
        title: "流程历史记录",
        height: 750,
        width: 900
    });
}
PageTool.prototype.CommandDelete = function () {
    var rows = this.Page.GetSelectedRows();
    if (!rows || !rows.length) {
        return Z.Error("请选择要删除的数据");
    }
    var str = [];
    for (var i = 0; i < rows.length; i++) {
        str.push(rows[i].ID);
    }
    var $this = this;
    Z.Show("是否确认删除？", function (x) {
        if (x) {
            PageRequest($this.Page, "delete?rid=" + str.join(","), null, function (x) {
                if (x.Code) {
                    Z.Show("删除成功。");
                    $this.Page.Refresh();
                } else {
                    Z.Error("删除失败：" + x.Message);
                }
            });
        }
    });
}
PageTool.prototype.ProcessFlow = function (x) {
    var html = [];
    html.push("<div class='flow-process'>");
    if (this.Memo) {
        html.push("<div class='flow-process-desc'>");
        html.push(this.Memo);
        html.push("</div>");
    }
    if (x) {
        html.push("<label  class='flow-user-title'>选择下环节处理人员：</label>");
        html.push("<div class='flow-user'>");
        for (var i = 0; i < x.Rows.length; i++) {
            var row = x.Rows[i];
            html.push("<label>");

            html.push("<input name='next-user'  type='" + (this.AllowMulitUser ? "checkbox" : "radio") + "' uid=\"" + row[0] + "\"");
            if (i == 0) html.push(" checked");
            html.push("/>");
            html.push(row[1]);
            html.push("</label>");
        }
        html.push("</div>");
        this.NeedUser = true;
    } else {
        this.NeedUser = false;
    }
    html.push("<textarea class='text-box' style='height:100px;' placeholder='备注或处理意见'></textarea>");
    var div = $(html.join(""));
    var dialog = EMW.UI.Dialog({
        content: div,
        title: "确认执行" + this.Name,
        width: 400, height: 300,
        OnOK: function (a) {
            this.SubmitFlow(div);
        }.bind(this)
    });
}
PageTool.prototype.SubmitFlow = function (content) {
    var data = [];

    var opit = content.find("textarea").val();
    if (this.NeedOption && !opit) {
        return Z.Error("请输入处理意见或备注。");
    }
    if (opit.length > 400) {
        return Z.Error("处理意见或备注的长度不能大于400");
    }
    if (this.NeedUser) {
        var users = [];
        var elems = content.find("input");
        for (var i = 0; i < elems.length; i++) {
            if ($(elems[i]).is(":checked")) {
                users.push($(elems[i]).attr("uid"));
            }
        }
        if (!users.length) {
            return Z.Error("请选择下环节处理人员。");
        }
        data.push("NextUser=" + users.join(","));
    }
    data.push("Option=" + EMW.Const.encode(opit));
    data.push("Line=" + this.LineID);
    data.push("FlowID=" + this.FlowID);
    data.push("rid=" + this.Page.RecordID);
    this.Page.Request("lineto?" + data.join("&"), true, function (x) {
        if (!x) return;
        if (x.Message) return Z.Error(x.Message);
        x.Message = "流程已提交";
        this.Page.SaveOver(null, x);
    }.bind(this));
}
PageTool.prototype.GroupLines = function (lines) {
    if (!lines) return;
    var list = [];
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (!line) continue;
        var group_line = list.First(x=>x.Flow = line.Flow && x.LineID == line.LineID);
        if (!group_line) {
            line.Records = [];
            list.push(line);
            group_line = line;
        }
        group_line.Records.push({ RecordID: line.Record, Users: line.NextUser, FlowID: line.FlowID });
    }
    return list;
}
PageTool.prototype.CommandBatchSubmit = function () {
    var ids = this.GetRecord();
    PageRequest(this.Page, "getlines?rid=" + ids, function (list) {
        var lines = this.GroupLines(list);
        var div = $("<div class='batch-submit'></div>");
        var rowsCount = this.Page.GetSelectedRows().length;
        if (!lines || !lines.length) {
            div.append("<li>无可用操作</li>");
        } else {
            div.append("<div>你当前选择的" + rowsCount + "条数据，有以下可用操作：</div>");
            for (var i = 0; i < lines.length; i++) {
                $("<label><input  type='radio' name='line'>" + lines[i].Name + "<span>(" + lines[i].Records.length + ")</span></label>").appendTo(div).data("line", lines[i]);
            }
        }
        div.append("<textarea placeholder='备注或意见' ></textarea>");
        div.append("<button class='btn'>确认提交</button>");

        EMW.UI.RightPanel.Show({
            Content: div
        });
        div.on("click", "input", this, function (e) {
            var line = $(this).parent().data("line");
            var ids = [];
            var $this = e.data;
            for (var i = 0; i < line.Records.length; i++) {
                ids.push(line.Records[i].RecordID);
            }
            $this.SelectedLine = line;
            $this.Page.SelectByID(ids);
        }).on("click", "button", this.BatchSubmit.bind(this));
        this.FlowPanel = div;
    }.bind(this));

}
PageTool.prototype.BatchSubmit = function () {
    if (!this.SelectedLine) return Z.Error("请选择操作");
    this.FlowPanel.find("button").prop("disabled", true);
    var data = [];

    var opit = this.FlowPanel.find("textarea").val();
    if (this.SelectedLine.NeedOption && !opit) {
        return Z.Error("请输入处理意见或备注。");
    }
    if (opit.length > 400) {
        return Z.Error("处理意见或备注的长度不能大于400");
    }
    data.push("Option=" + opit);
    data.push("Line=" + this.SelectedLine.LineID);
    var str = [];
    for (var i = 0; i < this.SelectedLine.Records.length; i++) {
        var item = this.SelectedLine.Records[i];
        str.push(item.RecordID);
        str.push(item.FlowID);
        if (item.Users && item.Users.length) {
            str.push(item.Users[0].ID);
        } else {
            str.push(0);
        }
    }
    data.push("Record=" + str.join("|"));
    data.push("FlowModule=" + this.SelectedLine.Flow);
    PageRequest(this.Page, "lineto", data.join("&"), function (x) {
        this.FlowPanel.find("button").removeProp("disabled");
        if (!x.Code) {
            Z.Error(x.Message);
        } else {
            Z.Show(this.SelectedLine.Name + "提交完成。");
            this.Page.Refresh();
        }
    }.bind(this));
}
PageTool.prototype.BatchSubmit = function () {
    if (!this.SelectedLine) return Z.Error("请选择操作");
    this.FlowPanel.find("button").prop("disabled", true);
    var data = [];

    var opit = this.FlowPanel.find("textarea").val();
    if (this.SelectedLine.NeedOption && !opit) {
        return Z.Error("请输入处理意见或备注。");
    }
    if (opit.length > 400) {
        return Z.Error("处理意见或备注的长度不能大于400");
    }
    data.push("Option=" + opit);
    data.push("Line=" + this.SelectedLine.LineID);
    var str = [];
    for (var i = 0; i < this.SelectedLine.Records.length; i++) {
        var item = this.SelectedLine.Records[i];
        str.push(item.RecordID);
        str.push(item.FlowID);
        if (item.Users && item.Users.length) {
            str.push(item.Users[0].ID);
        } else {
            str.push(0);
        }
    }
    data.push("Record=" + str.join("|"));
    data.push("FlowModule=" + this.SelectedLine.Flow);
    PageRequest(this.Page, "lineto", data.join("&"), function (x) {
        this.FlowPanel.find("button").removeProp("disabled");
        if (!x.Code) {
            Z.Error(x.Message);
        } else {
            Z.Show(this.SelectedLine.Name + "提交完成。");
            this.Page.Refresh();
        }
    }.bind(this));
}
PageTool.prototype.CommandShare = function () {
    var win = EMW.UI.Dialog({
        url: "Pages/Table/Tools/UserDateShareSetting.html",
        title: "数据分享",
        width: 920,
        height: 580,
        OnOK: function (x) {
            RefreshData();
        }
    });
    win.Tools = _control.Tools;
    win.TableID = _control.TID;
    win.rid = _control.CurRow.ID;
}
PageTool.prototype.CommandAssign = function () {
    var win = EMW.UI.Dialog({
        url: "Pages/Table/Tools/UserDateAssignSetting.html",
        title: "分派",
        width: 720,
        height: 520,
        OnOK: function (x) {
            //RefreshData();
        }
    });
    win.Table = _control;
}
PageTool.prototype.CommandTrans = function (da) {
    var win = EMW.UI.Dialog({
        url: "Pages/Table/Tools/UserDateTransSetting.html",
        title: "数据转换",
        width: 720,
        height: 520,
        OnOK: function (x) {
            //RefreshData();
        }
    });
    win.Table = _control;
    win.tool = this;
}
function GridView() {

}
function PageRule(elem, evt, moment, repeat) {

    if (!evt || !elem) return;
    this.Moment = moment;
    this.Repeat = repeat;

    if (!elem["On" + evt]) elem["On" + evt] = [];
    elem["On" + evt].push(this);
}
PageRule.prototype.Exec = function (page) {
    if (!this.func) return;
    if (this.Moment == 1 && page.RecordID > 0) return;
    if (this.Moment == 2 && page.RecordID == 0) return;
    if (!this.Repeat && this.IsRun) return;
    return this.func.apply(page);
}


function Flow(obj) {
    this.Name = obj.Name;
    this.Memo = obj.Memo;
    this.Flows = obj.Flows || [];
}
Flow.prototype.AddTools = function (tools) {

    for (var i = 0; i < this.Flows.length; i++) {
        var flow = this.Flows[i];
        if (!flow.Lines) continue;
        for (var j = 0; j < flow.Lines.length; j++) {
            var line = flow.Lines[j];
            tools.push(new PageTool({
                LineID: line.ID,
                Name: line.Name,
                Memo: line.Memo,
                Icon: line.Icon || "content_redo",
                FlowID: flow.ID
            }));
        }
    }
}
Flow.prototype.ShowFlowInfo = function () {
    if (!this.Element) {
        var html = [];
        html.push("<div class='flow-panel'>");
        var flows = this.Flows;
        if (flows.length > 1) {
            html.push("<div class='flow-headers'>");

            html.push("</div>");
        }
        html.push("<div class='flow-content'>");

        html.push("</div></div>");
        this.Element = $(html.join("")).appendTo(document.body);
        var content = this.Element.find(".flow-content");
        var headers = this.Element.find(".flow-headers");
        for (var i = 0; i < flows.length; i++) {
            var item = new FlowItem();
            $.extend(item, flows[i]);
            item.Page = this.Page;
            item.ParentContent = this;
            item.Build(content);
            if (flows.length > 1) {
                $("<div data-itemindex='" + i + "' class='flow-title" + (i == 0 ? " active" : "") + "'>" + (item.Title || item.Node) + "</div>").appendTo(headers);
                if (i > 0) item.Element.hide();
            }

        }
        headers.on("click", ".flow-title", function () {
            var $this = $(this);
            if ($this.is("active")) return;
            var children = content.children();
            var selItem = headers.find(".active");
            selItem.removeClass("active");
            $this.addClass("active");
            $(children[selItem.attr("data-itemindex")]).fadeOut("fast", function () {
                $(children[$this.attr("data-itemindex")]).fadeIn("fast");
            });
        });
    }
    //var height = GetWindow().options.height;
    //this.Element.height(height - 60);
    this.Dialog = new EMW.UI.Window({
        content: this.Element,
        title: this.Name,
        width: 400,
        height: "auto",
        OnOK: function (x) {
            this.Page.Refresh();
        }.bind(this)
    });
}
function FlowItem(obj) {
    this.ID = 0;
    this.AllowReturn = false;
    this.AllowTrans = false;
    this.AllowAppend = false;
    this.Lines = [];
    this.Tasks = [];
}
FlowItem.prototype.BuildImage = function (html, img) {
    html.push("<div class='flow-user-image'>");
    if (img) {
        img = "/resource/" + EMW.Global.User.CompanyCode + "/UserImage/" + img;
    }
    html.push("<image src='" + (img || "/images/testpic.jpg") + "'/>");
    html.push("</div>");
}
FlowItem.prototype.Build = function (parent) {
    var html = [];
    html.push('<div class="flow-process">');
    if (this.History) {
        for (var i = 0; i < this.History.length; i++) {
            var his = this.History[i];
            html.push("<div class='flow-item flow-item-pass'>");
            html.push("<div class='flow-border" + (his.Line == "回退" ? "-back" : "") + "'>");
            html.push("</div>");
            this.BuildImage(html, his.Image);
            html.push("<div class='flow-item-header'>");

            html.push("<span class='flow-user'>");
            html.push(his.User);
            if (his.RealUser) {
                html.push(" 代理 " + his.RealUser);
            }
            html.push("</span>");
            html.push("<span class='flow-line'>");
            html.push(" " + his.Line);
            html.push("</span>");
            html.push("<span class='flow-time'>");
            html.push(his.Time);
            html.push("</span>");

            html.push("</div>");

            html.push("<div class='flow-option'>");
            html.push(his.Content);
            html.push("</div>");
            html.push("</div>");

        }
    }
    var curNodeUser;
    var isCurrentUser = false;
    if (this.UserStatus) {
        //html.push("<div class='flow-item'>");
        //html.push("<div class='flow-border'>");
        //html.push("</div>");
        //html.push("<h5>当前节点由以下人员处理：</h5>");
        for (var i = 0; i < this.UserStatus.length; i++) {
            var state = this.UserStatus[i];
            curNodeUser = state;
            if (state.UserID == 0 || state.UserID == EMW.Global.User.ID) {
                //curNodeUser = state;
                isCurrentUser = true;
                continue;
            }
            // this.BuildImage(html, state.UserImage);
        }
        // html.push("</div>");
    } else { curNodeUser = {}; }
    var ary = [];
    //展示流程任务
    for (var i = 0; i < this.Tasks.length; i++) {
        var task = this.Tasks[i];
        ary.push({
            icon: "action_trending_flat", text: "任务" + (i + 1) + "：" + task.Name + " " + (task.IsDone ? "√" : "×"), desc: "请确保先完成任务再提交下环节处理！ " + task.Memo, id: task.ID, IsTask: true
        });
    }

    for (var i = 0; i < this.Lines.length; i++) {
        var line = this.Lines[i];
        ary.push({
            icon: line.Icon || "content_redo", text: line.Name, desc: line.Memo,
            id: line.ID, isLine: true, AllowMulitUser: line.AllowMulitUser, NoReceiver: line.NoReceiver
        });
    }
    if (this.AllowTrans) {
        ary.push({
            icon: "communication_import_export", isTrans: true, text: "转发", desc: "转发给别人处理",
            id: -3, isLine: true
        });
    }
    if (this.AllowAppend) {
        ary.push({
            icon: "content_redo", isTrans: true, text: "加签", desc: "先转发给别人，再返回给自己处理",
            id: -2, isLine: true
        });
    }
    if (this.AllowReturn) {
        ary.push({
            icon: "av_replay", text: "回退到上个环节", desc: "将该数据的状态返回到上个阶段",
            id: -1, isLine: true, NeedOption: true, NoReceiver: true
        });
    }
    if (this.AllowReturnAll) {
        ary.push({
            icon: "av_replay", text: "回退到开始节点", desc: "将该数据的状态返回第一步开始节点",
            id: -9999, isLine: true, NeedOption: true, NoReceiver: true
        });
    }
    if (ary.length) {
        ary.push({
            icon: "action_done", text: "确认", NeedOption: true, command: "ok", isShow: false, isLine: false
        });
        ary.push({
            icon: "navigation_close", text: "取消", NeedOption: true, command: "cancel", isShow: false, isLine: false
        });

    }
    //展示状态
    if (!isCurrentUser && curNodeUser) {
        if (curNodeUser.UserName != undefined) {

            html.push("<div class='flow-item'>");
            html.push("<div class='flow-border'>");
            html.push("</div>");
            this.BuildImage(html, curNodeUser.UserImage);
            html.push("<div class='flow-item-header'>");

            html.push("<span class='flow-user'>");
            html.push("<span class='flow-line'>");
            html.push(curNodeUser.UserName);
            html.push("</span>");
            if (his.RealUser) {
                html.push(" 代理 " + his.RealUser);
            }
            html.push("</span>");
            html.push("<span class='flow-line'>");
            html.push(" 正在处理");
            html.push("</span>");

            html.push("</div>");
        }
    }

    if (curNodeUser && ary.length) {
        html.push("<div class='flow-item flow-cur'>");
        html.push("<div class='flow-border'>");
        html.push("</div>");
        this.BuildImage(html, EMW.Global.User.Image);
        html.push("<div class='flow-item-header'>");

        html.push("<span class='flow-user'>");
        html.push(EMW.Global.User.Name);
        if (this.RealUser) {
            html.push(" 代理 " + this.RealUser + "处理该阶段");
        }
        html.push("</span>");
        html.push("</div>");
        if (this.Remark) {
            html.push("<div class='flow-option'>");
            html.push(this.Remark);
            html.push("</div>");
        }
        html.push('<div class="tool-bar"></div>');

        html.push("</div>");
        html.push('</div>');
    }
    this.Element = $(html.join("")).appendTo(parent);
    if (curNodeUser && ary.length) {
        var elem = this.Element.find(".tool-bar");

        this.ToolBar = elem.ToolBar({
            display: "tool-vertical",
            items: ary
        }).OnClick(this.LineClick.bind(this));
    }

}
FlowItem.prototype.LineClick = function (item) {
    if (item == this.CurLine) return;
    var cmd = item.command;
    if (cmd == "ok") {
        this.Submit();
        return;
    }
    if (item.IsTask) {
        //任务暂时不做操作，只展示
        return;
    }
    if (cmd == "cancel") {
        this.CurLine.isLine = true;
        this.ToolBar.FindItem("isLine", true, "show");
        this.ToolBar.FindItem("isLine", false, "hide");
        this.CurLine = null;
        if (this.SubmitElement) {
            this.SubmitElement.remove();
            this.SubmitElement = null;
        }
    } else {
        item.isLine = false;
        this.CurLine = item;
        this.ToolBar.FindItem("isLine", true, "hide");
        this.ToolBar.FindItem("isLine", false, "show");
        if (item.id > 0) {
            this.Page.Request("LineUser?rid=" + this.Page.RecordID + "&flowid=" + this.ID + "&id=" + item.id, false, this.ShowNextUser.bind(this));
        } else {
            this.ShowNextUser(null);
        }

    }

}
FlowItem.prototype.Submit = function () {
    if (!this.CurLine) return;
    var data = [];
    if (!this.CurLine.NoReceiver) {
        var users = [];
        if (this.CurLine.isTrans) {
            var v = this.UserSearcher.GetValue();
            if (v) users.push(v);

        } else {
            var elems = this.Element.find("input");
            for (var i = 0; i < elems.length; i++) {
                if ($(elems[i]).is(":checked")) {
                    users.push($(elems[i]).attr("uid"));

                }
            }
        }
        if (!users.length) {
            return Z.Error("请选择下环节处理人员。");
        }
        data.push("NextUser=" + EMW.Const.encode(users.join(",")));
        //data.NextUser = users.join(",");
    }
    //data.Option = this.Element.find("textarea").val();
    var opit = this.Element.find("textarea").val();
    if (this.CurLine.NeedOption && !opit) {
        return Z.Error("请输入处理意见或备注。");
    }
    if (opit.length > 400) {
        return Z.Error("处理意见或备注的长度不能大于400");
    }
    data.push("Option=" + EMW.Const.encode(opit));
    data.push("Line=" + this.CurLine.id);
    data.push("FlowID=" + this.ID);
    data.push("rid=" + this.Page.RecordID);
    this.Page.Request("lineto?" + data.join("&"), true, function (x) {
        if (!x) return;
        if (x.Message) return Z.Error(x.Message);
        this.ParentContent.Dialog.Close(true);
        x.Message = "流程已提交";
        this.Page.SaveOver(null, x);
    }.bind(this));
}
FlowItem.prototype.ShowNextUser = function (x) {
    var html = [];
    html.push("<div class='hide-item'>");
    if (x) {
        html.push("<div style='padding:5px 0px 5px 10px;'>选择下环节处理人员：</div>");
        html.push("<div style='max-height:100px;overflow-y:auto;padding:0px 0px 0px 10px;'>");
        for (var i = 0; i < x.Rows.length; i++) {
            var row = x.Rows[i];
            html.push("<label style='display:block;'>");
            var uid = row[0];
            if (row[4]) {
                uid = uid + "(" + row[4] + ")";
            }
            html.push("<input name='line" + this.CurLine.ID + "' type='" + (this.CurLine.AllowMulitUser ? "checkbox" : "radio") + "'  uid=\"" + uid + "\"/>");
            html.push(row[1]);
            if (row[4]) {
                html.push("(由" + row[5] + "代理)");
            }
            html.push("</label>");
        }
        html.push("</div>");
    }

    html.push("<textarea class='text-box' style='width:330px;height:100px;margin:0px 10px 0px 10px;' placeholder='处理意见或备注'></textarea>");
    html.push("</div>");
    this.SubmitElement = $(html.join("")).insertAfter(this.CurLine.__target);
    if (this.CurLine.isTrans) {
        var elem = $("<div style='width:180px;padding:5px 0px 5px 10px;'><div>选择接收人员：</div><input type='text' class='text-box'></div>")
           .insertBefore(this.SubmitElement.find("textarea"));
        this.UserSearcher = elem.find("input").Searcher({
            multiple: true,
            dataKey: "Users",
            textField: "NAME",
            valueField: "ID",
            columns: [[
                { title: "用户", field: "NAME", width: 200 },
            ]]
        });
    }
}

function Navigation() {
    this.Items = [];
    this.IsForElement = true;
}
Navigation.prototype.AddSectionItem = function (elem, text, icon) {
    this.Items.push({ ID: elem.ID, ForElement: elem, Name: text, Icon: icon || "action_list" });
}
Navigation.prototype.AddNavigationItem = function (item) {
    if (!item) return;
    item.Icon = item.Icon || "image_assistant_photo";
    this.Items.push(item);
}

Navigation.prototype.Width = function () {

    if (!this.Element) return 200;
    if (this.Element.attr("isHide")) return 30;
    return 200;
}
Navigation.prototype.SetItemVisible = function (item) {
    if (!this.Element) return;
    var elem = this.Element.find("#nav_" + item.ID);
    if (item.State == ElementStates.Hidden) {
        elem.hide();
    } else {
        elem.show();
    }
}
Navigation.prototype.GroupItems = function () {
    var baseInfo = [];
    var navs = {};
    var list = [baseInfo];
    for (var i = 0; i < this.Items.length; i++) {
        var item = this.Items[i];
        if (!item.ForElement && !this.Page.RecordID) continue;
        if (item.Group) {
            if (!navs[item.Group]) {
                navs[item.Group] = [];
                list.push(navs[item.Group]);
            }
            navs[item.Group].push(item);
        } else {
            baseInfo.push(item);
        }
    }
    return list;

}
Navigation.prototype.Build = function (parent) {
    $(".form_content,.form_pages").css({ marginLeft: 30 });
    var html = [];
    html.push("<div class='form_left form-left-hide' style='width:30px;'>");
    html.push("<span class='glyphicon icon-image_dehaze fold-close icon'></span>");
    html.push("<div class='content'>");

    var navs = this.GroupItems();
    for (var j = 0; j < navs.length; j++) {
        var nav = navs[j];
        if (!nav.length) continue;
        html.push("<div class='formnav-group'>");
        html.push("<div class='formnav-group-header'>");
        html.push("<span class='hide-item formnav-group-text'>" + (nav[0].Group || "基本信息") + "</span>");
        html.push("<span class='glyphicon icon-hardware_keyboard_arrow_down formnav-group-icon'></span>");
        html.push("</div>");
        html.push("<div class='formnav-group-body'>");
        for (var i = 0; i < nav.length; i++) {
            var item = nav[i];
            html.push("<div class='formnav-item' id='nav_" + item.ID + "'");
            // if (item.PageID) html.push(" page='"+item.PageID+"'");
            if (nav.ForElement && ForElement.State == ElementStates.Hidden) {
                html.push(" style='display:none;'");
            }
            html.push("><span class='glyphicon icon-" + item.Icon + " formnav-item-icon'></span>");
            html.push("<span class='hide-item formnav-item-text'>" + item.Name + "</span>");
            html.push("</div>");
        }
        html.push("</div>");
        html.push("</div>");

    }

    html.push("</div></div>");
    this.Element = $(html.join("")).appendTo(parent);
    //this.Element.find(".tree").Tree({data:this.Items});

    this.Element.find(".icon").click(this.Toggle);
    this.Element.on("click", ".formnav-item", this.SelectNav.bind(this));
}
Navigation.prototype.SelectNav = function (evt) {
    var elem = $(evt.target).closest(".formnav-item");
    if (elem.is(".selected")) return;
    if (this.SelectedItem) {
        this.SelectedItem.NavElem.removeClass("selected");
        this.SelectedItem.ClosePage && this.SelectedItem.ClosePage();
    }
    elem.addClass("selected");
    var id = elem.attr("id").replace("nav_", "");
    var item = this.Items.First(function (x) { return x.ID == id; });
    if (!item) return;
    item.NavElem = elem;
    this.SelectedItem = item;
    if (!this.Page.PagesElement) {
        this.Page.PagesElement = $("<div class='form_pages'></div>").appendTo(document.body);

        if (this.Element.is(".form-left-hide")) this.Page.PagesElement.css({ marginLeft: 30 });
        else this.Page.PagesElement.css({ marginLeft: 200 });
    }
    var ischange = (!!item.ForElement) != this.IsForElement;
    if (!item.OpenPage) {

        var sec = $("#" + id);
        var height = sec.height();
        var pos = sec.position();
        $(document.body).scrollTop(pos.top);
        if (ischange) {
            this.Page.PagesElement.hide();
            this.Page.Element.show();
            this.Page.InitToolBar();
            this.Page.SetTitle(this.Page.Name);
        }
    } else {
        if (ischange) {
            this.Page.PagesElement.show();
            this.Page.Element.hide();
        }
        item.OpenPage(this.Page);
    }
    this.IsForElement = (!!item.ForElement);
}
Navigation.prototype.Toggle = function () {
    var elem = $(this).parent();
    if (elem.is(".form-left-hide")) {
        elem.animate({ width: 200 }, "fast", function () {
            elem.removeClass("form-left-hide");
            $(".form_content,.form_pages").css({ marginLeft: 200 });
        });
    } else {
        elem.animate({ width: 30 }, "fast", function () {
            $(".form_content,.form_pages").css({ marginLeft: 30 });
        });
        elem.addClass("form-left-hide");
    }
}
function QuickSearch() {
    this.Items = [];
}
QuickSearch.prototype.AddItem = function (title) {
    this.Items.push(title);
}
QuickSearch.prototype.GetSearch = function (obj) {
    if (!this.Element) return;
    var item = this.Element.find(".selected").attr("sindex");
    if (item == undefined) return;
    obj[this.ID] = parseInt(item);
}
QuickSearch.prototype.Create = function (panel) {
    if (!this.Items.length) return;
    var html = [];
    html.push("<div class='quicksearch-group' id='" + this.ID + "'>");
    html.push("<span class='quicksearch-header'>");
    html.push(this.Name);
    html.push("：</span>");
    html.push("<span class='quicksearch-item selected'><span class='block glyphicon icon-action_done'></span>全部</span>");
    for (var i = 0; i < this.Items.length; i++) {
        html.push("<span class='quicksearch-item' sindex='" + i + "'><span class='block glyphicon icon-action_done'></span>" + this.Items[i] + "</span>");
    }
    html.push("</div>");
    var $grid = this.Page;
    this.Element = $(html.join("")).appendTo(panel).on("click", ".quicksearch-item", function () {
        if (!$(this).parent().is(":last-child")) {
            //if ($(this).is(".selected")) return;
            $(this).parent().children().removeClass("selected");
        }
        $(this).toggleClass("selected");
        $('.search-button').unbind("click").on('click', function () {
            $grid.LoadData();
        })
    });
}

var FormImage = function () {
    this._Value = "";
    this.Height = 100;
    this.Title = "";
}
Inherits(FormImage, TextBox);

FormImage.prototype.Build = function (parent) {
    this.Element = $("<div " + (this.State == ElementStates.Hidden ? "style='display:none'" : "") + " class='section-item'><div class='title img-title'>" + this.Title
    + (this.IsAllowNull ? "" : "<span class='notnull'>*</span>") + "</div></div>");

    parent.append(this.Element);

    var imgPanel = $("<div class='form-img'></div>");
    imgPanel.height(this.Height);
    if (this.Width) imgPanel.width(this.Width);

    var list = $("<div class='img-list'></div>");

    imgPanel.append(list);

    list.append("<div class='img-item'><img src='/Images/pic.png' style='display:none;'/></div>")

    if (this.IsMul) {
        imgPanel.append("<div class=\"arrow arrow-left\"><span class=\"glyphicon glyphicon-chevron-left\"></span></div><div class=\"arrow arrow-right\"><span class=\"glyphicon glyphicon-chevron-right\"></span></div>");
        imgPanel.on("click", ">.arrow", this, this.OnImageArrow);

        imgPanel.append("<div class='img-count'></div>");
    }
    this.Img = list.find(">.img-item>img");
    var $this = this;
    this.Img.on("load", function () {
        var img = $(this);
        if (!this.naturalWidth) {
            img.attr("actualwidth", this.naturalWidth);
            img.attr("actualheight", this.naturalHeight);
            $this.ScaleImage(img);
        } else {
            $("<img src='" + img.attr("src") + "'/>").on("load", function () {
                img.attr("actualwidth", this.width);
                img.attr("actualheight", this.height);
                $this.ScaleImage(img);
            });
        }
    });

    imgPanel.append("<div class=\"upload-btn\" " + (this.State == ElementStates.ReadOnly ? "style='display:none;'" : "") + "><span class=\"glyphicon glyphicon-upload\"></span>上传</div>");

    this.Element.append(imgPanel);

    imgPanel.on("click", ">.upload-btn", this, this.OpenSelectImageWind);

    imgPanel.on("click", ">.img-list>.img-item>img", this, function (e) {
        var _this = e.data;
        _this.Zoom($(this).attr("src"));
    })
    if (!this.Page.RecordID) {
        this._Value = this.DefaultValue;
    }
    if (this._Value != undefined) this.Value(this._Value);

    return this.Element;
}

FormImage.prototype.Zoom = function (src) {
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
        var imgh, imgw, ww, wh, $b = ($(img).parent())[0], i = $(img)[0], _img = i.style, bgX = 0, bgY = 0, scaleSize = 1, isRun, startX, startY, endX, endY, rX, rY;
        img.one("load", function (e) {
            img.attr("actualwidth", img.width());
            img.attr("actualheight", img.height());
            _this.ScaleImage(img, overlayPanel.width(), overlayPanel.height());
            imgw = parseInt(img.width());
            imgh = parseInt(img.height()),
            ww = parseInt($b.style.width),
            wh = parseInt($b.style.height);
        });
        _img.position = "absolute";
        //图片滚轮事件
        img.on("mousedown", function (e) {
            e = e.originalEvent;
            if (e.which === 1 && e.target && (e.target === i)) {
                isRun = true;
                startX = e.pageX;
                startY = e.pageY;
                return false;
            }
        }).on("mouseup", function (e) {
            e = e.originalEvent;
            if (e.which !== 1) return;
            img.cursor = "default";
            isRun = false;
            bgX = rX;
            bgY = rY;
            return false;
        }).on("mousemove", function (e) {
            e = e.originalEvent;
            if (e.which !== 1) return;
            if (isRun) {
                _img.cursor = "move";
                endX = e.pageX;
                endY = e.pageY;
                rX = bgX + endX - startX;
                rY = bgY + endY - startY;
                _img.left = rX + "px";
                _img.top = rY + "px";
            }
        }).on("mousewheel", function (e) {
            e = e.originalEvent;
            var deltaY = 0;
            var x = e.pageX;
            var y = e.pageY;
            e.preventDefault();
            if (e.target && (e.target === i)) {
                x = x - $b.offsetLeft;
                y = y - $b.offsetTop;
                var p = -(e.deltaY) / 1000;
                var ns = scaleSize;
                ns += p;
                ns = ns < 0.5 ? 0.5 : (ns > 5 ? 5 : ns);//可以缩小到0.5,放大到5倍
                //计算位置，以鼠标所在位置为中心
                //以每个点的x、y位置，计算其相对于图片的位置，再计算其相对放大后的图片的位置
                bgX = bgX - (x - bgX) * (ns - scaleSize) / (scaleSize);
                bgY = bgY - (y - bgY) * (ns - scaleSize) / (scaleSize);
                scaleSize = ns;//更新倍率
                _img.width = imgw * ns + "px";
                _img.height = imgh * ns + "px";
                _img.top = bgY + "px";
                _img.left = bgX + "px";
                _img.cursor = "pointer"
            }
        }).on("click", function () {
            return false;
        })
        /////////////////
    }
}
//按比例缩放图片
FormImage.prototype.ScaleImage = function (img, w, h) {
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

FormImage.prototype.OpenSelectImageWind = function (e) {
    var $this = e.data;
    var wind = EMW.UI.Dialog({
        url: "/Pages/Public/Uploader.html",
        title: "选择图片",
        width: 450,
        height: 360,
        OnOK: function (o) {
            if (o) {
                var results = $.isArray(o) ? o : [o];
                $this.SelectedCallback(results);
            }
        }
    });
    wind.multi = $this.IsMul ? '1' : undefined;
    wind.exts = ["png", "jpg", "jpeg"];
    wind.ml = 1024 * 1024 * 1000;
    wind.path = "UserImage";
    wind.save = 0;
    var strs = $this.Value();
    if (strs) {
        var urls = strs.split(";");
        var files = urls.Select(function (url) { return { Url: url } });
        wind.files = files;
    }

}
FormImage.prototype.OnImageArrow = function (e) {
    var $this = e.data;
    var index = $this._CurrentIndex;
    $(this).hasClass("arrow-left") ? index-- : index++;
    $this.Show(index);
}

FormImage.prototype._Count = function () {
    var val = this.Value();
    if (val) {
        var paths = val.split(";");
        return paths.length;
    }
    return 0;
}
FormImage.prototype.SetState = function (state) {
    if (state == this.State) return;
    this.State = state;
    if (this.IsRepeat) this.Parent.SaveState(this);
    if (!this.Element) return;
    switch (state) {
        case 1:
            this.Element.show();
            this.Element.find(".upload-btn").show();
            break;
        case 2:
            this.Element.show();
            this.Element.find(".upload-btn").hide();
            break;
        case 3:
            this.Element.hide();
            break;
    }
}
FormImage.prototype.Show = function (index) {
    var val = this.Value();
    if (val) {
        var paths = val.split(";");
        if (index >= 0 && index < paths.length) {
            this.Img.attr("src", this.GetSrc(paths[index]));
            this._CurrentIndex = index;
            this.OnEvent("Change");
        }
    }
    else {
        this.Img.attr("src", "/Images/pic.png");
    }
    var count = this._Count();
    if (count > 0) {
        this.Element.find(".img-count").html((this._CurrentIndex + 1) + "/" + count);
    }
}

FormImage.prototype.GetSrc = function (path) {
    if (path && path.indexOf("/") != 0) {
        return "/" + path;
    }
    return path;
}

FormImage.prototype.SelectedCallback = function (files) {
    this.Value("");
    if (files) {
        var paths = [];
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            paths.push(file.Url);
        }
        this.Value(paths.join(";"));
        this.Show(0);
    }
}

FormImage.prototype.Value = function (v) {
    if (v === undefined) {
        return this._Value;
    }
    else {
        this._Value = v;
        this.Show(0);
        return this;
    }
}

var FormChart = function () {
    this.ChartType = ChartTypes.Column;
    this.IsHeader = true;
}
Inherits(FormChart, TextBox);
FormChart.prototype.Build = function (p) {

    this.Element = $('<div ' + (this.State == ElementStates.Hidden ? "style='display:none'" : "") + ' class="form-section" id="' + this.ID + '"><div class="section-header"><span class="glyphicon section-icon"></span><span class="section-title">' + this.Title
       + '</span></div><div class="section-body"></div></div>');
    if (!this.IsHeader)
        this.Element.find(".section-header").hide();
    this.Element.Section();

    this.Content = this.Element.find(".section-body");

    p.append(this.Element);

    var chartPanel = $("<div class='form-chart-panel'></div>");

    this.Content.append(chartPanel);

    chartPanel.css({ height: this.Height, width: this.Width });

    this.InitChart();

    return this.Element;
}

FormChart.prototype.SetOption = function (opt) {
    if (this.Chart) {
        this.Chart.setOption(opt);
    }
}
//参数rows:{X:分类的值，T:"X分类的文本"，Y:统计值}
FormChart.prototype.SetData = function (rows) {
    var opt = ChartProccesor.GetChartOption({ Name: this.Title, ChartType: this.ChartType }, rows);
    this.SetOption(opt);
}

//图表类型ChartTypes
FormChart.prototype.SetChartType = function (type) {
    this.ChartType = type;
}

//图表标题
FormChart.prototype.SetTitle = function (title) {
    if (this.Chart) {
        this.Chart.setOption({ title: { text: title } });
    }
}

FormChart.prototype.InitChart = function () {
    var _this = this;
    FormChart.RequireEchart(function () {
        _this.Chart = echarts.init(_this.Element.find(".form-chart-panel")[0]);
        _this.Chart.on("click", function (params) {
            var obj = $.isArray(params) ? params[0] : params;
            _this.SelectedData = obj.data;
            _this.OnEvent("ClickSerice", params)
            return false;
        });
        _this.Chart.on("dblclick", function (params) {
            var obj = $.isArray(params) ? params[0] : params;
            _this.SelectedData = obj.data;
            _this.OnEvent("DBLClickSerice", params);
            return false;
        });
        _this.OnEvent("ChartInited");
    });
};
FormChart.prototype.GetChartTypeName = function () {
    var type = this.ChartType || 0;
    return FormChart.ChartTypeMaps[type];
};
(function () {
    var loaded, loading, callbacks;
    FormChart.RequireEchart = function (cb) {
        if (loaded) {
            cb();
            return false;
        }
        if (!callbacks) {
            callbacks = $.Callbacks("once unique");
        }
        callbacks.add(cb);
        if (!loading) {
            loading = true;
            $.getScript("/JS/ECharts/echarts.min.js", function () {
                loaded = true;
                callbacks.fire();
            });
        }
    }
})();
FormChart.ChartTypeMaps = ["bar", "bar", "line", "pie", "pie", "funnel", "radar"];
var ChartTypes = {
    /// <summary>
    /// 柱状图
    /// </summary>
    //[ChartTypeMeta(Text = "柱状图", ClientType = "bar")]
    Column: 0,
    /// <summary>
    /// 条形图
    /// </summary>
    //[ChartTypeMeta(Text = "条形图", ClientType = "bar")]        
    Bar: 1,
    /// <summary>
    /// 折线图
    /// </summary>
    //[ChartTypeMeta(Text = "折线图", ClientType = "line")]
    Line: 2,
    /// <summary>
    /// 饼图
    /// </summary>
    //[ChartTypeMeta(Text = "饼图", ClientType = "pie")]
    Pie: 3,
    /// <summary>
    /// 环状图
    /// </summary>
    //[ChartTypeMeta(Text = "环状图", ClientType = "pie")]
    Ring: 4,
    /// <summary>
    /// 漏斗图
    /// </summary>
    //[ChartTypeMeta(Text = "漏斗图", ClientType = "funnel")]
    Funnel: 5,
    /// <summary>
    /// 雷达(面积)图
    /// </summary>
    //[ChartTypeMeta(Text = "雷达(面积)图", ClientType = "radar")]
    Radar: 6
};

var Switch = function () {
    this._Value = "";
}
Inherits(Switch, TextBox);
Switch.prototype.Build = function (p) {
    this.Element = $("<div " + (this.State == ElementStates.Hidden ? "style='display:none'" : "") + "class='section-item'  id='" + this.ID + "'><div class='title'>" + this.Title
    + "</div> <div style='display: table-cell;vertical-align: top;text-align: left;'><div class=\"switch\"><span class=\"option on-option\">ON</span><span class=\"option off-option\">OFF</span><span class=\"switch-target\"></span></div></div> </div>");
    if (this.Default == "true") {
        this.Element.find(".switch").addClass("on");
    }
    this.Element.on("click", ".switch", this, function (e) {
        var _this = e.data;
        if (_this.State == ElementStates.ReadOnly) return false;
        _this.Value(!$(this).hasClass("on"));
    });

    if (!this.Page.RecordID) {
        this._Value = this.DefaultValue;
    }
    this.Value(this._Value);

    this.Element.data("control", this);

    p.append(this.Element);

    return this.Element;
}

Switch.prototype.Value = function (v) {
    if (arguments.length > 0) {
        var changed = this._Value != v;
        this._Value = !!v;
        if (this.Element) {
            this._Value ? this.Element.find(".switch").addClass("on") : this.Element.find(".switch").removeClass("on");
        }
        if (changed) {
            this.OnEvent("Change");
        }
    }
    else {
        return this.Element ? this.Element.find(".switch").hasClass("on") : this._Value;
    }
}
Switch.prototype.Save = function (ds) {
    var v = this.Value();
    ds[this.ID] = v ? 1 : 0;
}

var FormAttach = function () {
    this.Files = [];
}

Inherits(FormAttach, TextBox);

FormAttach.prototype.Build = function (parent) {

    this.Element = $('<div ' + (this.State == ElementStates.Hidden ? "style='display:none'" : "")
        + ' class="form-section" id="' + this.ID + '"><div class="section-header"><span class="glyphicon section-icon"></span><span class="section-title">'
        + this.Title + '</span><small>' + (this.Memo ? ('(' + this.Memo + ')') : "") + '</small></div><div class="section-body"></div></div>');

    this.Element.Section();

    this.Content = this.Element.find(".section-body");

    parent.append(this.Element);

    this.ListPanel = $("<div class='form-attach-list'></div>");

    this.Content.append(this.ListPanel);

    this.ToolBar = $("<div class='form-attach-toolbar'></div>");

    this.ToolBar.append("<div class='attach-tool-item' data-cmd='Upload'><span class='glyphicon icon-av_playlist_add'></span> 添加附件</div>");

    this.Content.append(this.ToolBar);

    this.ToolBar.on("click", ">.attach-tool-item", this, function (e) {
        e.data.OnClickTool($(this).attr("data-cmd"));
    });

    if (this.State == ElementStates.ReadOnly) {
        this.Element.addClass("attach-disabled");
    }

    this.ListPanel.on("click", ">.attach-item>.attach-operator", this, FormAttach.OnClickOperator);

    this.ListPanel.on("focusout", ">.attach-item>.attach-operator", this, FormAttach.OnFocusoutOperator);

    this.DisplayFiles(this.Files);

    return this.Element;
}

FormAttach.prototype.Value = function () {
    if (arguments.length == 0) {
        var arr = [];
        if (this.Files) {
            arr = this.Files.Select(function (f) { return f.ID; });
        }
        return arr.join(",");
    }
    return this;
}
//NoSet:0, Normal:1,ReadOnly:2,Hidden:3
FormAttach.prototype.SetState = function (state) {
    if (state == this.State) return;
    this.State = state;
    switch (state) {
        case 1:
            this.Element.show();
            this.Element.removeClass("attach-disabled");
            break;
        case 2:
            this.Element.show();
            this.Element.addClass("attach-disabled");
            break;
        case 3:
            this.Element.hide();
            break;
    }
}


FormAttach.prototype.DisplayFiles = function (files) {
    this.ListPanel.empty();
    this.Files = [];
    if (files) {
        for (var i = 0; i < files.length; i++) {
            this.AppendFile(files[i]);
        }
    }
}

FormAttach.prototype.AppendFile = function (file) {
    var item = $("<div class='attach-item'></div>");
    this.ListPanel.append(item);
    item.attr("data-fileid", file.ID);

    var icon = EMW.Const.Util.GetFileIcon(file.Name);
    item.append("<div class='attach-file-icon'><image src='" + icon + "'/></div>");

    var info = $("<div class='attach-file-info'></div>");
    item.append(info);
    info.append("<div class='info-row'><div class='attach-file-name'>" + file.Name + "</div></div>");
    info.append("<div class='info-row'><div class='attach-upload-date'>" + Z.ToDate(file.UpdateTime).ToString("yyyy-MM-dd hh:mm")
        + "</div><div class='attach-file-size'>" + EMW.Const.Util.FileLengthToString(file.Length) + "</div></div>");

    item.append("<div class='attach-operator' tabindex='-1'><span class='glyphicon icon-navigation_more_horiz'></span></div>");
    item.data("file", file);

    this.Files.push(file);

    if (!this.IsMul) {
        this.ToolBar.hide();
    }
}

FormAttach.prototype.OnClickTool = function (cmd) {
    var fn = this["CMD_" + cmd];
    if (fn) {
        fn.apply(this);
    }
}
FormAttach.prototype.CMD_Upload = function () {
    var _this = this;
    var wind = EMW.UI.Dialog({
        url: "/Pages/Files/FileList.html",
        title: "选择附件",
        width: 840,
        height: 580,
        OnOK: function (x) {
            if (x) {
                var file = x[0];
                _this.AppendFile(file);
            }
        }
    });
    wind.multi = 0;
}

FormAttach.prototype.RemoveItem = function (fileID) {
    var attachItem = this.ListPanel.find(">.attach-item[data-fileid='" + fileID + "']");
    if (attachItem.length) {
        var file = attachItem.data("file");
        this.Files.Remove(file);
        attachItem.remove();
    }
    if (!this.IsMul && this.Files.length == 0) {
        this.ToolBar.show();
    }
}

FormAttach.OnClickOperator = function (e) {
    var attach = e.data;
    if (!FormAttach.OperatorPanel) {
        FormAttach.OperatorPanel = $("<div class='form-attach-operator-panel'></div>").appendTo("body");
        FormAttach.OperatorPanel.on("click", ">.operator-item", FormAttach.OnClickOperatorItem);
    }
    var panel = FormAttach.OperatorPanel;
    var pos = $(this).offset();
    var left = pos.left - (panel.outerWidth() / 2) + ($(this).outerWidth() / 2);
    left = left < 0 ? 0 : left;
    panel.css({ top: pos.top + $(this).outerHeight() + 10, left: left });
    attach.DisplayOperatorMenu(panel, $(this).closest(".attach-item").data("file"));
    $(this).focus();
}

FormAttach.prototype.DisplayOperatorMenu = function (panel, file) {
    var fileID = file.ID;
    panel.data("attach", this);
    panel.empty();
    var tools = [
        { icon: "file_file_download", text: "下载", OnClick: FormAttach.Download }
    ];
    var previewTypes = [".docx", ".doc", ".xls", ".xlsx", ".png", ".jpg", ".jpeg"];
    var ext = file.Name.substr(file.Name.lastIndexOf(".")).toLowerCase();
    if (previewTypes.Exist(function (o) { return o == ext; })) {
        tools.push({ icon: "action_pageview", text: "预览", OnClick: FormAttach.Preview });
    }
    if (this.State != ElementStates.ReadOnly) {
        tools.push({ icon: "action_delete_forever", text: "删除", OnClick: FormAttach.Delete });
    }
    if (tools && tools.length) {
        for (var i = 0; i < tools.length; i++) {
            var tool = tools[i];
            var item = $("<div class='operator-item' data-fileid='" + fileID + "'><span class='glyphicon icon-" + tool.icon + "'></span> " + tool.text + "</div>");
            item.data("file", file);
            item.data("tool", tool);
            panel.append(item);
        }
    }
    panel.fadeIn("fast");
}

FormAttach.OnFocusoutOperator = function (e) {
    if (FormAttach.OperatorPanel) {
        FormAttach.OperatorPanel.fadeOut("fast");
    }
}
FormAttach.OnClickOperatorItem = function (e) {
    var attach = $(this).closest(".form-attach-operator-panel").data("attach");
    var tool = $(this).data("tool");
    if (tool.OnClick) {
        tool.OnClick.apply(this, [tool, attach]);
    }
}
FormAttach.Download = function (tool, attach) {
    EMW.Const.Util.Download($(this).attr("data-fileid"));
}

FormAttach.Preview = function (tool, attach) {

    var file = $(this).data("file");

    var previewTypes = [".png", ".jpg", ".jpeg"];
    var ext = file.Name.substr(file.Name.lastIndexOf(".")).toLowerCase();
    if (previewTypes.Exist(function (x) { return x == ext; })) {
        var im = new FormImage();
        var src = "/resource/" + file.Url;
        im.Zoom(src);
    }
    else {
        EMW.Const.PreviewFile(file);
    }
}

FormAttach.Delete = function (tool, attach) {
    var target = $(this);
    Z.Show("确定删除吗?", function (isOK) {
        if (isOK) {
            attach.RemoveItem(target.attr("data-fileid"));
        }
    });
}

var Button = function () {

}
Inherits(Button, TextBox);
Button.prototype.OnEvent = TextBox.prototype.OnEvent;
Button.prototype.Build = function (parent) {
    this.Element = $("<div class='section-item'><button class='btn' " + (this.State == ElementStates.ReadOnly ? "disabled" : "") + ">" + this.Title + "</button><div>").appendTo(parent);
    this.Element.click(this.OnEvent.bind(this, "Click"));
    if (this.Width) this.Element.find("button").width(this.Width);
    return this.Element;
}
Button.prototype.SetState = function (state) {
    if (state == this.State) return;
    this.State = state;
    if (!this.Element) return;
    switch (state) {
        case 1:
            this.Element.removeProp("disabled");
            this.Element.show();
            break;
        case 2:
            this.Element.prop("disabled", true);
            this.Element.show();
            break;
        case 3:
            this.Element.hide();
            break;
    }
}
var NavigationItem = function () {

}

NavigationItem.OnEvent = TextBox.prototype.OnEvent;
NavigationItem.prototype.OpenPage = function (fromPage) {
    if (!this.PageID) return;
    if (this.Page) {
        this.Page.show();
        this.SetTitle(this.Title);
        this.ShowTools(this.Tools);
    }
    else {

        var url = "/Page/" + this.PageID + "?mrid=" + fromPage.RecordID + "&mtid=" + fromPage.TID;
        this.Page = $("<iframe src='" + url + "' frameborder='0' width='100%'></iframe>");
        this.Page[0].params = {};
        this.Page[0].params["param0"] = this;
        this.Page.appendTo(fromPage.PagesElement).on("load", function () {
            var win = this.contentWindow;
            var elems = win.$(".form_content");
            var $this = $(this);
            if (elems.length) {

                win.$("body").css("height", "auto");
                win._control.On("Load", function () {

                    $this.height(win.$(".form_content").height());

                });
                win.onresize = function () {
                    $this.height(win.$("body").height());
                };
            } else {
                win.$("body").css("height", "100%");
                $this.height($(window).innerHeight());
            }
        });
    }
}
NavigationItem.prototype.ClosePage = function () {
    if (this.Page) this.Page.hide();
}
NavigationItem.prototype.ShowTools = function (tools) {
    if (!tools) return;
    this.Tools = tools;
    var win = GetWindow();
    if (win) win.ShowTools(tools);
}
NavigationItem.prototype.SetTitle = function (title) {
    if (!title) return;
    this.Title = title;
    var win = GetWindow();
    win && win.SetTitle(title);
}


function FormMap() {
    this.Height = 200;
}
Inherits(FormMap, TextBox);

FormMap.prototype.Build = function (parent) {
    this.Element = $('<div ' + (this.State == ElementStates.Hidden ? "style='display:none'" : "") + ' class="form-section" id="' + this.ID + '"><div class="section-header"><span class="glyphicon section-icon"></span><span class="section-title">' + this.Title
     + '</span></div><div class="section-body"><div class="map" id="' + this.ID + '_map" ></div></div></div>').appendTo(parent);;
    this.Element.Section();
    this.Map = this.Element.find(".map").height(this.Height).Map();
    if (this._Value) {
        this.Map.SetPoint(this._Value);
    }
}
FormMap.prototype.Value = function () {
    if (arguments.length) {
        var v = arguments[0];
        if (v != this._Value) {
            this._Value = arguments[0];
            this.Map.SetPoint(this._Value);
        }
    } else {
        return this.Map.GetPoint();
    }
}


function RichTextBox() {
    this.Height = 200;
}
Inherits(RichTextBox, TextBox);
RichTextBox.prototype.Build = function (parent) {
    this.Element = $('<div ' + (this.State == ElementStates.Hidden ? "style='display:none'" : "") + ' class="form-section" id="' + this.ID + '"><div class="section-header"><span class="glyphicon section-icon"></span><span class="section-title">' + this.Title
+ '</span></div><div class="section-body"><div  id="' + this.ID + '_editor" contenteditable="true"></div></div></div>').appendTo(parent);
    this.Element.Section();
    this.Input = this.Element.find("#" + this.ID + "_editor").height(this.Height).html(this._Value);
    if (this.State == ElementStates.ReadOnly || this.State == ElementStates.ReadOnly) {
        return;
    }
    this.LoadEditor();
}
RichTextBox.prototype.LoadEditor = function () {
    if (this._Init) return;
    this._Init = true;
    $("<script src='/pages/talker/js/ckeditor/ckeditor.js'>").appendTo("head");
    window.setTimeout(this.Build2.bind(this), 500);
}
RichTextBox.prototype.Build2 = function () {
    if (!window["CKEDITOR"]) {
        return window.setTimeout(this.Build2.bind(this), 300);
    }
    CKEDITOR.replace(this.ID + "_editor");
}
RichTextBox.prototype.SetState = function (state) {
    if (state == this.State) return;
    this.State = state;
    switch (this.State) {
        case ElementStates.Normal:
            this.LoadEditor();
            this.Element.show();
            break;
        case ElementStates.ReadOnly:
            this.Element.show();//还要初始化
            break;
        case ElementStates.Hidden:
            this.Element.hide();
            break;
    }
}
RichTextBox.prototype.Value = function () {
    if (arguments.length) {
        this.Input.html(arguments[0]);
    } else {
        return this.Input.html();
    }
}
function SystemModule() {
    this.Height = 400;
}
Inherits(SystemModule, TextBox);

SystemModule.prototype.Build = function (parent) {

    this.OnEvent("Init");
    this.Element = $('<div ' + (this.State == ElementStates.Hidden ? "style='display:none'" : "") + ' class="form-section" id="' + this.ID + '"><div class="section-header"><span class="glyphicon section-icon"></span><span class="section-title">' + this.Title
    + '</span></div><div class="section-body"></div></div>').appendTo(parent);;
    this.Element.Section();
    if (!this.ModulePage || !this.ModulePage.URL) return;

    var url = this.ModulePage.URL;
    if (this.Page.ReadOnly) {
        url = (url + (url.indexOf("?") > -1 ? "&" : "?") + "view=1");
    }
    var _this = this;
    this.IFrame = AddIFrame(this.Element.find(">.section-body"), { src: url, height: this.Height }, this, function (fr) {
        _this.contentWindow = fr.contentWindow;
        _this.OnEvent("Load");
    });
}
SystemModule.prototype.Invoke = function (fnName, paras) {
    if (this.contentWindow) {
        var fn = this.contentWindow[fnName];
        if ($.isFunction(fn)) {
            return fn.apply(this.contentWindow, $.makeArray(arguments).RemoveAt(0));
        }
    }
}

SystemModule.prototype.GetObject = function (name) {
    if (this.contentWindow && name) {
        return this.contentWindow[name];
    }
}

function Calendar() {
    this.DefaultDate = new Date();
    this.SelectedDate = new Date();
    this.weekStr = '日一二三四五六';
    this.weekStrArr = ['日', '一', '二', '三', '四', '五', '六'];
    this.monthsStr = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
    this.Data = { MaxRow: 0 };
    this.EditData = [];
}
Inherits(Calendar, TextBox);
Calendar.prototype.Build = function (parent) {

    this.OnEvent("Init");
    this.Element = $('<div ' + (this.State == ElementStates.Hidden ? "style='display:none'" : "") + ' class="form-section" id="' + this.ID + '"><div class="section-header"><span class="glyphicon section-icon"></span><span class="section-title">' + this.Title
    + '</span></div><div class="section-body"><div class="toolbar"></div><div class="form-calendar" ><div class="form-calendar-header" >'
    + '<span class="glyphicon icon-hardware_keyboard_arrow_left form-calendar-icon month-left"></span><span class="form-calendar-title"></span>'
    + '<span class="glyphicon icon-hardware_keyboard_arrow_right form-calendar-icon month-right"></span>'
    + '</div><div class="form-calendar-days" ></div></div></div></div>').appendTo(parent);;
    this.Element.Section();
    this.TitlePanel = this.Element.find(".form-calendar-header").on("click", ".form-calendar-icon ", this.ChangeMonth.bind(this)).find(".form-calendar-title");
    this.Content = this.Element.find(".form-calendar-days").on("click", ".form-calendar-day", this.ShowPopPanel.bind(this));
    this.Data = this.ParseData();
    this.ShowMonth(this.DefaultDate);
}
Calendar.prototype.ParseData = function () {
    if (!this.Data.MaxRow) return;
    var ary = [];
    for (var j = 0; j < this.Data.Rows.length; j++) {
        var row = this.Data.Rows[j];
        var newRow = {};
        for (var i = 0; i < this.Data.Columns.length; i++) {
            var col = this.Data.Columns[i];
            newRow[col] = row[i];
        }
        var day = new Date(newRow.DATE).getDate();
        ary[day] = newRow;
    }
    return ary;
}
Calendar.prototype.IsEqual = function (dt1, dt2) {
    return dt1.getFullYear() == dt2.getFullYear() && dt1.getMonth() == dt2.getMonth() && dt1.getDate() == dt2.getDate();
}
Calendar.prototype.ShowMonth = function (date) {
    if (this.CurDate && this.IsEqual(this.CurDate, date)) return;
    var _template = [];
    this.CurDate = date;
    _template.push('<table class="table"><thead>');

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
            _template.push('<div data-day="' + sdate.getDate() + '" class="form-calendar-day ' + (this.IsEqual(sdate, this.SelectedDate) ? "selected_date" : "") + '"><div class="form-calendar-content"></div><span >' + sdate.getDate() + '</span></div>');
        }
        sdate = sdate.AddDays(1);
        _template.push('</td>');
        if (sdate.getDay() % 7 == 0)
            _template.push('</tr>');
    }
    _template.push('</tr></tbody></table>');
    this.Content.html(_template.join(""));
    this.TitlePanel.html(this.CurDate.getFullYear() + "年" + (this.CurDate.getMonth() + 1) + "月");
    this.BindDayRow();
}
Calendar.prototype.BindDayRow = function () {
    var days = this.Content.find(".form-calendar-day");
    for (var i = 0; i < days.length; i++) {
        var $day = $(days[i]);
        var day = $day.attr("data-day");
        var row = this.GetDayRowByDay(day);
        if (!row) continue;
        $day.data("day-row", row);
        for (var f = 0; f < this.Elements.length; f++) {
            var control = this.Elements[f];
            control._Value = row[control.ID];
        }
        this.OnEvent("DayBind");
    }
}
Calendar.prototype.ChangeMonth = function (e) {
    var isleft = $(e.target).is(".month-left");
    var dt = this.CurDate.AddMonths(isleft ? -1 : 1);
    this.CurDate = null;

    this.ShowMonth(dt);
}
Calendar.prototype.GetDayRowByDay = function (day) {
    return this.Data && this.Data[day];
}
Calendar.prototype.ShowPopPanel = function (e) {
    var div = $(e.target).closest(".form-calendar-day");
    this.EditDayPanel = div;
    var dt = new Date(this.CurDate.getFullYear(), (this.CurDate.getMonth() + 1), div.attr("data-day"));
    this.EditRow = div.data("day-row");
    this.PopPanel = $("<div style='padding-left:10px;padding-top:10px;padding-bottom:20px;' class='form-section formlayout-LR'></div>");
    if (this.OnEvent("BeforeEdit") == false) return;
    for (var i = 0; i < this.Elements.length; i++) {
        var control = this.Elements[i];
        if (this.EditRow) {
            control._Value = this.EditRow[control.ID];
        } else {
            control._Value = control.DefaultValue;
        }
        control.Build(this.PopPanel);
    }

    EMW.UI.Popover.Show({
        Content: this.PopPanel,
        Title: this.CurDate.getFullYear() + "年" + (this.CurDate.getMonth() + 1) + "月" + div.attr("data-day") + "日",

        Position: {
            at: "center top",
            my: "center bottom",
            of: div,
            collision: "fit"
        },
        OnClose: this.EditEnd.bind(this)
    });
}
Calendar.prototype.EditEnd = function () {
    if (!this.EditDayPanel) return;
    var panel = this.PopPanel;
    if (!this.EditRow) {
        this.EditRow = { Date: new Date(this.CurDate.getFullYear(), this.CurDate.getMonth(), this.EditDayPanel.attr("data-day")) };
        this.EditData.push(this.EditRow);
        this.EditDayPanel.data("day-row", this.EditRow);
    }
    for (var i = 0; i < this.Elements.length; i++) {
        var control = this.Elements[i];
        this.EditRow[control.ID] = control.Value();
    }
    this.OnEvent("EendEdit");
    this.PopPanel = null;
    this.EditRow = null;
    this.EditDayPanel = null;
}
Calendar.prototype.Save = function (data) {
    if (!this.EditData.length) return;
    var ary = [];
    for (var i = 0; i < this.EditData.length; i++) {
        var obj = {}, row = this.EditData[i];
        if (!row.Date) {
            return Z.Error("错误");
        }
        obj.ID = row.ID || 0;
        obj.Date = row.Date;
        for (var i = 0; i < this.Elements.length; i++) {
            var control = this.Elements[i];

            control._Value = row[control.ID];
        }
        for (var j = 0; j < this.Elements.length; j++) {
            var item = this.Elements[j];
            if (item.Check(item._Value) == false) {
                return false;
            }
            obj[item.ID] = item.Value();
            if (item.IsSearcher) {
                obj["T_" + item.ID] = item.Text();
            }
        }
        ary.push(obj);
    }
    data[this.ID] = ary;
}

/*******报表******/
var ReportControl = function () {
    $(function () {
        var win = GetWindow();
        if (win) {
            this.Init();
        }
    }.bind(this));
    this.PageCount = 0;
    this.PageIndex = 1;
}
//$被FastReport的$覆盖
; (function ($) {

    ReportControl.prototype.Init = function (parent) {
        if (!parent) {
            var container = $("<div class='report-container'></div>").appendTo(document.body);
            var url = "/ReportService/InitReport?templateID=" + this.TemplateID + "&reportID=" + this.ID
                + "&guid=" + this.ReportGuid + "&width=" + this.PaperWidth + "&height=" + this.PaperHeight;
            if (this.Parameters && this.Parameters.length) {
                url += "&";
                url += this.Parameters.Select(function (para) {
                    return (para.Name + "=" + para.Value);
                }).join("&");
            }
            container.load(url, function () {
                IsLoaded();
            });
        }
        var _report = this;
        var IsLoaded = function () {
            var elem = $("#" + _report.ReportGuid);
            if (elem.find("#frbody").length) {
                _report.ReportElement = $("#report_" + _report.ID);
                _report.ReportLoaded();
                return;
            }
            setTimeout(IsLoaded, 300);
            $.logger.log("IsLoaded..");
        }
    }

    ReportControl.prototype.ReportLoaded = function () {
        this._isLoaded = true;
        $.logger.log("ReportLoaded..");
        //this.ReportElement.css("height", "100%");

        var _report = this;

        var onfrAjaxCallback = window.onFrAjaxSuccess;

        window.onFrAjaxSuccess = function (data, textStatus, request) {
            onfrAjaxCallback.apply(this, $.makeArray(arguments));
            _report.Resize();
        }
        this.Resize();
        $(window).resize(function () {
            _report.Resize();
        });
        this.InitActionPanel();
    }

    ReportControl.prototype.InitActionPanel = function () {
        var tools = this.GetTools();
        var wind = GetWindow();
        if (wind) {
            var arr = [];
            if (this.PageCount > 1) {
                arr = [{
                    icon: 'navigation_first_page', text: "第一页", desc: "第一页", Report: this, Action: "first", OnClick: OnPageChange
                },
                {
                    icon: 'navigation_chevron_left', text: "上一页", desc: "上一页", Report: this, Action: "prev", OnClick: OnPageChange
                },
                {
                    icon: 'navigation_chevron_right', text: "下一页", desc: "下一页", Report: this, Action: "next", OnClick: OnPageChange
                },
                {
                    icon: 'navigation_last_page', text: "最后一页", desc: "最后一页", Report: this, Action: "last", OnClick: OnPageChange
                }];
            }
            if (this.Parameters && this.Parameters.length && this.Parameters.Exist(function (p) {
                return p.ShowType != ReportParameterTypes.Hidden;
            })) {
                arr.push({
                    icon: 'action_search', text: "筛选", desc: "筛选", Report: this, OnClick: function (tool) {
                        tool.Report.OpenFilterWindow();
                    }
                });
            }
            tools = arr.concat(tools);
            wind.ShowTools(tools);
            if (wind.options.toolPanel && this.PageCount > 1) {
                var bf = wind.options.toolPanel.find(">span.icon-navigation_chevron_left");
                bf.after("<input name='pagecount' value='" + this.PageCount + "' class='text-box' readonly='readonly'/>");
                bf.after("<span>/</span>");
                bf.after("<input name='pageindex' value='1' class='text-box'/>");
                this.$PageCountInput = wind.options.toolPanel.find("input[name='pagecount']");
                this.$PageIndexInput = wind.options.toolPanel.find("input[name='pageindex']").onEnter(this, function (e) {
                    var report = e.data;
                    var pageIndex = Z.ToInt($(this).val());
                    if (pageIndex != report.PageIndex && pageIndex <= report.PageCount && pageIndex > 0) {
                        report.PageIndex = pageIndex;
                        frRequestServer('/FastReport.Export.axd?previewobject=' + report.ReportGuid + '&goto=' + pageIndex + '&s=' + Math.random());
                    }
                });
            }
        }
        else {
            var panel = $('<div id="action_div"></div>');
            var sec = $('<div class="section"><div class="section-header"><span class="glyphicon section-icon"></span><span class="section-title">快捷操作</span></div><div class="section-body"><div class="tool-bar"></div></div></div>').appendTo(panel);
            sec.Section();
            this.ToolBar = sec.find(".tool-bar").ToolBar({
                display: "tool-vertical",
                items: tools
            });

            var pagerPanel = this.CreatePagerPanel();
            if (pagerPanel) {
                sec.find(">.section-body").append(pagerPanel);
            }

            this.CreateSearcher(panel);

            this.Page && this.Page.SetActionPanel(this.Name, panel);
        }
    }

    var OnPageChange = function (arg) {
        var act = arg.Action;
        if (act) {
            var report = arg.Report;
            var pageCount = report.PageCount;
            var pageIndex = report.PageIndex;
            switch (act) {
                case "first":
                case "prev":
                    if (pageIndex <= 1) {
                        return false;
                    }
                    pageIndex = (act == "first" ? 1 : (pageIndex - 1));
                    break;
                case "next":
                case "last":
                    if (pageIndex >= pageCount) {
                        return false;
                    }
                    pageIndex = (act == "last" ? pageCount : (pageIndex + 1));
                    break;
                default:
                    return false;
            }

            var $pageIndex = $(this).siblings("input[name='pageindex']");
            $pageIndex.val(pageIndex);
            report.PageIndex = pageIndex;
            frRequestServer('/FastReport.Export.axd?previewobject=' + report.ReportGuid + '&' + act + '=1&s=' + Math.random());
        }
    }

    ReportControl.prototype.CreatePagerPanel = function () {

        var pageCount = this.PageCount;

        if (pageCount > 1) {
            var pagePanel = $("<div class='report-pager-panel section-item'></div>");

            pagePanel.append('<span class="glyphicon icon-navigation_first_page" data-action="first"></span>');
            pagePanel.append('<span class="glyphicon icon-navigation_chevron_left" data-action="prev"></span>');

            pagePanel.append("<input name='pageindex' value='1' class='text-box'/>");
            pagePanel.append("<span>/</span>");
            pagePanel.append("<input name='pagecount' value='" + pageCount + "' class='text-box' readonly='readonly'/>");

            pagePanel.append('<span class="glyphicon icon-navigation_chevron_right" data-action="next"></span>');
            pagePanel.append('<span class="glyphicon icon-navigation_last_page" data-action="last"></span>');

            pagePanel.on("click", ">span.glyphicon", this, function (e) {
                var act = $(this).attr("data-action");
                OnPageChange.call(this, { Action: act, Report: e.data });
            });
            this.$PageIndexInput = pagePanel.find("input[name='pageindex']").onEnter(this, function (e) {
                var report = e.data;
                var pageIndex = Z.ToInt($(this).val());
                if (pageIndex != report.PageIndex && pageIndex <= report.PageCount && pageIndex > 0) {
                    report.PageIndex = pageIndex;
                    frRequestServer('/FastReport.Export.axd?previewobject=' + report.ReportGuid + '&goto=' + pageIndex + '&s=' + Math.random());
                }
            });
            this.$PageCountInput = pagePanel.find("input[name='pagecount']");

            return pagePanel;
        }
    }

    ReportControl.prototype.CreateSearcher = function (panel) {
        if (this.Parameters && this.Parameters.length) {
            this.Searchers = [];
            sec = $('<div class="section"><div class="section-header"><span class="glyphicon section-icon"></span><span class="section-title">搜索</span></div><div class="section-body"><div class="grid-search-panel"></div></div></div></div>').appendTo(panel);
            sec.Section();
            var serPanel = sec.find(".grid-search-panel");
            for (var i = 0; i < this.Parameters.length; i++) {
                var para = this.Parameters[i];
                if (para.ShowType != ReportParameterTypes.Hidden) {
                    var sear = null;
                    switch (para.ShowType) {
                        case ReportParameterTypes.Select:
                            sear = new DropDownList();
                            if (para.SelectItems) {
                                sear.SelectItems = para.SelectItems.Select(function (kv) {
                                    return { Value: kv.Key, Text: kv.Value };
                                });
                            }
                            break;
                        case ReportParameterTypes.Input:
                            sear = new TextBox();
                            break;
                        case ReportParameterTypes.Search:
                            sear = new Searcher();
                            sear.AddColumn('T', 200);
                            sear.TextColumn = 'T';
                            sear.AddColumn('V', 0);
                            sear.ValueColumn = 'V';
                            sear.IsLoadData = true;
                            break;
                        default:
                            break;
                    }
                    if (sear) {
                        this.Searchers.push(sear);
                        sear.ID = para.Name;
                        sear.Name = para.Text;
                        sear.DefaultValue = para.Value;
                        this.AppendSearcher(sear, serPanel);
                        if (para.ShowType == ReportParameterTypes.Search) {
                            var v = para.Value;
                            if (v) {
                                SearchData(this, para.Name, para.Value, sear);
                            }
                            else {
                                var _report = this;
                                sear.Searcher.OnShowPanel(function () {
                                    SearchData(_report, para.Name, para.Value, sear);
                                });
                            }
                        }
                    }
                }
            }

            $('<button class="btn btn-default btn-sm grid-search-btn" type="button"><span class="glyphicon glyphicon-search"></span> 搜索</button>')
                .on("click", this.Search.bind(this)).appendTo(serPanel);
        }
    }

    ReportControl.prototype.GetTools = function () {
        var tools = [{
            icon: 'navigation_refresh', text: "刷新", desc: "刷新报表", Report: this, OnClick: function (tool) {
                frRequestServer('/FastReport.Export.axd?previewobject=' + tool.Report.ReportGuid + '&refresh=1&s=' + Math.random());
            }
        }];
        var win = GetWindow();
        if (win) {
            tools.push({
                icon: 'image_pimageture_as_pdf', text: "导出PDF", desc: "导出PDF", Report: this, OnClick: function (tool) {
                    window.open('/FastReport.Export.axd?previewobject=' + tool.Report.ReportGuid + '&export_pdf=1&s=' + Math.random());
                }
            });
            tools.push({
                icon: 'image_grid_on', text: "导出EXCEL", desc: "导出Excel", Report: this, OnClick: function (tool) {
                    window.open('/FastReport.Export.axd?previewobject=' + tool.Report.ReportGuid + '&export_excel2007=1&s=' + Math.random());
                }
            });
        }
        else {
            tools.push({
                icon: "file_file_download", text: "导出", menu: {
                    items: [{
                        icon: 'image_pimageture_as_pdf', text: "导出PDF", desc: "导出PDF", Report: this, OnClick: function (tool) {
                            window.open('/FastReport.Export.axd?previewobject=' + tool.Report.ReportGuid + '&export_pdf=1&s=' + Math.random());
                        }
                    },
                    {
                        icon: 'image_grid_on', text: "导出EXCEL", desc: "导出Excel", Report: this, OnClick: function (tool) {
                            window.open('/FastReport.Export.axd?previewobject=' + tool.Report.ReportGuid + '&export_excel2007=1&s=' + Math.random());
                        }
                    }]
                }
            });
        }
        tools.push({
            icon: 'action_print', text: "打印", desc: "打印报表", Report: this, OnClick: function (tool) {
                //window.open('/Pages/Table/PrintReport.html?' + tool.Report.ReportGuid);
                window.open('/FastReport.Export.axd?previewobject=' + tool.Report.ReportGuid + '&print_browser=1&s=' + Math.random());
            }
        });
        return tools;
    }

    ReportControl.prototype.Search = function () {
        if (this.Searchers.length) {
            var searchValues = {};
            var isVal = false;
            for (var i = 0; i < this.Searchers.length; i++) {
                var ser = this.Searchers[i];
                var val = ser.Value();
                if (val) {
                    searchValues[ser.ID] = val;
                    isVal = true;
                }
            }
            if (isVal) {
                setTimeout(function () {
                    var url = BuildUrl(searchValues);
                    location.href = url;
                }, 200);
            }
        }
    }

    ReportControl.prototype.AppendSearcher = function (sear, panel) {
        panel = panel || $(".grid-search-panel");
        sear.Title = sear.Title || sear.Name;
        sear.Page = this;
        var elem = sear.Build(panel);
        var type = sear.constructor.name;
        switch (type) {
            case "TextBox":
                elem.on("keyup", this, function (e) {
                    if (e.keyCode == 13) {
                        var grid = e.data;
                        grid.Search();
                    }
                });
                break;
        }
        sear.Element = elem;
    }

    ReportControl.prototype.SetParameters = function (paras) {
        if (this.Parameters && this.Parameters.length && paras && paras.length) {
            var results = [];
            for (var i = 0; i < paras.length; i++) {
                var p1 = paras[i];
                var p2 = this.FindParameter(p1.Name);
                if (p2) {
                    p2.Value = p1.Value;

                    p2.SelectItems = p1.SelectItems;

                    results.push(p2);
                }
                else {
                    results.push(p1);
                }
            }
            this.Parameters = results;
        }
        else {
            this.Parameters = paras;
        }
    }

    ReportControl.prototype.SetReportData = function (data) {
        $.extend(this, data);
        if (this.$PageCountInput) {
            this.$PageCountInput.val(data.PageCount);
        }
        if (this.$PageIndexInput) {
            this.$PageIndexInput.val(1);
            this.PageIndex = 1;
        }
    }

    ReportControl.prototype.OpenFilterWindow = function () {
        var inited = true;
        this._FilterPanel = CreateParameterPanel(this.Parameters);
        inited = false;
        var _report = this;
        EMW.UI.Dialog({
            title: "筛选数据",
            width: 360,
            height: 260,
            isAlert: true,
            content: this._FilterPanel,
            OnOK: function () {
                var isChanged = false;
                var resultPara = {};
                _report._FilterPanel.find("input[pname]").each(function () {
                    var _this = top.$(this);
                    var pname = _this.attr("pname");
                    var para = _report.FindParameter(pname);
                    var oldValue = para.Value;
                    var newValue = oldValue;
                    if (_this.hasClass("textbox")) {
                        newValue = _this.val();
                    }
                    else if (_this.hasClass("_combobox")) {
                        newValue = _this.Combobox().GetValue();
                    }
                    else if (_this.hasClass("_combogrid")) {
                        newValue = _this.Searcher().GetValue();
                    }
                    if (oldValue != newValue) {
                        resultPara[pname] = newValue;
                    }
                });
                if (!$.isEmptyObject(resultPara)) {
                    setTimeout(function () {
                        location.href = BuildUrl(resultPara);
                    }, 200);
                }
            },
            OnOpen: function (e) {
                if (!inited) {
                    _report._FilterPanel.find("._combobox").each(function () {
                        var _this = top.$(this);
                        var opts = EMW.Const.Str2Json(_this.attr("data-options"));
                        opts.width = _this.width() + 4;
                        var combox = _this.Combobox(opts);
                        var v = _this.val();
                        if (v) {
                            combox.SetValue(v);
                        }
                    });
                    _report._FilterPanel.find("._combogrid").each(function () {
                        var _this = top.$(this);
                        var w = _this.width() + 4;
                        var opts = {
                            valueField: "V",
                            textField: "T",
                            width: w,
                            columns: [[
                                    { field: 'T', width: w - 20 }
                            ]]
                        };
                        var searcher = _this.Searcher(opts);
                        var v = _this.val();
                        if (v) {
                            SearchData(_report, _this.attr("pname"), v, searcher);
                        }
                        else {
                            searcher.OnShowPanel(function () {
                                SearchData(_report, _this.attr("pname"), v, this);
                            });
                        }
                    });
                }
            }
        });
    }

    var SearchData = function (_report, elemName, v, sear) {
        sear = sear.Searcher || sear;
        if (!sear.SearcherData) {

            var url = "searcher?elem=" + elemName;

            PageRequest(_report, url, null, function (data) {
                sear.SearcherData = data ? Z.ParseData(data).Rows : [];
                sear.BindData(sear.SearcherData);
                if (v) {
                    sear.Clear();
                    sear.SetValue(v, true);
                }
            });
        }
    }

    ReportControl.prototype.FindParameter = function (name) {
        if (this.Parameters && this.Parameters.length > 0) {
            return this.Parameters.First(function (p) {
                return p.Name == name;
            });
        }
    }

    var BuildUrl = function (newPara) {
        var url = document.location.href;
        var index = url.indexOf("?");
        var queryString = url.substr(index + 1);
        var url = url.substr(0, index);
        var arr = queryString.split("&");
        var result = {};
        for (var i = 0; i < arr.length; i++) {
            var kvs = arr[i].split("=");
            result[kvs[0].toLowerCase()] = decodeURIComponent(kvs[1]);
        }
        result = $.extend({}, result, newPara);
        arr = [];
        for (var name in result) {
            arr.push(name + "=" + result[name]);
        }
        return String.Concat(url, "?", encodeURI(arr.join("&")));
    }

    var CreateParameterPanel = function (parameters) {
        if (parameters && parameters.length > 0) {
            var htmls = [];
            htmls.push("<table cellpadding=\"0\" cellspacing=\"0\"  style=\" width:100%\">");
            for (var i = 0; i < parameters.length; i++) {
                var para = parameters[i];
                if (para.ShowType != ReportParameterTypes.Hidden) {
                    htmls.push("<tr>");
                    switch (para.ShowType) {
                        case ReportParameterTypes.Select:
                            CreateSelecter(htmls, para);
                            break;
                        case ReportParameterTypes.Input:
                            CreateTextBox(htmls, para);
                            break;
                        case ReportParameterTypes.Search:
                            CreateSearcher(htmls, para);
                            break;
                        default:
                            break;
                    }
                    htmls.push("</tr>");
                }
            }
            htmls.push("</table>");
            return top.$(htmls.join(""));
        }
    }

    var ToStr = function (v) {
        return v || "";
    }

    var CreateTextBox = function (htmls, parameter) {
        htmls.push("<td style=\"text-align: right;padding-right: 10px; padding-top: 5px;width:30%;\">");
        htmls.push(parameter.Text);
        htmls.push("</td>");
        htmls.push("<td style=\"text-align: left;padding-left: 10px;padding-top: 5px;\">");
        htmls.push("<input style=\"width:80%;\" pname=\"" + parameter.Name + "\" class=\"textbox\" value=\"" + ToStr(parameter.Value) + "\"/>");
        htmls.push("</td>");
    }

    var CreateSelecter = function (htmls, parameter) {
        htmls.push("<td style=\"text-align: right;padding-right: 10px;padding-top: 5px; width:30%;\">");
        htmls.push(parameter.Text);
        htmls.push("</td>");
        htmls.push("<td style=\"text-align: left;padding-left: 10px;padding-top: 5px;\">");
        htmls.push("<input style=\"width:80%;\"  pname=\"" + parameter.Name + "\" value=\"" + ToStr(parameter.Value) + "\" class=\"_combobox\" data-options='{valueField:\"Key\",textField:\"Value\"");
        if (parameter.SelectItems) {
            htmls.push(",Items:");
            var items = parameter.SelectItems;
            htmls.push(EMW.Const.Json2Str(items));
        }

        htmls.push("}'/></td>");
    }

    var CreateSearcher = function (htmls, parameter) {
        htmls.push("<td style=\"text-align: right;padding-right: 10px; padding-top: 5px;width:30%;\">");
        htmls.push(parameter.Text);
        htmls.push("</td>");
        htmls.push("<td  style=\"text-align: left;padding-left: 10px;padding-top: 5px;\">");
        htmls.push("<input  style=\"width:80%;\" pname=\"" + parameter.Name + "\" value=\"" + ToStr(parameter.Value) + "\" class=\"_combogrid\"/>");
        htmls.push("</td>");
    }

    ReportControl.prototype.Resize = function () {
        if (this._isLoaded) {
            if (!GetWindow()) {
                var height = this.ReportElement.height();
                this.ReportElement.find("#frbody").css("height", height - 6);
            }
            else {
                var height1 = this.ReportElement.height();

                var $frbody = this.ReportElement.find("#frbody");

                var height2 = $frbody.find(">table").height();
                if (height2 > height1) {
                    $frbody.css("height", height2);
                }

                var width1 = this.ReportElement.width();
                var width2 = this.ReportElement.parent().width();
                var w = width2 - width1;
                if (w > 0) {
                    this.ReportElement.css("margin-left", w / 2);
                }
            }
        }
    }
    var ReportParameterTypes = {
        Hidden: 0,
        Input: 1,
        Select: 2,
        Search: 3
    };

})(jQuery);