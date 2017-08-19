using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Spreadsheet;

namespace DocumentEditor.Excel
{
    public class NewExcel : Stylesheet
    {
        public NewExcel()
        {
            //创建默认字体样式1 Arial 24
            var fonts = new Fonts();
            var font = new DocumentFormat.OpenXml.Spreadsheet.Font();
            var fontName = new FontName { Val = StringValue.FromString("Arial") };
            var fontSize = new FontSize { Val = DoubleValue.FromDouble(11) };
            font.FontName = fontName;
            font.FontSize = fontSize;
            fonts.Append(font);
            fonts.Count = UInt32Value.FromUInt32((uint)fonts.ChildElements.Count);
            //创建填充样式1 
            var fills = new Fills();
            var fill = new Fill();
            var patternFill = new PatternFill { PatternType = PatternValues.None };
            fill.PatternFill = patternFill;
            fills.Append(fill);
            fill = new Fill();
            patternFill = new PatternFill { PatternType = PatternValues.Gray0625 };
            fill.PatternFill = patternFill;
            fills.Append(fill);
            fills.Count = UInt32Value.FromUInt32((uint)fills.ChildElements.Count);
            //创建线条样式1
            var borders = new Borders();
            var border = new Border { LeftBorder = new LeftBorder(), RightBorder = new RightBorder(), TopBorder = new TopBorder(), BottomBorder = new BottomBorder(), DiagonalBorder = new DiagonalBorder() };
            borders.Append(border);
            borders.Count = UInt32Value.FromUInt32((uint)borders.ChildElements.Count);
            //创建单元格样式
            var cellStyleFormats = new CellStyleFormats();
            var cellFormat = new CellFormat
            {
                NumberFormatId = 0,
                FontId = 0,
                FillId = 0,
                BorderId = 0,
                FormatId=0
            };
            cellStyleFormats.Append(cellFormat);
            cellStyleFormats.Count = UInt32Value.FromUInt32((uint)cellStyleFormats.ChildElements.Count);
            
            var cellFormats = new CellFormats();
            cellFormat = new CellFormat
            {
                NumberFormatId = 0,
                FontId = 0,
                FillId = 0,
                BorderId = 0,
                FormatId = 0
            };
            cellFormats.Append(cellFormat);
            
            cellFormats.Count = UInt32Value.FromUInt32((uint)cellFormats.ChildElements.Count);
            this.Append(fonts);
            this.Append(fills);
            this.Append(borders);
            this.Append(cellStyleFormats);
            this.Append(cellFormats);
            var css = new CellStyles();
            var cs = new CellStyle
            {
                Name = StringValue.FromString("Normal"),
                FormatId = 0,
                BuiltinId = 0
            };
            css.Append(cs);
            css.Count = UInt32Value.FromUInt32((uint)css.ChildElements.Count);
            this.Append(css);
            var dfs = new DifferentialFormats { Count = 0 };
            this.Append(dfs);
            var tss = new TableStyles
            {
                Count = 0,
                DefaultTableStyle = StringValue.FromString("TableStyleMedium9"),
                DefaultPivotStyle = StringValue.FromString("PivotStyleLight16")
            };
            this.Append(tss);
        }

        ///// <summary>
        ///// Excel表有样式
        ///// </summary>
        ///// <param name="sheetStyles"></param>
        //public NewExcel(List<SheetDataList> sheetStyles)
        //{
        //    //创建默认字体样式1 Arial 24
        //    var fonts = new Fonts();
        //    var font = new Font();
        //    var fontName = new FontName { Val = StringValue.FromString("Arial") };
        //    var fontSize = new FontSize { Val = DoubleValue.FromDouble(11) };
        //    font.FontName = fontName;
        //    font.FontSize = fontSize;
        //    fonts.Append(font);
        //    //创建填充样式1 
        //    var fills = new Fills();
        //    var fill = new Fill();
        //    var patternFill = new PatternFill { PatternType = PatternValues.None };
        //    fill.PatternFill = patternFill;
        //    fills.Append(fill);
        //    fill = new Fill();
        //    patternFill = new PatternFill { PatternType = PatternValues.Gray125 };
        //    fill.PatternFill = patternFill;
        //    fills.Append(fill);
        //    //创建线条样式1
        //    var borders = new Borders();
        //    var border = new Border { LeftBorder = new LeftBorder(), RightBorder = new RightBorder(), TopBorder = new TopBorder(), BottomBorder = new BottomBorder(), DiagonalBorder = new DiagonalBorder() };
        //    borders.Append(border);
        //    //创建单元格样式
        //    var cellStyleFormats = new CellStyleFormats();
        //    var cellFormat = new CellFormat
        //    {
        //        NumberFormatId = 0,
        //        FontId = 0,
        //        FillId = 0,
        //        BorderId = 0,
        //        FormatId = 0
        //    };
        //    cellStyleFormats.Append(cellFormat);
        //    cellStyleFormats.Count = UInt32Value.FromUInt32((uint)cellStyleFormats.ChildElements.Count);

