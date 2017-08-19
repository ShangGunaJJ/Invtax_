using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Xml;
using System.Reflection;
using System.Collections;

namespace DocumentEditor.Excel
{
    public static class ConvertExchange
    {
        public static DataTable ToTable<T>(this IList<T> list)
        {
            System.Data.DataTable dt = new System.Data.DataTable();
            if (list.Count > 0)
            {
                PropertyInfo[] propertys = list[0].GetType().GetProperties();
                foreach (PropertyInfo pi in propertys)
                {
                    dt.Columns.Add(pi.Name, pi.PropertyType);
                }

                for (int i = 0; i < list.Count; i++)
                {
                    ArrayList tempList = new ArrayList();
                    foreach (PropertyInfo pi in propertys)
                    {
                        object obj = pi.GetValue(list[i], null);
                        tempList.Add(obj);
                    }
                    object[] array = tempList.ToArray();
                    dt.LoadDataRow(array, true);
                }
            }
            return dt;
        }
    }

    public class ExcelHelper
    {
        /// <summary>
        /// 获取Excel的表名
        /// </summary>
        /// <param name="v_strPath"></param>
        /// <returns></returns>
        public static List<string> fnGetSheet(string v_strPath)
        {
            List<string> sheets = new List<string>();

            using (SpreadsheetDocument xlPackage = SpreadsheetDocument.Open(v_strPath, false))//以只读方式打开一个Excel文件
            {
                WorkbookPart part = xlPackage.WorkbookPart;//获取Workbook
                Stream stream = part.GetStream();
                XmlDocument doc = new XmlDocument();
                doc.Load(stream);//加载流
                XmlNamespaceManager name = new XmlNamespaceManager(doc.NameTable);
                name.AddNamespace("default", doc.DocumentElement.NamespaceURI);
                XmlNodeList list = doc.SelectNodes("//default:sheets/default:sheet", name);//通过XPath表达式获取Worksheet节点
                string sheetName = string.Empty;
                foreach (XmlNode node in list)
                {
                    sheetName = node.Attributes["name"].Value;//遍历节点，取出属性名
                    sheets.Add(sheetName);
                }
            }
            return sheets;
        }
        /// <summary>
        /// 通过sheet名得到worksheet
        /// </summary>
        /// <param name="document">电子表格名称</param>
        /// <param name="sheetName">sheet名称</param>
        /// <returns></returns>
        public static WorksheetPart GetWorksheetPartByName(SpreadsheetDocument document, string sheetName)
        {
            IEnumerable<Sheet> sheets = document.WorkbookPart.Workbook.GetFirstChild<Sheets>().Elements<Sheet>().Where(s => s.Name == sheetName);
            if (sheets.Count() == 0)
                return null;
            string relationshipId = sheets.First().Id.Value;
            WorksheetPart worksheetPart = (WorksheetPart)document.WorkbookPart.GetPartById(relationshipId);
            return worksheetPart;
        }
        /// <summary>
        /// 移除指定Sheet表
        /// </summary>
        /// <param name="objDocument"></param>
        /// <param name="sheetName">Sheet名称</param>
        public static void RemoveWorksheet(SpreadsheetDocument objDocument, string sheetName)
        {
            WorkbookPart workbookPart = objDocument.WorkbookPart;
            var worksheetpart = workbookPart.WorksheetParts;
            Sheets sheets = workbookPart.Workbook.GetFirstChild<Sheets>();
            foreach (Sheet sheet in sheets.Elements<Sheet>())
            {
                if (sheet.Name.ToString().ToLower() == sheetName.ToLower())
                {
                    sheets.RemoveChild(sheet);
                }
            }
            workbookPart.Workbook.Save();
        }
        /// <summary>
        /// 添加新的Sheet表
        /// </summary>
        /// <param name="objDocument"></param>
        /// <param name="sheetName">Sheet名称</param>
        public static WorksheetPart AddNewWorksheet(SpreadsheetDocument objDocument, string sheetName)
        {
            WorkbookPart workbookPart = objDocument.WorkbookPart;
            WorksheetPart newWorksheetPart = workbookPart.AddNewPart<WorksheetPart>();
            newWorksheetPart.Worksheet = new Worksheet(new SheetData());
            newWorksheetPart.Worksheet.Save();

            string relationshipId = workbookPart.GetIdOfPart(newWorksheetPart);
            Sheets sheets = workbookPart.Workbook.GetFirstChild<Sheets>();
            uint sheetId = 1;
            if (sheets.Elements<Sheet>().Count() > 0)
            {
                sheetId = sheets.Elements<Sheet>().Select(s => s.SheetId.Value).Max() + 1;
            }

            //// Append the new worksheet and associate it with the workbook. 
            Sheet sheet = new Sheet() { Id = relationshipId, SheetId = sheetId, Name = sheetName };
            sheets.Append(sheet);
            return newWorksheetPart;
        }

        /// <summary>
        /// 将列索引转换为字母
        /// </summary>
        /// <param name="index"></param>
        /// <returns></returns>
        private static string GetColumnName(uint index)
        {
            string name = "";
            char[] columnNames = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".ToCharArray();
            int num = (int)index;
            do
            {
                int i = num % 26;
                name = columnNames[i] + name;
                num = num / 26 - 1;
            } while (num > -1);
            if (string.IsNullOrEmpty(name))
                name = "A";
            return name;
        }

