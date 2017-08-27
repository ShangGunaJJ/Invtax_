﻿using Ace.IdStrategy;
using Chloe.Admin.Common.Tree;
using Chloe.Application.Interfaces;
using Chloe.Application.Interfaces.System;
using Chloe.Application.Models.Scan;
using Chloe.Application.Models.Company;
using Chloe.Entities;
using Chloe.Admin.Common;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using Ace;
using System.Text;
using DocumentEditor;
using DocumentEditor.Excel;
using System.IO;
using Aspose.Cells;
using System.Data;

namespace Chloe.Admin.Areas.SystemManage.Controllers
{
    [LoginAuthorizeAttribute]
    public class ScanController : WebController
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ImportExecl()
        {
            Response.ContentEncoding = System.Text.Encoding.GetEncoding("gb2312");
            return View();
        }

        [HttpPost]
        public ActionResult SaveData(List<AddMainInput> strs, List<string> dms, List<string> hms)
        {
            var CompanyAppService = this.CreateService<ICompanyAppService>();
            var InvService = this.CreateService<IInvAppService>();
            inv_company com = CompanyAppService.GetUserCompany();
            int userPages = CompanyAppService.GetUserPages();
            int count = strs.Count;
            Result<object> result;
            if (count == 0)
            {
                result = Result.CreateResult<object>(ResultStatus.Failed, null);
                result.Msg = "请添加需要查验的发票数据.";
                return this.JsonContent(result);
            }
            if (com.totlePage - userPages < count)
            {
                result = Result.CreateResult<object>(ResultStatus.Failed, null);
                result.Msg = "发票查验授权剩余数量不够，请联系软件服务商增加授权数量！";
                return this.JsonContent(result);
            }
            var re = InvService.getRepeat(dms, hms);

            if (re != "")
            {
                result = Result.CreateResult<object>(ResultStatus.OK, re);
                result.Msg = "";
                result.state = 1;//重复
                return this.JsonContent(result);
            }

            int succ = 0;
            for (int i = 0; i < count; i++)
            {
                if (InvService.Add(strs[i]).Id > 0)
                    succ++;
            }
            result = Result.CreateResult<object>(ResultStatus.OK, null);
            result.Msg = "已成功提交" + succ.ToString() + "张发票.";
            return this.JsonContent(result);
        }
        [HttpPost]
        public ActionResult Update(AddOrUpdateInvMain main)
        {
            var CompanyAppService = this.CreateService<ICompanyAppService>();
            var InvService = this.CreateService<IInvAppService>();
            inv_company com = CompanyAppService.GetUserCompany();
            int userPages = CompanyAppService.GetUserPages();
            Result<object> result;
            if (com.totlePage < ++userPages)
            {
                result = Result.CreateResult<object>(ResultStatus.Failed, null);
                result.Msg = "发票查验授权数量已用完，请联系软件服务商增加授权数量！";
                return this.JsonContent(result);
            }
            result = Result.CreateResult<object>(ResultStatus.OK, null);
            if (InvService.Update(main) > 0)
                result.Msg = "发票编辑成功!";
            else
                result.Msg = "发票编辑失败!";
            return this.JsonContent(result);
        }
        [HttpPost]
        public ActionResult SaveExcel2(string fileName, string fileData)
        {
            try
            {
                var objSaveDataList = Newtonsoft.Json.Linq.JArray.Parse(fileData);

                List<MergeCellsList> listMCL = new List<MergeCellsList>();
                List<SheetDatas> listSDS = new List<SheetDatas>();

                for (int i = 0; i < objSaveDataList.Count; i++)
                {
                    var objSaveData = objSaveDataList[i];
                    for (int j = 0; j < objSaveData.Count(); j++)
                    {
                        //单元格数据
                        SheetDatas sds = new SheetDatas();
                        sds.RowId = i;
                        sds.ColumnId = j;
                        sds.Type = "s";
                        bool bm = false;

                        var item = objSaveData[j];
                        if (item.Type == Newtonsoft.Json.Linq.JTokenType.Object)
                        {
                            //有样式
                            if (item.Count() > 0)
                            {
                                var objItem = (Newtonsoft.Json.Linq.JObject)item;
                                //合并单元格列表
                                MergeCellsList mcl = new MergeCellsList();

                                foreach (var key in objItem.Children())
                                {
                                    var keyValue = ((Newtonsoft.Json.Linq.JValue)((Newtonsoft.Json.Linq.JProperty)key).Value).Value.ToString();
                                    switch (((Newtonsoft.Json.Linq.JProperty)key).Name)
                                    {
                                        #region 单元格样式
                                        case "value":
                                            sds.SharedString = keyValue.ToString();
                                            break;
                                        case "left":
                                            sds.LeftBorder = keyValue;
                                            break;
                                        case "right":
                                            sds.RightBorder = keyValue;
                                            break;
                                        case "top":
                                            sds.TopBorder = keyValue;
                                            break;
                                        case "bottom":
                                            sds.BottomBorder = keyValue;
                                            break;
                                        case "diagonal":
                                            sds.DiagonalBorder = keyValue;
                                            break;
                                        case "patternType":
                                            sds.FillType = keyValue;
                                            break;
                                        case "bgColor":
                                            sds.FillForegroundColor = keyValue;
                                            break;
                                        case "fontname":
                                            sds.FontName = keyValue;
                                            break;
                                        case "fontsize":
                                            sds.FontSize = keyValue;
                                            break;
                                        case "color":
                                            sds.FontColor = keyValue;
                                            break;
                                        case "bold":
                                            sds.FontBold = keyValue;
                                            break;
                                        case "italic":
                                            sds.Italic = keyValue;
                                            break;
                                        case "underline":
                                            sds.Underline = keyValue;
                                            break;
                                        case "rowspan":
                                            bm = true;
                                            mcl.row = i;
                                            mcl.col = j;
                                            mcl.rowspan = int.Parse(keyValue);
                                            mcl.colspan = int.Parse(((Newtonsoft.Json.Linq.JValue)(objItem.GetValue("colspan"))).Value.ToString());
                                            break;
                                        case "vertical":
                                            sds.AligmentVertical = keyValue;
                                            break;
                                        case "horizontal":
                                            sds.AligmentHorizontal = keyValue;
                                            break;
                                        case "width":
                                            sds.Width = int.Parse(keyValue);
                                            break;
                                        case "height":
                                            sds.Height = int.Parse(keyValue);
                                            break;
                                        case "wraptext":
                                            sds.WrapText = keyValue;
                                            break;
                                            #endregion
                                    }
                                }
                                if (bm) { listMCL.Add(mcl); }
                            }
                        }
                        else
                        {
                            //只有值
                            var value = ((Newtonsoft.Json.Linq.JValue)item).Value;
                            if (value != null)
                                sds.SharedString = value.ToString();
                        }
                        listSDS.Add(sds);
                    }
                }

                string tempPath = HttpContext.Server.MapPath("\\Content\\Temptale\\Excel.xlsx");
                string newFilePath = HttpContext.Server.MapPath("\\Content\\Temp\\");
                if (!Directory.Exists(newFilePath)) Directory.CreateDirectory(newFilePath);

                var fname = fileName + ".xlsx";
                newFilePath = newFilePath + fileName + ".xlsx";
                if (System.IO.File.Exists(newFilePath))
                {
                    System.IO.File.Delete(newFilePath);
                }
                System.IO.File.Copy(tempPath, newFilePath);
                DocumentEditor.Excel.ExcelHelper.SaveNewExcel(newFilePath, listSDS, listMCL);
                var result = Result.CreateResult<object>(ResultStatus.OK, null);
                result.Msg = fname;
                return this.JsonContent(result);
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        [HttpPost]
        public ActionResult UploadFile(HttpPostedFileBase file)
        {
            var InvService = this.CreateService<IInvAppService>();
            DataTable dt = null;
            DataTable newdt = new DataTable();
            int columnscount = 1;
            while (columnscount<8)
            {
                newdt.Columns.Add("Column" + columnscount);
                columnscount++;
            }
            int[] columns = new int[7] { -1, -1, -1, -1, -1, -1, -1 };

            Result result;
            List<string> dms = new List<string>();
            List<string> hms = new List<string>();
            if (Request.Files.Count > 0)
            {
                file = Request.Files[0];
                Stream sm = file.InputStream;
                dt = ReadExcelDataList(sm);

                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    if (i == 0)
                    {
                        for (int y = 0; y < dt.Columns.Count; y++)
                        {
                            if (dt.Rows[0][y].ToString() == "发票代码")
                                columns[0] = y;
                            if (dt.Rows[0][y].ToString() == "发票号码")
                                columns[1] = y;
                            if (dt.Rows[0][y].ToString() == "开票日期")
                                columns[2] = y;
                            if (dt.Rows[0][y].ToString() == "销方名称")
                                columns[3] = y;
                            if (dt.Rows[0][y].ToString() == "销方税号")
                                columns[4] = y;
                            if (dt.Rows[0][y].ToString() == "金额")
                                columns[5] = y;
                            if (dt.Rows[0][y].ToString() == "税额")
                                columns[6] = y;
                        }
                        if (columns.ToList().IndexOf(-1) > -1)
                        {
                            result = Result.CreateResult<object>(ResultStatus.Failed, null);
                            result.Msg = "Execl数据格式不对！请下载Execl模板对比！";
                            return this.JsonContent(result);
                        }
                    }
                    else
                    {
                        DataRow nrow = newdt.NewRow();
                        for (int c = 0; c < columns.Length; c++)
                        {
                            nrow[c] = dt.Rows[i][columns[c]];
                        }
                        newdt.Rows.Add(nrow);
                        dms.Add(dt.Rows[i]["Column1"].ToString());
                        hms.Add(dt.Rows[i]["Column2"].ToString());
                    }
                }

            }
            string re = InvService.getRepeat(dms, hms);
            result = Result.CreateResult<object>(ResultStatus.OK, newdt);
            result.Msg = re;
            return this.JsonContent(result);
        }

        public DataTable ReadExcelDataList(Stream sm)
        {
            Workbook workbook = new Workbook(sm);
            var sheetDataList = workbook.Worksheets;
            var sheetdata = sheetDataList[0];
            var cells = sheetdata.Cells;
            DataTable dt = cells.ExportDataTable(0, 0, cells.MaxRow + 1, cells.MaxColumn + 1, false);
            return dt;
        }

        [HttpPost]
        public ActionResult SaveExeclData(List<string> dms, List<string> hms, List<string> rq, List<string> je)
        {
            var CompanyAppService = this.CreateService<ICompanyAppService>();
            var InvService = this.CreateService<IInvAppService>();
            inv_company com = CompanyAppService.GetUserCompany();
            int userPages = CompanyAppService.GetUserPages();
            int count = dms.Count;
            Result<object> result;
            if (count == 0)
            {
                result = Result.CreateResult<object>(ResultStatus.Failed, null);
                result.Msg = "请添加需要查验的发票数据.";
                return this.JsonContent(result);
            }
            if (com.totlePage - userPages < count)
            {
                result = Result.CreateResult<object>(ResultStatus.Failed, null);
                result.Msg = "发票查验授权剩余数量不够，请联系软件服务商增加授权数量！";
                return this.JsonContent(result);
            }
            var re = InvService.getRepeat(dms, hms);

            if (re != "")
            {
                result = Result.CreateResult<object>(ResultStatus.OK, re);
                result.Msg = "";
                result.state = 1;//重复
                return this.JsonContent(result);
            }

            int succ = 0;
            try
            {
                for (int i = 0; i < count; i++)
                {
                    AddMainInput m = new AddMainInput()
                    {
                        fplx = "01",
                        fpdm = dms[i],
                        fphm = hms[i],
                        kprq = rq[i].Replace("-", ""),
                        je = (je[i] == "" || je[i] == null ? 0 : decimal.Parse(je[i].Trim()))
                    };
                    if (InvService.Add(m).Id > 0)
                        succ++;
                }
            }
            catch (Exception e)
            {
                result = Result.CreateResult<object>(ResultStatus.Failed, null);
                result.Msg = "数据格式有误！请修改错误数据！";
                return this.JsonContent(result);
            }
            result = Result.CreateResult<object>(ResultStatus.OK, null);
            result.Msg = "已成功提交" + succ.ToString() + "张发票.";
            return this.JsonContent(result);
        }

        public ActionResult AgainSearch(List<int> ids) {
            var CompanyAppService = this.CreateService<ICompanyAppService>();
            var InvService = this.CreateService<IInvAppService>();
            inv_company com = CompanyAppService.GetUserCompany();
            int userPages = CompanyAppService.GetUserPages();
            Result<object> result;
            if (com.totlePage < ++userPages)
            {
                result = Result.CreateResult<object>(ResultStatus.Failed, null);
                result.Msg = "发票查验授权数量已用完，请联系软件服务商增加授权数量！";
                return this.JsonContent(result);
            }
            result = Result.CreateResult<object>(ResultStatus.OK, null);
            if (InvService.AgainSearch(ids) > 0)
                result.Msg = "已提交重新查验!";
            else
                result.Msg = "重新查验失败!";
            return this.JsonContent(result);
        }
    }
}