        //    var cellFormats = new CellFormats();
        //    cellFormat = new CellFormat
        //    {
        //        FontId = 0,
        //        FillId = 0,
        //        BorderId = 0,
        //        FormatId = 0
        //    };
        //    cellFormats.Append(cellFormat);

        //    for (int i = 0; i < sheetStyles.Count(); i++)
        //    {
        //        #region //新加字体样式
        //        font = new Font();
        //        string fname = "宋体";
        //        if (sheetStyles[i].FontName != ""&& sheetStyles[i].FontName!= null)
        //        {
        //            fname = sheetStyles[i].FontName;
        //        }
        //        fontName = new FontName { Val = StringValue.FromString(fname) };
        //        font.FontName = fontName;
        //        int size = 11;
        //        if (sheetStyles[i].FontSize != "" && sheetStyles[i].FontSize != null) {
        //            size = int.Parse(sheetStyles[i].FontSize.Replace("px", ""));
        //        }
        //        fontSize = new FontSize { Val = DoubleValue.FromDouble(size) };
        //        font.FontSize = fontSize;
        //        if (sheetStyles[i].FontColor != "" && sheetStyles[i].FontColor != null)
        //        {
        //            font.Color = new Color { Rgb = sheetStyles[i].FontColor.ToUpper().Replace("#","FF") };
        //        }
        //        if (sheetStyles[i].FontBold != "" && sheetStyles[i].FontBold != null)
        //        {
        //            font.Bold = new Bold { Val = true };
        //        }
        //        if (sheetStyles[i].Italic != "" && sheetStyles[i].Italic != null) {
        //            font.Italic = new Italic { Val = true };
        //        }
        //        if (sheetStyles[i].Underline != "" && sheetStyles[i].Underline != null) {
        //            font.Underline = new Underline { Val = UnderlineValues.Single };
        //        }
        //        fonts.Append(font);
        //        #endregion
        //        #region//新加填充样式
        //        fill = new Fill();
        //        if (sheetStyles[i].FillForegroundColor != ""&& sheetStyles[i].FillForegroundColor != null) {
        //            patternFill = new PatternFill { PatternType = PatternValues.Solid, ForegroundColor = new ForegroundColor() };
        //            patternFill.ForegroundColor = new ForegroundColor() { Rgb = sheetStyles[i].FillForegroundColor.ToUpper().Replace("#", "FF") };
        //            patternFill.BackgroundColor = new BackgroundColor() { Rgb = patternFill.ForegroundColor.Rgb };
        //        } else {
        //            patternFill = new PatternFill { PatternType = PatternValues.None };
        //        }
        //        fill.PatternFill = patternFill;
        //        fills.Append(fill);
        //        #endregion
        //        #region//新加边框样式
        //        if (sheetStyles[i].LeftBorder != "" || sheetStyles[i].RightBorder != "" || sheetStyles[i].TopBorder != "" || sheetStyles[i].BottomBorder != "")
        //        {
        //            LeftBorder left = new LeftBorder();
        //            RightBorder right = new RightBorder();
        //            TopBorder top = new TopBorder();
        //            BottomBorder bottom = new BottomBorder();
        //            if (sheetStyles[i].LeftBorder != "" && sheetStyles[i].LeftBorder != null)
        //            {
        //                left = new LeftBorder { Style = BorderStyleValues.Thin };
        //            }
        //            else
        //            {
        //                left = new LeftBorder();
        //            }
        //            if (sheetStyles[i].RightBorder != "" && sheetStyles[i].RightBorder != null)
        //            {
        //                right = new RightBorder { Style = BorderStyleValues.Thin };
        //            }
        //            else
        //            {
        //                right = new RightBorder();
        //            }
        //            if (sheetStyles[i].TopBorder != "" && sheetStyles[i].TopBorder != null)
        //            {
        //                top = new TopBorder { Style = BorderStyleValues.Thin };
        //            }
        //            else
        //            {
        //                top = new TopBorder();
        //            }
        //            if (sheetStyles[i].BottomBorder != "" && sheetStyles[i].BottomBorder != null)
        //            {
        //                bottom = new BottomBorder { Style = BorderStyleValues.Thin };
        //            }
        //            else
        //            {
        //                bottom = new BottomBorder();
        //            }
        //            border = new Border
        //            {
        //                LeftBorder = left,
        //                RightBorder = right,
        //                TopBorder = top,
        //                BottomBorder = bottom,
        //                DiagonalBorder = new DiagonalBorder()
        //            };
        //        }
        //        else {
        //            border = new Border { LeftBorder = new LeftBorder(), RightBorder = new RightBorder(), TopBorder = new TopBorder(), BottomBorder = new BottomBorder(), DiagonalBorder = new DiagonalBorder() };
        //        }
        //        borders.Append(border);
        //        #endregion
        //        //新加单元格样式
        //        UInt32Value index = UInt32Value.FromUInt32((uint)(i + 1));
        //        cellFormat = new CellFormat
        //        {
        //            FontId = index,
        //            FillId = index+1,
        //            BorderId = index
        //        };
        //        if (sheetStyles[i].AligmentHorizontal != null|| sheetStyles[i].AligmentVertical != null) {
        //            HorizontalAlignmentValues hor = HorizontalAlignmentValues.Left;
        //            VerticalAlignmentValues ver = VerticalAlignmentValues.Bottom;
        //            if (sheetStyles[i].AligmentHorizontal == null) { }
        //            else if (sheetStyles[i].AligmentHorizontal.ToLower() == "center")
        //            {
        //                hor = HorizontalAlignmentValues.Center;
        //            }
        //            else if (sheetStyles[i].AligmentHorizontal.ToLower() == "right") {
        //                hor = HorizontalAlignmentValues.Right;
        //            }
        //            if (sheetStyles[i].AligmentVertical == null) { }
        //            else if (sheetStyles[i].AligmentVertical.ToLower() == "center")
        //            {
        //                ver = VerticalAlignmentValues.Center;
        //            }
        //            else if (sheetStyles[i].AligmentVertical.ToLower() == "top")
        //            {
        //                ver = VerticalAlignmentValues.Top;
        //            }
        //            var horAli = new Alignment { Horizontal = hor, Vertical = ver };
        //            cellFormat.Append(horAli);
        //        }
        //        cellFormats.Append(cellFormat);
        //    }

