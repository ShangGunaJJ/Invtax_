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

namespace Chloe.Admin.Areas.SystemManage.Controllers
{
    [LoginAuthorizeAttribute]
    public class ScanHouseController : WebController
    {
        public ActionResult Index()
        {
            string fplx = Request.QueryString["type"];
            this.ViewBag.type = fplx;
            var company = this.CreateService<ICompanyAppService>().GetCompaneyByID(this.CurrentSession.CompanyID);
            this.ViewBag.CompanyName = company[0].name;
            this.ViewBag.SH = company[0].sh;
            return View();
        }
        [HttpPost]
        public ActionResult GetInvData(int PageSize, int PageIndex, inv_main SearcherValues, string OrderBy, string SortColumn)
        {
            var InvService = this.CreateService<IInvAppService>();
            Searcher sear = new Searcher()
            {
                PageSize = PageSize,
                PageIndex = PageIndex,
                SearcherValues = SearcherValues,
                OrderBy = OrderBy,
                SortColumn = SortColumn,
                fplx = Request.QueryString["type"]
            };
            int count = 0;
            var data = InvService.GetInvData(sear, out count);
            Result<object> result = Result.CreateResult<object>(ResultStatus.OK, data);
            result.MaxRow = count;
            return this.JsonContent(result);
        }
        [HttpPost]
        public ActionResult DeleteData(List<int> ids)
        {
            string msg = this.CreateService<IInvAppService>().Delete(ids);
            Result<object> result = Result.CreateResult<object>(ResultStatus.OK, null);
            result.Msg = msg;
            return this.JsonContent(result);
        }
        [HttpPost]
        public ActionResult UpdateState(List<int> ids, int state)
        {
            string[] states = new string[4] { "正常", "假票", "错票", "敏感票" };
            int count = this.CreateService<IInvAppService>().UpdateState(ids, states[state]);
            Result<object> result = Result.CreateResult<object>(ResultStatus.OK, null);
            result.Msg = count > 0 ? count.ToString() + "张发票异常状态更新成功！" : "发票异常状态更新成功!";
            return this.JsonContent(result);
        }

        [HttpPost]
        public ActionResult GetDetail(int id)
        {
            List<inv_detail> des = this.CreateService<IInvAppService>().getDetail(id);
            Result<object> result = Result.CreateResult<object>(ResultStatus.OK, des);
            return this.JsonContent(result);
        }
        public ActionResult Print() {
            return View();
        }
    }
}