        /// <summary>
        /// 插入单元格到Sheet表中
        /// </summary>
        /// <param name="columnName"></param>
        /// <param name="rowIndex"></param>
        /// <param name="worksheetPart"></param>
        /// <returns></returns>
        private static Cell InsertCellInWorksheet(string columnName, uint rowIndex, int? styleIndex, WorksheetPart worksheetPart)
        {
            Worksheet worksheet = worksheetPart.Worksheet;
            SheetData sheetData = worksheet.GetFirstChild<SheetData>();
            string cellReference = columnName + rowIndex;

            // If the worksheet does not contain a row with the specified row index, insert one.
            Row row;
            if (sheetData.Elements<Row>().Where(r => r.RowIndex == rowIndex).Count() != 0)
            {
                row = sheetData.Elements<Row>().Where(r => r.RowIndex == rowIndex).First();
            }
            else
            {
                row = new Row() { RowIndex = rowIndex };
                sheetData.Append(row);
            }

            // If there is not a cell with the specified column name, insert one.  
            if (row.Elements<Cell>().Where(c => c.CellReference.Value == columnName + rowIndex).Count() > 0)
            {
                return row.Elements<Cell>().Where(c => c.CellReference.Value == cellReference).First();
            }
            else
            {
                // Cells must be in sequential order according to CellReference. Determine where to insert the new cell.
                Cell refCell = null;
                foreach (Cell cell in row.Elements<Cell>())
                {
                    if (string.Compare(cell.CellReference.Value, cellReference, true) > 0)
                    {
                        refCell = cell;
                        break;
                    }
                }

                Cell newCell = new Cell() { CellReference = cellReference };
                if (!string.IsNullOrEmpty(styleIndex.ToString())) { newCell.StyleIndex = (uint)styleIndex; }
                row.InsertBefore(newCell, refCell);

                worksheet.Save();
                return newCell;
            }
        }
        /// <summary>
        /// 插入字符项
        /// </summary>
        /// <param name="text"></param>
        /// <param name="shareStringPart"></param>
        /// <returns></returns>
        private static int InsertSharedStringItem(string text, SharedStringTablePart shareStringPart)
        {
            // If the part does not contain a SharedStringTable, create one. 
            if (shareStringPart.SharedStringTable == null)
            {
                shareStringPart.SharedStringTable = new SharedStringTable();
                shareStringPart.SharedStringTable.Count = 1;
                shareStringPart.SharedStringTable.UniqueCount = 1;
            }
            int i = 0;
            // Iterate through all the items in the SharedStringTable. If the text already exists, return its index. 
            foreach (SharedStringItem item in shareStringPart.SharedStringTable.Elements<SharedStringItem>())
            {
                if (item.InnerText == text)
                {
                    return i;
                }
                i++;
            }
            // The text does not exist in the part. Create the SharedStringItem and return its index.
            if (!string.IsNullOrEmpty(text) && text.Contains("</span>"))
            {
                var shareStringItem = GetShareStringStyle(text);
                shareStringPart.SharedStringTable.AppendChild(shareStringItem);
            }
            else
            {
                shareStringPart.SharedStringTable.AppendChild(new SharedStringItem(new Text(text)));
            }
            shareStringPart.SharedStringTable.Save();

            return i;
        }
        /// <summary>
        /// 插入合并单元格
        /// </summary>
        /// <param name="MergeCells">一个Sheet中要插入的合并单元格列表</param>
        /// <param name="worksheetPart">Sheet页</param>
        private static void InsertMergeCellInWorksheet(List<MergeCellsList> MergeCells, WorksheetPart worksheetPart)
        {
            Worksheet worksheet = worksheetPart.Worksheet;
            IEnumerable<MergeCells> oldMergeCells = worksheet.Elements<MergeCells>();
            if (oldMergeCells.Count() > 0)
            {
                //将原有合并单元格列表移除
                worksheet.RemoveChild((MergeCells)oldMergeCells.First());
            }
            if (MergeCells.Count() > 0)
            {
                MergeCells mergeCells = new MergeCells();

                for (int i = 0; i < MergeCells.Count; i++)
                {   //添加新的合并单元格
                    MergeCellsList mcl = MergeCells[i];
                    string startCell = GetColumnName((uint)mcl.col) + (mcl.row + 1).ToString();
                    string endCell = GetColumnName((uint)(mcl.col + mcl.colspan - 1)) + (mcl.row + mcl.rowspan).ToString();
                    MergeCell mergeCell = new MergeCell() { Reference = startCell + ":" + endCell };
                    mergeCells.Append(mergeCell);
                }
                mergeCells.Count = UInt32Value.FromUInt32((uint)mergeCells.ChildElements.Count);
                IEnumerable<SheetData> SheetData = worksheet.Elements<SheetData>();
                if (SheetData.Count() > 0)
                {//插入到SheetData之后，若其他元素排在合并单元格前面，会报格式错误
                    worksheet.InsertAfter(mergeCells, SheetData.First());
                }
                else
                {
                    worksheet.Append(mergeCells);
                }
                worksheet.Save();
            }
        }
        /// <summary>
        /// 添加批注
        /// </summary>
        /// <param name="cclist"></param>
        /// <param name="sourceWorksheetPart"></param>
        public static void AddComments(List<CommentCellsList> cclist, WorksheetPart sourceWorksheetPart)
        {
            string commentsVmlXml = string.Empty;
            foreach (CommentCellsList ccl in cclist)
            {
                commentsVmlXml += GetCommentVMLShapeXML(ccl.col, ccl.row + 1);
            }

            VmlDrawingPart vmlDrawingPart = sourceWorksheetPart.AddNewPart<VmlDrawingPart>();
            using (XmlTextWriter writer = new XmlTextWriter(vmlDrawingPart.GetStream(FileMode.Create), Encoding.UTF8))
            {
                writer.WriteRaw("<xml xmlns:v=\"urn:schemas-microsoft-com:vml\"\r\n"
                            + "xmlns:o=\"urn:schemas-microsoft-com:office:office\"\r\n"
                            + "xmlns:x=\"urn:schemas-microsoft-com:office:excel\">\r\n"
                            + "<o:shapelayout v:ext=\"edit\">\r\n"
                            + "<o:idmap v:ext=\"edit\" data=\"1\"/>\r\n"
                            + "</o:shapelayout><v:shapetype id=\"_x0000_t202\" coordsize=\"21600,21600\" o:spt=\"202\"\r\n"
                            + "path=\"m,l,21600r21600,l21600,xe\">\r\n"
                            + "<v:stroke joinstyle=\"miter\"/>\r\n"
                            + "<v:path gradientshapeok=\"t\" o:connecttype=\"rect\"/>\r\n"
                            + "</v:shapetype>" + commentsVmlXml + "</xml>");
            }

            for (int i = 0; i < cclist.Count; i++)
            {
                CommentCellsList ccl = cclist[i];
                WorksheetCommentsPart worksheetCommentsPart = sourceWorksheetPart.WorksheetCommentsPart ?? sourceWorksheetPart.AddNewPart<WorksheetCommentsPart>();

                if (sourceWorksheetPart.Worksheet.Descendants<LegacyDrawing>().SingleOrDefault() == null)
                {
                    string vmlPartId = sourceWorksheetPart.GetIdOfPart(vmlDrawingPart);
                    LegacyDrawing legacyDrawing = new LegacyDrawing() { Id = vmlPartId };
                    sourceWorksheetPart.Worksheet.Append(legacyDrawing);
                }

                bool appendComments = false;
                Comments comments = null;
                if (sourceWorksheetPart.WorksheetCommentsPart.Comments != null)
                {
                    comments = sourceWorksheetPart.WorksheetCommentsPart.Comments;
                }
                else
                {
                    comments = new Comments();
                    appendComments = true;
                }

                if (sourceWorksheetPart.WorksheetCommentsPart.Comments == null)
                {
                    Authors objAuthors = new Authors();
                    Author objAuthor = new Author();
                    objAuthor.Text = "作者";
                    objAuthors.Append(objAuthor);
                    comments.Append(objAuthors);
                }

                bool appendCommentList = false;
                CommentList commentList = null;
                if (sourceWorksheetPart.WorksheetCommentsPart.Comments != null && sourceWorksheetPart.WorksheetCommentsPart.Comments.Descendants<CommentList>().SingleOrDefault() != null)
                {
                    commentList = sourceWorksheetPart.WorksheetCommentsPart.Comments.Descendants<CommentList>().Single();
                }
                else
                {
                    commentList = new CommentList();
                    appendCommentList = true;
                }

                var reference = GetColumnName((uint)ccl.col) + (ccl.row + 1).ToString();
                Comment comment = new Comment() { Reference = reference, AuthorId = 0, ShapeId = 0 };
                CommentText commentTextElement = new CommentText();
                Run run = new Run();
                RunProperties runProperties = new RunProperties();
                //Bold bold = new Bold();
                RunPropertyCharSet runPropertyCharSet = new RunPropertyCharSet() { Val = 134 };
                //runProperties.Append(bold);
                runProperties.Append(runPropertyCharSet);
                Text text = new Text();
                text.Text = ccl.comment;

                run.Append(runProperties);
                run.Append(text);

                commentTextElement.Append(run);
                comment.Append(commentTextElement);
                commentList.Append(comment);

                if (appendCommentList)
                {
                    comments.Append(commentList);
                }

                if (appendComments)
                {
                    worksheetCommentsPart.Comments = comments;
                }
            }
            sourceWorksheetPart.Worksheet.Save();
        }
        private static string GetCommentVMLShapeXML(int columnIndex, int rowIndex)
        {
            string commentVmlXml = "<v:shape id=\"" + Guid.NewGuid().ToString().Replace("-", "") + "\" type=\"#_x0000_t202\" style=\'position:absolute;\r\n"
                                        + "margin-left:65.25pt;margin-top:1.5pt;width:270pt;height:59.25pt;z-index:1;\r\n"
                                        + "visibility:hidden;mso-wrap-style:tight\' fillcolor=\"#ffffe1\" o:insetmode=\"auto\">\r\n"
                                        + "<v:fill color2=\"#ffffe1\"/>\r\n"
                                        + "<v:shadow on=\"t\" color=\"black\" obscured=\"t\"/>\r\n"
                                        + "<v:path o:connecttype=\"none\"/>\r\n"
                                        + "<v:textbox style=\'mso-direction-alt:auto\'>\r\n"
                                        + "<div style=\'text-align:left\'></div>\r\n"
                                        + "</v:textbox>\r\n"
                                        + "<x:ClientData ObjectType=\"Note\">\r\n"
                                        + "<x:MoveWithCells/>\r\n"
                                        + "<x:SizeWithCells/>\r\n"
                                        + "<x:Anchor>\r\n"
                                        + GetAnchorCoordinatesForVMLCommentShape(columnIndex, rowIndex) + "</x:Anchor>\r\n"
                                        + "<x:AutoFill>False</x:AutoFill>\r\n"
                                        + "<x:Row>" + (rowIndex - 1) + "</x:Row>\r\n"
                                        + "<x:Column>" + columnIndex + "</x:Column>\r\n"
                                        + "</x:ClientData>\r\n"
                                        + "</v:shape>";
            return commentVmlXml;
        }
        private static string GetAnchorCoordinatesForVMLCommentShape(int columnIndex, int rowIndex)
        {
            string coordinates = string.Empty;
            List<int> coordList = new List<int>(8) { 0, 0, 0, 0, 0, 0, 0, 0 };
            coordList[0] = columnIndex + 1;
            coordList[1] = 15;
            coordList[4] = columnIndex + 2;
            coordList[5] = 71;

            if (rowIndex == 0)
            {
                coordList[2] = 0;
                coordList[3] = 2;
                coordList[6] = 4;
                coordList[7] = 9;
            }
            else
            {
                coordList[2] = rowIndex;
                coordList[3] = 8;
                coordList[6] = rowIndex + 4;
                coordList[7] = 15;
            }

            coordinates = string.Join(",", coordList.ConvertAll<string>(x => x.ToString()).ToArray());
            return coordinates;
        }

