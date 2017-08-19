using System;
using System.Collections.Generic;
using System.IO;
using System.Xml;
using System.Linq;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using OpenXmlPowerTools;
using System.Data;
using System.Reflection;
using DocumentEditor.Excel;
using DocumentFormat.OpenXml.Drawing.Spreadsheet;
using System.Text.RegularExpressions;
using System.Collections;
using ex=Aspose.Cells;

public class SmlToHtmlConverterHelper
{
    public static string ConvertToHtml(string file, string outputDirectory,bool dataOnly, bool isallsheet)
    {
        bool isExists = File.Exists(file);
        string strHtml = string.Empty;
        if (!isExists)
        {
            //文件不存在
            return "{\"msg\":\"系统找不到指定文件\"}";
        }
        try
        {
            List<string> sheetName = ExcelHelper.fnGetSheet(file);

            if (!dataOnly)
            {
                using (SpreadsheetDocument excel = SpreadsheetDocument.Open(file, false))
                {
                    //ExcelEntity ee = ReadExcelDetail(excel, sheetName, file);
                    //return EMW.API.Serializer.ObjectToString(ee);
                    List<SheetDataList> list = ReadExcelDetailTest(excel, sheetName, file);
                    return "";
                }
            }
            else
            {
                return ReadExcelDataList(file, isallsheet).ToString();
            }
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public static string CreateNewExcel(string file, List<DataTable> listdt)
    {
        List<string> sheetName = ExcelHelper.fnGetSheet(file);
        using (SpreadsheetDocument excel = SpreadsheetDocument.Open(file, true))
        {
            //读取多个Sheet表
            for (int i = 0; i < sheetName.Count; i++)
            {
                //获取一个工作表的数据
                WorksheetPart worksheet = ExcelHelper.GetWorksheetPartByName(excel, sheetName[i]);
                //单元格行
                foreach (OpenXmlPowerTools.Row row in worksheet.Rows())
                {
                    //单元格列
                    foreach (OpenXmlPowerTools.Cell cell in row.Cells())
                    {
                        //多个DataTable
                        for (int j = 0; j < listdt.Count; j++)
                        {
                            //DataTable列名
                            for (int col = 0; col < listdt[j].Columns.Count; col++)
                            {
                                string colName = "{" + listdt[j].Columns[col].ColumnName + "}";
                                if (string.IsNullOrEmpty(cell.SharedString)) { break; }
                                //判断单元格数据是否与列名一致
                                if (cell.SharedString.ToString().ToLower() == colName.ToString().ToLower())
                                {
                                    //循环添加行
                                    for (int r = 0; r < listdt[j].Rows.Count; r++)
                                    {
                                        ExcelHelper.InsertDataIntoWorkSheet((uint)(int.Parse(row.RowId) + r), (uint)cell.ColumnIndex, listdt[j].Rows[r][col].ToString(), cell.Style, excel.WorkbookPart, worksheet);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return null;
    }
    /// <summary>
    /// 仅读取Excel中的数据
    /// </summary>
    /// <param name="filepath">文件路径</param>
    /// <param name="isallsheet">是否读取多个Sheet</param>
    /// <returns></returns>
    public static System.Text.StringBuilder ReadExcelDataList(string filepath, bool isallsheet)
    {
        ex.Workbook workbook = new ex.Workbook(filepath);
        var sheetDataList = workbook.Worksheets;

        if (isallsheet)
        {
            System.Text.StringBuilder sbSheetList = new System.Text.StringBuilder();
            sbSheetList.Append("[");
            for (int i = 0; i < sheetDataList.Count; i++)
            {
                var sheetdata = sheetDataList[i];
                var cells = sheetdata.Cells;
                if (cells.Count > 0)
                {
                    DataTable dt = cells.ExportDataTable(0, 0, cells.MaxRow + 1, cells.MaxColumn + 1, false);
                    dt.TableName = sheetDataList[i].CodeName;

                    sbSheetList.Append(TableToJSON(dt) + ",");
                }
            }
            sbSheetList.Remove(sbSheetList.Length - 1, 1);
            sbSheetList.Append("]");
            return sbSheetList;
        }
        else
        {
            var sheetdata = sheetDataList[0];
            var cells = sheetdata.Cells;
            DataTable dt = cells.ExportDataTable(0, 0, cells.MaxRow + 1, cells.MaxColumn + 1, false);
            return TableToJSON(dt);
        }
    }
    /// <summary>
    /// 将Table转换为JSON字符串
    /// </summary>
    /// <param name="dt"></param>
    /// <returns></returns>
    public static System.Text.StringBuilder TableToJSON(DataTable dt)
    {
        System.Text.StringBuilder sb = new System.Text.StringBuilder();
        sb.Append("[");
        for (int r = 0; r < dt.Rows.Count; r++)
        {
            System.Text.StringBuilder sbRow = new System.Text.StringBuilder();
            sbRow.Append("[");
            for (int c = 0; c < dt.Columns.Count; c++)
            {
                var cellvalue = dt.Rows[r][c].ToString();
                while (cellvalue.Contains("\""))
                {
                    cellvalue = cellvalue.Replace('"', '\'');
                }
                sbRow.Append("\"" + cellvalue + "\",");
            }
            sbRow.Remove(sbRow.Length - 1, 1);
            sbRow.Append("],");
            sb.Append(sbRow);
        }
        sb.Remove(sb.Length - 1, 1);
        sb.Append("]");
        return sb;
    }
    /// <summary>
    /// 读取Excel中数据，包括样式
    /// </summary>
    /// <param name="excel"></param>
    /// <param name="sheetName"></param>
    /// <param name="file"></param>
    /// <returns></returns>
    public static List<SheetDataList> ReadExcelDetailTest(SpreadsheetDocument excel, List<string> sheetName, string file)
    {
        try
        {
            #region //获取样式设置
            Stylesheet styleSheet = excel.WorkbookPart.WorkbookStylesPart.Stylesheet;

            //获取Excel文件主题色
            ThemePart themPart = excel.WorkbookPart.ThemePart;
            var themColor = ThemeColor.GetThemeColorList(themPart);

            #region 样式列表
            CellFormats cellFormats = styleSheet.CellFormats;
            List<CellFormatsList> cellFormatsList = new List<CellFormatsList>();
            int index = 0;
            foreach (CellFormat cell in cellFormats.ChildElements)
            {
                if (cell != null)
                {
                    CellFormatsList cfl = new CellFormatsList();
                    cfl.styleIndex = index;
                    if (cell.NumberFormatId != null)
                    { cfl.numFmtId = int.Parse(cell.NumberFormatId); }
                    if (cell.FontId != null)
                    { cfl.fontId = int.Parse(cell.FontId); }
                    if (cell.FillId != null)
                    { cfl.fillId = int.Parse(cell.FillId); }
                    if (cell.BorderId != null)
                    { cfl.borderId = int.Parse(cell.BorderId); }
                    if (cell.ApplyAlignment != null) { cfl.applyAlignment = int.Parse(cell.ApplyAlignment); }
                    if (cell.ApplyBorder != null) { cfl.applyBorder = int.Parse(cell.ApplyBorder); }
                    if (cell.ApplyFont != null) { cfl.applyFont = int.Parse(cell.ApplyFont); }
                    if (cell.ApplyNumberFormat != null) { cfl.applyNumberFormat = int.Parse(cell.ApplyNumberFormat); }
                    if (cell.Alignment != null)
                    {
                        string ver = cell.Alignment.Vertical;
                        string hor = cell.Alignment.Horizontal;
                        string wra = cell.Alignment.WrapText;
                        if (!string.IsNullOrEmpty(ver))
                        {
                            if (ver == "center") { cfl.vertical = "htMiddle"; }
                            else
                            {
                                cfl.vertical = "ht" + ver.Substring(0, 1).ToUpper() + ver.Substring(1, ver.Length - 1);
                            }
                        }
                        else
                        {
                            cfl.vertical = "htBottom";
                        }
                        if (!string.IsNullOrEmpty(hor))
                        {
                            cfl.horizontal = "ht" + hor.Substring(0, 1).ToUpper() + hor.Substring(1, hor.Length - 1);
                        }
                        else
                        {
                            cfl.horizontal = "htLeft";
                        }
                        cfl.wraptext = wra;
                    }
                    cellFormatsList.Add(cfl);
                    index++;
                }
            }
            #endregion

            #region 数据类型列表
            NumberingFormats numberFormats = styleSheet.NumberingFormats;
            List<NumFmtsList> numFmtList = new List<NumFmtsList>();
            if (numberFormats != null)
            {
                foreach (NumberingFormat cell in numberFormats.ChildElements)
                {
                    NumFmtsList nfl = new NumFmtsList();
                    if (cell.NumberFormatId != null) { nfl.numFmtId = (int)cell.NumberFormatId.Value; }
                    if (cell.FormatCode != null) { nfl.formatCode = cell.FormatCode.Value; }
                    numFmtList.Add(nfl);
                }
            }
            #endregion

            #region 字体样式
            Fonts fonts = styleSheet.Fonts;
            List<FontsList> fontsList = new List<FontsList>();
            foreach (Font cell in fonts.ChildElements)
            {
                FontsList fl = new FontsList();
                if (cell.FontSize != null) { fl.fontsize = cell.FontSize.Val + "px"; }
                if (cell.FontName != null) { fl.fontname = cell.FontName.Val; }
                if (cell.Color != null)
                {
                    if (cell.Color.Rgb != null && !string.IsNullOrEmpty(cell.Color.Rgb.ToString()))
                    {
                        fl.color = "#" + cell.Color.Rgb.ToString().Substring(2, 6);
                    }
                }
                if (cell.Italic != null) { fl.italic = "italic"; }
                if (cell.Bold != null) { fl.bold = "bold"; }
                if (cell.Underline != null) { fl.underline = "underline"; }
                fontsList.Add(fl);
            }
            #endregion

            #region 填充色样式
            Fills fills = styleSheet.Fills;
            List<FillsList> fillsList = new List<FillsList>();
            foreach (Fill cell in fills.ChildElements)
            {
                FillsList fl = new FillsList();
                if (cell.PatternFill != null)
                {
                    fl.patternType = cell.PatternFill.PatternType;
                    if (cell.PatternFill.ForegroundColor != null)
                    {
                        if (cell.PatternFill.ForegroundColor.Rgb != null)
                        { fl.fgColor = "#" + cell.PatternFill.ForegroundColor.Rgb.ToString().Substring(2, 6); }
                        if (cell.PatternFill.ForegroundColor.Theme != null)
                        {
                            UInt32Value themeIndex = cell.PatternFill.ForegroundColor.Theme;
                            DoubleValue tint = cell.PatternFill.ForegroundColor.Tint;
                            if (tint != null)
                            {
                                var newColor = ThemeColor.ThemColorDeal(themeIndex, tint, themColor[themeIndex]);
                                fl.fgColor = "#" + newColor.Name.Substring(2, 6);
                                fl.fgColor = "#" + newColor.Name.Substring(2, 6);
                            }
                            else
                            {
                                fl.fgColor = "#" + themColor[themeIndex];
                                fl.fgColor = "#" + themColor[themeIndex];
                            }
                        }
                    }
                }
                fillsList.Add(fl);
            }
            #endregion

            #region 边框样式
            Borders borders = styleSheet.Borders;
            List<BordersList> bordersList = new List<BordersList>();
            var defaultBorderStyle = "1px solid #000";
            foreach (Border cell in borders.ChildElements)
            {
                BordersList bl = new BordersList();
                if (cell.LeftBorder != null)
                {
                    if (cell.LeftBorder.Style != null) { bl.left = defaultBorderStyle; }
                }
                if (cell.RightBorder != null)
                {
                    if (cell.RightBorder.Style != null) { bl.right = defaultBorderStyle; }
                }
                if (cell.TopBorder != null)
                {
                    if (cell.TopBorder.Style != null) { bl.top = defaultBorderStyle; }
                }
                if (cell.BottomBorder != null)
                {
                    if (cell.BottomBorder.Style != null) { bl.bottom = defaultBorderStyle; }
                }
                if (cell.DiagonalBorder != null)
                {
                    if (cell.DiagonalBorder.Style != null) { bl.diagonal = cell.DiagonalBorder.Style; }
                }
                bordersList.Add(bl);
            }
            #endregion

            #endregion

            List<SheetDataList> listSDL = new List<SheetDataList>();
            List<PictureInfo> pictures = null;
            //获取多个Sheet数据和样式
            for (int i = 0; i < sheetName.Count; i++)
            {
                //总行数和总列数
                int RowCount = 0, ColumnCount = 0;
                SheetDataList sdl = new SheetDataList();
                //获取一个工作表的数据
                WorksheetPart worksheet = ExcelHelper.GetWorksheetPartByName(excel, sheetName[i]);

                #region //批注
                WorksheetCommentsPart comments = worksheet.WorksheetCommentsPart;
                List<CommentCellsList> commentLists = new List<CommentCellsList>();
                if (comments != null)
                {
                    CommentList commentList = (CommentList)comments.Comments.ChildElements[1];
                    //批注列表
                    foreach (Comment comment in commentList.ChildElements)
                    {
                        CommentCellsList ccl = new CommentCellsList();
                        //坐标
                        var cell = GetCellXY(comment.Reference).Split('_');
                        var columnRow = int.Parse(cell[0].ToString()) - 1;
                        var columnCol = GetColumnIndex(cell[1]);
                        //批注内容
                        var commentVal = comment.InnerText;
                        ccl.row = columnRow;
                        ccl.col = columnCol;
                        ccl.comment = comment.InnerText;
                        //var commentCell = "{\"Row\":\""+ columnRow + "\",\"Col\":\"" + columnCol + ",\"Comment\":\"" + commentVal + "\"}";
                        commentLists.Add(ccl);
                    }
                }
                sdl.Comments = commentLists;
                #endregion

                #region //获取合并单元格
                IEnumerable<MergeCells> mergeCells = worksheet.Worksheet.Elements<MergeCells>();
                List<MergeCellsList> mergeCellList = new List<MergeCellsList>();
                if (mergeCells.Count() > 0)
                {
                    for (int k = 0; k < mergeCells.First().ChildElements.Count; k++)
                    {
                        MergeCell mergeCell = (MergeCell)mergeCells.First().ChildElements[k];
                        var reference = mergeCell.Reference.ToString().Split(':');
                        var startCell = GetCellXY(reference[0]).Split('_');
                        var endCell = GetCellXY(reference[1]).Split('_');
                        MergeCellsList mcl = new MergeCellsList();
                        mcl.row = int.Parse(startCell[0]) - 1;
                        mcl.rowspan = int.Parse(endCell[0]) - int.Parse(startCell[0]) + 1;
                        mcl.col = GetColumnIndex(startCell[1]);
                        mcl.colspan = GetColumnIndex(endCell[1]) - mcl.col + 1;
                        //mcl.reference = mergeCell.Reference.ToString();
                        mergeCellList.Add(mcl);
                    }
                }
                sdl.MergeCells = mergeCellList;
                #endregion

                #region //读取图片
                DrawingsPart drawingPart = worksheet.GetPartsOfType<DrawingsPart>().ToList().FirstOrDefault();
                pictures = new List<PictureInfo>();
                if (drawingPart != null)
                {
                    int tempIndex = 1;
                    foreach (var part in drawingPart.Parts)
                    {
                        PictureInfo pic = new PictureInfo();
                        ImagePart imgPart = (ImagePart)part.OpenXmlPart;
                        System.Drawing.Image img1 = System.Drawing.Image.FromStream(imgPart.GetStream());

                        var newFilename = Guid.NewGuid().ToString("N") + ".png";
                        string[] sArray = Regex.Split(file, "UserFile", RegexOptions.IgnoreCase);
                        string newFilePath = sArray[0] + "_Temp\\" + newFilename;
                        img1.Save(newFilePath);
                        //pic.Image = img1;
                        pic.RefId = part.RelationshipId;//"rId" + imgPart.Uri.ToString().Split('/')[3].Split('.')[0].Substring(5);
                        pic.ImageUrl = newFilePath;
                        pic.ImageName = newFilename;
                        pic.ImgHeight = img1.Height;
                        pic.ImgWidth = img1.Width;
                        pictures.Add(pic);
                        tempIndex++;
                    }
                    //获取图片定位
                    var worksheetDrawings = drawingPart.WorksheetDrawing.Where(c => c.ChildElements.Any
                               (a => a.GetType().FullName == "DocumentFormat.OpenXml.Drawing.Spreadsheet.Picture")).ToList();
                    foreach (var worksheetDrawing in worksheetDrawings)
                    {
                        if (worksheetDrawing.GetType().FullName ==
                            "DocumentFormat.OpenXml.Drawing.Spreadsheet.TwoCellAnchor")
                        {
                            TwoCellAnchor anchor = (TwoCellAnchor)worksheetDrawing;
                            DocumentFormat.OpenXml.Drawing.Spreadsheet.Picture picDef =
                                (DocumentFormat.OpenXml.Drawing.Spreadsheet.Picture)
                                anchor.ChildElements.FirstOrDefault(c => c.GetType().FullName ==
                                "DocumentFormat.OpenXml.Drawing.Spreadsheet.Picture");
                            if (picDef != null)
                            {
                                var embed = picDef.BlipFill.Blip.Embed;
                                if (embed != null)
                                {
                                    var picMapping = pictures.FirstOrDefault(c => c.RefId == embed.InnerText);
                                    picMapping.FromCol = int.Parse(anchor.FromMarker.ColumnId.InnerText);
                                    picMapping.FromRow = int.Parse(anchor.FromMarker.RowId.InnerText);
                                }
                            }
                            // anchor.FromMarker.RowId + anchor.FromMarker.ColumnId 
                        }
                    }
                }
                sdl.PictureList = pictures;
                #endregion

                //读取列宽
                IEnumerable<Columns> colsList = worksheet.Worksheet.Elements<Columns>();

                #region //读取表格数据
                List<SheetDatas> sheetDatas = new List<SheetDatas>();
                if (worksheet.Rows().Count() > 0)
                {
                    RowCount = int.Parse((worksheet.Rows().Last()).RowId);
                }
                foreach (OpenXmlPowerTools.Row row in worksheet.Rows())
                {
                    int TempColumn = 0;
                    int r = 0;
                    foreach (OpenXmlPowerTools.Cell cell in row.Cells())
                    {
                        int co = 0;
                        //读取超链接？？？

                        //读取单元格数据
                        SheetDatas sheetData = new SheetDatas();
                        sheetData.RowId = int.Parse(row.RowId) - 1;
                        sheetData.ColumnId = cell.ColumnIndex;
                        sheetData.Column = cell.Column;
                        sheetData.Type = cell.Type;
                        sheetData.Value = cell.Value;
                        sheetData.SharedString = cell.SharedString;
                        sheetData.Formula = cell.Formula;
                        sheetData.StyleId = cell.Style;
                        //读取列宽(仅限第一行设置列宽)
                        if (colsList.Count() > 0 && r == 0)
                        {
                            Columns col = colsList.ElementAt<Columns>(0);
                            foreach (Column c in col.ChildElements)
                            {
                                if (c.Max == cell.ColumnIndex)
                                {
                                    sheetData.Width = c.Width;
                                    break;
                                }
                            }
                        }
                        //读取行高（仅限第一列设置行高）
                        if (co == 0) {
                            if (row.RowElement.Attribute("ht") != null)
                            {
                                sheetData.Height = double.Parse(row.RowElement.Attribute("ht").Value);
                            }
                        }
                        #region 样式赋值
                        if (sheetData.StyleId != null)
                        {
                            CellFormatsList cfl = cellFormatsList[(int)sheetData.StyleId];
                            //字体样式
                            sheetData.FontName = fontsList[cfl.fontId].fontname;
                            sheetData.FontSize = fontsList[cfl.fontId].fontsize;
                            sheetData.FontColor = fontsList[cfl.fontId].color;
                            sheetData.FontBold = fontsList[cfl.fontId].bold;
                            sheetData.Italic = fontsList[cfl.fontId].italic;
                            sheetData.Underline = fontsList[cfl.fontId].underline;
                            sheetData.AligmentVertical = cfl.vertical;
                            sheetData.AligmentHorizontal = cfl.horizontal;
                            sheetData.WrapText = cfl.wraptext;
                            //背景色样式
                            sheetData.FillType = fillsList[cfl.fillId].patternType;
                            sheetData.FillForegroundColor = fillsList[cfl.fillId].fgColor;
                            sheetData.FillBackgroundColor = fillsList[cfl.fillId].bgColor;
                            //边框样式
                            sheetData.LeftBorder = bordersList[cfl.borderId].left;
                            sheetData.RightBorder = bordersList[cfl.borderId].right;
                            sheetData.TopBorder = bordersList[cfl.borderId].top;
                            sheetData.BottomBorder = bordersList[cfl.borderId].bottom;
                            sheetData.DiagonalBorder = bordersList[cfl.borderId].diagonal;
                        }
                        #endregion

                        //识别文字格式？？？（日期与数字的区别）

                        sheetDatas.Add(sheetData);
                        TempColumn++;
                        co++;
                    }
                    r++;
                    //计算列数
                    if (TempColumn > ColumnCount) { ColumnCount = TempColumn; }
                }
                sdl.SheetData = sheetDatas;
                #endregion

                sdl.SheetName = sheetName[i];
                sdl.SheetId = "sheet" + (i + 1);
                sdl.TotalRow = RowCount < 20 ? 20 : RowCount + 1;
                sdl.TotalColumn = ColumnCount < 15 ? 15 : ColumnCount + 1;
                listSDL.Add(sdl);
            }
            return listSDL;
        }
        catch (Exception ex)
        {
            throw;
        }
    }

    public static ExcelEntity ReadExcelDetail(SpreadsheetDocument excel, List<string> sheetName, string file)
    {
        ExcelEntity ee = new ExcelEntity();
        #region SheetStyle公用样式表
        #region 主题色
        ThemePart themPart = excel.WorkbookPart.ThemePart;
        var themColor = ThemeColor.GetThemeColorList(themPart);
        #endregion

        //获取样式设置
        Stylesheet styleSheet = excel.WorkbookPart.WorkbookStylesPart.Stylesheet;
        #region 样式列表
        CellFormats cellFormats = styleSheet.CellFormats;
        List<CellFormatsList> cellFormatsList = new List<CellFormatsList>();
        int index = 0;
        foreach (CellFormat cell in cellFormats.ChildElements)
        {
            if (cell != null)
            {
                CellFormatsList cfl = new CellFormatsList();
                cfl.styleIndex = index;
                if (cell.NumberFormatId != null)
                { cfl.numFmtId = int.Parse(cell.NumberFormatId); }
                if (cell.FontId != null)
                { cfl.fontId = int.Parse(cell.FontId); }
                if (cell.FillId != null)
                { cfl.fillId = int.Parse(cell.FillId); }
                if (cell.BorderId != null)
                { cfl.borderId = int.Parse(cell.BorderId); }
                if (cell.ApplyAlignment != null) { cfl.applyAlignment = int.Parse(cell.ApplyAlignment); }
                if (cell.ApplyBorder != null) { cfl.applyBorder = int.Parse(cell.ApplyBorder); }
                if (cell.ApplyFont != null) { cfl.applyFont = int.Parse(cell.ApplyFont); }
                if (cell.ApplyNumberFormat != null) { cfl.applyNumberFormat = int.Parse(cell.ApplyNumberFormat); }
                if (cell.Alignment != null)
                {
                    string ver = cell.Alignment.Vertical;
                    string hor = cell.Alignment.Horizontal;
                    if (!string.IsNullOrEmpty(ver))
                    {
                        if (ver == "center") { cfl.vertical = "htMiddle"; }
                        else
                        {
                            cfl.vertical = "ht" + ver.Substring(0, 1).ToUpper() + ver.Substring(1, ver.Length - 1);
                        }
                    }
                    else
                    {
                        cfl.vertical = "htBottom";
                    }
                    if (!string.IsNullOrEmpty(hor))
                    {
                        cfl.horizontal = "ht" + hor.Substring(0, 1).ToUpper() + hor.Substring(1, hor.Length - 1);
                    }
                    else
                    {
                        cfl.horizontal = "htLeft";
                    }
                }
                cellFormatsList.Add(cfl);
                index++;
            }
        }
        ee.CellFormatsList = cellFormatsList;
        #endregion

        #region 数据类型列表
        NumberingFormats numberFormats = styleSheet.NumberingFormats;
        List<NumFmtsList> numFmtList = new List<NumFmtsList>();
        if (numberFormats != null)
        {
            foreach (NumberingFormat cell in numberFormats.ChildElements)
            {
                NumFmtsList nfl = new NumFmtsList();
                if (cell.NumberFormatId != null) { nfl.numFmtId = (int)cell.NumberFormatId.Value; }
                if (cell.FormatCode != null) { nfl.formatCode = cell.FormatCode.Value; }
                numFmtList.Add(nfl);
            }
        }
        ee.NumFmtsList = numFmtList;
        #endregion

        #region 字体样式
        Fonts fonts = styleSheet.Fonts;
        List<FontsList> fontsList = new List<FontsList>();
        foreach (Font cell in fonts.ChildElements)
        {
            FontsList fl = new FontsList();
            if (cell.FontSize != null) { fl.fontsize = cell.FontSize.Val + "px"; }
            if (cell.FontName != null) { fl.fontname = cell.FontName.Val; }
            if (cell.Color != null)
            {
                if (cell.Color.Rgb != null && !string.IsNullOrEmpty(cell.Color.Rgb.ToString()))
                {
                    fl.color = "#" + cell.Color.Rgb.ToString().Substring(2, 6);
                }
            }
            if (cell.Italic != null) { fl.italic = "italic"; }
            if (cell.Bold != null) { fl.bold = "bold"; }
            if (cell.Underline != null) { fl.underline = "underline"; }
            fontsList.Add(fl);
        }
        ee.FontsList = fontsList;
        #endregion

        #region 填充色样式
        Fills fills = styleSheet.Fills;
        List<FillsList> fillsList = new List<FillsList>();
        foreach (Fill cell in fills.ChildElements)
        {
            FillsList fl = new FillsList();
            if (cell.PatternFill != null)
            {
                fl.patternType = cell.PatternFill.PatternType;
                if (cell.PatternFill.ForegroundColor != null)
                {
                    if (cell.PatternFill.ForegroundColor.Rgb != null)
                    { fl.fgColor = "#" + cell.PatternFill.ForegroundColor.Rgb.ToString().Substring(2, 6); }
                    if (cell.PatternFill.ForegroundColor.Theme != null)
                    {
                        UInt32Value themeIndex = cell.PatternFill.ForegroundColor.Theme;
                        DoubleValue tint = cell.PatternFill.ForegroundColor.Tint;
                        if (tint != null)
                        {
                            var newColor = ThemeColor.ThemColorDeal(themeIndex, tint, themColor[themeIndex]);
                            fl.fgColor = "#" + newColor.Name.Substring(2, 6);
                            fl.fgColor = "#" + newColor.Name.Substring(2, 6);
                        }
                        else
                        {
                            fl.fgColor = "#" + themColor[themeIndex];
                            fl.fgColor = "#" + themColor[themeIndex];
                        }
                    }
                }
            }
            fillsList.Add(fl);
        }
        ee.FillsList = fillsList;
        #endregion

        #region 边框样式
        Borders borders = styleSheet.Borders;
        List<BordersList> bordersList = new List<BordersList>();
        var defaultBorderStyle = "1px solid #000";
        foreach (Border cell in borders.ChildElements)
        {
            BordersList bl = new BordersList();
            if (cell.LeftBorder != null)
            {
                if (cell.LeftBorder.Style != null) { bl.left = defaultBorderStyle; }
            }
            if (cell.RightBorder != null)
            {
                if (cell.RightBorder.Style != null) { bl.right = defaultBorderStyle; }
            }
            if (cell.TopBorder != null)
            {
                if (cell.TopBorder.Style != null) { bl.top = defaultBorderStyle; }
            }
            if (cell.BottomBorder != null)
            {
                if (cell.BottomBorder.Style != null) { bl.bottom = defaultBorderStyle; }
            }
            if (cell.DiagonalBorder != null)
            {
                if (cell.DiagonalBorder.Style != null) { bl.diagonal = cell.DiagonalBorder.Style; }
            }
            bordersList.Add(bl);
        }
        ee.BordersList = bordersList;
        #endregion
        #endregion

        List<SheetDataList> sheetDataList = new List<SheetDataList>();
        List<PictureInfo> pictures = null;
        for (int i = 0; i < sheetName.Count; i++)
        {
            SheetDataList sdl = new SheetDataList();
            int RowCount = 0;
            int ColumnCount = 0;
            //得到工作表dimension
            WorksheetPart worksheet = ExcelHelper.GetWorksheetPartByName(excel, sheetName[i]);

            #region 获取单个Sheet表的数据

            #region //批注
            WorksheetCommentsPart comments = worksheet.WorksheetCommentsPart;
            List<CommentCellsList> commentLists = new List<CommentCellsList>();
            if (comments != null)
            {
                CommentList commentList = (CommentList)comments.Comments.ChildElements[1];
                //批注列表
                foreach (Comment comment in commentList.ChildElements)
                {
                    CommentCellsList ccl = new CommentCellsList();
                    //坐标
                    var cell = GetCellXY(comment.Reference).Split('_');
                    var columnRow = int.Parse(cell[0].ToString()) - 1;
                    var columnCol = GetColumnIndex(cell[1]);
                    //批注内容
                    var commentVal = comment.InnerText;
                    ccl.row = columnRow;
                    ccl.col = columnCol;
                    ccl.comment = comment.InnerText;
                    //var commentCell = "{\"Row\":\""+ columnRow + "\",\"Col\":\"" + columnCol + ",\"Comment\":\"" + commentVal + "\"}";
                    commentLists.Add(ccl);
                }
            }
            sdl.Comments = commentLists;
            #endregion

            #region //获取合并单元格
            IEnumerable<MergeCells> mergeCells = worksheet.Worksheet.Elements<MergeCells>();
            List<MergeCellsList> mergeCellList = new List<MergeCellsList>();
            if (mergeCells.Count() > 0)
            {
                for (int k = 0; k < mergeCells.First().ChildElements.Count; k++)
                {
                    MergeCell mergeCell = (MergeCell)mergeCells.First().ChildElements[k];
                    var reference = mergeCell.Reference.ToString().Split(':');
                    var startCell = GetCellXY(reference[0]).Split('_');
                    var endCell = GetCellXY(reference[1]).Split('_');
                    MergeCellsList mcl = new MergeCellsList();
                    mcl.row = int.Parse(startCell[0]) - 1;
                    mcl.rowspan = int.Parse(endCell[0]) - int.Parse(startCell[0]) + 1;
                    mcl.col = GetColumnIndex(startCell[1]);
                    mcl.colspan = GetColumnIndex(endCell[1]) - mcl.col + 1;
                    //mcl.reference = mergeCell.Reference.ToString();
                    mergeCellList.Add(mcl);
                }
            }
            sdl.MergeCells = mergeCellList;
            #endregion

            //获取超链接列表
            //var hyperlinks = worksheet.RootElement.Descendants<Hyperlinks>().First().Cast<Hyperlink>();

            #region //读取图片
            DrawingsPart drawingPart = worksheet.GetPartsOfType<DrawingsPart>().ToList().FirstOrDefault();
            pictures = new List<PictureInfo>();
            if (drawingPart != null)
            {
                int tempIndex = 1;
                foreach (var part in drawingPart.Parts)
                {
                    PictureInfo pic = new PictureInfo();
                    ImagePart imgPart = (ImagePart)part.OpenXmlPart;
                    System.Drawing.Image img1 = System.Drawing.Image.FromStream(imgPart.GetStream());

                    var newFilename = Guid.NewGuid().ToString("N") + ".png";
                    string[] sArray = Regex.Split(file, "UserFile", RegexOptions.IgnoreCase);
                    string newFilePath = sArray[0] + "_Temp\\" + newFilename;
                    img1.Save(newFilePath);
                    //pic.Image = img1;
                    pic.RefId = part.RelationshipId;//"rId" + imgPart.Uri.ToString().Split('/')[3].Split('.')[0].Substring(5);
                    pic.ImageUrl = newFilePath;
                    pic.ImageName = newFilename;
                    pic.ImgHeight = img1.Height;
                    pic.ImgWidth = img1.Width;
                    pictures.Add(pic);
                    tempIndex++;
                }
                //获取图片定位
                var worksheetDrawings = drawingPart.WorksheetDrawing.Where(c => c.ChildElements.Any
                           (a => a.GetType().FullName == "DocumentFormat.OpenXml.Drawing.Spreadsheet.Picture")).ToList();
                foreach (var worksheetDrawing in worksheetDrawings)
                {
                    if (worksheetDrawing.GetType().FullName ==
                        "DocumentFormat.OpenXml.Drawing.Spreadsheet.TwoCellAnchor")
                    {
                        TwoCellAnchor anchor = (TwoCellAnchor)worksheetDrawing;
                        DocumentFormat.OpenXml.Drawing.Spreadsheet.Picture picDef =
                            (DocumentFormat.OpenXml.Drawing.Spreadsheet.Picture)
                            anchor.ChildElements.FirstOrDefault(c => c.GetType().FullName ==
                            "DocumentFormat.OpenXml.Drawing.Spreadsheet.Picture");
                        if (picDef != null)
                        {
                            var embed = picDef.BlipFill.Blip.Embed;
                            if (embed != null)
                            {
                                var picMapping = pictures.FirstOrDefault(c => c.RefId == embed.InnerText);
                                picMapping.FromCol = int.Parse(anchor.FromMarker.ColumnId.InnerText);
                                picMapping.FromRow = int.Parse(anchor.FromMarker.RowId.InnerText);
                            }
                        }
                        // anchor.FromMarker.RowId + anchor.FromMarker.ColumnId 
                    }
                }
            }
            sdl.PictureList = pictures;
            #endregion

            #region 读取表格数据
            List<SheetDatas> sheetDatas = new List<SheetDatas>();
            if (worksheet.Rows().Count() > 0)
            {
                RowCount = int.Parse((worksheet.Rows().Last()).RowId);
            }
            int TempColumn = 0;
            foreach (OpenXmlPowerTools.Row row in worksheet.Rows())
            {
                foreach (OpenXmlPowerTools.Cell cell in row.Cells())
                {
                    #region 读取超链接
                    //var hyperlink = hyperlinks.SingleOrDefault(c => c.Reference.Value == cell.Column);

                    //if (hyperlink != null)
                    //{
                    //    var hyperlinksRelation = worksheet.HyperlinkRelationships.SingleOrDefault(c => c.Id == hyperlink.Id);
                    //    if (hyperlinksRelation != null)
                    //    {
                    //        //这是最终我们需要的超链接
                    //        var url = hyperlinksRelation.Uri.ToString();
                    //    }
                    //}
                    #endregion

                    TempColumn = (row.Cells().Last()).ColumnIndex;
                    if (ColumnCount < TempColumn) { ColumnCount = TempColumn + 1; }

                    SheetDatas sheetData = new SheetDatas();
                    sheetData.RowId = int.Parse(row.RowId);
                    sheetData.ColumnId = cell.ColumnIndex;
                    sheetData.Column = cell.Column;
                    sheetData.Type = cell.Type;
                    sheetData.Value = cell.Value;
                    sheetData.SharedString = cell.SharedString;
                    sheetData.Formula = cell.Formula;
                    sheetData.StyleId = cell.Style;

                    #region 样式赋值
                    if (sheetData.StyleId != null)
                    {
                        CellFormatsList cfl = cellFormatsList[(int)sheetData.StyleId];
                        sheetData.FontName = fontsList[cfl.fontId].fontname;
                        sheetData.FontSize = fontsList[cfl.fontId].fontsize;
                        sheetData.FontColor = fontsList[cfl.fontId].color;
                        sheetData.FontBold = fontsList[cfl.fontId].bold;
                        sheetData.Italic = fontsList[cfl.fontId].italic;
                        sheetData.Underline = fontsList[cfl.fontId].underline;
                        sheetData.AligmentVertical = cfl.vertical;
                        sheetData.AligmentHorizontal = cfl.horizontal;

                        sheetData.FillType = fillsList[cfl.fillId].patternType;
                        sheetData.FillForegroundColor = fillsList[cfl.fillId].fgColor;
                        sheetData.FillBackgroundColor = fillsList[cfl.fillId].bgColor;

                        sheetData.LeftBorder = bordersList[cfl.borderId].left;
                        sheetData.RightBorder = bordersList[cfl.borderId].right;
                        sheetData.TopBorder = bordersList[cfl.borderId].top;
                        sheetData.BottomBorder = bordersList[cfl.borderId].bottom;
                        sheetData.DiagonalBorder = bordersList[cfl.borderId].diagonal;
                    }
                    #endregion

                    if (cell.Style != null)
                    {
                        var cellf = cellFormatsList[(int)cell.Style];
                        if (cellf.applyNumberFormat > 0 && cell.Type == null && cell.Value != null)
                        {
                            //for (int n = 0; n < numFmtList.Count; n++)
                            //{
                            //    if (numFmtList[n].numFmtId == cellf.numFmtId|| cellf.numFmtId == 14)
                            //    {
                            //        sheetData.Type = "s";
                            //        sheetData.SharedString = DateTime.FromOADate(double.Parse(cell.Value)).ToShortDateString();
                            //        break;
                            //    }
                            //}
                            if (cellf.numFmtId == 58)
                            {
                                sheetData.Type = "s";
                                sheetData.SharedString = DateTime.FromOADate(double.Parse(cell.Value)).ToString("M月d日");
                            }
                            else if (cellf.numFmtId == 14)
                            {
                                sheetData.Type = "s";
                                sheetData.SharedString = DateTime.FromOADate(double.Parse(cell.Value)).ToShortDateString();
                            }
                            else
                            {
                                for (int n = 0; n < numFmtList.Count; n++)
                                {
                                    if (numFmtList[n].numFmtId == cellf.numFmtId)
                                    {
                                        sheetData.Type = "s";
                                        sheetData.SharedString = DateTime.FromOADate(double.Parse(cell.Value)).ToShortDateString();
                                        break;
                                    }
                                }
                            }
                        }
                        else
                        {
                            sheetData.Value = cell.Value;
                        }
                    }

                    sheetDatas.Add(sheetData);
                }
            }
            if (ColumnCount < 5)
            {
                ColumnCount = 5;
            }
            if (RowCount < 20)
            {
                RowCount = 20;
            }
            sdl.SheetData = sheetDatas;
            #endregion

            sdl.SheetName = sheetName[i];
            sdl.SheetId = "sheet" + (i + 1);
            sdl.TotalRow = (RowCount + 1);
            sdl.TotalColumn = ColumnCount;
            sheetDataList.Add(sdl);
            //htmlStr = EMW.API.Serializer.ObjectToString(sheetDataList);//
            //htmlStr = "{\"SheetData\":" + htmlStr + ",\"Comments\":" + EMW.API.Serializer.ObjectToString(commentLists) + ",\"MergeCells\":" + EMW.API.Serializer.ObjectToString(mergeCellList) + ",\"TotalRow\":" + (RowCount + 1) + ",\"TotalColumn\":" + ColumnCount + ",\"SheetName\":\"" + sheetName[i] + "\"}";
            //htmlSheet.Add(htmlStr);
            #endregion
        }
        ee.SheetDataList = sheetDataList;
        return ee;
    }

    /// <summary>
    /// 拆分行列
    /// </summary>
    /// <param name="reference"></param>
    /// <returns></returns>
    private static string GetCellXY(string reference)
    {
        var row = "";
        var col = "";
        for (int i = 0; i < reference.Count(); i++)
        {
            var val = reference.Substring(i, 1);
            var result = -1;
            if (int.TryParse(val, out result))
            {
                row = row + result.ToString();
            }
            else
            {
                col += val;
            }
        }
        return row + "_" + col;
    }

    /// <summary>
    /// 根据列名获取列索引
    /// </summary>
    /// <param name="name"></param>
    /// <returns></returns>
    private static int GetColumnIndex(string name)
    {
        int num = 0;
        char[] columnNames = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".ToCharArray();
        for (int i = 0; i < name.Count(); i++)
        {
            for (int j = 0; j < columnNames.Length; j++)
            {
                if (name[i] == columnNames[j])
                {
                    if (i != name.Count() - 1)
                        num += (j + 1) * 26;
                    else
                        num += j;
                    break;
                }
            }
        }
        return num;
    }
    
}