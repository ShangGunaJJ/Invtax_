using Ace.IdStrategy;
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
        public ActionResult SaveExcel2(string fileName, string fileData, string Sheets, List<int> ids)
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
                        //只有值
                        var value = ((Newtonsoft.Json.Linq.JValue)item).Value;
                        if (value != null)
                            sds.SharedString = value.ToString();
                        listSDS.Add(sds);
                    }
                }

                var InvService = this.CreateService<IInvAppService>();

                List<string[]> detil = new List<string[]>();
                string[] columns = new string[] { "发票代码", "发票号码", "货物或应税劳务、服务名称", "规格型号", "单位", "数量", "单价", "金额", "税率", "税额", "开票日期", "销方名称", "销方税号", "销方地址", "销方账号" };
                detil.Add(columns);
                var Listdetails = InvService.getDetailFors(ids);
                for (int i = 0; i < Listdetails.Count; i++)
                {
                    detil.Add(Listdetails[i]);
                }

                List<SheetDatas> listSDS1 = new List<SheetDatas>();

                for (int i = 0; i < detil.Count; i++)
                {
                    var objSaveData = detil[i];
                    for (int j = 0; j < objSaveData.Count(); j++)
                    {
                        //单元格数据
                        SheetDatas sds = new SheetDatas();
                        sds.RowId = i;
                        sds.ColumnId = j;
                        sds.Type = "s";
                        bool bm = false;

                        var item = objSaveData[j];
                        //只有值
                        var value = ((Newtonsoft.Json.Linq.JValue)item).Value;
                        if (value != null)
                            sds.SharedString = value.ToString();
                        listSDS1.Add(sds);
                    }
                }


                //var SheetList = Newtonsoft.Json.Linq.JArray.Parse(Sheets);
                //List<SheetDataList> SDList = new List<SheetDataList>();
                //for (int i = 0; i < objSaveDataList.Count; i++)
                //{
                //    var objSaveData = objSaveDataList[i];
                //    SheetDataList sl = new SheetDataList();
                //    sl.SheetName = "发票要素";
                //    List<SheetDatas> listSDS = new List<SheetDatas>();
                //    for (int j = 0; j < objSaveData.Count(); j++)
                //    {
                //        //单元格数据
                //        SheetDatas sds = new SheetDatas();
                //        sds.RowId = 0;
                //        sds.ColumnId = j;
                //        sds.Type = "s";
                //        bool bm = false;

                //        var item = objSaveData[j];
                //        //只有值
                //        var value = ((Newtonsoft.Json.Linq.JValue)item).Value;
                //        if (value != null)
                //            sds.SharedString = value.ToString();
                //        listSDS.Add(sds);
                //    }
                //    sl.SheetData = listSDS;
                //    SDList.Add(sl);
                //}
                //List<SheetDataList> SDList1 = new List<SheetDataList>();
                //for (int i = 0; i < detil.Count; i++)
                //{
                //    var objSaveData = detil[i];
                //    SheetDataList sl = new SheetDataList();
                //    sl.SheetName = "发票明细";
                //    List<SheetDatas> listSDS = new List<SheetDatas>();
                //    for (int j = 0; j < objSaveData.Count(); j++)
                //    {
                //        //单元格数据
                //        SheetDatas sds = new SheetDatas();
                //        sds.RowId = 0;
                //        sds.ColumnId = j;
                //        sds.Type = "s";
                //        bool bm = false;

                //        var item = objSaveData[j];
                //        //只有值
                //        var value = ((Newtonsoft.Json.Linq.JValue)item).Value;
                //        if (value != null)
                //            sds.SharedString = value.ToString();
                //        listSDS.Add(sds);
                //    }
                //    sl.SheetData = listSDS;
                //    SDList1.Add(sl);
                //}


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
                DocumentEditor.Excel.ExcelHelper.SaveNewExcel(newFilePath, listSDS, listSDS1);
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
            while (columnscount < 8)
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

        public ActionResult AgainSearch(List<int> ids)
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
            if (InvService.AgainSearch(ids) > 0)
                result.Msg = "已提交重新查验!";
            else
                result.Msg = "重新查验失败!";
            return this.JsonContent(result);
        }
    }
}