        /// <summary>
        /// 保存仅有数据的Excel
        /// </summary>
        /// <param name="filePath"></param>
        /// <param name="fileData"></param>
        public static void SaveNewExcel(string filePath, string[][] fileData)
        {
            using (SpreadsheetDocument objDocument = SpreadsheetDocument.Open(filePath, true))
            {
                WorkbookPart workbookPart = objDocument.WorkbookPart;

                WorksheetPart sourceWorksheetPart = GetWorksheetPartByName(objDocument, "Sheet1");

                WriteDataIntoWorkSheet(fileData, workbookPart, sourceWorksheetPart);
            }
        }
        /// <summary>
        /// 保存带有样式的Excel(单个)
        /// </summary>
        /// <param name="filePath">文件路径</param>
        /// <param name="listSDS">数据加样式</param>
        /// <param name="listMCL">合并单元格列表</param>
        public static void SaveNewExcel(string filePath, List<SheetDatas> listSDS, List<MergeCellsList> listMCL)
        {
            using (SpreadsheetDocument objDocument = SpreadsheetDocument.Open(filePath, true))
            {
                WorkbookPart workbookPart = objDocument.WorkbookPart;
                WorksheetPart sourceWorksheetPart = GetWorksheetPartByName(objDocument, "Sheet1");
                Stylesheet styleSheet = objDocument.WorkbookPart.WorkbookStylesPart.Stylesheet;

                WriteDataIntoWorkSheet(listSDS, styleSheet, workbookPart, sourceWorksheetPart);
                //给sheet表插入合并单元格
                InsertMergeCellInWorksheet(listMCL, sourceWorksheetPart);
            }
        }
        /// <summary>
        /// 保存带有复杂样式的Excel(多个)
        /// </summary>
        /// <param name="filePath"></param>
        /// <param name="listSDL"></param>
        public static void SaveNewExcel(string filePath, List<SheetDataList> listSDL)
        {
            using (SpreadsheetDocument objDocument = SpreadsheetDocument.Open(filePath, true))
            {
                WorkbookPart workbookPart = objDocument.WorkbookPart;
                Stylesheet styleSheet = objDocument.WorkbookPart.WorkbookStylesPart.Stylesheet;
                bool flag = false;
                //多个Sheet表循环
                for (int i = 0; i < listSDL.Count; i++)
                {
                    if (listSDL[i].SheetName.ToLower() == "sheet1") { flag = true; }

                    WorksheetPart sourceWorksheetPart = GetWorksheetPartByName(objDocument, listSDL[i].SheetName);
                    if (sourceWorksheetPart == null)
                    {   //未找到Sheet表，插入新Sheet并填充数据
                        sourceWorksheetPart = AddNewWorksheet(objDocument, listSDL[i].SheetName);
                    }
                    //插入数据和样式
                    WriteDataIntoWorkSheet(listSDL[i].SheetData, styleSheet, workbookPart, sourceWorksheetPart);
                    //插入合并单元格
                    if (listSDL[i].MergeCells != null)
                        InsertMergeCellInWorksheet(listSDL[i].MergeCells, sourceWorksheetPart);
                    //添加批注
                    if (listSDL[i].Comments != null && listSDL[i].Comments.Count > 0)
                    {
                        AddComments(listSDL[i].Comments, sourceWorksheetPart);
                    }
                }
                workbookPart.Workbook.Save();
                //将多余的Sheet1移除
                if (!flag) { RemoveWorksheet(objDocument, "Sheet1"); }
            }
        }

        /// <summary>
        /// 仅写入数据到Excel中
        /// </summary>
        /// <param name="cellDatas">数组数据</param>
        /// <param name="workbookPart"></param>
        /// <param name="worksheetPart"></param>
        public static void WriteDataIntoWorkSheet(string[][] cellDatas, WorkbookPart workbookPart, WorksheetPart worksheetPart)
        {
            Worksheet worksheet = worksheetPart.Worksheet;
            SheetData sheetData = worksheet.GetFirstChild<SheetData>();
            for (int r = 0; r < cellDatas.Length; r++)
            {
                var rows = cellDatas[r];
                Row row = new Row { RowIndex = (uint)(r + 1) };
                sheetData.AppendChild(row);
                for (int c = 0; c < rows.Length; c++)
                {
                    var cols = rows[c];
                    string cellReference = GetColumnName((uint)c) + (r + 1);
                    Cell cell = new Cell() { CellReference = cellReference };
                    row.AppendChild(cell);

                    var sharedStringTablePart = workbookPart.SharedStringTablePart;
                    if (sharedStringTablePart == null)
                    {
                        sharedStringTablePart = workbookPart.AddNewPart<SharedStringTablePart>();
                    }
                    int index = InsertSharedStringItem(cols, sharedStringTablePart);

                    cell.CellValue = new CellValue(index.ToString());
                    cell.DataType = new EnumValue<CellValues>(CellValues.SharedString);
                }
            }
            worksheetPart.Worksheet.Save();
        }
        /// <summary>
        /// 写入数据和格式到Excel中
        /// </summary>
        /// <param name="cellDatas"></param>
        /// <param name="cellData"></param>
        /// <param name="styleSheet"></param>
        /// <param name="workbookPart"></param>
        /// <param name="worksheetPart"></param>
        public static void WriteDataIntoWorkSheet(List<SheetDatas> listSDS, Stylesheet styleSheet, WorkbookPart workbookPart, WorksheetPart worksheetPart)
        {
            Row row = null;
            uint nextrow = 0;
            for (int i = 0; i < listSDS.Count; i++)
            {
                var cellData = listSDS[i];
                uint startx = (uint)cellData.RowId + 1;
                uint starty = (uint)cellData.ColumnId;

                string name = GetColumnName(starty);
                string text = cellData.Type == "s" ? cellData.SharedString : cellData.Value; ;
                if (string.IsNullOrEmpty(text)) { text = ""; }

                Worksheet worksheet = worksheetPart.Worksheet;
                SheetData sheetData = worksheet.GetFirstChild<SheetData>();
                string cellReference = name + startx;

                if (startx != nextrow)
                {
                    //设置单元格行高
                    if (cellData.Height > 0)
                    {
                        row = new Row() { RowIndex = startx, CustomHeight = true, Height = cellData.Height };
                    }
                    else
                    {
                        row = new Row() { RowIndex = startx };
                    }
                    sheetData.AppendChild(row);
                }

                if (cellData.Width > 0)
                {
                    InsertColWidth(cellData.ColumnId, cellData.Width, workbookPart, worksheetPart);
                }

                Cell cell = new Cell() { CellReference = cellReference };
                row.AppendChild(cell);
                cell.StyleIndex = CreateCellFormat(styleSheet, cellData);
                cell.CellReference = name + (startx);
                //判断数据类型
                if (text.Length > 1 && text.Substring(0, 1) == "=")
                {//插入公式
                    cell.CellFormula = new CellFormula { CalculateCell = true, Text = text.Substring(1, text.Length - 1).ToUpper() };
                    cell.DataType = new EnumValue<CellValues>(CellValues.Number);
                }
                else if (cellData.Type == "n")
                {//数值
                    cell.DataType = new EnumValue<CellValues>(CellValues.Number);
                    cell.CellValue = new CellValue(text);
                }
                else
                {//字符串
                    var sharedStringTablePart = workbookPart.SharedStringTablePart;
                    if (sharedStringTablePart == null)
                    {
                        sharedStringTablePart = workbookPart.AddNewPart<SharedStringTablePart>();
                    }
                    int index = InsertSharedStringItem(text, sharedStringTablePart);

                    cell.CellValue = new CellValue(index.ToString());
                    cell.DataType = new EnumValue<CellValues>(CellValues.SharedString);
                }
                nextrow = startx;
            }
            worksheetPart.Worksheet.Save();
        }
        public static void InsertDataIntoWorkSheet(uint startx, uint starty, string val, int? styleindex, WorkbookPart workbookPart, WorksheetPart worksheetPart)
        {
            SheetData sheetData = worksheetPart.Worksheet.GetFirstChild<SheetData>();
            string name = GetColumnName(starty);
            string text = Convert.IsDBNull(val) ? "" : val;
            int index = InsertSharedStringItem(text, workbookPart.SharedStringTablePart);
            Cell cell = InsertCellInWorksheet(name, Convert.ToUInt32(startx), styleindex, worksheetPart);

            cell.CellValue = new CellValue(index.ToString());
            cell.DataType = new EnumValue<CellValues>(CellValues.SharedString);
            worksheetPart.Worksheet.Save();
        }

