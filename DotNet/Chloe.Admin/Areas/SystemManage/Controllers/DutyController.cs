using Ace.IdStrategy;
using Chloe.Admin.Common.Tree;
using Chloe.Application.Interfaces;
using Chloe.Application.Interfaces.System;
using Chloe.Application.Models.Company;
using Chloe.Application.Models.Duty;
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

namespace Chloe.Admin.Areas.SystemManage.Controllers
{
    [LoginAuthorizeAttribute]
    public class DutyController : WebController
    {
        public ActionResult Index()
        {
            List<SelectOption> departmentList = SelectOption.CreateList(this.CreateService<ICompanyAppService>().GetSimpleModels());

            this.ViewBag.DepartmentList = departmentList;
            this.ViewBag.DepartmentListString = JsonHelper.Serialize(departmentList);

            return View();
        }

        [HttpGet]
        public ActionResult GetModels(string keyword)
        {
            List<Sys_Duty> data = this.CreateService<IDutyAppService>().GetDutyList(keyword);
            return this.SuccessData(data);
        }

        [HttpPost]
        public ActionResult Add(AddDutyInput input)
        {
            this.CreateService<IDutyAppService>().Add(input);
            return this.AddSuccessMsg();
        }
        [HttpPost]
        public ActionResult Update(UpdateDutyInput input)
        {
            this.CreateService<IDutyAppService>().Update(input);
            return this.UpdateSuccessMsg();
        }

        [HttpPost]
        public ActionResult Delete(string id)
        {
            this.CreateService<IDutyAppService>().Delete(id);
            return this.DeleteSuccessMsg();
        }
    }

}