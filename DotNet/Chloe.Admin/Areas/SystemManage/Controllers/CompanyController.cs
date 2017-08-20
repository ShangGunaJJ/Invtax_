using Ace.IdStrategy;
using Chloe.Admin.Common.Tree;
using Chloe.Application.Interfaces;
using Chloe.Application.Interfaces.System;
using Chloe.Application.Models.Company;
using Chloe.Entities;
using Chloe.Admin.Common;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Ace;

namespace Chloe.Admin.Areas.SystemManage.Controllers
{
    [LoginAuthorizeAttribute]
    public class CompanyController : WebController
    {
        // GET: SystemManage/Role
        public ActionResult Index()
        {
            List<SelectOption> CompanyList = SelectOption.CreateList(this.CreateService<ICompanyAppService>().GetSimpleModels());
            this.ViewBag.CompanyList = CompanyList;
            return View();
        }

        public ActionResult TryKeyword()
        {
            string key = this.CreateService<ICompanyAppService>().GetTryKey();
            this.ViewBag.TryKey = key;
            return View();
        }

        [HttpPost]
        public ActionResult UpdataTryKey(string key)
        {
            Result<object> result;
            if (this.CreateService<ICompanyAppService>().UpdataTryKey(key) > 0)
            {
                result = Result.CreateResult<object>(ResultStatus.OK, null);
            }
            else
            {
                result = Result.CreateResult<object>(ResultStatus.Failed, null);
            }
            return this.JsonContent(result);
        }

        [HttpPost]
        public ActionResult GetModels(string keyword)
        {
            List<inv_company> data = this.CreateService<ICompanyAppService>().GetCompaneys(keyword);
            return this.SuccessData(data);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public ActionResult Add(AddCompanyInput input)
        {
            this.CreateService<ICompanyAppService>().Add(input);
            return this.AddSuccessMsg();
        }
        [HttpPost]
        //[ValidateAntiForgeryToken]
        public ActionResult Update(UpdateCompanyInput input)
        {
            this.CreateService<ICompanyAppService>().Update(input);
            return this.UpdateSuccessMsg();
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public ActionResult Delete(string id)
        {
            this.CreateService<ICompanyAppService>().Delete(id);
            return this.DeleteSuccessMsg();
        }
        [HttpPost]
        public ActionResult Addtotle(string companyid, int totle, string Date)
        {
            Result<object> result = new Result<object>();
            if (this.CreateService<ICompanyAppService>().AddTotleforCompany(companyid, totle, Date) > 0)
            {
                result.Status = ResultStatus.OK;
                result.Msg = "添加授权成功！";
            }
            else
            {
                result.Status = ResultStatus.Failed;
                result.Msg = "添加授权失败！";
            }
            return this.JsonContent(result);
        }
    }

}