        #region 设置样式
        /// <summary>
        /// 设置单元格列宽
        /// </summary>
        /// <param name="index">列索引</param>
        /// <param name="width">宽度</param>
        /// <param name="workbookPart"></param>
        /// <param name="worksheetPart"></param>
        public static void InsertColWidth(int index, double width, WorkbookPart workbookPart, WorksheetPart worksheetPart)
        {
            Worksheet worksheet = worksheetPart.Worksheet;
            IEnumerable<Columns> colsList = worksheet.Elements<Columns>();
            Column newCol = new Column() { CustomWidth = true, Width = width, Max = (uint)(index + 1), Min = (uint)(index + 1) };
            Column oldCol = null;
            Column maxCol = null;
            if (colsList.Count() > 0)
            {
                Columns col = colsList.ElementAt<Columns>(0);
                foreach (Column cell in col.ChildElements)
                {
                    if (cell.Max == (index + 1))
                    {
                        oldCol = cell;
                        break;
                    }
                    else if (cell.Max > (index + 1))
                    {
                        maxCol = cell;
                        break;
                    }
                }
                if (oldCol != null)
                {
                    col.ReplaceChild(newCol, oldCol);
                }
                else
                {
                    if (maxCol != null) { col.InsertBefore(newCol, maxCol); }
                    else
                    {
                        col.Append(newCol);
                    }
                }
            }
            else
            {
                Columns cols = new Columns();
                cols.Append(newCol);
                IEnumerable<SheetData> SheetData = worksheet.Elements<SheetData>();
                worksheet.InsertBefore(cols, SheetData.First());
            }
        }
        /// <summary>
        /// 创建单个单元格的样式
        /// </summary>
        /// <param name="styleSheet"></param>
        /// <param name="cell"></param>
        /// <returns></returns>
        private static UInt32Value CreateCellFormat(Stylesheet styleSheet, SheetDatas cell)
        {
            if (styleSheet.CellFormats.Count == null)
            {
                styleSheet.CellFormats.Count = (UInt32Value)0;

            }
            CellFormat cellFormat = new CellFormat();
            //边框
            if (!string.IsNullOrEmpty(cell.LeftBorder) || !string.IsNullOrEmpty(cell.RightBorder) || !string.IsNullOrEmpty(cell.TopBorder) || !string.IsNullOrEmpty(cell.BottomBorder) || !string.IsNullOrEmpty(cell.DiagonalBorder))
            {
                cellFormat.BorderId = CreateBorder(styleSheet, cell.LeftBorder, cell.RightBorder, cell.TopBorder, cell.BottomBorder, cell.DiagonalBorder);
                cellFormat.ApplyBorder = true;
            }
            //填充色
            if (!string.IsNullOrEmpty(cell.FillForegroundColor))
            {
                cellFormat.FillId = CreateFill(styleSheet, cell.FillForegroundColor);
                cellFormat.ApplyFill = true;
            }
            //字体样式
            if (!string.IsNullOrEmpty(cell.FontName) || !string.IsNullOrEmpty(cell.FontSize) || !string.IsNullOrEmpty(cell.FontColor) || !string.IsNullOrEmpty(cell.FontBold) || !string.IsNullOrEmpty(cell.Italic) || !string.IsNullOrEmpty(cell.Underline))
            {
                cellFormat.FontId = CreateFont(styleSheet, cell.FontName, cell.FontSize, cell.FontColor, cell.FontBold, cell.Italic, cell.Underline);
                cellFormat.ApplyFont = true;
            }
            //对齐方式
            if (!string.IsNullOrEmpty(cell.AligmentVertical) || !string.IsNullOrEmpty(cell.AligmentHorizontal) || !string.IsNullOrEmpty(cell.WrapText))
            {
                cellFormat.ApplyAlignment = true;
                HorizontalAlignmentValues hor = HorizontalAlignmentValues.Left;
                VerticalAlignmentValues ver = VerticalAlignmentValues.Bottom;

                //横向对齐方式
                if (string.IsNullOrEmpty(cell.AligmentHorizontal)) { }
                else if (cell.AligmentHorizontal.ToLower() == "htcenter")
                {
                    hor = HorizontalAlignmentValues.Center;
                }
                else if (cell.AligmentHorizontal.ToLower() == "htright")
                {
                    hor = HorizontalAlignmentValues.Right;
                }
                //纵向对齐方式
                if (string.IsNullOrEmpty(cell.AligmentVertical)) { }
                else if (cell.AligmentVertical.ToLower() == "htmiddle")
                {
                    ver = VerticalAlignmentValues.Center;
                }
                else if (cell.AligmentVertical.ToLower() == "httop")
                {
                    ver = VerticalAlignmentValues.Top;
                }
                Alignment horAli = null;
                //是否自动换行
                if (!string.IsNullOrEmpty(cell.WrapText) && (cell.WrapText.ToLower() == "true" || cell.WrapText == "1"))
                { horAli = new Alignment { Horizontal = hor, Vertical = ver, WrapText = true }; }
                else { horAli = new Alignment { Horizontal = hor, Vertical = ver }; }
                cellFormat.Append(horAli);
            }

            UInt32Value i = 0;
            int result = -1;
            foreach (CellFormat cellf in styleSheet.CellFormats.ChildElements)
            {
                string oldFontId = cellf.FontId, newFontId = cellFormat.FontId;
                string oldFillId = cellf.FillId, newFillId = cellFormat.FillId;
                string oldBorderId = cellf.BorderId, newBorderId = cellFormat.BorderId;
                string oldAlH = null, newAlH = null;
                string oldAlV = null, newAlV = null;
                string oldAlW = null, newAlW = null;
                if (cellf.Alignment != null)
                {
                    oldAlH = cellf.Alignment.Horizontal;
                    oldAlV = cellf.Alignment.Vertical;
                    oldAlW = cellf.Alignment.WrapText;
                }
                if (cellFormat.Alignment != null)
                {
                    newAlH = cellFormat.Alignment.Horizontal;
                    newAlV = cellFormat.Alignment.Vertical;
                    newAlW = cellFormat.Alignment.WrapText;
                }
                if (oldFontId == newFontId && oldFillId == newFillId && oldBorderId == newBorderId && oldAlH == newAlH && oldAlV == newAlV && oldAlW == newAlW)
                {
                    result = int.Parse(i);
                    break;
                }
                i++;
            }

            if (result < 0)
            {
                styleSheet.CellFormats.Append(cellFormat);
                result = int.Parse(styleSheet.CellFormats.Count);
                styleSheet.CellFormats.Count++;
            }
            return (uint)result;
        }
        /// <summary>
        /// 创建单个单元格的边框样式
        /// </summary>
        /// <param name="styleSheet"></param>
        /// <param name="leftBorder">左边框</param>
        /// <param name="rightBorder">右边框</param>
        /// <param name="topBorder">上边框</param>
        /// <param name="bottomBorder">下边框</param>
        /// <param name="diagonalBorder">斜边框</param>
        /// <returns></returns>
        private static UInt32Value CreateBorder(Stylesheet styleSheet, string leftBorder, string rightBorder, string topBorder, string bottomBorder, string diagonalBorder)
        {
            if (styleSheet.Borders.Count == null)
            {
                styleSheet.Borders.Count = (UInt32Value)0;
            }
            LeftBorder left = new LeftBorder();
            RightBorder right = new RightBorder();
            TopBorder top = new TopBorder();
            BottomBorder bottom = new BottomBorder();
            DiagonalBorder diagonal = new DiagonalBorder();
            //左边框
            if (!string.IsNullOrEmpty(leftBorder) && (leftBorder.ToLower() == "true" || leftBorder.ToLower() == "1px solid #000"))
            {
                left = new LeftBorder { Style = BorderStyleValues.Thin };
            }
            //右边框
            if (!string.IsNullOrEmpty(rightBorder) && (rightBorder.ToLower() == "true" || rightBorder.ToLower() == "1px solid #000"))
            {
                right = new RightBorder { Style = BorderStyleValues.Thin };
            }
            //上边框
            if (!string.IsNullOrEmpty(topBorder) && (topBorder.ToLower() == "true" || topBorder.ToLower() == "1px solid #000"))
            {
                top = new TopBorder { Style = BorderStyleValues.Thin };
            }
            //下边框
            if (!string.IsNullOrEmpty(bottomBorder) && (bottomBorder.ToLower() == "true" || bottomBorder.ToLower() == "1px solid #000"))
            {
                bottom = new BottomBorder { Style = BorderStyleValues.Thin };
            }
            //斜边框
            if (!string.IsNullOrEmpty(diagonalBorder) && (diagonalBorder.ToLower() == "true" || diagonalBorder.ToLower() == "1px solid #000"))
            {
                diagonal = new DiagonalBorder { Style = BorderStyleValues.Thin };
            }
            //边框样式
            var border = new Border
            {
                LeftBorder = left,
                RightBorder = right,
                TopBorder = top,
                BottomBorder = bottom,
                DiagonalBorder = diagonal
            };

            UInt32Value i = 0;
            int result = -1;
            //遍历所有边框样式列表
            foreach (Border cell in styleSheet.Borders.ChildElements)
            {
                BordersList bl = new BordersList();
                //若在边框样式列表中查找到相同样式，则返回边框样式索引
                string oldLs = cell.LeftBorder.Style, newLs = border.LeftBorder.Style;
                string oldRs = cell.RightBorder.Style, newRs = border.RightBorder.Style;
                string oldTs = cell.TopBorder.Style, newTs = border.TopBorder.Style;
                string oldBs = cell.BottomBorder.Style, newBs = border.BottomBorder.Style;
                string oldDs = cell.DiagonalBorder.Style, newDs = border.DiagonalBorder.Style;
                if (oldLs == newLs && oldRs == newRs && oldTs == newTs && oldBs == newBs && oldDs == newDs)
                {
                    result = int.Parse(i);
                    break;
                }
                i++;
            }
            //若没有查找到相同边框样式，则添加新的边框样式
            if (result < 0)
            {
                styleSheet.Borders.Append(border);
                result = int.Parse(styleSheet.Borders.Count);
                styleSheet.Borders.Count++;
            }
            return (uint)result;
        }
        /// <summary>
        /// 创建单个单元格的填充色样式
        /// </summary>
        /// <param name="styleSheet"></param>
        /// <param name="bgColor">背景颜色</param>
        /// <returns></returns>
        private static UInt32Value CreateFill(Stylesheet styleSheet, string bgColor)
        {
            int result = -1;
            if (styleSheet.Fills.Count == null)
            {
                styleSheet.Fills.Count = (UInt32Value)0;
            }

            int i = 0;
            foreach (Fill cell in styleSheet.Fills.ChildElements)
            {
                if (cell.PatternFill != null)
                {
                    if (cell.PatternFill.ForegroundColor != null)
                    {
                        if (cell.PatternFill.ForegroundColor.Rgb != null)
                        {
                            var bg = "#" + cell.PatternFill.ForegroundColor.Rgb.ToString().Substring(2, 6);
                            if (bg.ToLower() == bgColor.ToLower())
                            {
                                result = i;
                                break;
                            }
                        }
                    }
                }
                i++;
            }

            if (result < 0)
            {
                Fill fill = null;
                fill = new Fill(
                        new PatternFill(
                             new ForegroundColor()
                             {
                                 Rgb = bgColor.Replace("#", "ff")
                             })
                        {
                            PatternType = PatternValues.Solid
                        }
                    );

                styleSheet.Fills.Append(fill);
                result = int.Parse(styleSheet.Fills.Count);
                styleSheet.Fills.Count++;
            }
            return (uint)result;
        }
        /// <summary>
        /// 创建单个单元格的字体样式
        /// </summary>
        /// <param name="styleSheet"></param>
        /// <param name="fontName">字体名称</param>
        /// <param name="fontSize">字体大小</param>
        /// <param name="fontColor">字体颜色</param>
        /// <param name="fontBold">是否加粗</param>
        /// <param name="italic">是否倾斜</param>
        /// <param name="underline">是否有下划线</param>
        /// <returns></returns>
        private static UInt32Value CreateFont(Stylesheet styleSheet, string fontName, string fontSize, string fontColor, string fontBold, string italic, string underline)
        {
            int result = -1;
            if (styleSheet.Fonts.Count == null)
            {
                styleSheet.Fonts.Count = (UInt32Value)0;
            }
            Font font = new Font();
            //字体名称
            if (!string.IsNullOrEmpty(fontName))
            {
                FontName name = new FontName()
                {
                    Val = fontName
                };
                font.Append(name);
            }
            //字体大小
            if (!string.IsNullOrEmpty(fontSize))
            {
                FontSize size = new FontSize()
                {
                    Val = DoubleValue.FromDouble(int.Parse(fontSize.Replace("px", "")))
                };
                font.Append(size);
            }
            //字体颜色
            if (!string.IsNullOrEmpty(fontColor))
            {
                Color color = new Color()
                {
                    Rgb = fontColor.Replace("#", "ff")
                };
                font.Append(color);
            }
            //是否加粗
            if (!string.IsNullOrEmpty(fontBold) && (fontBold.ToLower() == "true" || fontBold.ToLower() == "bold"))
            {
                Bold bold = new Bold();
                font.Append(bold);
            }
            //是否倾斜
            if (!string.IsNullOrEmpty(italic) && (italic.ToLower() == "true" || italic.ToLower() == "italic"))
            {
                Italic bold = new Italic();
                font.Append(bold);
            }
            //下划线
            if (!string.IsNullOrEmpty(underline) && (underline.ToLower() == "true" || underline.ToLower() == "underline"))
            {
                Underline bold = new Underline();
                font.Append(bold);
            }

            //UInt32Value i = 0;
            //foreach (Font cell in styleSheet.Fonts.ChildElements)
            //{
            //    string oldFS = null, newFS = null;
            //    string oldFN = null, newFN = null;
            //    string oldC = null, newC = null;
            //    string oldB = null, newB = null;
            //    string oldI = null, newI = null;
            //    string oldU = null, newU = null;
            //    if (cell.FontSize != null) { oldFS = cell.FontSize.Val; }
            //    if (cell.FontName != null) { oldFN = cell.FontName.Val; }
            //    if (cell.Color != null) { oldC = cell.Color.Rgb; }
            //    if (cell.Bold != null) { oldB = cell.Bold.Val; }
            //    if (cell.Italic != null) { oldI = cell.Italic.Val; }
            //    if (cell.Underline != null) { oldU = cell.Underline.Val; }

            //    if (font.FontSize != null) { newFS = font.FontSize.Val; }
            //    if (font.FontName != null) { newFN = font.FontName.Val; }
            //    if (font.Color != null) { newC = font.Color.Rgb; }
            //    if (font.Bold != null) { newB = font.Bold.Val; }
            //    if (font.Italic != null) { newI = font.Italic.Val; }
            //    if (font.Underline != null) { newU = font.Underline.Val; }
            //    if (oldFS == newFS && oldFN == newFN && oldC == newC && oldB == newB && oldI == newI && oldU == newU)
            //    {
            //        result = int.Parse(i);
            //        break;
            //    }
            //    i++;
            //}

            if (result < 0)
            {
                styleSheet.Fonts.Append(font);
                result = int.Parse(styleSheet.Fonts.Count);
                styleSheet.Fonts.Count++;
            }
            return (uint)result;
        }
        #endregion