        //    fonts.Count = UInt32Value.FromUInt32((uint)fonts.ChildElements.Count);
        //    fills.Count = UInt32Value.FromUInt32((uint)fills.ChildElements.Count);
        //    borders.Count = UInt32Value.FromUInt32((uint)borders.ChildElements.Count);
        //    cellFormats.Count = UInt32Value.FromUInt32((uint)cellFormats.ChildElements.Count);
        //    this.Append(fonts);
        //    this.Append(fills);
        //    this.Append(borders);
        //    this.Append(cellStyleFormats);
        //    this.Append(cellFormats);
        //    var css = new CellStyles();
        //    var cs = new CellStyle
        //    {
        //        Name = StringValue.FromString("Normal"),
        //        FormatId = 0,
        //        BuiltinId = 0
        //    };
        //    css.Append(cs);
        //    css.Count = UInt32Value.FromUInt32((uint)css.ChildElements.Count);
        //    this.Append(css);
        //    var dfs = new DifferentialFormats { Count = 0 };
        //    this.Append(dfs);
        //    var tss = new TableStyles
        //    {
        //        Count = 0,
        //        DefaultTableStyle = StringValue.FromString("TableStyleMedium9"),
        //        DefaultPivotStyle = StringValue.FromString("PivotStyleLight16")
        //    };
        //    this.Append(tss);
        //}
    }
}