        #region 废弃
        public static void SaveNewExcel(string filePath, ExcelEntity SheetList)
        {
            using (SpreadsheetDocument objDocument = SpreadsheetDocument.Open(filePath, true))
            {
                var flag = false;
                WorkbookPart workbookPart = objDocument.WorkbookPart;
                List<SheetDataList> sheetDataList = SheetList.SheetDataList;

                Stylesheet styleSheet = objDocument.WorkbookPart.WorkbookStylesPart.Stylesheet;
                styleSheet.CellFormats.ClearAllAttributes();
                styleSheet.Fonts.ClearAllAttributes();
                styleSheet.Fills.ClearAllAttributes();
                styleSheet.Borders.ClearAllAttributes();
                //styleSheet.NumberingFormats.ClearAllAttributes();
                CreateFont(styleSheet, SheetList.FontsList);
                CreateFill(styleSheet, SheetList.FillsList);
                CreateBorder(styleSheet, SheetList.BordersList);
                //InsertStyleInStylesheet(objDocument.WorkbookPart, SheetList.CellFormatsList);
                CreateCellFormat(styleSheet, SheetList.CellFormatsList);

                for (int i = 0; i < sheetDataList.Count; i++)
                {
                    WorksheetPart sourceWorksheetPart = GetWorksheetPartByName(objDocument, sheetDataList[i].SheetName);

                    if (sheetDataList[i].SheetName.ToLower() == "sheet1") { flag = true; }

                    if (sourceWorksheetPart == null)
                    {   //未找到Sheet表，插入新Sheet并填充数据
                        sourceWorksheetPart = AddNewWorksheet(objDocument, sheetDataList[i].SheetName);
                    }

                    WriteDataIntoWorkSheet(sheetDataList[i].SheetData, workbookPart, sourceWorksheetPart);

                    //给sheet表插入合并单元格
                    InsertMergeCellInWorksheet(sheetDataList[i].MergeCells, sourceWorksheetPart);
                    //给sheet表插入批注
                    if (sheetDataList[i].Comments.Count > 0)
                    {
                        AddComments(sheetDataList[i].Comments, sourceWorksheetPart);
                    }
                }
                workbookPart.Workbook.Save();

                if (!flag)
                {
                    RemoveWorksheet(objDocument, "Sheet1");
                }
            }
        }
        ///<summary>
        /// Sheet拷贝,需要先通过SpreadsheetWriter.InsertWorksheet()函数创建,创建WorkSheetPart
        ///</summary>
        ///<param name="document"></param>
        ///<param name="sheetName"></param>
        ///<param name="newWorkSheetPart"></param>
        public static void CopySheet(SpreadsheetDocument document, string sheetName, WorksheetPart newWorkSheetPart)
        {
            WorkbookPart workbookPart = document.WorkbookPart;
            WorksheetPart sourceWorksheetPart = GetWorksheetPartByName(document, sheetName);//查找目标模版Sheet页
            newWorkSheetPart.Worksheet = (Worksheet)sourceWorksheetPart.Worksheet.CloneNode(true);
            //通过深拷贝的方式直接拷贝目标模版的数据格式部分的XML，其他部分可以不需要。
            workbookPart.Workbook.Save();
        }
        private static void WriteDataIntoWorkSheet(List<SheetDatas> cellDatas, WorkbookPart workbookPart, WorksheetPart worksheetPart)
        {
            Row row = null;
            uint nextrow = 0;
            for (int i = 0; i < cellDatas.Count; i++)
            {
                var cellData = cellDatas[i];
                uint startx = (uint)cellData.RowId;
                uint starty = (uint)cellData.ColumnId;

                string name = GetColumnName(starty);
                string text = cellData.Type == "s" ? cellData.SharedString : cellData.Value;
                if (string.IsNullOrEmpty(text)) { text = ""; }

                //Cell cell = InsertCellInWorksheet(name, Convert.ToUInt32(startx), worksheetPart);
                Worksheet worksheet = worksheetPart.Worksheet;
                SheetData sheetData = worksheet.GetFirstChild<SheetData>();
                string cellReference = name + startx;

                if (startx != nextrow)
                {
                    row = new Row() { RowIndex = startx };
                    sheetData.AppendChild(row);
                }

                Cell cell = new Cell() { CellReference = cellReference };
                row.AppendChild(cell);

                //if (cell.StyleIndex != null) { cellData.StyleId = cellData.StyleId; }
                //int styleIndex = InsertStyleInStylesheet(cellData, workbookPart);
                if (cellData.StyleId != null)
                {
                    cell.StyleIndex = new UInt32Value((uint)cellData.StyleId);
                }
                cell.CellReference = name + (startx);
                if (text.Length > 1 && text.Substring(0, 1) == "=")
                {//插入公式
                    cell.CellFormula = new CellFormula { CalculateCell = true, Text = text.Substring(1, text.Length - 1).ToUpper() };
                    cell.DataType = new EnumValue<CellValues>(CellValues.Number);
                }
                else if (cellData.Type == "n")
                {//数值
                    cell.DataType = new EnumValue<CellValues>(CellValues.Number);
                    cell.CellValue = new CellValue(text);
                }
                else
                {//字符串
                    var sharedStringTablePart = workbookPart.SharedStringTablePart;
                    if (sharedStringTablePart == null)
                    {
                        sharedStringTablePart = workbookPart.AddNewPart<SharedStringTablePart>();
                    }
                    int index = InsertSharedStringItem(text, sharedStringTablePart);

                    cell.CellValue = new CellValue(index.ToString());
                    cell.DataType = new EnumValue<CellValues>(CellValues.SharedString);
                }

                nextrow = startx;
            }
            worksheetPart.Worksheet.Save();
        }
        private static SharedStringItem GetShareStringStyle(string value)
        {
            SharedStringItem item = new SharedStringItem();
            #region 处理负责样式
            string[] spanStr = Regex.Split(value, "</span>", RegexOptions.IgnoreCase);
            string simpVal = "";
            for (int s = 0; s < spanStr.Length - 1; s++)
            {
                Run run = new Run();
                RunProperties shareRun = new RunProperties();
                if (spanStr[s].Contains("</em>"))
                {
                    Regex emreg = new Regex(@"(?s)(?<=<em>).*(?=</em>)");
                    var emstr = emreg.Match(spanStr[s]).Value;
                    Italic em = new Italic();
                    shareRun.Append(em);
                    simpVal = emstr;
                }
                if (spanStr[s].Contains("</u>"))
                {
                    Regex ureg = new Regex(@"(?s)(?<=<u>).*(?=</u>)");
                    var ustr = ureg.Match(spanStr[s]).Value;
                    Underline under = new Underline();
                    shareRun.Append(under);
                    simpVal = ustr;
                }
                if (spanStr[s].Contains("</b>"))
                {
                    Regex breg = new Regex(@"(?s)(?<=<b>).*(?=</b>)");
                    var bstr = breg.Match(spanStr[s]).Value;
                    Bold bold = new Bold();
                    shareRun.Append(bold);
                    simpVal = bstr;
                }
                if (spanStr[s].Contains("font-size"))
                {
                    Regex breg = new Regex(@"(?s)(?<=font-size:).*(?=px;)");
                    var bstr = breg.Match(spanStr[s]).Value;
                    FontSize fs = new FontSize();
                    fs.Val = int.Parse(bstr);
                    shareRun.Append(fs);
                }
                if (spanStr[s].Contains("color"))
                {
                    Regex breg = new Regex(@"(?s)(?<=color:#).*(?=;)");
                    var bstr = breg.Match(spanStr[s]).Value;
                    Color color = new Color();
                    color.Rgb = "FF" + bstr.Substring(0, 6).ToUpper();
                    shareRun.Append(color);
                }
                if (spanStr[s].Contains("font-family"))
                {
                    Regex breg = new Regex(@"(?s)(?<=font-family:').*(?=';)");
                    var bstr = breg.Match(spanStr[s]).Value;
                    RunFont rf = new RunFont();
                    rf.Val = bstr;
                    shareRun.Append(rf);
                }
                if (shareRun.Count() > 0)
                {
                    run.Append(shareRun);
                }
                Regex valreg = new Regex(@"(?s)(?<=>).*(?=)");
                var valstr = valreg.Match(spanStr[s]).Value;
                if (simpVal != "")
                {
                    valstr = simpVal;
                }
                Text val = new Text();
                val.Text = valstr;
                run.Text = val;
                item.Append(run);
            }
            #endregion
            return item;
        }
        /// 插入字体样式
        /// </summary>
        /// <param name="styleSheet">要保存的样式</param>
        /// <param name="fontName">字体</param>
        /// <param name="fontSize">大小</param>
        /// <param name="foreColor">颜色</param>
        /// <param name="isBold">是否加粗</param>
        /// <param name="isItalic">是否倾斜</param>
        /// <param name="isUnderline">是否有下划线</param>
        /// <returns>返回FontId</returns>
        private static void CreateFont(Stylesheet styleSheet, List<FontsList> cellData)
        {
            for (int i = 1; i < cellData.Count; i++)
            {
                var cell = cellData[i];
                if (styleSheet.Fonts.Count == null)
                {
                    styleSheet.Fonts.Count = (UInt32Value)0;

                }
                Font font = new Font();
                if (!string.IsNullOrEmpty(cell.fontname))
                {
                    FontName name = new FontName()
                    {
                        Val = cell.fontname
                    };
                    font.Append(name);
                }

                if (!string.IsNullOrEmpty(cell.fontsize))
                {
                    FontSize size = new FontSize()
                    {
                        Val = DoubleValue.FromDouble(int.Parse(cell.fontsize.Replace("px", "")))
                    };
                    font.Append(size);
                }

                if (!string.IsNullOrEmpty(cell.color))
                {
                    Color color = new Color()
                    {
                        Rgb = cell.color.Replace("#", "ff")
                    };
                    font.Append(color);
                }

                if (!string.IsNullOrEmpty(cell.bold))
                {
                    Bold bold = new Bold();
                    font.Append(bold);
                }
                if (!string.IsNullOrEmpty(cell.italic))
                {
                    Italic bold = new Italic();
                    font.Append(bold);
                }
                if (!string.IsNullOrEmpty(cell.underline))
                {
                    Underline bold = new Underline();
                    font.Append(bold);
                }
                styleSheet.Fonts.Append(font);
                UInt32Value result = styleSheet.Fonts.Count;
                styleSheet.Fonts.Count++;
            }
        }
        /// <summary>
        /// 插入填充色
        /// </summary>
        /// <param name="styleSheet"></param>
        /// <param name="fillColor">填充色（FFFFFFFF）</param>
        /// <returns>返回FillId</returns>
        private static void CreateFill(Stylesheet styleSheet, List<FillsList> cellData)
        {
            for (int i = 2; i < cellData.Count; i++)
            {
                var cell = cellData[i];
                if (styleSheet.Fills.Count == null)
                {
                    styleSheet.Fills.Count = (UInt32Value)0;
                }

                Fill fill = null;
                if (!string.IsNullOrEmpty(cell.fgColor))
                {
                    fill = new Fill(
                        new PatternFill(
                             new ForegroundColor()
                             {
                                 Rgb = cell.fgColor.Replace("#", "ff")
                             })
                        {
                            PatternType = PatternValues.Solid
                        }
                    );
                }
                else
                {
                    fill = new Fill();
                    var patternFill = new PatternFill { PatternType = PatternValues.None };
                    fill.PatternFill = patternFill;
                }
                styleSheet.Fills.Append(fill);

                UInt32Value result = styleSheet.Fills.Count;

                styleSheet.Fills.Count++;
            }
        }
        /// <summary>
        /// 插入边框
        /// </summary>
        /// <param name="styleSheet"></param>
        /// <param name="leftBorder">左边框</param>
        /// <param name="rightBorder">右边框</param>
        /// <param name="topBorder">上边框</param>
        /// <param name="bottomBorder">下边框</param>
        /// <returns>返回BorderId</returns>
        private static void CreateBorder(Stylesheet styleSheet, List<BordersList> cellData)
        {
            for (int i = 1; i < cellData.Count; i++)
            {
                var cell = cellData[i];
                if (styleSheet.Borders.Count == null)
                {
                    styleSheet.Borders.Count = (UInt32Value)0;
                }
                if (!string.IsNullOrEmpty(cell.left) || !string.IsNullOrEmpty(cell.right) || !string.IsNullOrEmpty(cell.top) || !string.IsNullOrEmpty(cell.bottom))
                {
                    LeftBorder left = new LeftBorder();
                    RightBorder right = new RightBorder();
                    TopBorder top = new TopBorder();
                    BottomBorder bottom = new BottomBorder();
                    if (!string.IsNullOrEmpty(cell.left))
                    {
                        left = new LeftBorder { Style = BorderStyleValues.Thin };
                    }
                    else
                    {
                        left = new LeftBorder();
                    }
                    if (!string.IsNullOrEmpty(cell.right))
                    {
                        right = new RightBorder { Style = BorderStyleValues.Thin };
                    }
                    else
                    {
                        right = new RightBorder();
                    }
                    if (!string.IsNullOrEmpty(cell.top))
                    {
                        top = new TopBorder { Style = BorderStyleValues.Thin };
                    }
                    else
                    {
                        top = new TopBorder();
                    }
                    if (!string.IsNullOrEmpty(cell.bottom))
                    {
                        bottom = new BottomBorder { Style = BorderStyleValues.Thin };
                    }
                    else
                    {
                        bottom = new BottomBorder();
                    }
                    var border = new Border
                    {
                        LeftBorder = left,
                        RightBorder = right,
                        TopBorder = top,
                        BottomBorder = bottom,
                        DiagonalBorder = new DiagonalBorder()
                    };
                    styleSheet.Borders.Append(border);
                    UInt32Value result = styleSheet.Borders.Count;
                    styleSheet.Borders.Count++;
                }
            }
        }
        /// <summary>
        /// 创建样式列表
        /// </summary>
        /// <param name="styleSheet"></param>
        /// <param name="fontIndex">fontid</param>
        /// <param name="fillIndex">fillid</param>
        /// <param name="borderIndex">borderid</param>
        /// <param name="numberFormatId"></param>
        /// <param name="aliHor">横向对齐方式（“center”||left”||“right”）</param>
        /// <param name="aliVer">纵向对齐方式（“center”||“top”||“bottom”）</param>
        /// <returns></returns>
        private static void CreateCellFormat(Stylesheet styleSheet, List<CellFormatsList> cellData)
        {
            for (int i = 1; i < cellData.Count; i++)
            {
                var cell = cellData[i];
                if (styleSheet.CellFormats.Count == null)
                {
                    styleSheet.CellFormats.Count = (UInt32Value)0;

                }
                CellFormat cellFormat = new CellFormat();
                cellFormat.BorderId = 0;
                cellFormat.ApplyFont = true;
                cellFormat.FontId = new UInt32Value((uint)cell.fontId);
                cellFormat.FillId = new UInt32Value((uint)cell.fillId);
                cellFormat.ApplyFill = true;

                if (cell.applyBorder > 0)
                {
                    cellFormat.BorderId = new UInt32Value((uint)cell.borderId);
                    cellFormat.ApplyBorder = true;
                }
                if (cell.applyNumberFormat > 0)
                {
                    cellFormat.NumberFormatId = new UInt32Value((uint)cell.numFmtId);
                    cellFormat.ApplyNumberFormat = BooleanValue.FromBoolean(true);
                }
                //对齐方式
                if (cell.applyAlignment > 0)
                {
                    HorizontalAlignmentValues hor = HorizontalAlignmentValues.Left;
                    VerticalAlignmentValues ver = VerticalAlignmentValues.Bottom;
                    //横向对齐方式
                    if (string.IsNullOrEmpty(cell.horizontal)) { }
                    else if (cell.horizontal.ToLower() == "htcenter")
                    {
                        hor = HorizontalAlignmentValues.Center;
                    }
                    else if (cell.horizontal.ToLower() == "htright")
                    {
                        hor = HorizontalAlignmentValues.Right;
                    }
                    //纵向对齐方式
                    if (string.IsNullOrEmpty(cell.vertical)) { }
                    else if (cell.vertical.ToLower() == "htcenter")
                    {
                        ver = VerticalAlignmentValues.Center;
                    }
                    else if (cell.vertical.ToLower() == "httop")
                    {
                        ver = VerticalAlignmentValues.Top;
                    }
                    var horAli = new Alignment { Horizontal = hor, Vertical = ver };
                    cellFormat.Append(horAli);
                }

                styleSheet.CellFormats.Append(cellFormat);
                UInt32Value result = styleSheet.CellFormats.Count;
                styleSheet.CellFormats.Count++;
            }
        }
        public static void ClearComments(WorksheetPart sourceWorksheetPart, WorkbookPart workbookPart)
        {
            IEnumerable<VmlDrawingPart> oldVmlDrawingPart = sourceWorksheetPart.VmlDrawingParts;
            if (oldVmlDrawingPart.Count() > 0)
            {
                sourceWorksheetPart.DeleteParts(oldVmlDrawingPart);
            }
            sourceWorksheetPart.Worksheet.Save();
            workbookPart.Workbook.Save();
        }
        #endregion
    }

    public class SheetDatas
    {
        #region 数据
        /// <summary>
        /// 行索引
        /// </summary>
        public int RowId { get; set; }
        /// <summary>
        /// 列索引
        /// </summary>
        public int ColumnId { get; set; }
        /// <summary>
        /// 行列坐标
        /// </summary>
        public string Column { get; set; }
        /// <summary>
        /// 类型
        /// </summary>
        public string Type { get; set; }
        /// <summary>
        /// 数值
        /// </summary>
        public string Value { get; set; }
        /// <summary>
        /// 字符串值
        /// </summary>
        public string SharedString { get; set; }
        /// <summary>
        /// 公式
        /// </summary>
        public string Formula { get; set; }
        /// <summary>
        /// 样式索引
        /// </summary>
        public int? StyleId { get; set; }
        /// <summary>
        /// 批注
        /// </summary>
        public string Comment { get; set; }
        #endregion

        #region Excel的样式
        public double Width { get; set; }
        public double Height { get; set; }
        /// <summary>
        /// 字体名称
        /// </summary>
        public string FontName { get; set; }
        /// <summary>
        /// 字体大小
        /// </summary>
        public string FontSize { get; set; }
        /// <summary>
        /// 字体颜色
        /// </summary>
        public string FontColor { get; set; }
        /// <summary>
        /// 字体加粗
        /// </summary>
        public string FontBold { get; set; }
        /// <summary>
        /// 下划线
        /// </summary>
        public string Underline { get; set; }
        /// <summary>
        /// 文字倾斜
        /// </summary>
        public string Italic { get; set; }
        /// <summary>
        /// 横向对齐方式
        /// </summary>
        public string AligmentHorizontal { get; set; }
        /// <summary>
        /// 纵向对齐方式
        /// </summary>
        public string AligmentVertical { get; set; }
        /// <summary>
        /// 自动换行
        /// </summary>
        public string WrapText { get; set; }
        /// <summary>
        /// 填充类型
        /// </summary>
        public string FillType { get; set; }
        /// <summary>
        /// 填充颜色
        /// </summary>
        public string FillForegroundColor { get; set; }
        public string FillBackgroundColor { get; set; }
        /// <summary>
        /// 左边界
        /// </summary>
        public string LeftBorder { get; set; }
        /// <summary>
        /// 右边界
        /// </summary>
        public string RightBorder { get; set; }
        /// <summary>
        /// 上边界
        /// </summary>
        public string TopBorder { get; set; }
        /// <summary>
        /// 下边界
        /// </summary>
        public string BottomBorder { get; set; }
        /// <summary>
        /// 斜边界
        /// </summary>
        public string DiagonalBorder { get; set; }
        #endregion
    }

    public class MergeCellsList
    {
        //{"row":3,"col":2,"rowspan":2,"colspan":2}
        /// <summary>
        /// 行索引
        /// </summary>
        public int row { get; set; }
        /// <summary>
        /// 列索引
        /// </summary>
        public int col { get; set; }
        /// <summary>
        /// 横向合并单元格数
        /// </summary>
        public int rowspan { get; set; }
        /// <summary>
        /// 纵向合并单元格数
        /// </summary>
        public int colspan { get; set; }
    }

    public class CommentCellsList
    {
        public int row { get; set; }
        public int col { get; set; }
        public string comment { get; set; }
    }
    #region 样式表
    public class CellFormatsList
    {
        /// <summary>
        /// 总行数
        /// </summary>
        public int styleIndex { get; set; }

        /// <summary>
        /// 格式ID
        /// </summary>
        public int numFmtId { get; set; }
        /// <summary>
        /// 边框ID
        /// </summary>
        public int borderId { get; set; }
        /// <summary>
        /// 填充色ID
        /// </summary>
        public int fillId { get; set; }
        /// <summary>
        /// 字体ID
        /// </summary>
        public int fontId { get; set; }

        /// <summary>
        /// 是否应用对齐方式
        /// </summary>
        public int applyAlignment { get; set; }
        /// <summary>
        /// 是否应用边框样式
        /// </summary>
        public int applyBorder { get; set; }
        /// <summary>
        /// 是否应用字体样式
        /// </summary>
        public int applyFont { get; set; }
        /// <summary>
        /// 是否应用格式样式
        /// </summary>
        public int applyNumberFormat { get; set; }
        public int xfId { get; set; }

        /// <summary>
        /// 横向对齐方式
        /// </summary>
        public string vertical { get; set; }
        /// <summary>
        /// 纵向对齐方式
        /// </summary>
        public string horizontal { get; set; }
        /// <summary>
        /// 自动换行
        /// </summary>
        public string wraptext { get; set; }

        public int rowIndex { get; set; }
        public int colIndex { get; set; }
    }

    public class BordersList
    {
        public string left { get; set; }
        public string right { get; set; }
        public string top { get; set; }
        public string bottom { get; set; }
        public string diagonal { get; set; }
    }

    public class FillsList
    {
        public string patternType { get; set; }
        public string fgColor { get; set; }
        public string bgColor { get; set; }
    }

    public class FontsList
    {
        public string fontsize { get; set; }
        public string color { get; set; }
        public string fontname { get; set; }
        public string bold { get; set; }
        public string italic { get; set; }
        public string underline { get; set; }
    }

    public class NumFmtsList
    {
        public string formatCode { get; set; }
        public int numFmtId { get; set; }
    }
    #endregion

    public class SheetDataList
    {
        public string SheetName { get; set; }

        public string SheetId { get; set; }

        public List<SheetDatas> SheetData { get; set; }

        public List<MergeCellsList> MergeCells { get; set; }

        public List<CommentCellsList> Comments { get; set; }

        public List<PictureInfo> PictureList { get; set; }

        public int TotalRow { get; set; }

        public int TotalColumn { get; set; }
    }

    public class ExcelEntity
    {
        public List<SheetDataList> SheetDataList { get; set; }
        public List<MergeCellsList> MergeCellsList { get; set; }

        public List<CellFormatsList> CellFormatsList { get; set; }
        public List<BordersList> BordersList { get; set; }
        public List<FillsList> FillsList { get; set; }
        public List<FontsList> FontsList { get; set; }
        public List<NumFmtsList> NumFmtsList { get; set; }
    }

    public class PictureInfo
    {
        public string RefId { get; set; }
        public string ImageName { get; set; }
        public string ImageUrl { get; set; }

        public int FromRow { get; set; }
        public int FromCol { get; set; }
        public int ImgHeight { get; set; }
        public int ImgWidth { get; set; }
        //public Image Image { get; set; }
    }
}
